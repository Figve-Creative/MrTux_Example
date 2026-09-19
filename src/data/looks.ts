import lookMidnight from "@/assets/look-midnight-peak.jpg";
import lookIvory from "@/assets/look-ivory-dinner.jpg";
import lookNavy from "@/assets/look-navy-velvet.jpg";
import lookWhiteTie from "@/assets/look-white-tie.jpg";

export interface Accessory {
  id: string;
  name: string;
  category: "shoes" | "ties" | "pocket-squares" | "cufflinks" | "suspenders";
  price: number;
  description: string;
}

export interface Look {
  id: string;
  name: string;
  collection: string;
  price: number;
  rentalDays: number;
  image: string;
  description: string;
  items: string[];
}

// NOTE: these six looks are pulled from the real Mr. Tux inventory sheet (one per color
// family). Photos are still the placeholder stock shots below — swap look.image for the
// matching Drive photo once it's in src/assets. Pricing/rental days are carried over
// placeholders and should be replaced with real numbers.
export const looks: Look[] = [
  {
    id: "ginovia-black-beckett",
    name: "GiNovia Becket",
    collection: "Black",
    price: 189,
    rentalDays: 4,
    image: lookMidnight,
    description: "Style 848C. Black two-button notch tuxedo with a framed lapel in tropical wool. Side vented, besom pockets.",
    items: ["Notch Lapel Jacket", "Flat-Front Trousers", "Dress Shirt", "Bowtie"],
  },
  {
    id: "david-major-platinum",
    name: "David Major Platinum",
    collection: "Grey",
    price: 189,
    rentalDays: 4,
    image: lookIvory,
    description: "Style 807C. Platinum grey two-button notch suit, side vented with flap pockets.",
    items: ["Notch Lapel Jacket", "Flat-Front Trousers", "Dress Shirt", "Tie"],
  },
  {
    id: "ike-behar-blake",
    name: "Ike Behar Blake",
    collection: "Blue",
    price: 189,
    rentalDays: 4,
    image: lookNavy,
    description: "Style 1015C. Navy tuxedo with a one-button black satin peak lapel in super 120 wool. Side vented, besom pockets.",
    items: ["Peak Lapel Jacket", "Flat-Front Trousers", "Dress Shirt", "Bowtie"],
  },
  {
    id: "couture-dominic",
    name: "Couture Dominic",
    collection: "Tan & Beige",
    price: 189,
    rentalDays: 4,
    image: lookWhiteTie,
    description: "Style 4547C. Light tan two-button notch lapel suit in stretch poly wool. Side vented, flap pockets.",
    items: ["Notch Lapel Jacket", "Flat-Front Trousers", "Dress Shirt", "Tie"],
  },
  {
    id: "ike-behar-white-waverly",
    name: "Ike Behar Waverly",
    collection: "White",
    price: 189,
    rentalDays: 4,
    image: lookMidnight,
    description: "Style WGATSBY. White self shawl lapel dinner jacket with black self piping. One button, center vented.",
    items: ["Shawl Lapel Dinner Jacket", "Black Trousers", "Dress Shirt", "Black Bowtie"],
  },
  {
    id: "ike-behar-burgundy-marbella",
    name: "Ike Behar Marbella",
    collection: "Others",
    price: 189,
    rentalDays: 4,
    image: lookIvory,
    description: "Style MB201. Burgundy tuxedo with a black peak lapel in super 120's wool. One button, side vented, besom pockets.",
    items: ["Peak Lapel Jacket", "Flat-Front Trousers", "Dress Shirt", "Bowtie"],
  },
];

export const accessories: Accessory[] = [
  { id: "shoe-oxford", name: "Oxford Cap-Toe", category: "shoes", price: 35, description: "Patent leather, mirror shine" },
  { id: "shoe-derby", name: "Derby", category: "shoes", price: 30, description: "Polished calf leather" },
  { id: "shoe-opera", name: "Opera Pump", category: "shoes", price: 40, description: "Grosgrain bow, patent finish" },
  { id: "tie-silk-bow", name: "Silk Bowtie", category: "ties", price: 15, description: "Self-tie, satin finish" },
  { id: "tie-long", name: "Long Tie", category: "ties", price: 15, description: "Jacquard silk weave" },
  { id: "tie-cravat", name: "Cravat", category: "ties", price: 20, description: "Ascot-style, silk" },
  { id: "ps-white", name: "Presidential Fold", category: "pocket-squares", price: 10, description: "Crisp white linen" },
  { id: "ps-puff", name: "Puff Fold", category: "pocket-squares", price: 10, description: "Silk, hand-rolled edges" },
  { id: "cl-gold", name: "Gold Set", category: "cufflinks", price: 20, description: "Brushed gold barrel" },
  { id: "cl-silver", name: "Silver Set", category: "cufflinks", price: 18, description: "Polished sterling" },
  { id: "cl-onyx", name: "Onyx Set", category: "cufflinks", price: 22, description: "Black onyx cabochon" },
  { id: "susp-satin", name: "Satin Stripe", category: "suspenders", price: 18, description: "Adjustable, clip-on" },
  { id: "susp-plain", name: "Plain Black", category: "suspenders", price: 15, description: "Matte elastic, button-end" },
];

export const accessoryCategories = [
  { key: "shoes" as const, label: "Shoes" },
  { key: "ties" as const, label: "Ties & Bowties" },
  { key: "pocket-squares" as const, label: "Pocket Squares" },
  { key: "cufflinks" as const, label: "Cufflinks" },
  { key: "suspenders" as const, label: "Suspenders" },
];
