import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { looks } from "@/data/looks";
import { eventsWeSupport, storyChapters } from "@/data/content";
import { SITE, mapsEmbedUrl, mapsDirectionsUrl } from "@/lib/site";
import heroImg from "@/assets/hero-cream.jpg";
import storyImg from "@/assets/story-atelier.jpg";
import weddingImg from "@/assets/wedding-party.jpg";

const Home = () => (
  <>
    <Seo
      title="Mr. Tux — Tuxedo Rental in Miami | Dressed to be remembered"
      description="Tuxedo and formal menswear rental in Miami. Two sizes delivered, prepaid returns, no deposit. Start your order, or come in for a visit."
    />

    {/* Hero */}
    <section className="relative">
      <div className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
        <img
          src={heroImg}
          alt="Man in a black peak lapel tuxedo"
          className="h-full w-full object-cover object-[center_20%]"
          width={1440}
          height={1808}
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-background/25" />
        <div className="absolute inset-x-0 bottom-0 pb-10 sm:pb-14">
          <div className="mx-auto max-w-6xl px-5 lg:px-8">
            <h1 className="max-w-xl font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
              Dressed to be remembered
            </h1>
            <p className="mt-4 max-w-sm text-sm text-foreground/80 sm:text-base">
              Tuxedos and formal menswear, delivered in two sizes so the fit is never a question.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/start-your-order"
                className="inline-flex h-12 items-center justify-center bg-ink px-8 text-xs uppercase tracking-[0.18em] text-primary-foreground hover:bg-ink/90"
              >
                Start Your Order
              </Link>
              <Link
                to="/collection"
                className="inline-flex h-12 items-center justify-center border border-ink px-8 text-xs uppercase tracking-[0.18em] text-ink hover:bg-ink hover:text-primary-foreground"
              >
                View Collection
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Appointment band */}
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-6xl px-5 lg:px-8 py-12 grid gap-8 md:grid-cols-2">
        <div className="md:border-r md:border-border md:pr-10">
          <p className="eyebrow">In person</p>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl">Come in and get fitted</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Twenty minutes with a fitter, a mirror and the full collection in your hands.
          </p>
          <Link
            to="/appointment"
            className="mt-5 inline-flex h-12 items-center justify-center bg-highlight px-8 text-xs uppercase tracking-[0.18em] text-accent-foreground hover:bg-highlight/90"
          >
            Start a Visit
          </Link>
        </div>
        <div>
          <p className="eyebrow">Groups</p>
          <h2 className="mt-3 font-display text-2xl sm:text-3xl">Suit up your wedding party</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            One look, every man, wherever they live. We ship the party to arrive together.
          </p>
          <Link
            to="/wedding-parties"
            className="mt-5 inline-flex h-12 items-center justify-center border border-ink px-8 text-xs uppercase tracking-[0.18em] text-ink hover:bg-ink hover:text-primary-foreground"
          >
            Start a Party
          </Link>
        </div>
      </div>
    </section>

    {/* Collection highlights */}
    <section className="mx-auto max-w-6xl px-5 lg:px-8 py-16 sm:py-20">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow">The collection</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">Four ways to be correct</h2>
        </div>
        <Link to="/collection" className="hidden shrink-0 text-[11px] uppercase tracking-[0.2em] link-underline sm:inline">
          View all
        </Link>
      </div>

      <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {looks.map((look) => (
          <Link key={look.id} to={`/collection/${look.id}`} className="group">
            <div className="overflow-hidden bg-surface">
              <img
                src={look.image}
                alt={look.name}
                loading="lazy"
                width={1200}
                height={1504}
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>
            <p className="mt-4 eyebrow">{look.collection}</p>
            <h3 className="mt-1.5 font-display text-xl">{look.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              ${look.price} · {look.rentalDays}-day rental
            </p>
          </Link>
        ))}
      </div>

      <Link
        to="/collection"
        className="mt-10 inline-flex h-12 w-full items-center justify-center border border-ink text-xs uppercase tracking-[0.18em] sm:hidden"
      >
        View All Looks
      </Link>
    </section>

    {/* Events */}
    <section className="border-y border-border bg-surface">
      <div className="mx-auto max-w-6xl px-5 lg:px-8 py-16">
        <p className="eyebrow">Occasions</p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl">Events we dress</h2>
        <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {eventsWeSupport.map((e) => (
            <div key={e.name} className="border-t border-border pt-5">
              <h3 className="font-display text-xl">{e.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{e.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Story */}
    <section className="mx-auto max-w-6xl px-5 lg:px-8 py-16 sm:py-20 grid gap-10 lg:grid-cols-2 lg:items-center">
      <img
        src={storyImg}
        alt="A tailor pinning a tuxedo sleeve"
        loading="lazy"
        width={1600}
        height={1104}
        className="w-full object-cover"
      />
      <div>
        <p className="eyebrow">Our story</p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl">{storyChapters[0].title}</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{storyChapters[0].body}</p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{storyChapters[1].body}</p>
        <Link to="/our-story" className="mt-6 inline-block text-[11px] uppercase tracking-[0.2em] link-underline">
          Read our story
        </Link>
      </div>
    </section>

    {/* Wedding parties */}
    <section className="relative">
      <img
        src={weddingImg}
        alt="Groomsmen in black tuxedos"
        loading="lazy"
        width={1600}
        height={1104}
        className="h-[420px] w-full object-cover"
      />
      <div className="mx-auto max-w-6xl px-5 lg:px-8 py-12">
        <p className="eyebrow">Wedding parties</p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl">Eight men, one silhouette</h2>
        <p className="mt-4 max-w-lg text-sm text-muted-foreground">
          Send us the date and the count. We handle sizes, shipping and returns for every man in the party.
        </p>
        <Link
          to="/wedding-parties"
          className="mt-6 inline-flex h-12 items-center justify-center bg-ink px-8 text-xs uppercase tracking-[0.18em] text-primary-foreground"
        >
          Suit Up Your Party
        </Link>
      </div>
    </section>

    {/* Come see us */}
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-5 lg:px-8 py-16 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="eyebrow">Come and see us</p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">{SITE.address.city}, Florida</h2>
          <p className="mt-4 text-sm text-muted-foreground">{SITE.address.full}</p>
          <ul className="mt-5 space-y-1.5 text-sm">
            {SITE.hours.map((h) => (
              <li key={h.days} className="flex justify-between border-b border-border pb-1.5 max-w-xs">
                <span className="text-muted-foreground">{h.days}</span>
                <span>{h.time}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
          className="h-[320px] w-full border border-border"
        />
      </div>
    </section>
  </>
);

export default Home;
