import { useEffect, useState, ReactNode } from "react";
import { Link } from "react-router-dom";
import { Check, Lock } from "lucide-react";
import Seo from "@/components/Seo";
import SizeProfileForm from "@/components/SizeProfileForm";
import CalendlyEmbed from "@/components/CalendlyEmbed";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { rentalWindow } from "@/lib/dates";

const EVENT_TYPES = ["Wedding", "Gala or benefit", "Prom", "Quinceañera", "Awards or premiere", "Cruise", "Other"];

const fieldClass =
  "w-full border border-input bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-highlight";

const EMAIL_RE = /\S+@\S+\.\S+/;

// --- Accordion step shell ----------------------------------------------------
// Steps unlock in order. `openStep` is whichever one is currently expanded;
// `maxUnlocked` is the furthest a visitor has reached. Anything at or before
// maxUnlocked can be clicked open again to edit; anything past it is locked.

interface StepProps {
  index: number;
  title: string;
  description?: string;
  isOpen: boolean;
  isComplete: boolean;
  isLocked: boolean;
  onHeaderClick: () => void;
  children: ReactNode;
}

const Step = ({ index, title, description, isOpen, isComplete, isLocked, onHeaderClick, children }: StepProps) => (
  <div className="border-t border-border pt-8 sm:pt-10">
    <button
      type="button"
      onClick={onHeaderClick}
      disabled={isLocked}
      aria-expanded={isOpen}
      className="flex w-full items-center gap-3 text-left disabled:cursor-not-allowed"
    >
      <span
        className={`eyebrow flex h-6 w-6 shrink-0 items-center justify-center border ${
          isComplete ? "border-highlight bg-highlight text-accent-foreground" : "border-border"
        }`}
      >
        {isComplete ? <Check size={12} /> : isLocked ? <Lock size={11} /> : String(index).padStart(2, "0")}
      </span>
      <h2
        className={`font-display text-2xl sm:text-3xl ${
          isLocked ? "text-muted-foreground/50" : "text-foreground"
        }`}
      >
        {title}
      </h2>
    </button>

    {isOpen && (
      <div className="mt-6 pl-9">
        {description && <p className="mb-6 max-w-lg text-sm text-muted-foreground">{description}</p>}
        {children}
      </div>
    )}
  </div>
);

