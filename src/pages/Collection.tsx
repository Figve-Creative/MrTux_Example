import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import LookCardImage from "@/components/LookCardImage";
import { looks } from "@/data/looks";

const Collection = () => (
  <>
    <Seo
      title="The Collection — Tuxedos & Dinner Jackets | Mr. Tux"
      description="Browse the Mr. Tux collection: black, grey, blue, tan, white and more — one look per color family. Fitted in-store at pickup."
    />

    <div className="mx-auto max-w-6xl px-5 lg:px-8 py-14 sm:py-20">
      <p className="eyebrow">The collection</p>
      <h1 className="mt-3 font-display text-4xl sm:text-5xl">Every look, complete</h1>
      <p className="mt-4 max-w-xl text-sm text-muted-foreground">
        Each look is a full outfit, fitted to your exact size when you pick it up in-store.
      </p>

      <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2">
        {looks.map((look) => (
          <Link key={look.id} to={`/collection/${look.id}`} className="group">
            <LookCardImage look={look} />
            <p className="mt-4 eyebrow">{look.collection}</p>
            <h2 className="mt-1.5 font-display text-2xl">{look.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{look.description}</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Prices vary
            </p>
          </Link>
        ))}
      </div>
    </div>
  </>
);

export default Collection;
