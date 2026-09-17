import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { storyChapters } from "@/data/content";
import storyImg from "@/assets/story-atelier.jpg";

const OurStory = () => (
  <>
    <Seo
      title="Our Story — Mr. Tux"
      description="Three generations of formalwear in Miami. Two sizes, real cloth, and a fit decided in your own mirror."
    />

    <div className="mx-auto max-w-3xl px-5 lg:px-8 py-14 sm:py-20">
      <p className="eyebrow">Our story</p>
      <h1 className="mt-3 font-display text-4xl sm:text-5xl">A new chapter</h1>
    </div>

    <img
      src={storyImg}
      alt="A tailor pinning a tuxedo sleeve"
      loading="lazy"
      width={1600}
      height={1104}
      className="h-[380px] w-full object-cover sm:h-[520px]"
    />

    <div className="mx-auto max-w-3xl px-5 lg:px-8 py-14">
      <div className="space-y-12">
        {storyChapters.map((c, i) => (
          <section key={c.title} className="border-t border-border pt-8">
            <p className="eyebrow">Chapter {String(i + 1).padStart(2, "0")}</p>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl">{c.title}</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-14 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/appointment"
          className="inline-flex h-12 items-center justify-center bg-ink px-8 text-xs uppercase tracking-[0.18em] text-primary-foreground"
        >
          Start a Visit
        </Link>
        <Link
          to="/collection"
          className="inline-flex h-12 items-center justify-center border border-ink px-8 text-xs uppercase tracking-[0.18em]"
        >
          View Collection
        </Link>
      </div>
    </div>
  </>
);

export default OurStory;
