import { useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import SizeProfileForm from "@/components/SizeProfileForm";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { isSupabaseConfigured } from "@/lib/supabase";
import { countdown, formatDate } from "@/lib/dates";

const AccountAuth = () => {
  const { user, loading, signInWithEmail, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  // Hide entirely until the site actually has a Supabase project wired up —
  // everything below this still works as a guest either way.
  if (!isSupabaseConfigured || loading) return null;

  if (user) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-4 border border-border bg-surface p-5 text-sm">
        <p>
          Signed in as <span className="text-foreground">{user.email}</span>
        </p>
        <button
          onClick={() => signOut()}
          className="shrink-0 text-[11px] uppercase tracking-[0.2em] link-underline"
        >
          Sign out
        </button>
      </div>
    );
  }

  if (status === "sent") {
    return (
      <div className="border border-border bg-surface p-5 text-sm">
        <p>Check {email} for a sign-in link.</p>
        <p className="mt-2 text-muted-foreground">
          Signing in syncs your sizes and rental history across devices — everything below still
          works without it.
        </p>
      </div>
    );
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    const result = await signInWithEmail(email);
    if (result) {
      setError(result);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  };

  return (
    <form onSubmit={submit} className="border border-border bg-surface p-5">
      <p className="text-sm">Sign in to save your sizes and rentals across devices.</p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="h-11 flex-1 border border-border bg-background px-4 text-sm"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="h-11 shrink-0 bg-ink px-6 text-xs uppercase tracking-[0.18em] text-primary-foreground disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Email me a link"}
        </button>
      </div>
      {status === "error" && <p className="mt-3 text-sm text-destructive">{error}</p>}
      <p className="mt-3 text-xs text-muted-foreground">
        No password needed — everything below still works as a guest.
      </p>
    </form>
  );
};

const Account = () => {
  const { sizeProfile, orders, event } = useApp();
  const upcoming = orders.filter((o) => new Date(o.returnBy).getTime() > Date.now());
  const past = orders.filter((o) => new Date(o.returnBy).getTime() <= Date.now());

  return (
    <>
      <Seo title="My Account — Mr. Tux" description="Your saved sizes, upcoming events and past rentals." />

      <div className="mx-auto max-w-3xl px-5 lg:px-8 py-14 sm:py-20">
        <p className="eyebrow">Your account</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">Sizes, events, rentals</h1>

        <div className="mt-10">
          <AccountAuth />
        </div>

        <section className="mt-14 border-t border-border pt-10">
          <h2 className="font-display text-2xl">Your event</h2>
          {event ? (
            <div className="mt-4 border border-border bg-surface p-5 text-sm">
              <p>{event.eventType}</p>
              <p className="mt-1 text-muted-foreground">
                {event.eventDate ? formatDate(new Date(`${event.eventDate}T12:00:00`)) : "Date to confirm"}
              </p>
              {event.name && <p className="mt-2 text-muted-foreground">{event.name}</p>}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              No event yet.{" "}
              <Link to="/start-your-order" className="link-underline text-foreground">
                Start your order
              </Link>
              .
            </p>
          )}
        </section>

        <section className="mt-14 border-t border-border pt-10">
          <h2 className="font-display text-2xl">Your sizes</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {sizeProfile.method === "measurements"
              ? "Measurements on file."
              : sizeProfile.method === "brands"
                ? "Brand sizes on file."
                : "Nothing saved yet."}
          </p>
          <div className="mt-6">
            <SizeProfileForm />
          </div>
        </section>

        <section className="mt-14 border-t border-border pt-10">
          <h2 className="font-display text-2xl">Upcoming rentals</h2>
          {upcoming.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Nothing on the calendar.</p>
          ) : (
            <ul className="mt-5 space-y-4">
              {upcoming.map((o) => (
                <li key={o.reference} className="border border-border bg-surface p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="eyebrow">Order {o.reference}</p>
                    <p className="text-sm text-highlight">{countdown(o.returnBy)} to return</p>
                  </div>
                  <p className="mt-2 text-sm">{o.items.map((i) => i.look.name).join(", ")}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Arrives {o.deliveryFrom} – {o.deliveryTo} · due back {formatDate(new Date(o.returnBy))}
                  </p>
                  <Link to={`/order/${o.reference}`} className="mt-3 inline-block text-[11px] uppercase tracking-[0.2em] link-underline">
                    View order
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-14 border-t border-border pt-10">
          <h2 className="font-display text-2xl">Past rentals</h2>
          {past.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No past rentals yet.</p>
          ) : (
            <ul className="mt-5 space-y-3">
              {past.map((o) => (
                <li key={o.reference} className="flex justify-between border-b border-border pb-3 text-sm">
                  <span>{o.items.map((i) => i.look.name).join(", ")}</span>
                  <span className="text-muted-foreground">{formatDate(new Date(o.placedAt))}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
};

export default Account;
