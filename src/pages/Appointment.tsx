import { useEffect } from "react";
import Seo from "@/components/Seo";
import { SITE } from "@/lib/site";

const Appointment = () => {
  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>('script[src*="calendly.com/assets/external/widget.js"]');
    if (existing) return;
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      <Seo
        title="Start a Visit — Mr. Tux Miami"
        description="Start a visit with Mr. Tux in Miami. Twenty minutes with a fitter and the full collection."
      />

      <div className="mx-auto max-w-4xl px-5 lg:px-8 py-14 sm:py-20">
        <p className="eyebrow">In person</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">Start a visit</h1>
        <p className="mt-4 max-w-xl text-sm text-muted-foreground">
          Choose a time below. We are at {SITE.address.full}. Bring dress shoes if you have them.
        </p>

        <div className="mt-10 border border-border bg-surface">
          <div
            className="calendly-inline-widget"
            data-url={SITE.calendlyUrl}
            style={{ minWidth: 320, height: 700 }}
          />
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Prefer to write?{" "}
          <a href={SITE.calendlyUrl} target="_blank" rel="noreferrer" className="link-underline text-foreground">
            Open the scheduler in a new tab
          </a>
          .
        </p>
      </div>
    </>
  );
};

export default Appointment;
