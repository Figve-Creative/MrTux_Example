import { useEffect, useState, ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, Lock } from "lucide-react";
import Seo from "@/components/Seo";
import SizeProfileForm from "@/components/SizeProfileForm";
import CalendlyEmbed from "@/components/CalendlyEmbed";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { rentalWindow } from "@/lib/dates";
import { SITE } from "@/lib/site";

const EVENT_TYPES = ["Wedding", "Gala or benefit", "Prom", "Quinceañera", "Awards or premiere", "Cruise", "Other"];
const FORMALITY_OPTIONS = ["Not sure yet", "Black tie", "Black tie optional", "Semi-formal", "Casual / beach"];

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
  const [searchParams] = useSearchParams();
  const [path, setPathState] = useState<"myself" | "wedding" | null>(() =>
    searchParams.get("for") === "wedding" ? "wedding" : null,
  );
  const { event, setEvent, bag } = useApp();
  // Spread over defaults (rather than `event ?? {...}`) so an event saved
  // before a field existed doesn't leave it `undefined` and crash the
  // required-field checks below.
  const [form, setForm] = useState(() => ({
    eventType: EVENT_TYPES[0],
    eventDate: "",
    name: "",
    email: "",
    phone: "",
    height: "",
    weight: "",
    partySize: "",
    formality: FORMALITY_OPTIONS[0],
    notes: "",
    ...event,
  }));
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [openStep, setOpenStep] = useState(1);
  const [maxUnlocked, setMaxUnlocked] = useState(1);
  const [showValidation, setShowValidation] = useState(false);
  const dates = rentalWindow(form.eventDate);
  // "For myself" is a 4-step accordion (occasion/you → sizes → look → booking).
  // A wedding-party inquiry is much lighter — one short intake step, then
  // straight to booking a consult — so it only needs 2.
  const TOTAL_STEPS = path === "wedding" ? 2 : 4;

  // Picking (or changing) a path starts the accordion fresh — otherwise leftover
  // progress from one path (e.g. reaching step 3 on "myself") could look
  // "already done" against the other path's shorter step count.
  const selectPath = (p: "myself" | "wedding" | null) => {
    setPathState(p);
    setOpenStep(1);
    setMaxUnlocked(1);
    setShowValidation(false);
  };

  const requiredFilled =
    path === "wedding"
      ? form.name.trim() !== "" &&
        EMAIL_RE.test(form.email) &&
        form.phone.trim() !== "" &&
        form.eventDate.trim() !== "" &&
        form.partySize.trim() !== "" &&
        agreedToTerms
      : form.name.trim() !== "" &&
        EMAIL_RE.test(form.email) &&
        form.phone.trim() !== "" &&
        form.height.trim() !== "" &&
        form.weight.trim() !== "" &&
        agreedToTerms;

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
    if (openStep !== TOTAL_STEPS) return;
    const onMessage = (e: MessageEvent) => {
      if (typeof e.data === "object" && e.data?.event === "calendly.event_scheduled") {
        completeStep(TOTAL_STEPS);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openStep, path]);

  // Calendly's own "Invitee Questions" (set up once in your Calendly account)
  // fill in from a1, a2, a3... in the exact order those questions are listed
  // there — see docs/STATUS.md for the setup steps this depends on.
  const calendlyAnswers =
    path === "wedding"
      ? [form.phone, form.eventDate, form.partySize, form.formality, form.notes]
      : [form.phone, form.eventType, form.height, form.weight, form.notes];

  return (
    <>
      <Seo
        title="Start Your Order — Mr. Tux Miami"
        description="Tell us your occasion, save your sizes, choose your look, and book your pickup. Fitted in-store, no deposit."
      />

      <div className="mx-auto max-w-3xl px-5 lg:px-8 py-14 sm:py-20">
        <p className="eyebrow">Start your order</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">Who is this for?</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          No deposit is taken — you pay for the rental when your order is confirmed.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => selectPath("myself")}
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

          <button
            type="button"
            onClick={() => selectPath("wedding")}
            className={`border p-6 text-left transition-colors ${
              path === "wedding" ? "border-ink bg-surface" : "border-border hover:border-ink"
            }`}
          >
            <p className="eyebrow">Groomsmen</p>
            <h2 className="mt-2 font-display text-2xl">For a wedding party</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              One look, every man, wherever they live. We collect sizes from the whole party.
            </p>
          </button>
        </div>

        {!path && (
          <p className="mt-8 text-xs text-muted-foreground">
            Already started an order?{" "}
            <Link to="/account" className="link-underline text-foreground">
              Check your account
            </Link>
            .
          </p>
        )}

        {path && (
        <>
        <div className="mt-14 flex items-center justify-between border-t border-border pt-6">
          <p className="eyebrow">{path === "wedding" ? "Two quick steps" : "Four quick steps"}</p>
          <button
            type="button"
            onClick={() => selectPath(null)}
            className="text-[11px] uppercase tracking-[0.2em] link-underline text-muted-foreground"
          >
            Change
          </button>
        </div>

        {/* Step 1 */}
        {path === "wedding" ? (
          <Step
            index={1}
            title="Your wedding"
            description="Just the basics for now — we'll follow up to coordinate sizes and pick a look with the whole party in person."
            isOpen={openStep === 1}
            isComplete={maxUnlocked > 1}
            isLocked={false}
            onHeaderClick={() => goToStep(1)}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="eyebrow">Wedding date *</span>
                <input
                  required
                  type="date"
                  value={form.eventDate}
                  onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                  className={`${fieldClass} mt-2 ${
                    showValidation && !form.eventDate.trim() ? "border-destructive" : ""
                  }`}
                />
              </label>
              <label className="block">
                <span className="eyebrow">Number of men in the party *</span>
                <input
                  required
                  inputMode="numeric"
                  value={form.partySize}
                  onChange={(e) => setForm({ ...form, partySize: e.target.value })}
                  className={`${fieldClass} mt-2 ${
                    showValidation && !form.partySize.trim() ? "border-destructive" : ""
                  }`}
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="eyebrow">Formality</span>
                <select
                  value={form.formality}
                  onChange={(e) => setForm({ ...form, formality: e.target.value })}
                  className={`${fieldClass} mt-2`}
                >
                  {FORMALITY_OPTIONS.map((f) => (
                    <option key={f}>{f}</option>
                  ))}
                </select>
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
                  className={`${fieldClass} mt-2 ${
                    showValidation && !EMAIL_RE.test(form.email) ? "border-destructive" : ""
                  }`}
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
              <label className="block sm:col-span-2">
                <span className="eyebrow">Anything we should know</span>
                <textarea
                  rows={3}
                  placeholder="Colors you're leaning toward, out-of-town groomsmen, anything else helpful"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className={`${fieldClass} mt-2`}
                />
              </label>
            </div>

            <label className="mt-6 flex items-start gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-ink"
              />
              <span className={showValidation && !agreedToTerms ? "text-destructive" : ""}>
                I agree to the{" "}
                <Link to="/terms" target="_blank" rel="noreferrer" className="link-underline text-foreground">
                  Terms & Conditions
                </Link>{" "}
                *
              </span>
            </label>

            {showValidation && !requiredFilled && (
              <p className="mt-4 text-sm text-destructive">
                Wedding date, party size, name, email, phone and agreeing to the Terms & Conditions are required to
                continue.
              </p>
            )}

            <Button variant="ink" size="lg" className="mt-6 h-12 px-8" onClick={continueFromContact}>
              Continue to Booking
            </Button>
          </Step>
        ) : (
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
                  className={`${fieldClass} mt-2 ${
                    showValidation && !EMAIL_RE.test(form.email) ? "border-destructive" : ""
                  }`}
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
                Your look would be ready for pickup {dates.deliveryFrom} – {dates.deliveryTo} and is due back by{" "}
                {dates.returnBy}.
              </p>
            )}

            <label className="mt-6 flex items-start gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-ink"
              />
              <span className={showValidation && !agreedToTerms ? "text-destructive" : ""}>
                I agree to the{" "}
                <Link to="/terms" target="_blank" rel="noreferrer" className="link-underline text-foreground">
                  Terms & Conditions
                </Link>{" "}
                *
              </span>
            </label>

            {showValidation && !requiredFilled && (
              <p className="mt-4 text-sm text-destructive">
                Name, email, phone, height, weight and agreeing to the Terms & Conditions are required to continue.
              </p>
            )}

            <Button variant="ink" size="lg" className="mt-6 h-12 px-8" onClick={continueFromContact}>
              Continue to Sizes
            </Button>
          </Step>
        )}

        {/* Steps 2–3 — "for myself" only. A wedding inquiry skips straight from
            its step 1 to booking (below); sizes/looks get sorted out with the
            whole party in person. */}
        {path === "myself" && (
          <>
            <Step
              index={2}
              title="Your sizes"
              description="Give us measurements or the brand sizes you already wear as a starting point — we'll fit you to your exact size when you pick up in-store."
              isOpen={openStep === 2}
              isComplete={maxUnlocked > 2}
              isLocked={maxUnlocked < 2}
              onHeaderClick={() => goToStep(2)}
            >
              <SizeProfileForm onSaved={() => completeStep(2)} />
            </Step>

            <Step
              index={3}
              title="Choose your look"
              isOpen={openStep === 3}
              isComplete={maxUnlocked > 3}
              isLocked={maxUnlocked < 3}
              onHeaderClick={() => goToStep(3)}
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
              <Button variant="ink" size="lg" className="mt-6 h-12 px-8" onClick={() => completeStep(3)}>
                Continue to Booking
              </Button>
            </Step>
          </>
        )}

        {/* Final step — book a visit. Index 2 for a wedding inquiry, 4 for "for myself". */}
        <Step
          index={TOTAL_STEPS}
          title="Book your visit"
          description={
            path === "wedding"
              ? "Bring the groom in (or the whole crew) — we'll fit everyone and lock in the look together. Already have a time booked? You can skip this."
              : "Twenty minutes with a fitter and the full collection. Already have a time booked? You can skip this."
          }
          isOpen={openStep === TOTAL_STEPS}
          isComplete={maxUnlocked > TOTAL_STEPS}
          isLocked={maxUnlocked < TOTAL_STEPS}
          onHeaderClick={() => goToStep(TOTAL_STEPS)}
        >
          <CalendlyEmbed
            calendlyUrl={path === "wedding" ? SITE.calendlyUrlWedding : undefined}
            prefill={{ name: form.name, email: form.email, answers: calendlyAnswers }}
          />
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <Button variant="ink" size="lg" className="h-12 px-8" onClick={() => completeStep(TOTAL_STEPS)}>
              I've Booked My Time
            </Button>
            <button
              onClick={() => completeStep(TOTAL_STEPS)}
              className="text-[11px] uppercase tracking-[0.2em] link-underline text-muted-foreground"
            >
              Skip for now
            </button>
          </div>
        </Step>

        {maxUnlocked > TOTAL_STEPS && (
          <div className="mt-10 border-t border-ink pt-8">
            <p className="eyebrow">All set</p>
            <h2 className="mt-3 font-display text-3xl">You're on the books.</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              {path === "wedding"
                ? "We have your wedding details. Our team will follow up to coordinate sizes, looks and pricing for the whole party."
                : "We have your sizes, your look and your details. Our team will follow up to confirm pricing and next steps."}
            </p>
            <Link
              to="/account"
              className="mt-6 inline-flex h-12 items-center justify-center bg-ink px-8 text-xs uppercase tracking-[0.18em] text-primary-foreground"
            >
              My Account
            </Link>
          </div>
        )}
        </>
        )}
      </div>
    </>
  );
};

export default StartOrder;
