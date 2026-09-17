import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Check } from "lucide-react";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { accessories, accessoryCategories, looks, Accessory } from "@/data/looks";
import { useApp } from "@/context/AppContext";

const LookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToBag, sizeProfile } = useApp();
  const look = looks.find((l) => l.id === id);
  const [selected, setSelected] = useState<Accessory[]>([]);
  const [category, setCategory] = useState<typeof accessoryCategories[number]["key"]>("shoes");

  if (!look) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-24 text-center">
        <h1 className="font-display text-3xl">Look not found</h1>
        <Link to="/collection" className="mt-6 inline-block text-[11px] uppercase tracking-[0.2em] link-underline">
          Back to the collection
        </Link>
      </div>
    );
  }

  const toggle = (acc: Accessory) =>
    setSelected((prev) => (prev.find((a) => a.id === acc.id) ? prev.filter((a) => a.id !== acc.id) : [...prev, acc]));

  const addOns = selected.reduce((s, a) => s + a.price, 0);

  return (
    <>
      <Seo
        title={`${look.name} — ${look.collection} | Mr. Tux`}
        description={`${look.description} $${look.price} for a ${look.rentalDays}-day rental, delivered in two sizes.`}
      />

      <div className="mx-auto max-w-6xl px-5 lg:px-8 py-10 sm:py-14">
        <Link to="/collection" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
          ← Collection
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-2">
          <img
            src={look.image}
            alt={look.name}
            width={1200}
            height={1504}
            className="w-full bg-surface object-cover"
          />

          <div>
            <p className="eyebrow">{look.collection}</p>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl">{look.name}</h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{look.description}</p>
            <p className="mt-6 font-display text-2xl">${look.price}</p>
            <p className="text-sm text-muted-foreground">{look.rentalDays}-day rental · no deposit</p>

            <div className="mt-8 border-t border-border pt-6">
              <p className="eyebrow">What arrives</p>
              <ul className="mt-4 space-y-2">
                {look.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <Check size={14} className="mt-1 shrink-0 text-highlight" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 border border-border bg-surface p-5">
              <p className="text-sm">
                Two sizes ship every time — your fit and one size up. Keep the one that fits, return the other in the
                same box.
              </p>
              <Link
                to="/start-your-order"
                className="mt-3 inline-block text-[11px] uppercase tracking-[0.2em] link-underline"
              >
                {sizeProfile.method ? "Update your sizes" : "Set up your sizes"}
              </Link>
            </div>

            <div className="mt-10">
              <p className="eyebrow">Add accessories</p>
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {accessoryCategories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setCategory(cat.key)}
                    className={`whitespace-nowrap border px-3 py-2 text-[11px] uppercase tracking-[0.16em] transition-colors ${
                      category === cat.key
                        ? "border-ink bg-ink text-primary-foreground"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {accessories
                  .filter((a) => a.category === category)
                  .map((acc) => {
                    const on = selected.some((a) => a.id === acc.id);
                    return (
                      <button
                        key={acc.id}
                        onClick={() => toggle(acc)}
                        className={`border p-4 text-left transition-colors ${
                          on ? "border-highlight bg-surface" : "border-border hover:border-ink/40"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm">{acc.name}</p>
                          {on && <Check size={14} className="mt-0.5 shrink-0 text-highlight" />}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{acc.description}</p>
                        <p className="mt-2 text-xs">+${acc.price}</p>
                      </button>
                    );
                  })}
              </div>
            </div>

            <div className="sticky bottom-0 mt-10 -mx-5 border-t border-border bg-background/95 px-5 py-4 backdrop-blur lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0">
              <Button
                variant="ink"
                size="lg"
                className="h-14 w-full"
                onClick={() => {
                  addToBag({ look, accessories: selected });
                  navigate("/bag");
                }}
              >
                Add to Bag · ${look.price + addOns}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LookDetail;
