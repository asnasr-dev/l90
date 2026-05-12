import type { HomePageContent } from "../types";

export const HOME_PAGE_SEED: HomePageContent = {
  heroKicker: "Sports merchandise · Fan culture",
  heroTitle: "From the pitch to the paddock — gear that hits like steel.",
  heroLede:
    "LAP90 curates kits, layers, and accessories with a motorsport edge and stadium-ready presence. Metallic tones, deep ember accents, and textures chosen for real-world wear.",
  heroPrimaryCtaLabel: "Browse the shop",
  heroPrimaryCtaLink: "/shop",
  heroSecondaryCtaLabel: "View new arrivals",
  heroSecondaryCtaLink: "/shop",
  heroImageUrl: "https://picsum.photos/seed/laphomehero/720/900",
  heroImageAlt: "Stadium-inspired apparel still life",
  heroBadgeText: "World Cup 2026 ready",
  floatingCardLabel: "Featured material",
  floatingCardValue: "Brushed steel mesh lining",
  stats: [
    { id: "s1", title: "Authentic fan cuts", subtitle: "Athletic & relaxed fits" },
    { id: "s2", title: "Steel & ember palette", subtitle: "Cohesive drops" },
    { id: "s3", title: "Detail-first", subtitle: "Embroidery & trims" },
  ],
  stripItems: ["F1 & motorsport layers", "League kits & training", "Terrace accessories"],
  moodSectionTitle: "Shop the mood",
  moodCards: [
    {
      id: "m1",
      imageUrl: "https://picsum.photos/seed/lapmood1/600/420",
      imageAlt: "Football kits mood",
      title: "Football kits",
      subtitle: "Heat-sealed crests, breathable panels",
      linkTo: "/shop",
    },
    {
      id: "m2",
      imageUrl: "https://picsum.photos/seed/lapmood2/600/420",
      imageAlt: "Motorsport mood",
      title: "Motorsport layers",
      subtitle: "Ripstop shells & reflective piping",
      linkTo: "/shop",
    },
    {
      id: "m3",
      imageUrl: "https://picsum.photos/seed/lapmood3/600/420",
      imageAlt: "Street training mood",
      title: "Street training",
      subtitle: "Heavy fleece, metal hardware",
      linkTo: "/shop",
    },
  ],
};
