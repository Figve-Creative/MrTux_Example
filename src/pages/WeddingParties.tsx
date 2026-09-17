import { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import weddingImg from "@/assets/wedding-party.jpg";
import { looks } from "@/data/looks";

const fieldClass =
  "w-full border border-input bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-highlight";

const steps = [
  { title: "Pick the look", body: "Choose one look for the party. We keep the cloth consistent across every man." },
  { title: "Add your men", body: "Send us names and emails. Each man submits his own sizes from his phone." },
  { title: "We ship together", body: "Every order arrives in the same window, each in two sizes, with return labels." },
];

const WeddingParties = () => {
  const [form, setForm] = useState({ name: "", email: "", date: "", count: "", look: looks[0].name, notes: "" });
  const [sent, setSent] = useState(false);

  return (
    <>
      <Seo
        title="Wedding Parties — Suit Up Your Groomsmen | Mr. Tux"
        description="Dress the whole wedding party in one look. Sizes collected from each man, orders shipped to arrive together, prepaid returns."
      />

      <img
        src={weddingImg}
        alt="Groomsmen in black tuxedos"
        width={1600}
        height={1104}
        className="h-[320px] w-full object-cover sm:h-[460px]"
      />

      <div className="mx-auto max-w-3xl px-5 lg:px-8 py-14 sm:py-20">
        <p className="eyebrow">Wedding parties</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">Suit up your wedding party</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          One look, every man, wherever they live. Tell us the date and the count and we take it from there.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="border-t border-border pt-5">
              <p className="eyebrow">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="mt-2 font-display text-xl">{s.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-border pt-12">
          <h2 className="font-display text-3xl">Start a party</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="eyebrow">Your name</span>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`${fieldClass} mt-2`} />
            </label>
            <label className="block">
              <span className="eyebrow">Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`${fieldClass} mt-2`}
              />
            </label>
            <label className="block">
              <span className="eyebrow">Wedding date</span>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className={`${fieldClass} mt-2`}
              />
            </label>
            <label className="block">
              <span className="eyebrow">How many men</span>
              <input
                inputMode="numeric"
                value={form.count}
                onChange={(e) => setForm({ ...form, count: e.target.value })}
                className={`${fieldClass} mt-2`}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="eyebrow">Preferred look</span>
              <select value={form.look} onChange={(e) => setForm({ ...form, look: e.target.value })} className={`${fieldClass} mt-2`}>
                {looks.map((l) => (
                  <option key={l.id}>{l.name}</option>
                ))}
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="eyebrow">Notes</span>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className={`${fieldClass} mt-2`}
              />
            </label>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button variant="ink" size="lg" className="h-12 px-8" onClick={() => setSent(true)}>
              Send to the Shop
            </Button>
            <Link to="/appointment" className="text-[11px] uppercase tracking-[0.2em] link-underline">
              Or book an appointment
            </Link>
          </div>
          {sent && (
            <p className="mt-4 border border-border bg-surface p-4 text-sm">
              Thank you. We have your party request and will reply within one business day.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default WeddingParties;
