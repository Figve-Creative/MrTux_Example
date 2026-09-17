import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, ShoppingBag, User, X, MapPin } from "lucide-react";
import logoImg from "@/assets/mr-tux-logo-horizontal-dark.png";
import { useApp } from "@/context/AppContext";
import { SITE } from "@/lib/site";

const nav = [
  { to: "/collection", label: "Collection" },
  { to: "/wedding-parties", label: "Wedding Parties" },
  { to: "/our-story", label: "Our Story" },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const { bag } = useApp();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        {/* Line 1 — the mark */}
        <div className="flex justify-center pt-2 pb-1">
          <Link to="/" aria-label={SITE.name}>
            <img src={logoImg} alt="Mr. Tux" className="h-8 w-auto lg:h-10" />
          </Link>
        </div>

        {/* Line 2 — navigation and account */}
        <div className="flex items-center justify-between gap-4 pt-1.5 pb-3">
          <button
            className="lg:hidden text-foreground"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>

          <nav className="hidden lg:flex items-center gap-7">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-[11px] uppercase tracking-[0.2em] transition-colors ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-5">
            <Link
              to="/start-your-order"
              className="hidden lg:inline text-[11px] uppercase tracking-[0.2em] text-foreground border-b border-foreground pb-0.5"
            >
              Start Your Order
            </Link>
            <Link to="/come-see-us" className="text-muted-foreground hover:text-foreground" aria-label="Find us">
              <MapPin size={18} />
            </Link>
            <Link to="/account" className="text-muted-foreground hover:text-foreground" aria-label="Account">
              <User size={18} />
            </Link>
            <Link to="/bag" className="relative text-muted-foreground hover:text-foreground" aria-label="Bag">
              <ShoppingBag size={18} />
              {bag.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-highlight text-[9px] text-accent-foreground">
                  {bag.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="mx-auto max-w-6xl px-5 py-4 flex flex-col gap-4">
            {[{ to: "/", label: "Home" }, ...nav, { to: "/come-see-us", label: "Come See Us" }, { to: "/appointment", label: "Book an Appointment" }].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen((v) => !v)}
                className={`text-sm uppercase tracking-[0.16em] ${
                  location.pathname === item.to ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/start-your-order"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex h-12 items-center justify-center bg-ink text-primary-foreground text-xs uppercase tracking-[0.18em]"
            >
              Start Your Order
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
