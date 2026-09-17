import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import SizeProfileForm from "@/components/SizeProfileForm";
import { useApp } from "@/context/AppContext";
import { countdown, formatDate } from "@/lib/dates";

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
                Create your event
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
