import { Link } from "react-router-dom";
import Seo from "@/components/Seo";
import { looks } from "@/data/looks";

const Collection = () => (
  <>
    <Seo
      title="The Collection — Tuxedos & Dinner Jackets | Mr. Tux"
      description="Browse the Mr. Tux collection: heritage black tie, ivory dinner jackets, navy velvet and full white tie. Four-day rentals, two sizes delivered."
    />

    <div className="mx-auto max-w-6xl px-5 lg:px-8 py-14 sm:py-20">
      <p className="eyebrow">The collection</p>
      <h1 className="mt-3 font-display text-4xl sm:text-5xl">Every look, complete</h1>
      <p className="mt-4 max-w-xl text-sm text-muted-foreground">
        Each look ships as a full outfit in two sizes — your fit and one size up — with a prepaid return label in the box.
      </p>

      <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2">
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
            <h2 className="mt-1.5 font-display text-2xl">{look.name}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{look.description}</p>
            <p className="mt-3 text-sm">
              ${look.price} · {look.rentalDays}-day rental
            </p>
          </Link>
        ))}
      </div>
    </div>
  </>
);

export default Collection;
