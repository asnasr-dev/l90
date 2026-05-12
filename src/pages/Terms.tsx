import { useSiteSettings } from "../context/ProductsContext";
import styles from "./Legal.module.css";

export function Terms() {
  const { site } = useSiteSettings();

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <p className={styles.kicker}>Policies</p>
        <h1 className={styles.title}>Terms &amp; Policies</h1>
        <p className={styles.lede}>{site.termsIntro}</p>
      </header>

      {site.termsSections.map((s) => (
        <section key={s.id} className={styles.card}>
          <h2>{s.title}</h2>
          <p style={{ whiteSpace: "pre-wrap" }}>{s.body}</p>
        </section>
      ))}

      <section className={styles.card}>
        <h2>Contact</h2>
        <p>
          Email: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
          <br />
          Phone/WhatsApp: <a href={`tel:${site.contactPhone}`}>{site.contactPhone}</a>
        </p>
      </section>
    </div>
  );
}

