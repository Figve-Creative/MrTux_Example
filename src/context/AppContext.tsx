import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Accessory, Look } from "@/data/looks";

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

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [sizeProfile, setSizeProfile] = useState<SizeProfile>(() =>
    load<SizeProfile>("mrtux.sizeProfile", { method: null }),
  );
  const [event, setEvent] = useState<EventDetails | null>(() => load<EventDetails | null>("mrtux.event", null));
  const [bag, setBag] = useState<BagItem[]>(() => load<BagItem[]>("mrtux.bag", []));
  const [orders, setOrders] = useState<PlacedOrder[]>(() => load<PlacedOrder[]>("mrtux.orders", []));

  useEffect(() => localStorage.setItem("mrtux.sizeProfile", JSON.stringify(sizeProfile)), [sizeProfile]);
  useEffect(() => localStorage.setItem("mrtux.event", JSON.stringify(event)), [event]);
  useEffect(() => localStorage.setItem("mrtux.bag", JSON.stringify(bag)), [bag]);
  useEffect(() => localStorage.setItem("mrtux.orders", JSON.stringify(orders)), [orders]);

  const addToBag = (item: Omit<BagItem, "id">) =>
    setBag((prev) => [...prev, { ...item, id: `${item.look.id}-${Date.now()}` }]);
  const removeFromBag = (id: string) => setBag((prev) => prev.filter((i) => i.id !== id));
  const clearBag = () => setBag([]);
  const addOrder = (o: PlacedOrder) => setOrders((prev) => [o, ...prev]);

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
