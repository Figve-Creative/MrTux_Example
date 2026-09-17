import { Link, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { rentalWindow } from "@/lib/dates";

const Bag = () => {
  const { bag, removeFromBag, clearBag, event, addOrder } = useApp();
  const navigate = useNavigate();

  const total = bag.reduce((sum, item) => sum + item.look.price + item.accessories.reduce((s, a) => s + a.price, 0), 0);
  const dates = rentalWindow(event?.eventDate);

  const placeOrder = () => {
    const reference = `MT-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    addOrder({
      reference,
      placedAt: new Date().toISOString(),
      items: bag,
      total,
      event,
      deliveryFrom: dates.deliveryFrom,
      deliveryTo: dates.deliveryTo,
      returnBy: dates.returnByISO,
    });
    clearBag();
    navigate(`/order/${reference}`);
  };

  return (
    <>
      <Seo title="Your Bag — Mr. Tux" description="Review your looks, accessories and delivery window. No deposit required." />

      <div className="mx-auto max-w-3xl px-5 lg:px-8 py-14 sm:py-20">
        <p className="eyebrow">Your bag</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">Order summary</h1>

        {bag.length === 0 ? (
          <div className="mt-10 border border-border bg-surface p-8 text-center">
            <p className="text-sm text-muted-foreground">Your bag is empty.</p>
            <Link
              to="/collection"
              className="mt-5 inline-flex h-12 items-center justify-center bg-ink px-8 text-xs uppercase tracking-[0.18em] text-primary-foreground"
            >
              View Collection
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-10 space-y-8">
              {bag.map((item) => (
                <div key={item.id} className="flex gap-5 border-b border-border pb-8">
                  <img
                    src={item.look.image}
                    alt={item.look.name}
                    loading="lazy"
                    width={1200}
                    height={1504}
                    className="h-32 w-24 shrink-0 bg-surface object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="eyebrow">{item.look.collection}</p>
                        <h2 className="mt-1 font-display text-xl">{item.look.name}</h2>
                        <p className="mt-1 text-sm text-muted-foreground">{item.look.rentalDays}-day rental</p>
                      </div>
                      <button
                        onClick={() => removeFromBag(item.id)}
                        className="text-muted-foreground hover:text-foreground"
                        aria-label="Remove"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <p className="mt-2 text-sm">${item.look.price}</p>

                    {item.accessories.length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {item.accessories.map((a) => (
                          <li key={a.id} className="flex justify-between text-xs text-muted-foreground">
                            <span>{a.name}</span>
                            <span>+${a.price}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border border-border bg-surface p-5 text-sm">
              <p>Two sizes ship every time — your fit and one size up.</p>
              <p className="mt-2 text-muted-foreground">
                No deposit. A prepaid return label is included in the box.
              </p>
              <p className="mt-2 text-muted-foreground">
                Arrives {dates.deliveryFrom} – {dates.deliveryTo}
                {!event?.eventDate && " (estimated — add your event date to confirm)"}
              </p>
            </div>

            {!event && (
              <Link to="/start-your-order" className="mt-4 inline-block text-[11px] uppercase tracking-[0.2em] link-underline">
                Start your order
              </Link>
            )}

            <div className="mt-10 flex items-baseline justify-between border-t border-border pt-6">
              <span className="eyebrow">Total</span>
              <span className="font-display text-3xl">${total}</span>
            </div>

            <Button variant="ink" size="lg" className="mt-6 h-14 w-full" onClick={placeOrder}>
              Place Order
            </Button>
          </>
        )}
      </div>
    </>
  );
};

export default Bag;
