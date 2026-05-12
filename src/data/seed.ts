import type { Product } from "../types";

const placeholder = (seed: string, w = 900, h = 1100) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;

export const SEED_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Carbon Series Home Jersey",
    slug: "carbon-home-jersey",
    tagline: "Breathable mesh · heat-sealed crest",
    description:
      "Engineered for match-day intensity: moisture-wicking fabric, reinforced seams, and a satin-finish crest that reads premium under stadium lights. Cut for an athletic fit without feeling tight in the shoulders.",
    price: 4299,
    currency: "₹",
    category: "Football Kits",
    badge: "New drop",
    images: [
      placeholder("lapjersey1"),
      placeholder("lapjersey1b"),
      placeholder("lapjersey1c"),
    ],
    redirectUrl: "https://example.com/checkout",
    reviews: [
      {
        id: "r1",
        author: "Rahul V.",
        rating: 5,
        text: "Fabric feels expensive. Sizing chart was spot on.",
        date: "2026-04-02",
      },
      {
        id: "r2",
        author: "Meera K.",
        rating: 4,
        text: "Love the collar detail. Washes well on cold cycle.",
        date: "2026-04-18",
      },
    ],
  },
  {
    id: "p2",
    name: "Trackside F1 Windbreaker",
    slug: "f1-windbreaker",
    tagline: "Ripstop shell · reflective piping",
    description:
      "A motorsport-inspired shell with a brushed interior lining for early-morning paddock walks. Packable hood, two-way zip, and subtle reflective hits for low-light commutes.",
    price: 5890,
    currency: "₹",
    category: "Motorsport",
    badge: "Limited",
    images: [placeholder("lapf1a"), placeholder("lapf1b"), placeholder("lapf1c")],
    redirectUrl: "https://example.com/checkout",
    reviews: [
      {
        id: "r3",
        author: "Arjun S.",
        rating: 5,
        text: "Windproof without sounding like a crisp packet. Great cut.",
        date: "2026-03-30",
      },
    ],
  },
  {
    id: "p3",
    name: "Heritage Training Hoodie",
    slug: "heritage-hoodie",
    tagline: "Heavyweight fleece · tonal embroidery",
    description:
      "Double-knit fleece with a structured drape. Embroidered chest mark, ribbed side panels for mobility, and metal-tipped drawcords for that steel-and-burgundy aesthetic.",
    price: 3199,
    currency: "₹",
    category: "Street & Training",
    images: [placeholder("laphood1"), placeholder("laphood2"), placeholder("laphood3")],
    redirectUrl: "https://example.com/checkout",
    reviews: [],
  },
  {
    id: "p4",
    name: "Cup Final Scarf",
    slug: "cup-final-scarf",
    tagline: "Jacquard knit · soft acrylic blend",
    description:
      "Bold stripe pattern with fringed ends. Warm enough for terraces, light enough to stash in a tote. Pairs with kits or your everyday winter layers.",
    price: 899,
    currency: "₹",
    category: "Accessories",
    images: [placeholder("lapscarf1"), placeholder("lapscarf2")],
    redirectUrl: "https://example.com/checkout",
    reviews: [
      {
        id: "r4",
        author: "Nikhil P.",
        rating: 4,
        text: "Colours pop in person. No itch after a full match.",
        date: "2026-05-01",
      },
    ],
  },
];
