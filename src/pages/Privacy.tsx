import Seo from "@/components/Seo";

const sections = [
  {
    title: "What we collect",
    body: "Your name, email, phone number, event details, measurements or brand sizes, shoe and belt size, delivery address, and order history. Payment details are handled by our payment processor and are never stored by us.",
  },
  {
    title: "Why we collect it",
    body: "To select and ship the right garments, to arrange appointments, to process returns, and to answer you when you write to us.",
  },
  {
    title: "Who can see it",
    body: "Our staff, and the shipping and scheduling services required to fulfil your order. We do not sell or rent your information to anyone.",
  },
  {
    title: "How long we keep it",
    body: "Order and size records are kept while your account is active and for as long as tax and accounting rules require. You can ask us to delete anything else at any time.",
  },
  {
    title: "Your choices",
    body: "You may request a copy of your information, correct it, or ask us to delete it by writing to us. You can unsubscribe from marketing email with the link in any message.",
  },
  {
    title: "Cookies and measurement",
    body: "We use a small number of cookies to keep your bag and session working and to understand which pages people use. You can clear them in your browser at any time.",
  },
  {
    title: "Artificial intelligence",
    body: "Some imagery on this site is AI-generated for illustration, and AI tools may help us draft replies or schedule fittings. Your personal information is not used to train third-party models.",
  },
];

const Privacy = () => (
  <>
    <Seo
      title="Privacy — Mr. Tux"
      description="What Mr. Tux collects, why, who can see it, how long it is kept, and how to ask for a copy or deletion."
    />

    <div className="mx-auto max-w-2xl px-5 lg:px-8 py-14 sm:py-20">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-3 font-display text-4xl sm:text-5xl">Privacy</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        Short version: we keep what we need to dress you, we protect it, and we never sell it.
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

export default Privacy;
