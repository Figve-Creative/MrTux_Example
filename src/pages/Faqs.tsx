import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { faqs } from "@/data/content";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
};

const Faqs = () => (
  <>
    <Seo
      title="FAQs — Rentals, Sizes & Returns | Mr. Tux"
      description="How the two-size rental works, delivery windows, prepaid returns, wedding parties and alterations."
      jsonLd={faqJsonLd}
    />

    <div className="mx-auto max-w-3xl px-5 lg:px-8 py-14 sm:py-20">
      <p className="eyebrow">Questions</p>
      <h1 className="mt-3 font-display text-4xl sm:text-5xl">Answers, plainly</h1>

      <div className="mt-12 space-y-8">
        {faqs.map((f) => (
          <div key={f.q} className="border-t border-border pt-6">
            <h2 className="font-display text-xl">{f.q}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-14">
        <p className="text-sm text-muted-foreground">Still unsure?</p>
        <Link
          to="/appointment"
          className="mt-4 inline-flex h-12 items-center justify-center bg-ink px-8 text-xs uppercase tracking-[0.18em] text-primary-foreground"
        >
          Start a Visit
        </Link>
      </div>
    </div>
  </>
);

export default Faqs;
