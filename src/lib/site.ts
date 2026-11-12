export const SITE = {
  name: "Mr. Tux",
  tagline: "Dressed to be remembered",
  description:
    "Tuxedo and formal menswear rental in Miami. Book an appointment and come in for your perfect fit.",
  calendlyUrl: "https://calendly.com/mrtuxstyles-sales/appointment-at-mr-tux",
  // The Calendly link above is the ONE appointment event type (wedding party and
  // "myself"). Out-of-town measurements don't use Calendly — see Book.tsx.
  salesEmail: "sales@mrtuxstyles.com",
  // Web3Forms access key for the measurements form. Public by design (it can only
  // email the shop inbox it was created for). Leave "" until created — the form then
  // falls back to opening the visitor's email app. See docs/STATUS.md.
  web3formsKey: "bf61744e-1ea0-47cc-bb1c-a3c1c70d7df5",
  phone: "305.595.0709",
  phoneHref: "tel:+13055950709",
  address: {
    line1: "12004 SW 88th St",
    city: "Miami",
    state: "FL",
    zip: "33186",
    get full() {
      return `${this.line1}, ${this.city}, ${this.state} ${this.zip}`;
    },
  },
  hours: [
    { days: "Tuesday – Friday", time: "12pm – 6pm" },
    { days: "Saturday", time: "11am – 5pm" },
    { days: "Sunday – Monday", time: "Closed" },
  ],
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Facebook", href: "https://facebook.com" },
    { label: "TikTok", href: "https://tiktok.com" },
  ],
};

export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
  `${SITE.address.line1}, ${SITE.address.city}, ${SITE.address.state} ${SITE.address.zip}`,
)}&output=embed`;

export const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  `${SITE.address.line1}, ${SITE.address.city}, ${SITE.address.state} ${SITE.address.zip}`,
)}`;
