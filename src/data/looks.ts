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
  collection: "Heritage" | "Modern" | "Black Tie Optional" | "White Tie";
  price: number;
  rentalDays: number;
  image: string;
  description: string;
  items: string[];
}

export const looks: Look[] = [
  {
    id: "midnight-peak",
    name: "The Midnight Peak",
    collection: "Heritage",
    price: 189,
    rentalDays: 4,
    image: lookMidnight,
    description: "Peak lapel tuxedo in super 130s wool. Satin-faced lapels, single button closure. The definitive black tie.",
    items: ["Peak Lapel Jacket", "Flat-Front Trousers", "Wing Collar Shirt", "Silk Bowtie"],
  },
  {
    id: "ivory-dinner",
    name: "The Ivory Dinner",
    collection: "Modern",
    price: 219,
    rentalDays: 4,
    image: lookIvory,
    description: "Ivory shawl collar dinner jacket paired with black trousers. For the man who commands the room.",
    items: ["Ivory Dinner Jacket", "Black Trousers", "Spread Collar Shirt", "Black Silk Bowtie"],
  },
  {
    id: "navy-velvet",
    name: "The Navy Velvet",
    collection: "Black Tie Optional",
    price: 249,
    rentalDays: 4,
    image: lookNavy,
    description: "Italian velvet jacket in midnight navy. Peak lapels, single vent. Understated rebellion.",
    items: ["Velvet Peak Lapel Jacket", "Charcoal Trousers", "French Cuff Shirt", "Silk Knit Tie"],
  },
  {
    id: "white-tie-classic",
    name: "The White Tie Classic",
    collection: "White Tie",
    price: 299,
    rentalDays: 4,
    image: lookWhiteTie,
    description: "Full dress tailcoat with white marcella waistcoat. The highest dress code, executed flawlessly.",
    items: ["Tailcoat", "High-Waist Trousers", "Wing Collar Shirt", "White Marcella Waistcoat", "White Bowtie"],
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
