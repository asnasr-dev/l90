import { FormEvent, useEffect, useState } from "react";
import { useHomePage } from "../../context/ProductsContext";
import type { HomePageContent, HomeStat, MoodCard } from "../../types";
import { fileToDataUrl } from "../../utils/files";
import styles from "./HomepageEditor.module.css";

function newStat(): HomeStat {
  return { id: crypto.randomUUID(), title: "", subtitle: "" };
}

function newMoodCard(): MoodCard {
  return {
    id: crypto.randomUUID(),
    imageUrl: "https://picsum.photos/seed/newmood/600/420",
    imageAlt: "",
    title: "New mood",
    subtitle: "Subtitle",
    linkTo: "/shop",
  };
}

export function HomepageEditor() {
  const { homePage, saveHomePage } = useHomePage();
  const [draft, setDraft] = useState<HomePageContent>(homePage);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setDraft(homePage);
  }, [homePage]);

  function patch(p: Partial<HomePageContent>) {
    setDraft((d) => ({ ...d, ...p }));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!draft.heroImageUrl.trim()) {
      alert("Hero image URL is required.");
      return;
    }
    if (!draft.stats.length) {
      alert("Add at least one stat block.");
      return;
    }
    if (!draft.moodCards.length) {
      alert("Add at least one Shop the mood card.");
      return;
    }
    for (const m of draft.moodCards) {
      if (!m.imageUrl.trim()) {
        alert("Each mood card needs an image URL.");
        return;
      }
    }
    saveHomePage(draft);
  }

  async function onHeroFile(file: File | null) {
    if (!file) return;
    setBusy(true);
    try {
      const url = await fileToDataUrl(file);
      patch({ heroImageUrl: url, heroImageAlt: file.name || draft.heroImageAlt });
    } finally {
      setBusy(false);
    }
  }

  function updateStat(id: string, patchStat: Partial<HomeStat>) {
    setDraft((d) => ({
      ...d,
      stats: d.stats.map((s) => (s.id === id ? { ...s, ...patchStat } : s)),
    }));
  }

  function removeStat(id: string) {
    setDraft((d) => ({
      ...d,
      stats: d.stats.filter((s) => s.id !== id),
    }));
  }

  function addStat() {
    setDraft((d) => ({ ...d, stats: [...d.stats, newStat()] }));
  }

  function updateMood(id: string, patchMood: Partial<MoodCard>) {
    setDraft((d) => ({
      ...d,
      moodCards: d.moodCards.map((m) => (m.id === id ? { ...m, ...patchMood } : m)),
    }));
  }

  async function onMoodFile(id: string, file: File | null) {
    if (!file) return;
    setBusy(true);
    try {
      const url = await fileToDataUrl(file);
      updateMood(id, { imageUrl: url, imageAlt: file.name || "" });
    } finally {
      setBusy(false);
    }
  }

  function removeMood(id: string) {
    setDraft((d) => ({
      ...d,
      moodCards: d.moodCards.filter((m) => m.id !== id),
    }));
  }

  function addMood() {
    setDraft((d) => ({ ...d, moodCards: [...d.moodCards, newMoodCard()] }));
  }

  function moveMood(index: number, dir: -1 | 1) {
    const j = index + dir;
    setDraft((d) => {
      const cards = [...d.moodCards];
      if (j < 0 || j >= cards.length) return d;
      const t = cards[index];
      cards[index] = cards[j];
      cards[j] = t;
      return { ...d, moodCards: cards };
    });
  }

  const stripText = draft.stripItems.join("\n");

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <section className={styles.section}>
        <h2 className={styles.h2}>Hero</h2>
        <div className={styles.grid2}>
          <label className={styles.lbl}>
            Kicker
            <input
              className={styles.input}
              value={draft.heroKicker}
              onChange={(e) => patch({ heroKicker: e.target.value })}
            />
          </label>
          <label className={styles.lbl}>
            Badge on image
            <input
              className={styles.input}
              value={draft.heroBadgeText}
              onChange={(e) => patch({ heroBadgeText: e.target.value })}
            />
          </label>
          <label className={`${styles.lbl} ${styles.full}`}>
            Title
            <textarea
              className={styles.textarea}
              rows={2}
              value={draft.heroTitle}
              onChange={(e) => patch({ heroTitle: e.target.value })}
            />
          </label>
          <label className={`${styles.lbl} ${styles.full}`}>
            Lead paragraph
            <textarea
              className={styles.textarea}
              rows={4}
              value={draft.heroLede}
              onChange={(e) => patch({ heroLede: e.target.value })}
            />
          </label>
          <label className={styles.lbl}>
            Primary button label
            <input
              className={styles.input}
              value={draft.heroPrimaryCtaLabel}
              onChange={(e) => patch({ heroPrimaryCtaLabel: e.target.value })}
            />
          </label>
          <label className={styles.lbl}>
            Primary link (/shop or https://…)
            <input
              className={styles.input}
              value={draft.heroPrimaryCtaLink}
              onChange={(e) => patch({ heroPrimaryCtaLink: e.target.value })}
            />
          </label>
          <label className={styles.lbl}>
            Secondary button label
            <input
              className={styles.input}
              value={draft.heroSecondaryCtaLabel}
              onChange={(e) => patch({ heroSecondaryCtaLabel: e.target.value })}
            />
          </label>
          <label className={styles.lbl}>
            Secondary link
            <input
              className={styles.input}
              value={draft.heroSecondaryCtaLink}
              onChange={(e) => patch({ heroSecondaryCtaLink: e.target.value })}
            />
          </label>
          <label className={styles.lbl}>
            Hero image URL
            <input
              className={styles.input}
              value={draft.heroImageUrl}
              onChange={(e) => patch({ heroImageUrl: e.target.value })}
              required
            />
          </label>
          <label className={styles.lbl}>
            Upload hero image
            <input
              className={styles.input}
              type="file"
              accept="image/*"
              disabled={busy}
              onChange={(e) => void onHeroFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <label className={styles.lbl}>
            Hero image alt text
            <input
              className={styles.input}
              value={draft.heroImageAlt}
              onChange={(e) => patch({ heroImageAlt: e.target.value })}
            />
          </label>
          <label className={styles.lbl}>
            Floating card label
            <input
              className={styles.input}
              value={draft.floatingCardLabel}
              onChange={(e) => patch({ floatingCardLabel: e.target.value })}
            />
          </label>
          <label className={styles.lbl}>
            Floating card value
            <input
              className={styles.input}
              value={draft.floatingCardValue}
              onChange={(e) => patch({ floatingCardValue: e.target.value })}
            />
          </label>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.h2}>Stat row (under hero)</h2>
          <button type="button" className={styles.smallBtn} onClick={addStat}>
            + Add stat
          </button>
        </div>
        <ul className={styles.statList}>
          {draft.stats.map((s) => (
            <li key={s.id} className={styles.statCard}>
              <label className={styles.lbl}>
                Title (dt)
                <input
                  className={styles.input}
                  value={s.title}
                  onChange={(e) => updateStat(s.id, { title: e.target.value })}
                />
              </label>
              <label className={styles.lbl}>
                Subtitle (dd)
                <input
                  className={styles.input}
                  value={s.subtitle}
                  onChange={(e) => updateStat(s.id, { subtitle: e.target.value })}
                />
              </label>
              <button
                type="button"
                className={styles.linkDanger}
                onClick={() => removeStat(s.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Ticker strip</h2>
        <label className={`${styles.lbl} ${styles.full}`}>
          Lines (one phrase per line; dots are added automatically between lines)
          <textarea
            className={styles.textarea}
            rows={4}
            value={stripText}
            onChange={(e) =>
              patch({
                stripItems: e.target.value
                  .split("\n")
                  .map((x) => x.trim())
                  .filter(Boolean),
              })
            }
          />
        </label>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.h2}>Shop the mood</h2>
          <button type="button" className={styles.smallBtn} onClick={addMood}>
            + Add card
          </button>
        </div>
        <label className={`${styles.lbl} ${styles.full}`}>
          Section heading
          <input
            className={styles.input}
            value={draft.moodSectionTitle}
            onChange={(e) => patch({ moodSectionTitle: e.target.value })}
          />
        </label>

        <div className={styles.moodList}>
          {draft.moodCards.map((m, index) => (
            <div key={m.id} className={styles.moodCard}>
              <div className={styles.moodToolbar}>
                <span className={styles.moodIdx}>Card {index + 1}</span>
                <button
                  type="button"
                  className={styles.mini}
                  onClick={() => moveMood(index, -1)}
                  disabled={index === 0}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className={styles.mini}
                  onClick={() => moveMood(index, 1)}
                  disabled={index === draft.moodCards.length - 1}
                >
                  ↓
                </button>
                <button
                  type="button"
                  className={styles.linkDanger}
                  onClick={() => removeMood(m.id)}
                >
                  Remove card
                </button>
              </div>
              <div className={styles.grid2}>
                <label className={`${styles.lbl} ${styles.full}`}>
                  Image URL
                  <input
                    className={styles.input}
                    value={m.imageUrl}
                    onChange={(e) => updateMood(m.id, { imageUrl: e.target.value })}
                  />
                </label>
                <label className={`${styles.lbl} ${styles.full}`}>
                  Upload image
                  <input
                    className={styles.input}
                    type="file"
                    accept="image/*"
                    disabled={busy}
                    onChange={(e) => void onMoodFile(m.id, e.target.files?.[0] ?? null)}
                  />
                </label>
                <label className={`${styles.lbl} ${styles.full}`}>
                  Image alt text
                  <input
                    className={styles.input}
                    value={m.imageAlt}
                    onChange={(e) => updateMood(m.id, { imageAlt: e.target.value })}
                  />
                </label>
                <label className={styles.lbl}>
                  Title
                  <input
                    className={styles.input}
                    value={m.title}
                    onChange={(e) => updateMood(m.id, { title: e.target.value })}
                  />
                </label>
                <label className={styles.lbl}>
                  Subtitle
                  <input
                    className={styles.input}
                    value={m.subtitle}
                    onChange={(e) => updateMood(m.id, { subtitle: e.target.value })}
                  />
                </label>
                <label className={`${styles.lbl} ${styles.full}`}>
                  Link (/shop or full URL)
                  <input
                    className={styles.input}
                    value={m.linkTo}
                    onChange={(e) => updateMood(m.id, { linkTo: e.target.value })}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.toolbar}>
        <button type="submit" className={styles.primary}>
          Save homepage
        </button>
      </div>
    </form>
  );
}
