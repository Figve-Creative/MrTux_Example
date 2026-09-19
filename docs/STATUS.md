# Mr. Tux — project status

Last updated 2026-09-19. This replaces the old root-level `roadmap.md`, which described an
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
- SEO: per-page titles/descriptions, og/twitter tags, robots.txt, sitemap.xml
- Bag/sizes/account state persisted in the browser (no backend yet — see below)

## Known placeholders (need real input before launch)

- **Collection photos** — the six real-inventory looks still show old stock photography.
  Waiting on real photos pulled from the Drive photo library.
- **Pricing** — every look shows a placeholder $189 / 4-day rental. Needs real per-style
  rates.
- **Contact info** — phone number and social links (Instagram/Facebook/TikTok) in
  `src/lib/site.ts` are still generic placeholders. Address is correct.
- **Backend** — no cloud backend connected yet. Accounts, sizes, bag, and appointment intake
  are browser-only (localStorage), so nothing submitted survives a cleared cache or a new
  device. Next backend will be **Supabase** (confirmed — not Lovable Cloud, which was only
  used for the original design pass).
- **Analytics** — no Google Analytics / measurement ID wired in yet.
- **Legal review** — Terms & Privacy pages haven't had a legal pass.

## Open decisions

- Wedding-party pricing rules (volume discount? flat group rate?)
