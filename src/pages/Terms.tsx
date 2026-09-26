import Seo from "@/components/Seo";

const sections = [
  {
    title: "1. Rental agreement",
    body: "Renting from Mr. Tux is an agreement to return every garment shipped to you, in the bag provided, by the return date shown on your order. No deposit is taken. Garments returned late, damaged beyond normal wear, or not returned at all may be charged at replacement cost.",
  },
  {
    title: "2. Two sizes",
    body: "Orders ship in your stated size and one size up. Both garments are our property and both must be returned together.",
  },
  {
    title: "3. Fit and sizing information",
    body: "Sizes and measurements you submit are your responsibility. We use them to select garments in good faith and do not guarantee a specific fit.",
  },
  {
    title: "4. Appointments and cancellations",
    body: "Appointments may be rescheduled or cancelled through the confirmation email at no charge. Repeated missed appointments may limit future booking.",
  },
  {
    title: "5. User-submitted content",
    body: "If you send us photographs, reviews, measurements, or other material, you confirm it is yours to share and you grant Mr. Tux a non-exclusive, royalty-free licence to use it to fulfil your order and, where the material is clearly promotional in nature, to display it in our marketing. You may ask us to stop using it at any time by writing to us, and we will remove it from active use.",
  },
  {
    title: "6. Ownership of data",
    body: "You own the personal information you give us. We hold it as custodian in order to run your rental, and we do not sell it. See our Privacy page for what we keep and for how long.",
  },
  {
    title: "7. AI-generated imagery and tooling",
    body: "Some photography and illustration on this website is generated or enhanced using artificial intelligence and is shown for illustration. Garments received may differ in shade, drape or styling from an image. AI tools may also assist us in scheduling and responding to enquiries; a person remains responsible for every order.",
  },
  {
    title: "8. Pricing",
    body: "Pricing varies by garment and accessories and is confirmed by our team before your order is accepted, in US dollars and exclusive of applicable tax. Nothing is charged without that confirmation.",
  },
  {
    title: "9. Arbitration and dispute resolution",
    body: "Any dispute arising from these terms will first be raised with us directly so we can attempt to resolve it. If it cannot be resolved within thirty days, it will be settled by binding individual arbitration administered in Miami-Dade County, Florida, under Florida law, rather than in court, and not as a class action. You may opt out of this arbitration provision within thirty days of your first order by writing to us.",
  },
  {
    title: "10. Limitation of liability",
    body: "To the extent permitted by law, our liability for any claim relating to a rental is limited to the amount you paid for that rental.",
  },
  {
    title: "11. Changes",
    body: "We may update these terms. The version in force is the one published on this page on the day you place an order.",
  },
];

const Terms = () => (
  <>
    <Seo
      title="Terms & Conditions — Mr. Tux"
      description="Rental agreement, user-submitted content, data ownership, AI-generated imagery, and arbitration terms for Mr. Tux."
    />

    <div className="mx-auto max-w-2xl px-5 lg:px-8 py-14 sm:py-20">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-3 font-display text-4xl sm:text-5xl">Terms & Conditions</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        A plain-language summary of how renting from Mr. Tux works. This page is provided for information and is not
        legal advice; have counsel review it before launch.
      </p>

      <div className="mt-12 space-y-9">
        {sections.map((s) => (
          <section key={s.title} className="border-t border-border pt-6">
            <h2 className="font-display text-xl">{s.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  </>
);

export default Terms;
