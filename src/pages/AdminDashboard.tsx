import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { HomepageEditor } from "../components/admin/HomepageEditor";
import { SiteSettingsEditor } from "../components/admin/SiteSettingsEditor";
import { useProducts } from "../context/ProductsContext";
import { isAdminSession, setAdminSession } from "../storage";
import type { Product, Review } from "../types";
import { uniqueSlug } from "../utils/slug";
import styles from "./AdminDashboard.module.css";

const ph = (seed: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/1000`;

function emptyProduct(existingSlugs: Set<string>): Product {
  const name = "New merchandise";
  return {
    id: crypto.randomUUID(),
    name,
    slug: uniqueSlug(name, existingSlugs),
    tagline: "Add a sharp one-liner",
    description: "Describe materials, fit, and why fans will love it.",
    price: 1999,
    currency: "₹",
    category: "Football Kits",
    images: [ph("newitemcover")],
    reviews: [],
    redirectUrl: "https://example.com",
    badge: "New",
  };
}

type AdminTab = "products" | "homepage" | "site";

export function AdminDashboard() {
  const navigate = useNavigate();
  const { products, upsertProduct, deleteProduct } = useProducts();
  const [tab, setTab] = useState<AdminTab>("products");
  const [selectedId, setSelectedId] = useState<string | null>(() => products[0]?.id ?? null);
  const [draft, setDraft] = useState<Product | null>(null);
  const [imgText, setImgText] = useState("");
  const [revAuthor, setRevAuthor] = useState("");
  const [revRating, setRevRating] = useState(5);
  const [revText, setRevText] = useState("");

  useEffect(() => {
    if (!selectedId) {
      setDraft(null);
      setImgText("");
      return;
    }
    const p = products.find((x) => x.id === selectedId);
    if (p) {
      setDraft({ ...p, images: [...p.images], reviews: p.reviews.map((r) => ({ ...r })) });
      setImgText(p.images.join("\n"));
    }
  }, [selectedId, products]);

  useEffect(() => {
    if (!products.length) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !products.some((p) => p.id === selectedId)) {
      setSelectedId(products[0].id);
    }
  }, [products, selectedId]);

  const slugSet = useMemo(() => new Set(products.map((p) => p.slug)), [products]);

  if (!isAdminSession()) {
    return <Navigate to="/" replace />;
  }

  function logout() {
    setAdminSession(false);
    navigate("/", { replace: true });
  }

  function onSave(e: FormEvent) {
    e.preventDefault();
    if (!draft) return;
    const images = imgText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!images.length) {
      alert("Add at least one image URL.");
      return;
    }
    const slugOthers = new Set(
      products.filter((p) => p.id !== draft.id).map((p) => p.slug)
    );
    const cleaned: Product = {
      ...draft,
      images,
      slug: draft.slug.trim() || uniqueSlug(draft.name, slugOthers),
    };
    upsertProduct(cleaned);
  }

  function onNew() {
    const next = emptyProduct(slugSet);
    upsertProduct(next);
    setSelectedId(next.id);
  }

  function onDelete() {
    if (!draft) return;
    if (!confirm("Delete this product from the storefront?")) return;
    deleteProduct(draft.id);
  }

  function updateDraft(patch: Partial<Product>) {
    setDraft((d) => (d ? { ...d, ...patch } : d));
  }

  function removeReview(id: string) {
    if (!draft) return;
    updateDraft({ reviews: draft.reviews.filter((r) => r.id !== id) });
  }

  function addReview() {
    if (!draft || !revAuthor.trim() || !revText.trim()) return;
    const r: Review = {
      id: crypto.randomUUID(),
      author: revAuthor.trim(),
      rating: revRating,
      text: revText.trim(),
      date: new Date().toISOString().slice(0, 10),
    };
    updateDraft({ reviews: [...draft.reviews, r] });
    setRevAuthor("");
    setRevText("");
    setRevRating(5);
  }

  return (
    <div className={styles.page}>
      <div className={styles.bg} aria-hidden />
      <header className={styles.top}>
        <div>
          <p className={styles.kicker}>LAP90 control room</p>
          <h1 className={styles.title}>Inventory &amp; storytelling</h1>
        </div>
        <div className={styles.topActions}>
          <Link to="/" className={styles.linkBtn}>
            View homepage
          </Link>
          <Link to="/shop" className={styles.linkBtn}>
            View storefront
          </Link>
          <button type="button" className={styles.ghostBtn} onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      <nav className={styles.tabs} aria-label="Admin sections">
        <button
          type="button"
          className={`${styles.tab} ${tab === "products" ? styles.tabActive : ""}`}
          onClick={() => setTab("products")}
        >
          Products
        </button>
        <button
          type="button"
          className={`${styles.tab} ${tab === "homepage" ? styles.tabActive : ""}`}
          onClick={() => setTab("homepage")}
        >
          Homepage
        </button>
        <button
          type="button"
          className={`${styles.tab} ${tab === "site" ? styles.tabActive : ""}`}
          onClick={() => setTab("site")}
        >
          Site
        </button>
      </nav>

      <div className={tab === "homepage" ? styles.shellHome : styles.shell}>
        {tab === "homepage" ? (
          <section className={styles.editorWide}>
            <HomepageEditor />
          </section>
        ) : tab === "site" ? (
          <section className={styles.editorWide}>
            <SiteSettingsEditor />
          </section>
        ) : (
          <>
        <aside className={styles.aside}>
          <div className={styles.asideHead}>
            <h2 className={styles.asideTitle}>Products</h2>
            <button type="button" className={styles.primarySm} onClick={onNew}>
              + New
            </button>
          </div>
          <ul className={styles.list}>
            {products.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  className={`${styles.row} ${p.id === selectedId ? styles.rowOn : ""}`}
                  onClick={() => setSelectedId(p.id)}
                >
                  <span className={styles.rowName}>{p.name}</span>
                  <span className={styles.rowMeta}>
                    {p.currency}
                    {p.price.toLocaleString("en-IN")}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className={styles.editor}>
          {!draft ? (
            <p className={styles.placeholder}>Select or create a product.</p>
          ) : (
            <form className={styles.form} onSubmit={onSave}>
              <div className={styles.formGrid}>
                <label className={styles.lbl}>
                  Name
                  <input
                    className={styles.input}
                    value={draft.name}
                    onChange={(e) => updateDraft({ name: e.target.value })}
                    required
                  />
                </label>
                <label className={styles.lbl}>
                  URL slug
                  <input
                    className={styles.input}
                    value={draft.slug}
                    onChange={(e) => updateDraft({ slug: e.target.value })}
                    required
                  />
                </label>
                <label className={`${styles.lbl} ${styles.full}`}>
                  Tagline
                  <input
                    className={styles.input}
                    value={draft.tagline}
                    onChange={(e) => updateDraft({ tagline: e.target.value })}
                  />
                </label>
                <label className={`${styles.lbl} ${styles.full}`}>
                  Description
                  <textarea
                    className={styles.textarea}
                    rows={5}
                    value={draft.description}
                    onChange={(e) => updateDraft({ description: e.target.value })}
                  />
                </label>
                <label className={styles.lbl}>
                  Price
                  <input
                    className={styles.input}
                    type="number"
                    min={0}
                    value={draft.price}
                    onChange={(e) => updateDraft({ price: Number(e.target.value) || 0 })}
                  />
                </label>
                <label className={styles.lbl}>
                  Currency
                  <input
                    className={styles.input}
                    value={draft.currency}
                    onChange={(e) => updateDraft({ currency: e.target.value })}
                  />
                </label>
                <label className={styles.lbl}>
                  Category
                  <input
                    className={styles.input}
                    value={draft.category}
                    onChange={(e) => updateDraft({ category: e.target.value })}
                  />
                </label>
                <label className={styles.lbl}>
                  Badge (optional)
                  <input
                    className={styles.input}
                    value={draft.badge ?? ""}
                    onChange={(e) =>
                      updateDraft({ badge: e.target.value.trim() || undefined })
                    }
                    placeholder="Limited, New drop…"
                  />
                </label>
                <label className={`${styles.lbl} ${styles.full}`}>
                  Checkout / redirect link
                  <input
                    className={styles.input}
                    type="url"
                    value={draft.redirectUrl}
                    onChange={(e) => updateDraft({ redirectUrl: e.target.value })}
                    required
                  />
                </label>
                <label className={`${styles.lbl} ${styles.full}`}>
                  Image URLs (one per line)
                  <textarea
                    className={styles.textarea}
                    rows={5}
                    value={imgText}
                    onChange={(e) => setImgText(e.target.value)}
                    placeholder={"https://…\nhttps://…"}
                  />
                </label>
              </div>

              <div className={styles.toolbar}>
                <button type="submit" className={styles.primary}>
                  Save product
                </button>
                <button type="button" className={styles.danger} onClick={onDelete}>
                  Remove product
                </button>
              </div>

              <div className={styles.reviews}>
                <h3 className={styles.h3}>Reviews</h3>
                <ul className={styles.revList}>
                  {draft.reviews.map((r) => (
                    <li key={r.id} className={styles.revItem}>
                      <div>
                        <strong>{r.author}</strong> · {r.rating}★ ·{" "}
                        <span className={styles.muted}>{r.date}</span>
                        <p className={styles.revBody}>{r.text}</p>
                      </div>
                      <button
                        type="button"
                        className={styles.linkDanger}
                        onClick={() => removeReview(r.id)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>

                <div className={styles.addRev}>
                  <h4 className={styles.h4}>Add review</h4>
                  <div className={styles.addGrid}>
                    <input
                      className={styles.input}
                      placeholder="Author"
                      value={revAuthor}
                      onChange={(e) => setRevAuthor(e.target.value)}
                    />
                    <select
                      className={styles.input}
                      value={revRating}
                      onChange={(e) => setRevRating(Number(e.target.value))}
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>
                          {n} stars
                        </option>
                      ))}
                    </select>
                    <textarea
                      className={styles.textarea}
                      rows={3}
                      placeholder="Review text"
                      value={revText}
                      onChange={(e) => setRevText(e.target.value)}
                    />
                    <button
                      type="button"
                      className={styles.secondary}
                      onClick={addReview}
                    >
                      Append review
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </section>
          </>
        )}
      </div>
    </div>
  );
}
