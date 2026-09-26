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
- Supabase backend is **live** — accounts, size-profile sync, and order intake are connected
- Start Your Order is a 4-step accordion (occasion & contact → book a visit via Calendly →
  sizes → choose a look). Name, email, phone, height and weight are required before the
  Calendly step unlocks.

## Known placeholders (need real input before launch)

- **Collection photos** — the six real-inventory looks still show old stock photography.
  Waiting on real photos pulled from the Drive photo library.
- **Pricing** — every look shows a placeholder $189 / 4-day rental. Needs real per-style
  rates.
- **Contact info** — phone number and social links (Instagram/Facebook/TikTok) in
  `src/lib/site.ts` are still generic placeholders. Address is correct.
- **Backend** — Supabase project is connected (URL + anon key set in `.env.local` locally and
  in Vercel's project env vars). `supabase/migrations/0001_init.sql` created `profiles`
  (auto-created per signup, `is_staff` flag for team access), `size_profiles`, and `orders`,
  all with row-level security. Passwordless (magic-link) sign-in lives on the Account page;
  guests still work exactly as before on localStorage, with orders synced to Supabase either
  way (guest orders carry `guest_name`/`guest_email` for staff follow-up).
- **Analytics** — no Google Analytics / measurement ID wired in yet.
- **Legal review** — Terms & Privacy pages haven't had a legal pass.

## Open decisions

- Wedding-party pricing rules (volume discount? flat group rate?)
