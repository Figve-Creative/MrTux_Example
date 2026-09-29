# Mr. Tux — project status

Last updated 2026-09-28. This replaces the old root-level `roadmap.md`, which described an
earlier design direction (Playfair Display / Jost, gold accents) that's since been replaced.

## Fulfillment model (important — read before touching copy)

Mr. Tux is **pickup, not delivery**. A customer fills out Start Your Order online (occasion,
estimated size, look, T&Cs), then comes into the shop to get fitted to their exact size in
person and pick up their order. Nothing ships to the customer. Returns are flexible: drop it
back at the shop, or mail it with the prepaid label — customer's choice. If you see copy
anywhere that says "delivered," "ships to you," "two sizes shipped," or similar, that's a bug —
flag it.

Internally, `PlacedOrder`/`EventDetails` fields and the Supabase `orders` table still use
`delivery_from` / `delivery_to` column and variable names (kept to avoid a schema migration),
but every user-facing label now calls this the "pickup window." See the note in
`src/lib/dates.ts`.

## Live

- Full site: Home, Collection, Look detail, Start Your Order (the single funnel — see below),
  Our Story, Come See Us, Bag, Order Confirmation, Account, FAQs, Blog, Terms, Privacy
- Design system: cream background, ink/oxblood accents, NewYork display font (licensed),
  Montserrat body text
- Collection page: full catalog, all 62 styles from the real Mr. Tux inventory sheet
  (Black/Grey/Blue/Tan & Beige/White/Others) — real names, style numbers, fabric details.
  The homepage teaser ("Four ways to be correct") still only shows 4 curated looks
  (`FEATURED_LOOK_IDS` in `src/pages/Home.tsx`); the full list lives at `/collection`.
- Every CTA site-wide (nav, footer, homepage, FAQs, Our Story, Come See Us) points at
  `/start-your-order`. `/appointment` and `/wedding-parties` are now just redirects there, kept
  only so old bookmarks/links don't 404.
- SEO: per-page titles/descriptions, og/twitter tags, robots.txt, sitemap.xml, JSON-LD
  (ClothingStore + FAQPage)
- Supabase backend is **live** — accounts, size-profile sync, and order intake are connected
- Start Your Order is the single funnel every CTA on the site leads to (For Myself / For a
  Wedding Party fork up top). The two paths now have different lengths, because a wedding
  inquiry needs much less up front than a solo rental:
  - **For myself** — 4 steps: occasion & contact + T&Cs checkbox → sizes → choose a look →
    book a visit via Calendly.
  - **For a wedding party** — 2 steps: one short intake (wedding date, party size, formality,
    contact info, optional comments, T&Cs checkbox) → straight to booking a consult via
    Calendly. Sizes and look selection for the whole party happen with staff in person, not
    through the web form.
  `/appointment` and `/wedding-parties` still just redirect here for old links/bookmarks.
- **Calendly prefill** — both paths pass the visitor's name and email to Calendly automatically
  (Calendly's native fields). Everything else they typed (phone, occasion/wedding date, height/
  weight or party size/formality, comments) is passed too, as `a1`, `a2`, `a3`... query params —
  but those only show up on the booking/calendar invite once you add matching "Invitee
  Questions" in your Calendly event type, **in this exact order**:
  - For a solo booking (`SITE.calendlyUrl`): Phone, Occasion, Height, Weight, Notes.
  - For a wedding consult (`SITE.calendlyUrlWedding`): Phone, Wedding date, Party size,
    Formality, Notes.
  Calendly → Event Types → open the event → Edit → "Invitee Questions" → add one question per
  item above, in that order (the wording of the question doesn't matter, only the order).
  `SITE.calendlyUrlWedding` in `src/lib/site.ts` currently points at the same link as
  `SITE.calendlyUrl` — create a second Calendly event type for wedding consults (longer time
  slot makes sense) and swap its link in once you have it, so the two question sets don't
  collide on one event type.

## Known placeholders (need real input before launch)

- **Collection photos** — all 62 looks still show one of 4 old placeholder stock photos,
  cycled in rotation (`LOOK_IMAGES` in `src/data/looks.ts`), so the grid repeats the same
  handful of images many times over. Waiting on real photos pulled from the Drive photo
  library, or uploaded directly, to replace them one by one.
- **Pricing** — every look carries a placeholder $189 / 4-day rental internally (not shown
  to customers — see "Prices vary" copy). Needs real per-style rates for staff records.
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

- Whether `/collection` needs a color-family filter or sort now that it lists all 62 styles
  instead of 6 — currently one long 2-column scroll, grouped in the order they appear in
  `src/data/looks.ts` (Black, Grey, Blue, Tan & Beige, White, Others).
- Wedding-party pricing rules (volume discount? flat group rate?)
- Exact pickup/return timing: `rentalWindow()` in `src/lib/dates.ts` currently computes "ready
  2–3 days before the event, due back `rentalDays` (4) after pickup opens" — this was the old
  shipping-era placeholder math, just relabeled. Confirm whether that's the real pickup lead
  time and return grace period, or if it should change now that it's in-store.
