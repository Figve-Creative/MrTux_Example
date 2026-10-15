import { useEffect, useState, ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, Lock } from "lucide-react";
import Seo from "@/components/Seo";
import SizeProfileForm from "@/components/SizeProfileForm";
import CalendlyEmbed from "@/components/CalendlyEmbed";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { SITE } from "@/lib/site";

// MVP launch funnel. The shop can't take orders online yet, so every CTA on the
// site lands here and picks one of two actions:
//   1. Make your appointment — either for a wedding party or for yourself, then Calendly.
//      A wedding-party booking also produces a shareable link (see ShareBox) that
//      out-of-town groomsmen use to submit measurements for that wedding.
//   2. Submit your measurements — for out-of-town guests; measurements ride along
//      inside the Calendly booking so they land on the shop's calendar invite.
// The old order flow (bag / order confirmation) is hidden, not deleted.

type Path = "appointment" | "measurements";
type Who = "wedding" | "myself";

const EVENT_TYPES = ["Gala or benefit", "Prom", "Quinceañera", "Awards or premiere", "Wedding guest", "Other"];
const FORMALITY_OPTIONS = ["Not sure yet", "Black tie", "Black tie optional", "Semi-formal", "Casual / beach"];

const fieldClass =
  "w-full border border-input bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-highlight";

const EMAIL_RE = /\S+@\S+\.\S+/;

// --- Accordion step shell ----------------------------------------------------
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
      <h2 className={`font-display text-2xl sm:text-3xl ${isLocked ? "text-muted-foreground/50" : "text-foreground"}`}>
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

// Legacy ?for= values: "wedding" used to mean the wedding-party intake.
const parseEntry = (value: string | null): { path: Path | null; who: Who } => {
  if (value === "measurements") return { path: "measurements", who: "wedding" };
  if (value === "wedding") return { path: "appointment", who: "wedding" };
  if (value === "myself") return { path: "appointment", who: "myself" };
  if (value === "appointment") return { path: "appointment", who: "wedding" };
  return { path: null, who: "wedding" };
};

// Shareable link for a wedding party. Stateless on purpose: the wedding's name
// and date live in the URL, so there's nothing to store or look up. Opening it
// lands a guest on the measurements path with the wedding already filled in.
const buildShareUrl = (weddingOf: string, date: string) => {
  const url = new URL("/book", window.location.origin);
  url.searchParams.set("for", "measurements");
  if (weddingOf.trim()) url.searchParams.set("wedding", weddingOf.trim());
  if (date) url.searchParams.set("date", date);
  return url.toString();
};

const ShareBox = ({ weddingOf, date }: { weddingOf: string; date: string }) => {
  const [copied, setCopied] = useState(false);
  const url = buildShareUrl(weddingOf, date);
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard can be blocked (older browsers / insecure context) — the link
      // is still visible below so it can be selected and copied by hand.
      setCopied(false);
    }
  };

  return (
    <div className="mt-6 border border-ink p-5">
      <p className="eyebrow">Share with your wedding party</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Send this link to out-of-town groomsmen. It opens a short form for them to submit their measurements for your
        wedding.
      </p>
      <input
        readOnly
        value={url}
        onFocus={(e) => e.currentTarget.select()}
        aria-label="Shareable link for your wedding party"
        className={`${fieldClass} mt-4 text-xs`}
      />
      <div className="mt-3 flex flex-wrap gap-3">
        <Button variant="ink" size="lg" className="h-11 px-6" onClick={copy}>
          {copied ? "Copied" : "Copy link"}
        </Button>
        {canShare && (
          <button
            type="button"
            onClick={() => navigator.share({ title: "Mr. Tux — submit your measurements", url }).catch(() => {})}
            className="h-11 border border-ink px-6 text-xs uppercase tracking-[0.18em]"
          >
            Share
          </button>
        )}
      </div>
    </div>
  );
};

