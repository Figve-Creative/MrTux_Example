import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SizeProfile, useApp } from "@/context/AppContext";

const MEASUREMENTS = [
  { key: "chest", label: "Chest", hint: "Around the fullest part, arms down." },
  { key: "waist", label: "Waist", hint: "At the natural waist, over a shirt." },
  { key: "hips", label: "Hips", hint: "Around the seat at its fullest." },
  { key: "inseam", label: "Inseam", hint: "Crotch to top of the shoe." },
  { key: "neck", label: "Neck", hint: "Where the collar sits, plus a finger." },
  { key: "sleeve", label: "Sleeve", hint: "Centre back neck to wrist bone." },
  { key: "shoulder", label: "Shoulder", hint: "Seam to seam across the back." },
];

const BRANDS = ["Tom Ford", "Brioni", "Hugo Boss", "Ralph Lauren", "Canali", "Ermenegildo Zegna"];
const JACKETS = ["36S", "36R", "38S", "38R", "40R", "40L", "42R", "42L", "44R", "44L", "46R", "48R"];
const TROUSERS = ["28", "30", "32", "34", "36", "38", "40", "42"];
const SHIRTS = ["14.5", "15", "15.5", "16", "16.5", "17", "17.5", "18"];
const SHOES = ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "13", "14"];
const BELTS = ["28", "30", "32", "34", "36", "38", "40", "42", "44"];

const fieldClass =
  "w-full border border-input bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-highlight";

const SizeProfileForm = ({ onSaved }: { onSaved?: () => void }) => {
  const { sizeProfile, setSizeProfile } = useApp();
  const [method, setMethod] = useState<"measurements" | "brands">(
    sizeProfile.method === "brands" ? "brands" : "measurements",
  );
  const [measurements, setMeasurements] = useState<Record<string, string>>(sizeProfile.measurements ?? {});
  const [brand, setBrand] = useState(BRANDS[0]);
  const [brandSizes, setBrandSizes] = useState<SizeProfile["brandSizes"]>(sizeProfile.brandSizes ?? {});
  const [shoeSize, setShoeSize] = useState(sizeProfile.shoeSize ?? "");
  const [beltSize, setBeltSize] = useState(sizeProfile.beltSize ?? "");
  const [saved, setSaved] = useState(false);

  const current = brandSizes?.[brand] ?? { jacket: "", trouser: "", shirt: "" };
  const setBrandField = (field: "jacket" | "trouser" | "shirt", value: string) =>
    setBrandSizes({ ...(brandSizes ?? {}), [brand]: { ...current, [field]: value } });

  const save = () => {
    setSizeProfile({ method, measurements, brandSizes, shoeSize, beltSize });
    setSaved(true);
    onSaved?.();
  };

  return (
    <div>
      <div className="flex border border-border">
        {(["measurements", "brands"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMethod(m)}
            className={`flex-1 py-3 text-[11px] uppercase tracking-[0.18em] transition-colors ${
              method === m ? "bg-ink text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {m === "measurements" ? "My Measurements" : "Brand Sizes"}
          </button>
        ))}
      </div>

      {method === "measurements" ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {MEASUREMENTS.map((f) => (
            <label key={f.key} className="block">
              <span className="eyebrow">{f.label}</span>
              <input
                inputMode="decimal"
                placeholder="inches"
                value={measurements[f.key] ?? ""}
                onChange={(e) => setMeasurements({ ...measurements, [f.key]: e.target.value })}
                className={`${fieldClass} mt-2`}
              />
              <span className="mt-1.5 block text-[11px] text-muted-foreground">{f.hint}</span>
            </label>
          ))}
        </div>
      ) : (
        <div className="mt-6">
          <label className="block">
            <span className="eyebrow">Brand</span>
            <select value={brand} onChange={(e) => setBrand(e.target.value)} className={`${fieldClass} mt-2`}>
              {BRANDS.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </label>

          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            {[
              { label: "Jacket", field: "jacket" as const, options: JACKETS },
              { label: "Trouser", field: "trouser" as const, options: TROUSERS },
              { label: "Shirt", field: "shirt" as const, options: SHIRTS },
            ].map((s) => (
              <label key={s.field} className="block">
                <span className="eyebrow">{s.label}</span>
                <select
                  value={current[s.field]}
                  onChange={(e) => setBrandField(s.field, e.target.value)}
                  className={`${fieldClass} mt-2`}
                >
                  <option value="">Select</option>
                  {s.options.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>

          {Object.keys(brandSizes ?? {}).length > 0 && (
            <p className="mt-4 text-xs text-muted-foreground">
              Saved for: {Object.keys(brandSizes ?? {}).join(", ")}
            </p>
          )}
        </div>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="eyebrow">Shoe size</span>
          <select value={shoeSize} onChange={(e) => setShoeSize(e.target.value)} className={`${fieldClass} mt-2`}>
            <option value="">Select</option>
            {SHOES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="eyebrow">Belt size</span>
          <select value={beltSize} onChange={(e) => setBeltSize(e.target.value)} className={`${fieldClass} mt-2`}>
            <option value="">Select</option>
            {BELTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button variant="ink" size="lg" className="h-12 px-8" onClick={save}>
          Save My Sizes
        </Button>
        {saved && <span className="text-xs text-muted-foreground">Saved. Both your size and one size up will ship.</span>}
      </div>
    </div>
  );
};

export default SizeProfileForm;
