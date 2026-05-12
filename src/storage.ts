import { HOME_PAGE_SEED } from "./data/homeSeed";
import { SITE_SETTINGS_SEED } from "./data/siteSeed";
import { SEED_PRODUCTS } from "./data/seed";
import type { HomePageContent, HomeStat, MoodCard, Product, SiteSettings } from "./types";
import { ADMIN_SESSION_KEY, HOME_STORAGE_KEY, SITE_STORAGE_KEY, STORAGE_KEY } from "./types";

function safeParse(json: string | null): Product[] | null {
  if (!json) return null;
  try {
    const data = JSON.parse(json) as unknown;
    if (!Array.isArray(data)) return null;
    return data as Product[];
  } catch {
    return null;
  }
}

export function loadProducts(): Product[] {
  const stored = safeParse(localStorage.getItem(STORAGE_KEY));
  if (stored && stored.length) return stored;
  return SEED_PRODUCTS;
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function resetToSeed(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function isAdminSession(): boolean {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
}

export function setAdminSession(ok: boolean): void {
  if (ok) sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
  else sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

function ensureId(prefix: string, existing: string | undefined): string {
  if (existing && existing.trim()) return existing;
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}

export function normalizeHomePage(raw: unknown): HomePageContent {
  const d = HOME_PAGE_SEED;
  if (!raw || typeof raw !== "object") return { ...d, stats: d.stats.map((s) => ({ ...s })), moodCards: d.moodCards.map((m) => ({ ...m })) };

  const o = raw as Record<string, unknown>;

  const statsIn = Array.isArray(o.stats) ? o.stats : d.stats;
  const stats: HomeStat[] = statsIn.map((item, i) => {
    const x = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    return {
      id: ensureId("st", typeof x.id === "string" ? x.id : undefined),
      title: typeof x.title === "string" ? x.title : d.stats[i]?.title ?? "",
      subtitle: typeof x.subtitle === "string" ? x.subtitle : d.stats[i]?.subtitle ?? "",
    };
  });
  if (!stats.length) {
    return normalizeHomePage(null);
  }

  const stripItems = Array.isArray(o.stripItems)
    ? (o.stripItems as unknown[]).filter((x): x is string => typeof x === "string" && x.trim().length > 0)
    : d.stripItems;
  const strip = stripItems.length ? stripItems : d.stripItems;

  const moodIn = Array.isArray(o.moodCards) ? o.moodCards : d.moodCards;
  const moodCards: MoodCard[] = moodIn.map((item, i) => {
    const x = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const fallback = d.moodCards[i];
    return {
      id: ensureId("md", typeof x.id === "string" ? x.id : undefined),
      imageUrl: typeof x.imageUrl === "string" ? x.imageUrl : fallback?.imageUrl ?? "",
      imageAlt: typeof x.imageAlt === "string" ? x.imageAlt : fallback?.imageAlt ?? "",
      title: typeof x.title === "string" ? x.title : fallback?.title ?? "",
      subtitle: typeof x.subtitle === "string" ? x.subtitle : fallback?.subtitle ?? "",
      linkTo: typeof x.linkTo === "string" ? x.linkTo : fallback?.linkTo ?? "/shop",
    };
  });
  if (!moodCards.length) {
    return normalizeHomePage(null);
  }

  return {
    heroKicker: typeof o.heroKicker === "string" ? o.heroKicker : d.heroKicker,
    heroTitle: typeof o.heroTitle === "string" ? o.heroTitle : d.heroTitle,
    heroLede: typeof o.heroLede === "string" ? o.heroLede : d.heroLede,
    heroPrimaryCtaLabel:
      typeof o.heroPrimaryCtaLabel === "string" ? o.heroPrimaryCtaLabel : d.heroPrimaryCtaLabel,
    heroPrimaryCtaLink:
      typeof o.heroPrimaryCtaLink === "string" ? o.heroPrimaryCtaLink : d.heroPrimaryCtaLink,
    heroSecondaryCtaLabel:
      typeof o.heroSecondaryCtaLabel === "string" ? o.heroSecondaryCtaLabel : d.heroSecondaryCtaLabel,
    heroSecondaryCtaLink:
      typeof o.heroSecondaryCtaLink === "string" ? o.heroSecondaryCtaLink : d.heroSecondaryCtaLink,
    heroImageUrl: typeof o.heroImageUrl === "string" ? o.heroImageUrl : d.heroImageUrl,
    heroImageAlt: typeof o.heroImageAlt === "string" ? o.heroImageAlt : d.heroImageAlt,
    heroBadgeText: typeof o.heroBadgeText === "string" ? o.heroBadgeText : d.heroBadgeText,
    floatingCardLabel:
      typeof o.floatingCardLabel === "string" ? o.floatingCardLabel : d.floatingCardLabel,
    floatingCardValue:
      typeof o.floatingCardValue === "string" ? o.floatingCardValue : d.floatingCardValue,
    stats,
    stripItems: strip,
    moodSectionTitle:
      typeof o.moodSectionTitle === "string" ? o.moodSectionTitle : d.moodSectionTitle,
    moodCards,
  };
}

export function loadHomePageContent(): HomePageContent {
  try {
    const json = localStorage.getItem(HOME_STORAGE_KEY);
    if (!json) return normalizeHomePage(null);
    const parsed = JSON.parse(json) as unknown;
    return normalizeHomePage(parsed);
  } catch {
    return normalizeHomePage(null);
  }
}

export function saveHomePageContent(content: HomePageContent): void {
  localStorage.setItem(HOME_STORAGE_KEY, JSON.stringify(normalizeHomePage(content)));
}

export function normalizeSiteSettings(raw: unknown): SiteSettings {
  const d = SITE_SETTINGS_SEED;
  if (!raw || typeof raw !== "object") return { ...d };
  const o = raw as Record<string, unknown>;
  const termsSectionsIn = Array.isArray(o.termsSections) ? o.termsSections : d.termsSections;
  const termsSections = termsSectionsIn
    .map((item, i) => {
      const x = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
      const fallback = d.termsSections[i];
      const id = typeof x.id === "string" && x.id.trim() ? x.id : fallback?.id ?? crypto.randomUUID();
      return {
        id,
        title: typeof x.title === "string" ? x.title : fallback?.title ?? "",
        body: typeof x.body === "string" ? x.body : fallback?.body ?? "",
      };
    })
    .filter((s) => s.title.trim() || s.body.trim());

  return {
    brandName: typeof o.brandName === "string" ? o.brandName : d.brandName,
    brandTagline: typeof o.brandTagline === "string" ? o.brandTagline : d.brandTagline,
    logoUrl: typeof o.logoUrl === "string" ? o.logoUrl : d.logoUrl,
    logoAlt: typeof o.logoAlt === "string" ? o.logoAlt : d.logoAlt,
    contactEmail: typeof o.contactEmail === "string" ? o.contactEmail : d.contactEmail,
    contactPhone: typeof o.contactPhone === "string" ? o.contactPhone : d.contactPhone,
    contactInstagramUrl:
      typeof o.contactInstagramUrl === "string" ? o.contactInstagramUrl : d.contactInstagramUrl,
    contactAddress: typeof o.contactAddress === "string" ? o.contactAddress : d.contactAddress,
    footerNote: typeof o.footerNote === "string" ? o.footerNote : d.footerNote,
    termsIntro: typeof o.termsIntro === "string" ? o.termsIntro : d.termsIntro,
    termsSections: termsSections.length ? termsSections : d.termsSections,
  };
}

export function loadSiteSettings(): SiteSettings {
  try {
    const json = localStorage.getItem(SITE_STORAGE_KEY);
    if (!json) return normalizeSiteSettings(null);
    return normalizeSiteSettings(JSON.parse(json) as unknown);
  } catch {
    return normalizeSiteSettings(null);
  }
}

export function saveSiteSettings(settings: SiteSettings): void {
  localStorage.setItem(SITE_STORAGE_KEY, JSON.stringify(normalizeSiteSettings(settings)));
}
