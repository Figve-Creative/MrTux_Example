import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Accessory, Look } from "@/data/looks";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export interface SizeProfile {
  method: "measurements" | "brands" | null;
  measurements?: Record<string, string>;
  brandSizes?: Record<string, { jacket: string; trouser: string; shirt: string }>;
  shoeSize?: string;
  beltSize?: string;
}

export interface EventDetails {
  eventType: string;
  eventDate: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export interface BagItem {
  id: string;
  look: Look;
  accessories: Accessory[];
}

export interface PlacedOrder {
  reference: string;
  placedAt: string;
  items: BagItem[];
  total: number;
  event: EventDetails | null;
  deliveryFrom: string;
  deliveryTo: string;
  returnBy: string;
}

interface AppState {
  sizeProfile: SizeProfile;
  setSizeProfile: (p: SizeProfile) => void;
  event: EventDetails | null;
  setEvent: (e: EventDetails | null) => void;
  bag: BagItem[];
  addToBag: (item: Omit<BagItem, "id">) => void;
  removeFromBag: (id: string) => void;
  clearBag: () => void;
  orders: PlacedOrder[];
  addOrder: (o: PlacedOrder) => void;
}

const AppContext = createContext<AppState | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

const load = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

// --- Supabase row <-> local shape helpers -----------------------------------
// These only run when a Supabase project is actually configured (see
// src/lib/supabase.ts). Local (localStorage) state stays the source of truth
// for guests and remains fully functional if Supabase is never set up.

const sizeProfileToRow = (p: SizeProfile, userId: string) => ({
  user_id: userId,
  method: p.method,
  measurements: p.measurements ?? null,
  brand_sizes: p.brandSizes ?? null,
  shoe_size: p.shoeSize ?? null,
  belt_size: p.beltSize ?? null,
  updated_at: new Date().toISOString(),
});

const rowToSizeProfile = (row: Record<string, unknown>): SizeProfile => ({
  method: (row.method as SizeProfile["method"]) ?? null,
  measurements: (row.measurements as SizeProfile["measurements"]) ?? undefined,
  brandSizes: (row.brand_sizes as SizeProfile["brandSizes"]) ?? undefined,
  shoeSize: (row.shoe_size as string) ?? undefined,
  beltSize: (row.belt_size as string) ?? undefined,
});

const orderToRow = (o: PlacedOrder, userId: string | null) => ({
  reference: o.reference,
  user_id: userId,
  guest_name: o.event?.name ?? null,
  guest_email: o.event?.email ?? null,
  items: o.items,
  total: o.total,
  event: o.event,
  delivery_from: o.deliveryFrom,
  delivery_to: o.deliveryTo,
  return_by: o.returnBy || null,
  placed_at: o.placedAt,
});

const rowToOrder = (row: Record<string, unknown>): PlacedOrder => ({
  reference: row.reference as string,
  placedAt: row.placed_at as string,
  items: (row.items as BagItem[]) ?? [],
  total: Number(row.total),
  event: (row.event as EventDetails | null) ?? null,
  deliveryFrom: (row.delivery_from as string) ?? "",
  deliveryTo: (row.delivery_to as string) ?? "",
  returnBy: (row.return_by as string) ?? "",
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [sizeProfile, setSizeProfileState] = useState<SizeProfile>(() =>
    load<SizeProfile>("mrtux.sizeProfile", { method: null }),
  );
  const [event, setEvent] = useState<EventDetails | null>(() => load<EventDetails | null>("mrtux.event", null));
  const [bag, setBag] = useState<BagItem[]>(() => load<BagItem[]>("mrtux.bag", []));
  const [orders, setOrders] = useState<PlacedOrder[]>(() => load<PlacedOrder[]>("mrtux.orders", []));

  useEffect(() => localStorage.setItem("mrtux.sizeProfile", JSON.stringify(sizeProfile)), [sizeProfile]);
  useEffect(() => localStorage.setItem("mrtux.event", JSON.stringify(event)), [event]);
  useEffect(() => localStorage.setItem("mrtux.bag", JSON.stringify(bag)), [bag]);
  useEffect(() => localStorage.setItem("mrtux.orders", JSON.stringify(orders)), [orders]);

  // When someone signs in, pull their cloud size profile + order history and
  // merge it into local state so it shows up on this device too. If they had
  // no cloud size profile yet (first sign-in) but do have one saved locally
  // as a guest, push it up so it isn't lost the moment they create an account.
  useEffect(() => {
    if (!supabase || !user) return;
    let cancelled = false;

    (async () => {
      const { data: profileRow, error: profileError } = await supabase
        .from("size_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (cancelled) return;

      if (profileError) {
        console.error("[supabase] failed to load size profile", profileError.message);
      } else if (profileRow) {
        setSizeProfileState(rowToSizeProfile(profileRow));
      } else if (sizeProfile.method) {
        const { error } = await supabase.from("size_profiles").upsert(sizeProfileToRow(sizeProfile, user.id));
        if (error) console.error("[supabase] failed to migrate guest size profile", error.message);
      }

      const { data: orderRows, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("placed_at", { ascending: false });

      if (cancelled) return;

      if (ordersError) {
        console.error("[supabase] failed to load order history", ordersError.message);
      } else if (orderRows?.length) {
        setOrders((prev) => {
          const byReference = new Map(prev.map((o) => [o.reference, o]));
          for (const row of orderRows) byReference.set(row.reference as string, rowToOrder(row));
          return Array.from(byReference.values()).sort(
            (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime(),
          );
        });
      }
    })();

    return () => {
      cancelled = true;
    };
    // Deliberately only re-runs when the signed-in user changes — not on
    // every local sizeProfile/orders edit (setSizeProfile/addOrder below
    // handle pushing those changes up as they happen).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const setSizeProfile = (p: SizeProfile) => {
    setSizeProfileState(p);
    if (supabase && user) {
      supabase
        .from("size_profiles")
        .upsert(sizeProfileToRow(p, user.id))
        .then(({ error }) => {
          if (error) console.error("[supabase] failed to save size profile", error.message);
        });
    }
  };

  const addToBag = (item: Omit<BagItem, "id">) =>
    setBag((prev) => [...prev, { ...item, id: `${item.look.id}-${Date.now()}` }]);
  const removeFromBag = (id: string) => setBag((prev) => prev.filter((i) => i.id !== id));
  const clearBag = () => setBag([]);

  const addOrder = (o: PlacedOrder) => {
    setOrders((prev) => [o, ...prev]);
    if (supabase) {
      supabase
        .from("orders")
        .insert(orderToRow(o, user?.id ?? null))
        .then(({ error }) => {
          if (error) console.error("[supabase] failed to save order intake", error.message);
        });
    }
  };

  return (
    <AppContext.Provider
      value={{
        sizeProfile,
        setSizeProfile,
        event,
        setEvent,
        bag,
        addToBag,
        removeFromBag,
        clearBag,
        orders,
        addOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
