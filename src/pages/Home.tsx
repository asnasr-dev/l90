import { Fragment } from "react";
import { Link } from "react-router-dom";
import { CtaLink } from "../components/CtaLink";
import { useHomePage } from "../context/ProductsContext";
import type { MoodCard } from "../types";
import styles from "./Home.module.css";

export function Home() {
  const { homePage: h } = useHomePage();

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>{h.heroKicker}</p>
            <h1 className={styles.title}>{h.heroTitle}</h1>
            <p className={styles.lede}>{h.heroLede}</p>
            <div className={styles.ctaRow}>
              <CtaLink className={styles.btnPrimary} to={h.heroPrimaryCtaLink}>
                {h.heroPrimaryCtaLabel}
              </CtaLink>
              <CtaLink className={styles.btnGhost} to={h.heroSecondaryCtaLink}>
                {h.heroSecondaryCtaLabel}
              </CtaLink>
            </div>
            <dl className={styles.stats}>
              {h.stats.map((s) => (
                <div key={s.id}>
                  <dt>{s.title}</dt>
                  <dd>{s.subtitle}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.frameOuter}>
              <div className={styles.frameInner}>
                <img
                  src={h.heroImageUrl}
                  alt={h.heroImageAlt}
                  width={720}
                  height={900}
                  loading="eager"
                  className={styles.heroImg}
                />
                <div className={styles.frameBadge}>{h.heroBadgeText}</div>
              </div>
            </div>
            <div className={styles.floatingCard}>
              <span className={styles.fcLabel}>{h.floatingCardLabel}</span>
              <span className={styles.fcValue}>{h.floatingCardValue}</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.strip} aria-label="Highlights">
        <div className={styles.stripInner}>
          {h.stripItems.map((text, i) => (
            <Fragment key={`${i}-${text.slice(0, 24)}`}>
              {i > 0 && <span className={styles.dot} />}
              <span>{text}</span>
            </Fragment>
          ))}
        </div>
      </section>

      <section className={styles.gridSection}>
        <h2 className={styles.sectionTitle}>{h.moodSectionTitle}</h2>
        <div className={styles.cardGrid}>
          {h.moodCards.map((card) => (
            <MoodCardLink key={card.id} card={card} />
          ))}
        </div>
      </section>
    </div>
  );
}

function MoodCardLink({ card }: { card: MoodCard }) {
  const external = /^https?:\/\//i.test(card.linkTo.trim());
  const inner = (
    <>
      <img
        src={card.imageUrl}
        alt={card.imageAlt}
        width={600}
        height={420}
        className={styles.moodImg}
      />
      <div className={styles.moodOverlay}>
        <h3>{card.title}</h3>
        <p>{card.subtitle}</p>
      </div>
    </>
  );
  if (external) {
    return (
      <a href={card.linkTo.trim()} className={styles.moodCard} target="_blank" rel="noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <Link to={card.linkTo.trim() || "/shop"} className={styles.moodCard}>
      {inner}
    </Link>
  );
}
