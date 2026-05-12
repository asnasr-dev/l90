import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import { Stars, averageRating } from "../components/Stars";
import styles from "./ProductDetail.module.css";

export function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getBySlug } = useProducts();
  const product = slug ? getBySlug(slug) : undefined;
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setActiveImg(0);
  }, [product?.id]);

  const ratingAvg = useMemo(
    () => (product ? averageRating(product.reviews.map((r) => r.rating)) : 0),
    [product]
  );

  if (!product) {
    return (
      <div className={styles.missing}>
        <p>Product not found.</p>
        <Link to="/shop">Back to shop</Link>
      </div>
    );
  }

  const mainImg = product.images[activeImg] ?? product.images[0];

  return (
    <div className={styles.page}>
      <button type="button" className={styles.back} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className={styles.layout}>
        <div className={styles.gallery}>
          <div className={styles.mainShot}>
            <img src={mainImg} alt={product.name} className={styles.mainImg} />
            <div className={styles.mainFrame} aria-hidden />
          </div>
          <div className={styles.thumbs} role="tablist" aria-label="Product images">
            {product.images.map((src, i) => (
              <button
                key={src + i}
                type="button"
                className={`${styles.thumb} ${i === activeImg ? styles.thumbOn : ""}`}
                onClick={() => setActiveImg(i)}
                aria-selected={i === activeImg}
              >
                <img src={src} alt="" className={styles.thumbImg} />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.panel}>
          <p className={styles.cat}>{product.category}</p>
          <h1 className={styles.title}>{product.name}</h1>
          <p className={styles.tagline}>{product.tagline}</p>

          <div className={styles.priceRow}>
            <span className={styles.price}>
              {product.currency}
              {product.price.toLocaleString("en-IN")}
            </span>
            {product.badge && <span className={styles.badge}>{product.badge}</span>}
          </div>

          <div className={styles.ratingRow}>
            <Stars value={ratingAvg} />
            <span className={styles.ratingText}>
              {ratingAvg > 0 ? ratingAvg.toFixed(1) : "New"} · {product.reviews.length}{" "}
              review{product.reviews.length === 1 ? "" : "s"}
            </span>
          </div>

          <p className={styles.description}>{product.description}</p>

          <div className={styles.detailBlocks}>
            <div className={styles.block}>
              <h2 className={styles.blockTitle}>Materials &amp; finish</h2>
              <p className={styles.blockBody}>
                Structured panels with a cool-touch face fabric and a softer interior
                map for comfort. Hardware is powder-coated or brushed to match the
                steel palette — built to survive commutes and celebrations alike.
              </p>
            </div>
            <div className={styles.block}>
              <h2 className={styles.blockTitle}>Fit &amp; sizing notes</h2>
              <p className={styles.blockBody}>
                True-to-size athletic cut through the chest with slightly dropped
                shoulders for a modern silhouette. If you prefer a looser terrace
                fit, consider sizing up once.
              </p>
            </div>
            <div className={styles.block}>
              <h2 className={styles.blockTitle}>Shipping &amp; authenticity</h2>
              <p className={styles.blockBody}>
                Each order leaves with a tamper-evident seal and a digital receipt.
                Continue on our trusted checkout partner via the button below — your
                cart state will hand off securely.
              </p>
            </div>
          </div>

          <div className={styles.ctaRow}>
            <a className={styles.btnBuy} href={product.redirectUrl} target="_blank" rel="noreferrer">
              Continue to secure checkout
            </a>
            <Link className={styles.btnGhost} to="/shop">
              Keep browsing
            </Link>
          </div>
        </div>
      </div>

      <section className={styles.reviews}>
        <div className={styles.reviewsHead}>
          <h2 className={styles.reviewsTitle}>Fan reviews</h2>
          <p className={styles.reviewsSub}>
            Honest notes from buyers — refreshed when admins curate the wall.
          </p>
        </div>
        {product.reviews.length === 0 ? (
          <p className={styles.noReviews}>No reviews yet. Be the first after launch.</p>
        ) : (
          <ul className={styles.reviewList}>
            {product.reviews.map((r) => (
              <li key={r.id} className={styles.reviewCard}>
                <div className={styles.reviewTop}>
                  <Stars value={r.rating} size="sm" />
                  <time className={styles.reviewDate} dateTime={r.date}>
                    {r.date}
                  </time>
                </div>
                <p className={styles.reviewAuthor}>{r.author}</p>
                <p className={styles.reviewText}>{r.text}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
