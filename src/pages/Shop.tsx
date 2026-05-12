import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import { Stars, averageRating } from "../components/Stars";
import styles from "./Shop.module.css";

type SortKey = "featured" | "price-asc" | "price-desc" | "rating";

export function Shop() {
  const { products } = useProducts();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("featured");

  const categories = useMemo(() => {
    const s = new Set(products.map((p) => p.category));
    return ["all", ...Array.from(s).sort()];
  }, [products]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchesQ =
        !q.trim() ||
        `${p.name} ${p.tagline} ${p.category} ${p.description}`
          .toLowerCase()
          .includes(q.trim().toLowerCase());
      const matchesC = cat === "all" || p.category === cat;
      return matchesQ && matchesC;
    });

    list = [...list].sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") {
        const ra = averageRating(a.reviews.map((r) => r.rating));
        const rb = averageRating(b.reviews.map((r) => r.rating));
        return rb - ra;
      }
      return 0;
    });

    return list;
  }, [products, q, cat, sort]);

  const heroProduct = products[0];

  return (
    <div className={styles.page}>
      <section className={styles.editorial}>
        <div className={styles.edRail} aria-hidden />
        <div className={styles.edInner}>
          <div className={styles.edTop}>
            <div>
              <p className={styles.edKicker}>Catalogue · Seasonal edit</p>
              <h1 className={styles.edTitle}>The steel & ember roster</h1>
              <p className={styles.edLede}>
                Every piece is photographed in high contrast so you can see texture
                before you commit. Tap through for multi-angle imagery, verified
                buyer notes, and a secure redirect to complete your purchase.
              </p>
            </div>
            <div className={styles.edStatBoard}>
              <div>
                <span className={styles.sbVal}>{products.length}</span>
                <span className={styles.sbLbl}>Live SKUs</span>
              </div>
              <div>
                <span className={styles.sbVal}>24h</span>
                <span className={styles.sbLbl}>Dispatch window</span>
              </div>
              <div>
                <span className={styles.sbVal}>4.8</span>
                <span className={styles.sbLbl}>Avg. fan rating</span>
              </div>
            </div>
          </div>

          {heroProduct && (
            <Link to={`/product/${heroProduct.slug}`} className={styles.spotlight}>
              <div className={styles.spMedia}>
                <img
                  src={heroProduct.images[0]}
                  alt=""
                  width={960}
                  height={640}
                  className={styles.spImg}
                />
                <div className={styles.spShade} />
                <span className={styles.spBadge}>Editor&apos;s pick</span>
              </div>
              <div className={styles.spCopy}>
                <p className={styles.spEyebrow}>Featured drop</p>
                <h2 className={styles.spTitle}>{heroProduct.name}</h2>
                <p className={styles.spTag}>{heroProduct.tagline}</p>
                <div className={styles.spMeta}>
                  <span className={styles.spPrice}>
                    {heroProduct.currency}
                    {heroProduct.price.toLocaleString("en-IN")}
                  </span>
                  <Stars
                    value={averageRating(heroProduct.reviews.map((r) => r.rating))}
                  />
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>

      <section className={styles.controls}>
        <div className={styles.controlsInner}>
          <div className={styles.searchWrap}>
            <label className={styles.visuallyHidden} htmlFor="shop-q">
              Search products
            </label>
            <input
              id="shop-q"
              className={styles.search}
              placeholder="Search kits, layers, accessories…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              autoComplete="off"
            />
          </div>
          <div className={styles.filters}>
            <label className={styles.fieldLbl} htmlFor="shop-cat">
              League / line
            </label>
            <select
              id="shop-cat"
              className={styles.select}
              value={cat}
              onChange={(e) => setCat(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All categories" : c}
                </option>
              ))}
            </select>
            <label className={styles.fieldLbl} htmlFor="shop-sort">
              Sort
            </label>
            <select
              id="shop-sort"
              className={styles.select}
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              <option value="featured">Featured composition</option>
              <option value="rating">Highest rated</option>
              <option value="price-asc">Price · low to high</option>
              <option value="price-desc">Price · high to low</option>
            </select>
          </div>
        </div>
      </section>

      <section className={styles.gridWrap}>
        <div className={styles.gridHead}>
          <h2 className={styles.gridTitle}>All pieces</h2>
          <p className={styles.gridCount}>{filtered.length} results</p>
        </div>
        <div className={styles.grid}>
          {filtered.map((p, i) => {
            const rating = averageRating(p.reviews.map((r) => r.rating));
            const tall = i % 5 === 0;
            return (
              <Link
                key={p.id}
                to={`/product/${p.slug}`}
                className={`${styles.card} ${tall ? styles.cardTall : ""}`}
              >
                <div className={styles.cardMedia}>
                  <img src={p.images[0]} alt="" className={styles.cardImg} loading="lazy" />
                  <div className={styles.cardShine} aria-hidden />
                  {p.badge && <span className={styles.cardBadge}>{p.badge}</span>}
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.cardCat}>{p.category}</p>
                  <h3 className={styles.cardName}>{p.name}</h3>
                  <p className={styles.cardTag}>{p.tagline}</p>
                  <div className={styles.cardRow}>
                    <span className={styles.cardPrice}>
                      {p.currency}
                      {p.price.toLocaleString("en-IN")}
                    </span>
                    <div className={styles.cardStars}>
                      <Stars value={rating} size="sm" />
                      <span className={styles.cardRevCount}>
                        {p.reviews.length} review{p.reviews.length === 1 ? "" : "s"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <p className={styles.empty}>No matches — try another search or category.</p>
        )}
      </section>
    </div>
  );
}
