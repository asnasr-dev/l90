import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { HomePageContent, Product } from "../types";
import type { SiteSettings } from "../types";
import {
  loadHomePageContent,
  loadProducts,
  loadSiteSettings,
  saveHomePageContent,
  saveProducts,
  saveSiteSettings,
} from "../storage";

type ProductsContextValue = {
  products: Product[];
  replaceProducts: (next: Product[]) => void;
  upsertProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  getBySlug: (slug: string) => Product | undefined;
  homePage: HomePageContent;
  saveHomePage: (next: HomePageContent) => void;
  site: SiteSettings;
  saveSite: (next: SiteSettings) => void;
};

const ProductsContext = createContext<ProductsContextValue | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => loadProducts());
  const [homePage, setHomePage] = useState<HomePageContent>(() => loadHomePageContent());
  const [site, setSite] = useState<SiteSettings>(() => loadSiteSettings());

  const persist = useCallback((next: Product[]) => {
    setProducts(next);
    saveProducts(next);
  }, []);

  const replaceProducts = useCallback(
    (next: Product[]) => {
      persist(next);
    },
    [persist]
  );

  const upsertProduct = useCallback(
    (p: Product) => {
      setProducts((prev) => {
        const idx = prev.findIndex((x) => x.id === p.id);
        const next =
          idx === -1 ? [...prev, p] : prev.map((x) => (x.id === p.id ? p : x));
        saveProducts(next);
        return next;
      });
    },
    []
  );

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => {
      const next = prev.filter((x) => x.id !== id);
      saveProducts(next);
      return next;
    });
  }, []);

  const getBySlug = useCallback(
    (slug: string) => products.find((p) => p.slug === slug),
    [products]
  );

  const saveHomePage = useCallback((next: HomePageContent) => {
    setHomePage(next);
    saveHomePageContent(next);
  }, []);

  const saveSite = useCallback((next: SiteSettings) => {
    setSite(next);
    saveSiteSettings(next);
  }, []);

  const value = useMemo(
    () => ({
      products,
      replaceProducts,
      upsertProduct,
      deleteProduct,
      getBySlug,
      homePage,
      saveHomePage,
      site,
      saveSite,
    }),
    [
      products,
      replaceProducts,
      upsertProduct,
      deleteProduct,
      getBySlug,
      homePage,
      saveHomePage,
      site,
      saveSite,
    ]
  );

  return (
    <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}

export function useHomePage() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useHomePage must be used within ProductsProvider");
  return { homePage: ctx.homePage, saveHomePage: ctx.saveHomePage };
}

export function useSiteSettings() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useSiteSettings must be used within ProductsProvider");
  return { site: ctx.site, saveSite: ctx.saveSite };
}
