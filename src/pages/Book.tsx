import { useEffect, useState, ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, Lock, X } from "lucide-react";
import Seo from "@/components/Seo";
import SizeProfileForm from "@/components/SizeProfileForm";
import CalendlyEmbed from "@/components/CalendlyEmbed";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { SITE } from "@/lib/site";

// MVP launch funnel. The shop can't take orders online yet, so every CTA on the
// site lands here and picks one of two actions:
//   1. Make your appointment — for a wedding party or for yourself, then Calendly.
//      A wedding-party booking also builds a shareable link (see ShareBox) so
//      out-of-town guests can submit measurements for that wedding.
//   2. Submit your measurements — for out-of-town guests; measurements ride along
//      inside the Calendly booking so they land on the shop's calendar invite.
// Design rule: ask only what the shop can't fill in itself. Anything the staff
// capture in store (address, styles, prices, payment) is deliberately NOT asked
// here — the legacy in-store order sheet is the reference. The old order flow
// (bag / order confirmation) is hidden, not deleted.

type Path = "appointment" | "measurements";
type Who = "wedding" | "myself";
type PartyMember = { role: string; name: string };

const EVENT_TYPES = ["Gala or benefit", "Prom", "Quinceañera", "Awards or premiere", "Wedding guest", "Other"];
const FORMALITY_OPTIONS = ["Not sure yet", "Black tie", "Black tie optional", "Semi-formal", "Casual / beach"];
// Roles mirror the shop's in-store "Wedding Party Info" sheet.
const PARTY_ROLES = [
  "Groom",
  "Best Man",
  "Groomsman",
  "Jr. Groomsman",
  "Father of the Bride",
  "Father of the Groom",
  "Grandfather",
  "Ring Bearer",
  "Usher",
  "Other",
];
const HEARD_OPTIONS = ["", "Instagram", "Facebook", "Google", "Friend or family", "Drove by", "Other"];
const MAX_PARTY = 25;

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

// "|" and "~" delimit the party in the share link, so keep them out of names.
const clean = (s: string) => s.replace(/[|~]/g, " ").trim();

const encodeParty = (party: PartyMember[]) =>
  party
    .filter((m) => m.name.trim())
    .slice(0, MAX_PARTY)
    .map((m) => `${clean(m.role)}~${clean(m.name)}`)
    .join("|");

const decodeParty = (raw: string | null): PartyMember[] =>
  (raw ?? "")
    .split("|")
    .slice(0, MAX_PARTY)
    .map((chunk) => {
      const [role, ...rest] = chunk.split("~");
      return { role: role?.trim() ?? "", name: rest.join("~").trim() };
    })
    .filter((m) => m.name);

// Shareable link for a wedding party. Stateless on purpose: the wedding's name,
// date and party list live in the URL, so there's nothing to store or look up.
// Opening it lands a guest on the measurements path with the wedding filled in
// and a dropdown of the party to pick their name from.
const buildShareUrl = (weddingLabel: string, date: string, party: PartyMember[]) => {
  const url = new URL("/book", window.location.origin);
  url.searchParams.set("for", "measurements");
  if (weddingLabel.trim()) url.searchParams.set("wedding", weddingLabel.trim());
  if (date) url.searchParams.set("date", date);
  const encoded = encodeParty(party);
  if (encoded) url.searchParams.set("party", encoded);
  return url.toString();
};

