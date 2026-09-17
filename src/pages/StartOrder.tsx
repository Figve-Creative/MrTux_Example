import { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import SizeProfileForm from "@/components/SizeProfileForm";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { rentalWindow } from "@/lib/dates";

const EVENT_TYPES = ["Wedding", "Gala or benefit", "Prom", "Quinceañera", "Awards or premiere", "Cruise", "Other"];

const fieldClass =
  "w-full border border-input bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-highlight";

const StartOrder = () => {
  const { event, setEvent, bag } = useApp();
  const [form, setForm] = useState(
    event ?? { eventType: EVENT_TYPES[0], eventDate: "", name: "", email: "", phone: "", notes: "" },
  );
  const [savedEvent, setSavedEvent] = useState(false);
  const dates = rentalWindow(form.eventDate);

  return (
    <>
      <Seo
        title="Start Your Order — Create Your Event | Mr. Tux"
        description="Create your event, save your sizes and choose your look. Two sizes delivered, prepaid returns, no deposit."
      />

      <div className="mx-auto max-w-3xl px-5 lg:px-8 py-14 sm:py-20">
        <p className="eyebrow">Step one</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">Create your event</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Tell us the occasion and the date. No deposit is taken — you pay for the rental when you place the order.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="eyebrow">Occasion</span>
            <select
              value={form.eventType}
              onChange={(e) => setForm({ ...form, eventType: e.target.value })}
              className={`${fieldClass} mt-2`}
            >
              {EVENT_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="eyebrow">Event date</span>
            <input
              type="date"
              value={form.eventDate}
              onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
              className={`${fieldClass} mt-2`}
            />
          </label>
          <label className="block">
            <span className="eyebrow">Name</span>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`${fieldClass} mt-2`} />
          </label>
          <label className="block">
            <span className="eyebrow">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`${fieldClass} mt-2`}
            />
          </label>
          <label className="block">
            <span className="eyebrow">Phone</span>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={`${fieldClass} mt-2`}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="eyebrow">Anything we should know</span>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className={`${fieldClass} mt-2`}
            />
          </label>
        </div>

        {form.eventDate && (
          <p className="mt-6 border border-border bg-surface p-4 text-sm">
            Your rental would arrive {dates.deliveryFrom} – {dates.deliveryTo} and is due back by {dates.returnBy}.
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button
            variant="ink"
            size="lg"
            className="h-12 px-8"
            onClick={() => {
              setEvent(form);
              setSavedEvent(true);
            }}
          >
            Save Event
          </Button>
          {savedEvent && <span className="text-xs text-muted-foreground">Saved to your account.</span>}
        </div>

        <div className="mt-16 border-t border-border pt-12">
          <p className="eyebrow">Step two</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">Your sizes</h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Give us measurements or the brand sizes you already wear. Every order ships in your size and one size up.
          </p>
          <div className="mt-8">
            <SizeProfileForm />
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-12">
          <p className="eyebrow">Step three</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">Choose your look</h2>
          <p className="mt-4 text-sm text-muted-foreground">
            {bag.length > 0
              ? `You have ${bag.length} look${bag.length > 1 ? "s" : ""} in your bag.`
              : "Pick a look from the collection and add it to your bag."}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/collection"
              className="inline-flex h-12 items-center justify-center bg-ink px-8 text-xs uppercase tracking-[0.18em] text-primary-foreground"
            >
              View Collection
            </Link>
            {bag.length > 0 && (
              <Link
                to="/bag"
                className="inline-flex h-12 items-center justify-center border border-ink px-8 text-xs uppercase tracking-[0.18em]"
              >
                Go to Bag
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StartOrder;
