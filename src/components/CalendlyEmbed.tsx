import { useEffect } from "react";
import { SITE } from "@/lib/site";

interface CalendlyEmbedProps {
  height?: number;
  /** Overrides SITE.calendlyUrl — e.g. a dedicated wedding-consult event type. */
  calendlyUrl?: string;
  /** Pre-fills the Calendly form so the customer doesn't retype what they
   *  already gave us. `answers` map to Calendly's "Invitee Questions" (a1, a2,
   *  a3...) IN THE ORDER those questions are set up in the Calendly event
   *  type — see docs/STATUS.md for the one-time setup this depends on. */
  prefill?: { name?: string; email?: string; answers?: string[] };
}

const CalendlyEmbed = ({ height = 700, calendlyUrl, prefill }: CalendlyEmbedProps) => {
  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src*="calendly.com/assets/external/widget.js"]',
    );
    if (existing) return;
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const baseUrl = calendlyUrl || SITE.calendlyUrl;
  let url = baseUrl;
  const hasAnswers = prefill?.answers?.some((a) => a && a.trim() !== "");
  if (prefill?.name || prefill?.email || hasAnswers) {
    try {
      const parsed = new URL(baseUrl);
      if (prefill.name) parsed.searchParams.set("name", prefill.name);
      if (prefill.email) parsed.searchParams.set("email", prefill.email);
      prefill.answers?.forEach((answer, i) => {
        if (answer && answer.trim() !== "") parsed.searchParams.set(`a${i + 1}`, answer);
      });
      url = parsed.toString();
    } catch {
      // Malformed calendlyUrl would only happen from a bad config edit —
      // fall back to the plain URL rather than breaking the page.
      url = baseUrl;
    }
  }

  return (
    <div className="border border-border bg-surface">
      <div className="calendly-inline-widget" data-url={url} style={{ minWidth: 320, height }} />
    </div>
  );
};

export default CalendlyEmbed;
