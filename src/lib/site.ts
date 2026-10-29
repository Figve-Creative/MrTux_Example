export const SITE = {
  name: "Mr. Tux",
  tagline: "Dressed to be remembered",
  description:
    "Tuxedo and formal menswear rental in Miami. Book an appointment and come in for your perfect fit.",
  calendlyUrl: "https://calendly.com/mrtuxstyles-sales",
  // Optional: a separate Calendly event type for wedding-party consults (longer
  // slot, its own Invitee Questions in its own order). Falls back to the line
  // above until you create one and swap this in. See docs/STATUS.md.
  calendlyUrlWedding: "https://calendly.com/mrtuxstyles-sales",
  // Optional: a separate Calendly event type for out-of-town measurement
  // submissions (a short call slot). Falls back to the main link until created.
  calendlyUrlMeasurements: "https://calendly.com/mrtuxstyles-sales",
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