const StartOrder = () => {
  const [path, setPath] = useState<"myself" | null>(null);
  const { event, setEvent, bag } = useApp();
  // Spread over defaults (rather than `event ?? {...}`) so an event saved
  // before the height/weight fields existed doesn't leave them `undefined`
  // and crash the required-field checks below.
  const [form, setForm] = useState(() => ({
    eventType: EVENT_TYPES[0],
    eventDate: "",
    name: "",
    email: "",
    phone: "",
    height: "",
    weight: "",
    notes: "",
    ...event,
  }));
  const [openStep, setOpenStep] = useState(1);
  const [maxUnlocked, setMaxUnlocked] = useState(1);
  const [showValidation, setShowValidation] = useState(false);
  const dates = rentalWindow(form.eventDate);

  const requiredFilled =
    form.name.trim() !== "" &&
    EMAIL_RE.test(form.email) &&
    form.phone.trim() !== "" &&
    form.height.trim() !== "" &&
    form.weight.trim() !== "";

  const goToStep = (n: number) => {
    if (n <= maxUnlocked) setOpenStep(n);
  };

  const completeStep = (n: number) => {
    setMaxUnlocked((m) => Math.max(m, n + 1));
    setOpenStep(n + 1);
  };

  const continueFromContact = () => {
    if (!requiredFilled) {
      setShowValidation(true);
      return;
    }
    setEvent(form);
    setShowValidation(false);
    completeStep(1);
  };

  // Calendly posts a message to the parent window when someone finishes
  // booking — use it to auto-advance, but the "I've booked" / "skip" actions
  // below still work as a fallback if this doesn't fire for any reason.
  useEffect(() => {
    if (openStep !== 2) return;
    const onMessage = (e: MessageEvent) => {
      if (typeof e.data === "object" && e.data?.event === "calendly.event_scheduled") {
        completeStep(2);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openStep]);

  return (
    <>
      <Seo
        title="Start Your Order — Mr. Tux Miami"
        description="Tell us your occasion, book a fitting, save your sizes, and choose your look. Two sizes delivered, prepaid returns, no deposit."
      />

      <div className="mx-auto max-w-3xl px-5 lg:px-8 py-14 sm:py-20">
        <p className="eyebrow">Start your order</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">Who is this for?</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          No deposit is taken — you pay for the rental when you place the order.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setPath("myself")}
            className={`border p-6 text-left transition-colors ${
              path === "myself" ? "border-ink bg-surface" : "border-border hover:border-ink"
            }`}
          >
            <p className="eyebrow">Just me</p>
            <h2 className="mt-2 font-display text-2xl">For myself</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              One look, one fitting. Tell us the occasion and we'll take it from there.
            </p>
          </button>

          <Link to="/wedding-parties" className="block border border-border p-6 text-left transition-colors hover:border-ink">
            <p className="eyebrow">Groomsmen</p>
            <h2 className="mt-2 font-display text-2xl">For a wedding party</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              One look, every man, wherever they live. We collect sizes from the whole party.
            </p>
          </Link>
        </div>

        {path !== "myself" && (
          <p className="mt-8 text-xs text-muted-foreground">
            Already booked a visit or started an order?{" "}
            <Link to="/account" className="link-underline text-foreground">
              Check your account
            </Link>
            .
          </p>
        )}

        {path === "myself" && (
        <>
        <div className="mt-14 flex items-center justify-between border-t border-border pt-6">
          <p className="eyebrow">Four quick steps</p>
          <button
            type="button"
            onClick={() => setPath(null)}
            className="text-[11px] uppercase tracking-[0.2em] link-underline text-muted-foreground"
          >
            Change
          </button>
        </div>

        {/* Step 1 — Occasion & you */}
        <Step
          index={1}
          title="Your occasion & you"
          isOpen={openStep === 1}
          isComplete={maxUnlocked > 1}
          isLocked={false}
          onHeaderClick={() => goToStep(1)}
        >
          <div className="grid gap-5 sm:grid-cols-2">
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
              <span className="eyebrow">Name *</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`${fieldClass} mt-2 ${showValidation && !form.name.trim() ? "border-destructive" : ""}`}
              />
            </label>
            <label className="block">
              <span className="eyebrow">Email *</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`${fieldClass} mt-2 ${showValidation && !EMAIL_RE.test(form.email) ? "border-destructive" : ""}`}
              />
            </label>
            <label className="block">
              <span className="eyebrow">Phone *</span>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={`${fieldClass} mt-2 ${showValidation && !form.phone.trim() ? "border-destructive" : ""}`}
              />
            </label>
            <label className="block">
              <span className="eyebrow">Height *</span>
              <input
                required
                placeholder="e.g. 5'10 or 178cm"
                value={form.height}
                onChange={(e) => setForm({ ...form, height: e.target.value })}
                className={`${fieldClass} mt-2 ${showValidation && !form.height.trim() ? "border-destructive" : ""}`}
              />
            </label>
            <label className="block">
              <span className="eyebrow">Weight *</span>
              <input
                required
                placeholder="e.g. 180 lbs"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
                className={`${fieldClass} mt-2 ${showValidation && !form.weight.trim() ? "border-destructive" : ""}`}
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

          {showValidation && !requiredFilled && (
            <p className="mt-4 text-sm text-destructive">
              Name, email, phone, height and weight are required before we can book your fitting.
            </p>
          )}

          <Button variant="ink" size="lg" className="mt-6 h-12 px-8" onClick={continueFromContact}>
            Continue to Booking
          </Button>
        </Step>

        {/* Step 2 — Book your visit */}
        <Step
          index={2}
          title="Book your visit"
          description="Twenty minutes with a fitter and the full collection. Already have a time, or ordering delivery-only? You can skip this."
          isOpen={openStep === 2}
          isComplete={maxUnlocked > 2}
          isLocked={maxUnlocked < 2}
          onHeaderClick={() => goToStep(2)}
        >
          <CalendlyEmbed prefill={{ name: form.name, email: form.email }} />
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <Button variant="ink" size="lg" className="h-12 px-8" onClick={() => completeStep(2)}>
              I've Booked My Time
            </Button>
            <button
              onClick={() => completeStep(2)}
              className="text-[11px] uppercase tracking-[0.2em] link-underline text-muted-foreground"
            >
              Skip for now
            </button>
          </div>
        </Step>

        {/* Step 3 — Your sizes */}
        <Step
          index={3}
          title="Your sizes"
          description="Give us measurements or the brand sizes you already wear. Every order ships in your size and one size up."
          isOpen={openStep === 3}
          isComplete={maxUnlocked > 3}
          isLocked={maxUnlocked < 3}
          onHeaderClick={() => goToStep(3)}
        >
          <SizeProfileForm onSaved={() => completeStep(3)} />
        </Step>

        {/* Step 4 — Choose your look */}
        <Step
          index={4}
          title="Choose your look"
          isOpen={openStep === 4}
          isComplete={false}
          isLocked={maxUnlocked < 4}
          onHeaderClick={() => goToStep(4)}
        >
          <p className="text-sm text-muted-foreground">
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
        </Step>
        </>
        )}
      </div>
    </>
  );
};

export default StartOrder;