const Book = () => {
  const [searchParams] = useSearchParams();
  const entry = parseEntry(searchParams.get("for"));
  const [path, setPathState] = useState<Path | null>(entry.path);
  const [who, setWho] = useState<Who>(entry.who);
  const { event, setEvent, sizeProfile } = useApp();
  // Spread over defaults so an event saved before a field existed doesn't leave
  // it `undefined`.
  const [form, setForm] = useState(() => ({
    eventType: EVENT_TYPES[0],
    eventDate: searchParams.get("date") ?? "",
    name: "",
    email: "",
    phone: "",
    height: "",
    weight: "",
    partySize: "",
    formality: FORMALITY_OPTIONS[0],
    notes: "",
    ...event,
    // A shared link's date always wins over whatever was saved locally.
    ...(searchParams.get("date") ? { eventDate: searchParams.get("date") as string } : {}),
  }));
  // Wedding name: used by the wedding-party appointment and by guests submitting
  // measurements. Prefilled from a shared link.
  const [weddingOf, setWeddingOf] = useState(searchParams.get("wedding") ?? "");
  const cameFromShareLink = path === "measurements" && !!searchParams.get("wedding");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [openStep, setOpenStep] = useState(1);
  const [maxUnlocked, setMaxUnlocked] = useState(1);
  const [showValidation, setShowValidation] = useState(false);

  // Appointment = details -> Calendly (2 steps). Measurements = about you -> sizes -> Calendly (3).
  const TOTAL_STEPS = path === "measurements" ? 3 : 2;
  const isWeddingParty = path === "appointment" && who === "wedding";

  const selectPath = (p: Path | null) => {
    setPathState(p);
    setOpenStep(1);
    setMaxUnlocked(1);
    setShowValidation(false);
  };

  const baseFilled = form.name.trim() !== "" && EMAIL_RE.test(form.email) && form.phone.trim() !== "" && agreedToTerms;
  const requiredFilled =
    path === "measurements"
      ? baseFilled && weddingOf.trim() !== "" && form.height.trim() !== "" && form.weight.trim() !== ""
      : baseFilled &&
        form.eventDate.trim() !== "" &&
        (who === "wedding" ? form.partySize.trim() !== "" && weddingOf.trim() !== "" : true);

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
    setEvent({ ...form, eventType: isWeddingParty ? "Wedding" : form.eventType });
    setShowValidation(false);
    completeStep(1);
  };

  // Calendly posts a message to the parent window when someone finishes booking.
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

  // One-line summary of whatever the guest saved in the size form, so it can
  // travel inside a single Calendly answer.
  const measurementsSummary = (() => {
    const parts: string[] = [];
    if (sizeProfile.method === "measurements" && sizeProfile.measurements) {
      const m = Object.entries(sizeProfile.measurements)
        .filter(([, v]) => v && v.trim() !== "")
        .map(([k, v]) => `${k} ${v}"`);
      if (m.length) parts.push(m.join(", "));
    }
    if (sizeProfile.method === "brands" && sizeProfile.brandSizes) {
      const b = Object.entries(sizeProfile.brandSizes).map(
        ([brand, s]) => `${brand}: jacket ${s.jacket || "-"}, trouser ${s.trouser || "-"}, shirt ${s.shirt || "-"}`,
      );
      if (b.length) parts.push(b.join("; "));
    }
    if (sizeProfile.shoeSize) parts.push(`shoe ${sizeProfile.shoeSize}`);
    if (sizeProfile.beltSize) parts.push(`belt ${sizeProfile.beltSize}`);
    return parts.join(" | ");
  })();

  // Calendly "Invitee Questions" fill from a1, a2, a3... in the exact order they
  // are listed on the Calendly event type. See docs/STATUS.md.
  const calendlyAnswers =
    path === "measurements"
      ? [form.phone, form.eventDate, weddingOf, form.height, form.weight, measurementsSummary, form.notes]
      : [
          form.phone,
          who === "wedding" ? "Wedding party" : "Myself",
          who === "wedding" ? "Wedding" : form.eventType,
          form.eventDate,
          who === "wedding" ? weddingOf : "",
          who === "wedding" ? form.partySize : "",
          who === "wedding" ? form.formality : "",
          form.notes,
          who === "myself" ? form.height : "",
          who === "myself" ? form.weight : "",
        ];

  const calendlyUrl = path === "measurements" ? SITE.calendlyUrlMeasurements : SITE.calendlyUrlWedding;

  const termsCheckbox = (
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
  );

  const err = (bad: boolean) => (showValidation && bad ? "border-destructive" : "");

  const nameEmailPhone = (
    <>
      <label className="block">
        <span className="eyebrow">Name *</span>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={`${fieldClass} mt-2 ${err(!form.name.trim())}`}
        />
      </label>
      <label className="block">
        <span className="eyebrow">Email *</span>
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className={`${fieldClass} mt-2 ${err(!EMAIL_RE.test(form.email))}`}
        />
      </label>
      <label className="block sm:col-span-2">
        <span className="eyebrow">Phone *</span>
        <input
          required
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className={`${fieldClass} mt-2 ${err(!form.phone.trim())}`}
        />
      </label>
    </>
  );

  return (
    <>
      <Seo
        title="Make Your Appointment — Mr. Tux Miami"
        description="Make an appointment for your wedding party or yourself, or submit your measurements if you're traveling in. Mr. Tux, Miami."
      />

      <div className="mx-auto max-w-3xl px-5 lg:px-8 py-14 sm:py-20">
        <p className="eyebrow">Mr. Tux</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">How can we help?</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Registering a wedding is free. Pricing is confirmed by our team in person.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => selectPath("appointment")}
            className={`border p-6 text-left transition-colors ${
              path === "appointment" ? "border-ink bg-surface" : "border-border hover:border-ink"
            }`}
          >
            <p className="eyebrow">In person</p>
            <h2 className="mt-2 font-display text-2xl">Make your appointment</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              For a wedding party or just yourself — pick a time to come in and meet with us.
            </p>
          </button>

          <button
            type="button"
            onClick={() => selectPath("measurements")}
            className={`border p-6 text-left transition-colors ${
              path === "measurements" ? "border-ink bg-surface" : "border-border hover:border-ink"
            }`}
          >
            <p className="eyebrow">Out of town</p>
            <h2 className="mt-2 font-display text-2xl">Submit your measurements</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              One look, every man, wherever they live. Send us your sizes for a wedding party.
            </p>
          </button>
        </div>

        {path && (
          <>
            <div className="mt-14 flex items-center justify-between border-t border-border pt-6">
              <p className="eyebrow">{path === "measurements" ? "Three quick steps" : "Two quick steps"}</p>
              <button
                type="button"
                onClick={() => selectPath(null)}
                className="text-[11px] uppercase tracking-[0.2em] link-underline text-muted-foreground"
              >
                Change
              </button>
            </div>

            {path === "appointment" && (
              <div className="mt-6 flex border border-border" role="group" aria-label="Who is the appointment for?">
                {(["wedding", "myself"] as const).map((w) => (
                  <button
                    key={w}
                    type="button"
                    aria-pressed={who === w}
                    onClick={() => setWho(w)}
                    className={`flex-1 py-3 text-[11px] uppercase tracking-[0.18em] transition-colors ${
                      who === w ? "bg-ink text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {w === "wedding" ? "Wedding party" : "Myself"}
                  </button>
                ))}
              </div>
            )}

            {/* Step 1 */}
            {path === "appointment" ? (
              <Step
                index={1}
                title={who === "wedding" ? "Your wedding" : "Your event"}
                description={
                  who === "wedding"
                    ? "The basics — we'll coordinate sizes and pick a look with the whole party."
                    : "Tell us what you're dressing for and we'll have you covered."
                }
                isOpen={openStep === 1}
                isComplete={maxUnlocked > 1}
                isLocked={false}
                onHeaderClick={() => goToStep(1)}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  {who === "myself" && (
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
                  )}
                  <label className="block">
                    <span className="eyebrow">{who === "wedding" ? "Wedding date *" : "Event date *"}</span>
                    <input
                      required
                      type="date"
                      value={form.eventDate}
                      onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                      className={`${fieldClass} mt-2 ${err(!form.eventDate.trim())}`}
                    />
                  </label>
                  {who === "myself" && (
                    <>
                      <label className="block">
                        <span className="eyebrow">Height (optional)</span>
                        <input
                          placeholder="e.g. 5'10 or 178cm"
                          value={form.height}
                          onChange={(e) => setForm({ ...form, height: e.target.value })}
                          className={`${fieldClass} mt-2`}
                        />
                      </label>
                      <label className="block">
                        <span className="eyebrow">Weight (optional)</span>
                        <input
                          placeholder="e.g. 180 lbs"
                          value={form.weight}
                          onChange={(e) => setForm({ ...form, weight: e.target.value })}
                          className={`${fieldClass} mt-2`}
                        />
                      </label>
                    </>
                  )}
                  {who === "wedding" && (
                    <>
                      <label className="block sm:col-span-2">
                        <span className="eyebrow">Whose wedding? (groom or party name) *</span>
                        <input
                          required
                          value={weddingOf}
                          onChange={(e) => setWeddingOf(e.target.value)}
                          className={`${fieldClass} mt-2 ${err(!weddingOf.trim())}`}
                        />
                      </label>
                      <label className="block">
                        <span className="eyebrow">Number of men in the party *</span>
                        <input
                          inputMode="numeric"
                          value={form.partySize}
                          onChange={(e) => setForm({ ...form, partySize: e.target.value })}
                          className={`${fieldClass} mt-2 ${err(!form.partySize.trim())}`}
                        />
                      </label>
                      <label className="block">
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
                    </>
                  )}
                  {nameEmailPhone}
                  <label className="block sm:col-span-2">
                    <span className="eyebrow">Anything we should know</span>
                    <textarea
                      rows={3}
                      placeholder={
                        who === "wedding"
                          ? "Colors you're leaning toward, out-of-town groomsmen, anything else helpful"
                          : "Anything that helps us prepare"
                      }
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      className={`${fieldClass} mt-2`}
                    />
                  </label>
                </div>

                {termsCheckbox}

                {showValidation && !requiredFilled && (
                  <p className="mt-4 text-sm text-destructive">
                    {who === "wedding"
                      ? "Wedding date, whose wedding, party size, name, email, phone and agreeing to the Terms & Conditions are required to continue."
                      : "Event date, name, email, phone and agreeing to the Terms & Conditions are required to continue."}
                  </p>
                )}

                <Button variant="ink" size="lg" className="mt-6 h-12 px-8" onClick={continueFromContact}>
                  Continue to Booking
                </Button>
              </Step>
            ) : (
              <Step
                index={1}
                title="About you"
                description={
                  cameFromShareLink
                    ? `You're submitting measurements for the ${weddingOf} wedding. Tell us who you are and we'll match your sizes to the party.`
                    : "Tell us who you are and whose wedding you're part of, so we can match your sizes to the party."
                }
                isOpen={openStep === 1}
                isComplete={maxUnlocked > 1}
                isLocked={false}
                onHeaderClick={() => goToStep(1)}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  {nameEmailPhone}
                  <label className="block">
                    <span className="eyebrow">Wedding date</span>
                    <input
                      type="date"
                      value={form.eventDate}
                      onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                      className={`${fieldClass} mt-2`}
                    />
                  </label>
                  <label className="block">
                    <span className="eyebrow">Whose wedding? (groom or party name) *</span>
                    <input
                      required
                      value={weddingOf}
                      onChange={(e) => setWeddingOf(e.target.value)}
                      className={`${fieldClass} mt-2 ${err(!weddingOf.trim())}`}
                    />
                  </label>
                  <label className="block">
                    <span className="eyebrow">Height *</span>
                    <input
                      required
                      placeholder="e.g. 5'10 or 178cm"
                      value={form.height}
                      onChange={(e) => setForm({ ...form, height: e.target.value })}
                      className={`${fieldClass} mt-2 ${err(!form.height.trim())}`}
                    />
                  </label>
                  <label className="block">
                    <span className="eyebrow">Weight *</span>
                    <input
                      required
                      placeholder="e.g. 180 lbs"
                      value={form.weight}
                      onChange={(e) => setForm({ ...form, weight: e.target.value })}
                      className={`${fieldClass} mt-2 ${err(!form.weight.trim())}`}
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

                {termsCheckbox}

                {showValidation && !requiredFilled && (
                  <p className="mt-4 text-sm text-destructive">
                    Name, email, phone, whose wedding, height, weight and agreeing to the Terms & Conditions are
                    required to continue.
                  </p>
                )}

                <Button variant="ink" size="lg" className="mt-6 h-12 px-8" onClick={continueFromContact}>
                  Continue to Sizes
                </Button>
              </Step>
            )}

            {/* Step 2 — measurements path only */}
            {path === "measurements" && (
              <Step
                index={2}
                title="Your sizes"
                description="Give us measurements, or the brand sizes you already wear. Our team will use these to prepare your look."
                isOpen={openStep === 2}
                isComplete={maxUnlocked > 2}
                isLocked={maxUnlocked < 2}
                onHeaderClick={() => goToStep(2)}
              >
                <SizeProfileForm onSaved={() => completeStep(2)} />
              </Step>
            )}

            {/* Final step — Calendly */}
            <Step
              index={TOTAL_STEPS}
              title={path === "measurements" ? "Send it in" : "Book your appointment"}
              description={
                path === "measurements"
                  ? "Pick any open time for a quick call with our team — your measurements are attached to the booking, so nothing else to send."
                  : "Pick a time to come in — your details are attached to the booking. Already have a time booked? You can skip this."
              }
              isOpen={openStep === TOTAL_STEPS}
              isComplete={maxUnlocked > TOTAL_STEPS}
              isLocked={maxUnlocked < TOTAL_STEPS}
              onHeaderClick={() => goToStep(TOTAL_STEPS)}
            >
              <CalendlyEmbed
                calendlyUrl={calendlyUrl}
                prefill={{ name: form.name, email: form.email, answers: calendlyAnswers }}
              />
              {isWeddingParty && <ShareBox weddingOf={weddingOf} date={form.eventDate} />}
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
                <h2 className="mt-3 font-display text-3xl">Thank you.</h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  {path === "measurements"
                    ? "We have your measurements. Our team will be in touch if we need anything else."
                    : "We have your details. Our team will see you at your appointment — or call us any time."}
                </p>
                {isWeddingParty && <ShareBox weddingOf={weddingOf} date={form.eventDate} />}
                <a
                  href={SITE.phoneHref}
                  className="mt-6 inline-flex h-12 items-center justify-center bg-ink px-8 text-xs uppercase tracking-[0.18em] text-primary-foreground"
                >
                  Call {SITE.phone}
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Book;
