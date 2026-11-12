import { useEffect, useRef } from "react";
import { SITE } from "@/lib/site";

interface CalendlyEmbedProps {
  height?: number;
  /** Overrides SITE.calendlyUrl. */
  calendlyUrl?: string;
  /** Pre-fills the Calendly form so the customer doesn't retype what they
   *  already gave us. `answers` map to Calendly's "Invitee Questions" (a1, a2,
   *  a3...) IN THE ORDER those questions are set up in the Calendly event
   *  type — see docs/STATUS.md for the one-time setup this depends on. */
  prefill?: { name?: string; email?: string; answers?: string[] };
}

const SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";

// Loads Calendly's widget script once and resolves when window.Calendly exists.
const loadCalendly = (): Promise<void> =>
  new Promise((resolve, reject) => {
    if ((window as any).Calendly) return resolve();
    let script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (!script) {
      script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      document.body.appendChild(script);
    }
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () => reject(new Error("Calendly failed to load")));
  });

const CalendlyEmbed = ({ height = 700, calendlyUrl, prefill }: CalendlyEmbedProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const url = calendlyUrl || SITE.calendlyUrl;

  // Calendly's own prefill option takes plain values (no URL encoding), so spaces
  // and symbols arrive exactly as typed ("Black tie", not "Black+tie").
  const customAnswers: Record<string, string> = {};
  prefill?.answers?.forEach((answer, i) => {
    if (answer && answer.trim() !== "") customAnswers[`a${i + 1}`] = answer;
  });
  const prefillKey = JSON.stringify([prefill?.name, prefill?.email, customAnswers]);

  useEffect(() => {
    let cancelled = false;
    loadCalendly()
      .then(() => {
        const el = ref.current;
        if (cancelled || !el) return;
        el.innerHTML = "";
        (window as any).Calendly.initInlineWidget({
          url,
          parentElement: el,
          prefill: {
            ...(prefill?.name ? { name: prefill.name } : {}),
            ...(prefill?.email ? { email: prefill.email } : {}),
            customAnswers,
          },
        });
      })
      .catch(() => {
        /* Script blocked: the call/email fallbacks elsewhere on the page still work. */
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, prefillKey]);

  return (
    <div className="border border-border bg-surface">
      <div ref={ref} style={{ minWidth: 320, height }} />
    </div>
  );
};

export default CalendlyEmbed;
