import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { SITE, mapsDirectionsUrl, mapsEmbedUrl } from "@/lib/site";

const ComeSeeUs = () => (
  <>
    <Seo
      title="Come See Us — Mr. Tux, Miami FL"
      description={`Visit Mr. Tux at ${SITE.address.full}. Hours, directions, and how to start a visit.`}
    />

    <div className="mx-auto max-w-6xl px-5 lg:px-8 py-14 sm:py-20">
      <p className="eyebrow">Come and see us</p>
      <h1 className="mt-3 font-display text-4xl sm:text-5xl">The shop</h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div>
          <p className="text-sm">{SITE.address.line1}</p>
          <p className="text-sm text-muted-foreground">
            {SITE.address.city}, {SITE.address.state} {SITE.address.zip}
          </p>

          <div className="mt-8">
            <p className="eyebrow">Hours</p>
            <ul className="mt-4 space-y-2 text-sm">
              {SITE.hours.map((h) => (
                <li key={h.days} className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">{h.days}</span>
                  <span>{h.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={mapsDirectionsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center border border-ink px-8 text-xs uppercase tracking-[0.18em]"
            >
              Get Directions
            </a>
            <Link
              to="/appointment"
              className="inline-flex h-12 items-center justify-center bg-ink px-8 text-xs uppercase tracking-[0.18em] text-primary-foreground"
            >
              Start a Visit
            </Link>
          </div>
        </div>

        <iframe
          title="Mr. Tux location map"
          src={mapsEmbedUrl}
          loading="lazy"
          className="h-[420px] w-full border border-border"
        />
      </div>
    </div>
  </>
);

export default ComeSeeUs;
