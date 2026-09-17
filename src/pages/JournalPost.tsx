import { Link, useParams } from "react-router-dom";
import Seo from "@/components/Seo";
import { blogPosts } from "@/data/content";
import { formatDate } from "@/lib/dates";

const JournalPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-24 text-center">
        <h1 className="font-display text-3xl">Article not found</h1>
        <Link to="/journal" className="mt-6 inline-block text-[11px] uppercase tracking-[0.2em] link-underline">
          Back to the journal
        </Link>
      </div>
    );
  }

  return (
    <>
      <Seo title={`${post.title} — Mr. Tux Journal`} description={post.excerpt} />

      <article className="mx-auto max-w-2xl px-5 lg:px-8 py-14 sm:py-20">
        <Link to="/journal" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
          ← Journal
        </Link>
        <p className="mt-8 eyebrow">{formatDate(new Date(post.date))}</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">{post.title}</h1>
        <div className="mt-8 space-y-5">
          {post.body.map((p) => (
            <p key={p} className="text-sm leading-relaxed text-muted-foreground">
              {p}
            </p>
          ))}
        </div>
      </article>
    </>
  );
};

export default JournalPost;