const ShareBox = ({ weddingLabel, date, party }: { weddingLabel: string; date: string; party: PartyMember[] }) => {
  const [copied, setCopied] = useState(false);
  const url = buildShareUrl(weddingLabel, date, party);
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
        Send this link to out-of-town guests. It opens a short form for them to submit their measurements for your
        wedding{party.some((m) => m.name.trim()) ? ", with your party list ready to pick their name from" : ""}.
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

  // Wedding-party appointment: who is getting married, plus the optional extras
  // from the in-store sheet.
  const [groomName, setGroomName] = useState("");
  const [brideName, setBrideName] = useState("");
  const [weddingLocation, setWeddingLocation] = useState("");
  const [howHeard, setHowHeard] = useState("");
  const [firstStore, setFirstStore] = useState("");
  const [party, setParty] = useState<PartyMember[]>([{ role: "Best Man", name: "" }]);

  // Measurements path: the wedding comes from a shared link (or is typed), and the
  // guest can pick their own name from the party list the groom entered.
  const [weddingOf, setWeddingOf] = useState(searchParams.get("wedding") ?? "");
  const [role, setRole] = useState("Groomsman");
  const sharedParty = decodeParty(searchParams.get("party"));
  const cameFromShareLink = path === "measurements" && !!searchParams.get("wedding");

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [openStep, setOpenStep] = useState(1);
  const [maxUnlocked, setMaxUnlocked] = useState(1);
  const [showValidation, setShowValidation] = useState(false);

  const isWeddingParty = path === "appointment" && who === "wedding";
  // wedding appointment = details -> party -> Calendly (3); myself = details -> Calendly (2);
  // measurements = about you -> sizes -> Calendly (3).
  const TOTAL_STEPS = path === "appointment" && who === "myself" ? 2 : 3;
  const weddingLabel = [groomName.trim(), brideName.trim()].filter(Boolean).join(" & ");

  const selectPath = (p: Path | null) => {
    setPathState(p);
    setOpenStep(1);
    setMaxUnlocked(1);
    setShowValidation(false);
  };

  const changeWho = (w: Who) => {
    setWho(w);
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
        (who === "wedding" ? form.partySize.trim() !== "" && groomName.trim() !== "" : true);

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
  }, [openStep, path, who]);

  // One-line summary of whatever the guest saved in the size form, so it can
  // travel inside a single Calendly answer. Coat length and shoe width are stored
  // alongside the measurements but aren't inches.
  const UNITLESS = new Set(["coatLength", "shoeWidth"]);
  const measurementsSummary = (() => {
    const parts: string[] = [];
    if (sizeProfile.method === "measurements" && sizeProfile.measurements) {
      const m = Object.entries(sizeProfile.measurements)
        .filter(([k, v]) => !UNITLESS.has(k) && v && v.trim() !== "")
        .map(([k, v]) => `${k} ${v}"`);
      if (m.length) parts.push(m.join(", "));
    }
    if (sizeProfile.method === "brands" && sizeProfile.brandSizes) {
      const b = Object.entries(sizeProfile.brandSizes).map(
        ([brand, s]) => `${brand}: jacket ${s.jacket || "-"}, trouser ${s.trouser || "-"}, shirt ${s.shirt || "-"}`,
      );
      if (b.length) parts.push(b.join("; "));
    }
    if (sizeProfile.measurements?.coatLength) parts.push(`coat length ${sizeProfile.measurements.coatLength}`);
    if (sizeProfile.shoeSize) parts.push(`shoe ${sizeProfile.shoeSize}`);
    if (sizeProfile.measurements?.shoeWidth) parts.push(`shoe width ${sizeProfile.measurements.shoeWidth}`);
    if (sizeProfile.beltSize) parts.push(`belt ${sizeProfile.beltSize}`);
    return parts.join(" | ");
  })();

  // Wedding-party details that don't have their own Calendly question ride along
  // in the Notes answer (Calendly allows 10 questions in total).
  const partyText = party
    .filter((m) => m.name.trim())
    .map((m) => `${m.role}: ${m.name.trim()}`)
    .join("; ");
  const weddingNotes = [
    form.notes.trim(),
    weddingLocation.trim() && `Location: ${weddingLocation.trim()}`,
    howHeard && `Heard via: ${howHeard}`,
    firstStore && `First store visited: ${firstStore}`,
    partyText && `Party: ${partyText}`,
  ]
    .filter(Boolean)
    .join(" | ");

  // Calendly "Invitee Questions" fill from a1, a2, a3... in the exact order they
  // are listed on the Calendly event type. See docs/STATUS.md.
  const calendlyAnswers =
    path === "measurements"
      ? [form.phone, form.eventDate, weddingOf, role, form.height, form.weight, measurementsSummary, form.notes]
      : [
          form.phone,
          who === "wedding" ? "Wedding party" : "Myself",
          who === "wedding" ? "Wedding" : form.eventType,
          form.eventDate,
          who === "wedding" ? weddingLabel : "",
          who === "wedding" ? form.partySize : "",
          who === "wedding" ? form.formality : "",
          who === "wedding" ? weddingNotes : form.notes,
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
        <span className="eyebrow">Your name *</span>
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

  const progressLabel = TOTAL_STEPS === 2 ? "Two quick steps" : "Three quick steps";

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
          Registering a wedding is free, with no deposit online — a first payment is taken in store when you reserve.
          Pricing is confirmed by our team in person.
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
              <p className="eyebrow">{progressLabel}</p>
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
                    onClick={() => changeWho(w)}
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
                      <label className="block">
                        <span className="eyebrow">Groom's name *</span>
                        <input
                          required
                          value={groomName}
                          onChange={(e) => setGroomName(e.target.value)}
                          className={`${fieldClass} mt-2 ${err(!groomName.trim())}`}
                        />
                      </label>
                      <label className="block">
                        <span className="eyebrow">Bride's name</span>
                        <input
                          value={brideName}
                          onChange={(e) => setBrideName(e.target.value)}
                          className={`${fieldClass} mt-2`}
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

                {who === "wedding" && (
                  <details className="mt-6 border border-border p-4">
                    <summary className="cursor-pointer text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      A little more (optional)
                    </summary>
                    <div className="mt-4 grid gap-5 sm:grid-cols-2">
                      <label className="block sm:col-span-2">
                        <span className="eyebrow">Wedding location</span>
                        <input
                          value={weddingLocation}
                          onChange={(e) => setWeddingLocation(e.target.value)}
                          className={`${fieldClass} mt-2`}
                        />
                      </label>
                      <label className="block">
                        <span className="eyebrow">How did you hear about us?</span>
                        <select
                          value={howHeard}
                          onChange={(e) => setHowHeard(e.target.value)}
                          className={`${fieldClass} mt-2`}
                        >
                          {HEARD_OPTIONS.map((h) => (
                            <option key={h} value={h}>
                              {h || "Select"}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block">
                        <span className="eyebrow">Are we the first store you've visited?</span>
                        <select
                          value={firstStore}
                          onChange={(e) => setFirstStore(e.target.value)}
                          className={`${fieldClass} mt-2`}
                        >
                          <option value="">Select</option>
                          <option>Yes</option>
                          <option>No</option>
                        </select>
                      </label>
                    </div>
                  </details>
                )}

                {termsCheckbox}

                {showValidation && !requiredFilled && (
                  <p className="mt-4 text-sm text-destructive">
                    {who === "wedding"
                      ? "Wedding date, groom's name, party size, your name, email, phone and agreeing to the Terms & Conditions are required to continue."
                      : "Event date, name, email, phone and agreeing to the Terms & Conditions are required to continue."}
                  </p>
                )}

                <Button variant="ink" size="lg" className="mt-6 h-12 px-8" onClick={continueFromContact}>
                  {who === "wedding" ? "Continue to Your Party" : "Continue to Booking"}
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
                  {sharedParty.length > 0 && (
                    <label className="block sm:col-span-2">
                      <span className="eyebrow">Find your name in the party</span>
                      <select
                        defaultValue=""
                        onChange={(e) => {
                          const m = sharedParty[Number(e.target.value)];
                          if (!m) return;
                          setForm((f) => ({ ...f, name: m.name }));
                          if (PARTY_ROLES.includes(m.role)) setRole(m.role);
                        }}
                        className={`${fieldClass} mt-2`}
                      >
                        <option value="">I'm not listed</option>
                        {sharedParty.map((m, i) => (
                          <option key={`${m.name}-${i}`} value={i}>
                            {m.name} — {m.role}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}
                  {nameEmailPhone}
                  <label className="block">
                    <span className="eyebrow">Your role *</span>
                    <select value={role} onChange={(e) => setRole(e.target.value)} className={`${fieldClass} mt-2`}>
                      {PARTY_ROLES.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="eyebrow">Wedding date</span>
                    <input
                      type="date"
                      value={form.eventDate}
                      onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                      className={`${fieldClass} mt-2`}
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="eyebrow">Whose wedding? (groom &amp; bride) *</span>
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

            {/* Step 2 — wedding party roster (wedding-party appointment only) */}
            {isWeddingParty && (
              <Step
                index={2}
                title="Your wedding party"
                description="Optional, but it saves time at your fitting: add who's in the party and we'll have their names ready. Your out-of-town guests can then pick their name from this list."
                isOpen={openStep === 2}
                isComplete={maxUnlocked > 2}
                isLocked={maxUnlocked < 2}
                onHeaderClick={() => goToStep(2)}
              >
                <div className="space-y-3">
                  {party.map((m, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <select
                        aria-label={`Role for person ${i + 1}`}
                        value={m.role}
                        onChange={(e) => setParty(party.map((p, j) => (j === i ? { ...p, role: e.target.value } : p)))}
                        className={`${fieldClass} w-40 shrink-0`}
                      >
                        {PARTY_ROLES.filter((r) => r !== "Groom").map((r) => (
                          <option key={r}>{r}</option>
                        ))}
                      </select>
                      <input
                        aria-label={`Name for person ${i + 1}`}
                        placeholder="Full name"
                        value={m.name}
                        onChange={(e) => setParty(party.map((p, j) => (j === i ? { ...p, name: e.target.value } : p)))}
                        className={`${fieldClass} min-w-0 flex-1`}
                      />
                      {party.length > 1 && (
                        <button
                          type="button"
                          aria-label={`Remove person ${i + 1}`}
                          onClick={() => setParty(party.filter((_, j) => j !== i))}
                          className="mt-2.5 text-muted-foreground hover:text-foreground"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {party.length < MAX_PARTY && (
                  <button
                    type="button"
                    onClick={() => setParty([...party, { role: "Groomsman", name: "" }])}
                    className="mt-4 text-[11px] uppercase tracking-[0.2em] link-underline"
                  >
                    + Add another
                  </button>
                )}
                <div className="mt-6 flex flex-wrap items-center gap-5">
                  <Button variant="ink" size="lg" className="h-12 px-8" onClick={() => completeStep(2)}>
                    Continue to Booking
                  </Button>
                  <button
                    type="button"
                    onClick={() => completeStep(2)}
                    className="text-[11px] uppercase tracking-[0.2em] link-underline text-muted-foreground"
                  >
                    Skip for now
                  </button>
                </div>
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
              {isWeddingParty && <ShareBox weddingLabel={weddingLabel} date={form.eventDate} party={party} />}
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
                {isWeddingParty && <ShareBox weddingLabel={weddingLabel} date={form.eventDate} party={party} />}
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
