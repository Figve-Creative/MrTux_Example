import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { blogPosts } from "@/data/content";
import { formatDate } from "@/lib/dates";

const Journal = () => (
  <>
    <Seo
      title="The Journal — Black Tie Notes | Mr. Tux"
      description="Notes on black tie, measuring properly and dressing a wedding party, from the Mr. Tux shop floor."
    />

    <div className="mx-auto max-w-3xl px-5 lg:px-8 py-14 sm:py-20">
      <p className="eyebrow">The journal</p>
      <h1 className="mt-3 font-display text-4xl sm:text-5xl">Notes from the shop</h1>

      <div className="mt-12 space-y-10">
        {blogPosts.map((p) => (
          <article key={p.slug} className="border-t border-border pt-7">
            <p className="eyebrow">{formatDate(new Date(p.date))}</p>
            <h2 className="mt-2 font-display text-2xl">
              <Link to={`/journal/${p.slug}`} className="link-underline">
                {p.title}
              </Link>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.excerpt}</p>
            <Link to={`/journal/${p.slug}`} className="mt-4 inline-block text-[11px] uppercase tracking-[0.2em] link-underline">
              Read
            </Link>
          </article>
        ))}
      </div>
    </div>
  </>
);

export default Journal;
