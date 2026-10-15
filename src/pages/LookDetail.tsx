import { Link, useParams } from "react-router-dom";
import { Check } from "lucide-react";
import Seo from "@/components/Seo";
import { looks } from "@/data/looks";
import { SITE, mapsDirectionsUrl } from "@/lib/site";

// Every rental includes these on top of the look's own pieces.
const ALWAYS_INCLUDED = ["Accessories — tie, vest, suspenders and more", "Jewelry — studs & cufflinks"];

// Appointment-first MVP: no online ordering yet, so there's no Add to Bag, size
// box or accessories picker here. The data for all of those still exists —
// bring them back from git history when ordering goes live.
const LookDetail = () => {
  const { id } = useParams();
  const look = looks.find((l) => l.id === id);

  if (!look) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-24 text-center">
        <h1 className="font-display text-3xl">Look not found</h1>
        <Link to="/collection" className="mt-6 inline-block text-[11px] uppercase tracking-[0.2em] link-underline">
          Back to the collection
        </Link>
      </div>
    );
  }

  return (
    <>
      <Seo
        title={`${look.name} — ${look.collection} | Mr. Tux`}
        description={`${look.description} A ${look.rentalDays}-day rental. Prices vary — call or stop by for a quote.`}
      />

      <div className="mx-auto max-w-6xl px-5 lg:px-8 py-10 sm:py-14">
        <Link to="/collection" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
          ← Collection
        </Link>

        <div className="mt-8 grid gap-12 lg:grid-cols-2">
          <img
            src={look.image}
            alt={look.name}
            width={1200}
            height={1504}
            className="w-full bg-surface object-cover"
          />

          <div>
            <p className="eyebrow">{look.collection}</p>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl">{look.name}</h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{look.description}</p>
            <p className="mt-6 font-display text-2xl">Prices vary</p>
            <p className="text-sm text-muted-foreground">
              {look.rentalDays}-day rental · no deposit · final pricing confirmed with our team
            </p>

            <div className="mt-8 border-t border-border pt-6">
              <p className="eyebrow">What's included</p>
              <ul className="mt-4 space-y-2">
                {[...look.items, ...ALWAYS_INCLUDED].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <Check size={14} className="mt-1 shrink-0 text-highlight" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 border border-border bg-surface p-5">
              <p className="text-sm">Want to try it on? Call us or stop by the shop — we'll take it from there.</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <a
                  href={SITE.phoneHref}
                  className="inline-flex h-12 items-center justify-center bg-ink px-8 text-xs uppercase tracking-[0.18em] text-primary-foreground"
                >
                  Call {SITE.phone}
                </a>
                <a
                  href={mapsDirectionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center justify-center border border-ink px-8 text-xs uppercase tracking-[0.18em]"
                >
                  Get Directions
                </a>
              </div>
              <Link to="/book" className="mt-4 inline-block text-[11px] uppercase tracking-[0.2em] link-underline">
                Or book an appointment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LookDetail;
