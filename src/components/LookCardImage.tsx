import { Look } from "@/data/looks";

// Card image for a look. If the look has a real `hoverImage`, it fades in over the
// flat-lay on hover. The parent link needs the Tailwind `group` class.
const LookCardImage = ({ look }: { look: Look }) => (
  <div className="relative overflow-hidden bg-surface">
    <img
      src={look.image}
      alt={look.name}
      loading="lazy"
      width={1200}
      height={1504}
      className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
    />
    {look.hoverImage && (
      <img
        src={look.hoverImage}
        alt=""
        aria-hidden="true"
        loading="lazy"
        width={1200}
        height={1500}
        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
      />
    )}
  </div>
);

export default LookCardImage;
