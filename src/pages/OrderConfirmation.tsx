import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Seo from "@/components/Seo";
import { useApp } from "@/context/AppContext";
import { countdown, formatDate } from "@/lib/dates";

const returnSteps = [
  "Place both sizes in the bag provided.",
  "Seal the bag and attach nothing — the prepaid label is already on it.",
  "Drop it at any UPS or FedEx location before the return date.",
];

const OrderConfirmation = () => {
  const { reference } = useParams();
  const { orders } = useApp();
  const order = orders.find((o) => o.reference === reference) ?? orders[0];
  const [, tick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => tick((v) => v + 1), 60000);
    return () => clearInterval(id);
  }, []);

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="font-display text-3xl">No order found</h1>
        <Link to="/collection" className="mt-6 inline-block text-[11px] uppercase tracking-[0.2em] link-underline">
          View the collection
        </Link>
      </div>
    );
  }

  return (
    <>
      <Seo
        title={`Order ${order.reference} Confirmed — Mr. Tux`}
        description="Your rental is confirmed. Delivery window, return instructions and the prepaid return label are inside."
      />

      <div className="mx-auto max-w-3xl px-5 lg:px-8 py-14 sm:py-20">
        <p className="eyebrow">Order {order.reference}</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">You're dressed</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          A confirmation is on its way. Everything below is also in your account.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="border border-border bg-surface p-5">
            <p className="eyebrow">Delivery window</p>
            <p className="mt-2 font-display text-2xl">
              {order.deliveryFrom} – {order.deliveryTo}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Your size and one size up, in the same box.</p>
          </div>
          <div className="border border-border bg-surface p-5">
            <p className="eyebrow">Return by</p>
            <p className="mt-2 font-display text-2xl">{formatDate(new Date(order.returnBy))}</p>
            <p className="mt-2 text-sm text-highlight">{countdown(order.returnBy)} remaining</p>
          </div>
        </div>

        <div className="mt-6 border border-ink p-5">
          <p className="eyebrow">Included</p>
          <p className="mt-2 font-display text-2xl">Prepaid return label</p>
          <p className="mt-2 text-sm text-muted-foreground">
            No printing, no post office queue, no deposit held on your card.
          </p>
        </div>

        <div className="mt-10 border-t border-border pt-8">
          <p className="eyebrow">How to return</p>
          <ol className="mt-4 space-y-3">
            {returnSteps.map((s, i) => (
              <li key={s} className="flex gap-3 text-sm">
                <span className="font-display text-lg leading-none text-highlight">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10 border-t border-border pt-8">
          <p className="eyebrow">Your order</p>
          <ul className="mt-4 space-y-3">
            {order.items.map((item) => (
              <li key={item.id} className="text-sm">
                {item.look.name}
                {item.accessories.length > 0 && (
                  <span className="text-muted-foreground"> · {item.accessories.map((a) => a.name).join(", ")}</span>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t border-border pt-4 text-sm text-muted-foreground">
            Prices vary by look and accessories. Our team will confirm your final total shortly.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/account"
            className="inline-flex h-12 items-center justify-center bg-ink px-8 text-xs uppercase tracking-[0.18em] text-primary-foreground"
          >
            My Account
          </Link>
          <Link
            to="/collection"
            className="inline-flex h-12 items-center justify-center border border-ink px-8 text-xs uppercase tracking-[0.18em]"
          >
            Keep Browsing
          </Link>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;
