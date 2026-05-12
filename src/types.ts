export type Review = {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  images: string[];
  reviews: Review[];
  redirectUrl: string;
  badge?: string;
};

export const ADMIN_USER = "lapadmin";
export const ADMIN_PASS = "asnasr";
export const STORAGE_KEY = "lap90_products_v1";
export const ADMIN_SESSION_KEY = "lap90_admin_session";
export const HOME_STORAGE_KEY = "lap90_home_v1";
export const SITE_STORAGE_KEY = "lap90_site_v1";

export type HomeStat = {
  id: string;
  title: string;
  subtitle: string;
};

export type MoodCard = {
  id: string;
  imageUrl: string;
  imageAlt: string;
  title: string;
  subtitle: string;
  /** Internal path (e.g. /shop) or full https URL */
  linkTo: string;
};

export type HomePageContent = {
  heroKicker: string;
  heroTitle: string;
  heroLede: string;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaLink: string;
  heroSecondaryCtaLabel: string;
  heroSecondaryCtaLink: string;
  heroImageUrl: string;
  heroImageAlt: string;
  heroBadgeText: string;
  floatingCardLabel: string;
  floatingCardValue: string;
  stats: HomeStat[];
  stripItems: string[];
  moodSectionTitle: string;
  moodCards: MoodCard[];
};

export type SiteSettings = {
  brandName: string;
  brandTagline: string;
  logoUrl: string;
  logoAlt: string;
  contactEmail: string;
  contactPhone: string;
  contactInstagramUrl: string;
  contactAddress: string;
  footerNote: string;
  termsIntro: string;
  termsSections: Array<{
    id: string;
    title: string;
    body: string;
  }>;
};
