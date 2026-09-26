import { useEffect } from "react";
import { SITE } from "@/lib/site";

interface CalendlyEmbedProps {
  height?: number;
  /** Pre-fills the Calendly form so the customer doesn't retype what they
   *  already gave us. */
  prefill?: { name?: string; email?: string };
}

const CalendlyEmbed = ({ height = 700, prefill }: CalendlyEmbedProps) => {
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

  let url = SITE.calendlyUrl;
  if (prefill?.name || prefill?.email) {
    try {
      const parsed = new URL(SITE.calendlyUrl);
      if (prefill.name) parsed.searchParams.set("name", prefill.name);
      if (prefill.email) parsed.searchParams.set("email", prefill.email);
      url = parsed.toString();
    } catch {
      // Malformed SITE.calendlyUrl would only happen from a bad config edit —
      // fall back to the plain URL rather than breaking the page.
      url = SITE.calendlyUrl;
    }
  }

  return (
    <div className="border border-border bg-surface">
      <div className="calendly-inline-widget" data-url={url} style={{ minWidth: 320, height }} />
    </div>
  );
};

export default CalendlyEmbed;
