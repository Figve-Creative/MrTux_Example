export const SITE = {
  name: "Mr. Tux",
  tagline: "Dressed to be remembered",
  description:
    "Tuxedo and formal menswear rental in Miami. Two sizes delivered, prepaid returns, appointments welcome.",
  calendlyUrl: "https://calendly.com/mrtuxstyles-sales",
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
    { days: "Monday – Friday", time: "10:00 – 7:00" },
    { days: "Saturday", time: "10:00 – 5:00" },
    { days: "Sunday", time: "By appointment" },
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
