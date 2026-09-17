# Mr. Tux — Ralph Lauren / New York rebuild

Rebuild the app as a proper multi-page site: cream paper background, dark ink type, a New York style serif, and quiet editorial layouts. Masculine, old money, timeless. The one goal of the home page is booked appointments.

## The look

- Cream background (#F5F1E8 family), very dark ink brown-black text, small amounts of deep tobacco/burgundy for highlights. Gold retires as the accent color.
- Headlines in a New York style serif (Playfair Display / Instrument Serif register); body in a clean, quiet sans.
- Collection pieces shown isolated on cream, generous whitespace, thin rules between sections, no gradients, no shadows.
- Mobile first, tuned against the blacktux.com mobile feel: big tap targets, short scroll, one clear action per screen.

## Pages

1. **Home** — full-bleed hero image (video-ready), logo centered, top nav: Home, Collection, Our Story, Come See Us, plus Start Your Order. Headline "Dressed to be remembered" with two buttons: Start Your Order, View Collection. Below: appointment band ("Book your appointment" / "Suit up your wedding party"), isolated collection highlights on cream, events we support, our story teaser, come-see-us map, footer.
2. **Collection** — the four looks in an editorial grid, each opening a look detail page.
3. **Look detail** — full outfit breakdown, the two-sizes promise, accessories, Add to Bag.
4. **Start Your Order** — create your event or create your order, size profile (measurements or brand sizes, plus shoe and belt), delivery dates, no deposit.
5. **Book an Appointment** — your Calendly (mrtuxstyles-sales) embedded inline.
6. **Our Story** — the new chapter storyline, given real space.
7. **Come See Us** — Google map for 12004 SW 88th St, Miami, FL 33186, with hours and directions.
8. **Wedding Parties** — suit up your party, group flow into an appointment.
9. **Bag** and **Order Confirmation** — return label included, return-by countdown, no deposit.
10. **My Account** — saved sizes, events, past and upcoming orders.
11. **FAQs**, **Blog** (index plus first posts), **Terms**, **Privacy** — footer pages. Terms cover user-submitted content, arbitration, data ownership, privacy, and AI-generated imagery.

## Accounts and saved data

Turn on the built-in backend so customers can create an account, save sizes, save a bag, and submit appointment/order intake that is stored for you. Every record is private to its owner, and staff can read intake.

## Photography

Generate the look and hero imagery in the new cream/editorial style, since final photos come later.

## Findability

robots.txt allowing indexing, a sitemap, real page titles and descriptions per page, clean headings, and footer links to FAQs, Blog, and socials.

## Technical notes

- Move from the current single-screen switch to real routes in React Router so each page has its own URL for search engines and sharing.
- Redefine tokens in `index.css` / `tailwind.config.ts` (cream background, ink foreground, tobacco highlight, serif display font) and keep components on semantic tokens.
- Calendly loaded via its widget script on the appointment page; Google map via the Maps connector (needs connecting) or a simple embed if you prefer no setup.
- Backend: Lovable Cloud with tables for profiles, size profiles, orders/bags, appointment requests, and event/party records, all row-level secured.
- Deposit fields removed from the order flow.

## Open items

- Socials, phone number, hours, and blog copy: placeholders until you send the real ones.
- Wedding-party pricing rules, if any, still needed.
