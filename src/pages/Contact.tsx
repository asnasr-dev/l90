import { useSiteSettings } from "../context/ProductsContext";
import styles from "./Legal.module.css";

export function Contact() {
  const { site } = useSiteSettings();

  return (
    <div className={styles.page}>
      <header className={styles.head}>
        <p className={styles.kicker}>Support</p>
        <h1 className={styles.title}>Contact</h1>
        <p className={styles.lede}>
          For sizing help, drop queries, bulk orders, or order status — reach us here.
        </p>
      </header>

      <section className={styles.card}>
        <h2>Direct</h2>
        <p>
          Email: <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
          <br />
          Phone/WhatsApp: <a href={`tel:${site.contactPhone}`}>{site.contactPhone}</a>
        </p>
      </section>

      <section className={styles.card}>
        <h2>Social</h2>
        <p>
          Instagram:{" "}
          <a href={site.contactInstagramUrl} target="_blank" rel="noreferrer">
            {site.contactInstagramUrl}
          </a>
        </p>
      </section>

      <section className={styles.card}>
        <h2>Address</h2>
        <p style={{ whiteSpace: "pre-wrap" }}>{site.contactAddress}</p>
      </section>
    </div>
  );
}

