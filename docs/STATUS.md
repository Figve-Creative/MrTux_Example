# Mr. Tux — project status

Last updated 2026-09-23. This replaces the old root-level `roadmap.md`, which described an
earlier design direction (Playfair Display / Jost, gold accents) that's since been replaced.

## Live

- Full site: Home, Collection, Look detail, Start Your Order, Wedding Parties, Start a Visit
  (Calendly), Our Story, Come See Us, Bag, Order Confirmation, Account, FAQs, Blog, Terms,
  Privacy
- Design system: cream background, ink/oxblood accents, NewYork display font (licensed),
  Montserrat body text
- Collection page: six looks, one per color family (Black/Grey/Blue/Tan & Beige/White/
  Others), pulled from the real Mr. Tux inventory sheet — real names, style numbers, fabric
  details
- Cross-links between the three entry flows (Start Your Order / Start a Visit / Wedding
  Parties) so a visitor who picks the "wrong" one can redirect without restarting
- SEO: per-page titles/descriptions, og/twitter tags, robots.txt, sitemap.xml, JSON-LD
  (ClothingStore + FAQPage)
- Supabase integration is **coded and ready**, but not yet connected to a live project — see
  "Backend" below for exactly what's left

## Known placeholders (need real input before launch)

- **Collection photos** — the six real-inventory looks still show old stock photography.
  Waiting on real photos pulled from the Drive photo library.
- **Pricing** — every look shows a placeholder $189 / 4-day rental. Needs real per-style
  rates.
- **Contact info** — phone number and social links (Instagram/Facebook/TikTok) in
  `src/lib/site.ts` are still generic placeholders. Address is correct.
- **Backend** — Supabase integration is written but needs a real project connected before it
  does anything:
  - `supabase/migrations/0001_init.sql` — run once in the Supabase SQL Editor. Creates
    `profiles` (auto-created per signup, `is_staff` flag for team access), `size_profiles`,
    and `orders`, all with row-level security (customers see only their own rows; staff see
    everything; guests can still submit orders without an account).
  - `src/lib/supabase.ts` / `src/context/AuthContext.tsx` — passwordless (magic-link) sign-in,
    wired into `Account.tsx`.
  - `src/context/AppContext.tsx` — syncs size profile + order history to Supabase for signed-in
    users; guests keep working exactly as before on localStorage only.
  - **To activate:** create a Supabase project, run the migration above, copy `.env.example`
    to `.env.local`, fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (the public anon
    key — never the service role secret key), then `npm install` to pull in
    `@supabase/supabase-js`. Until those env vars are set, the site runs exactly as it does
    today (browser-only), with a console warning in dev mode as the only sign something's
    pending.
- **Analytics** — no Google Analytics / measurement ID wired in yet.
- **Legal review** — Terms & Privacy pages haven't had a legal pass.

## Open decisions

- Wedding-party pricing rules (volume discount? flat group rate?)
