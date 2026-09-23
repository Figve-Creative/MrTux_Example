import { Link } from "react-router-dom";
import { SITE } from "@/lib/site";

const columns = [
  {
    heading: "Shop",
    links: [
      { to: "/collection", label: "Collection" },
      { to: "/start-your-order", label: "Start Your Order" },
      { to: "/wedding-parties", label: "Wedding Parties" },
      { to: "/appointment", label: "Start a Visit" },
    ],
  },
  {
    heading: "House",
    links: [
      { to: "/our-story", label: "Our Story" },
      { to: "/come-see-us", label: "Come See Us" },
      { to: "/journal", label: "Journal" },
      { to: "/faqs", label: "FAQs" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { to: "/terms", label: "Terms & Conditions" },
      { to: "/privacy", label: "Privacy" },
    ],
  },
];

const Footer = () => (
  <footer className="mt-24 bg-ink text-cream">
    <div className="mx-auto max-w-6xl px-5 lg:px-8 py-14">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-2xl">{SITE.name}</p>
          <p className="mt-3 text-sm text-cream/70 max-w-xs">
            Tuxedo and formal menswear rental. Two sizes delivered. Return label included.
          </p>
          <p className="mt-4 text-sm text-cream/90">{SITE.address.full}</p>
        </div>

        {columns.map((col) => (
          <div key={col.heading}>
            <p className="font-body text-[11px] uppercase tracking-[0.24em] text-cream/60">{col.heading}</p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-cream/80 hover:text-cream transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-col gap-4 border-t border-cream/20 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-5">
          {SITE.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] uppercase tracking-[0.2em] text-cream/70 hover:text-cream"
            >
              {s.label}
            </a>
          ))}
        </div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-cream/60">
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
