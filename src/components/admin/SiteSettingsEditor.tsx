import { FormEvent, useEffect, useState } from "react";
import { useSiteSettings } from "../../context/ProductsContext";
import type { SiteSettings } from "../../types";
import { fileToDataUrl } from "../../utils/files";
import styles from "./SiteSettingsEditor.module.css";

function newTermSection() {
  return { id: crypto.randomUUID(), title: "New section", body: "" };
}

export function SiteSettingsEditor() {
  const { site, saveSite } = useSiteSettings();
  const [draft, setDraft] = useState<SiteSettings>(site);
  const [busy, setBusy] = useState(false);

  useEffect(() => setDraft(site), [site]);

  function patch(p: Partial<SiteSettings>) {
    setDraft((d) => ({ ...d, ...p }));
  }

  async function onLogoFile(file: File | null) {
    if (!file) return;
    setBusy(true);
    try {
      const url = await fileToDataUrl(file);
      patch({ logoUrl: url, logoAlt: file.name || draft.logoAlt });
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    saveSite(draft);
  }

  function patchTerm(id: string, p: { title?: string; body?: string }) {
    setDraft((d) => ({
      ...d,
      termsSections: d.termsSections.map((s) => (s.id === id ? { ...s, ...p } : s)),
    }));
  }

  function addTermSection() {
    setDraft((d) => ({ ...d, termsSections: [...d.termsSections, newTermSection()] }));
  }

  function removeTermSection(id: string) {
    setDraft((d) => ({ ...d, termsSections: d.termsSections.filter((s) => s.id !== id) }));
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <section className={styles.section}>
        <h2 className={styles.h2}>Brand</h2>
        <div className={styles.grid2}>
          <label className={styles.lbl}>
            Brand name
            <input
              className={styles.input}
              value={draft.brandName}
              onChange={(e) => patch({ brandName: e.target.value })}
            />
          </label>
          <label className={styles.lbl}>
            Tagline (small text)
            <input
              className={styles.input}
              value={draft.brandTagline}
              onChange={(e) => patch({ brandTagline: e.target.value })}
            />
          </label>
          <label className={`${styles.lbl} ${styles.full}`}>
            Logo image URL (or upload below)
            <input
              className={styles.input}
              value={draft.logoUrl}
              onChange={(e) => patch({ logoUrl: e.target.value })}
              placeholder="https://… or data:image/…"
            />
          </label>
          <label className={styles.lbl}>
            Logo alt text
            <input
              className={styles.input}
              value={draft.logoAlt}
              onChange={(e) => patch({ logoAlt: e.target.value })}
            />
          </label>
          <label className={styles.lbl}>
            Upload logo (PNG/SVG/JPG)
            <input
              className={styles.input}
              type="file"
              accept="image/*"
              disabled={busy}
              onChange={(e) => void onLogoFile(e.target.files?.[0] ?? null)}
            />
          </label>
          {draft.logoUrl ? (
            <div className={`${styles.preview} ${styles.full}`}>
              <p className={styles.previewLbl}>Preview</p>
              <img className={styles.logoPreview} src={draft.logoUrl} alt={draft.logoAlt} />
            </div>
          ) : (
            <p className={`${styles.muted} ${styles.full}`}>
              No logo set yet. The default chrome mark will be shown.
            </p>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Contact info</h2>
        <div className={styles.grid2}>
          <label className={styles.lbl}>
            Email
            <input
              className={styles.input}
              value={draft.contactEmail}
              onChange={(e) => patch({ contactEmail: e.target.value })}
            />
          </label>
          <label className={styles.lbl}>
            Phone / WhatsApp
            <input
              className={styles.input}
              value={draft.contactPhone}
              onChange={(e) => patch({ contactPhone: e.target.value })}
            />
          </label>
          <label className={`${styles.lbl} ${styles.full}`}>
            Instagram URL
            <input
              className={styles.input}
              value={draft.contactInstagramUrl}
              onChange={(e) => patch({ contactInstagramUrl: e.target.value })}
            />
          </label>
          <label className={`${styles.lbl} ${styles.full}`}>
            Address
            <textarea
              className={styles.textarea}
              rows={3}
              value={draft.contactAddress}
              onChange={(e) => patch({ contactAddress: e.target.value })}
            />
          </label>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.h2}>Footer</h2>
        <div className={styles.grid2}>
          <label className={`${styles.lbl} ${styles.full}`}>
            Footer note text
            <input
              className={styles.input}
              value={draft.footerNote}
              onChange={(e) => patch({ footerNote: e.target.value })}
            />
          </label>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.h2}>Terms &amp; Policies page</h2>
          <button type="button" className={styles.smallBtn} onClick={addTermSection}>
            + Add section
          </button>
        </div>

        <label className={`${styles.lbl} ${styles.full}`}>
          Intro text (under title)
          <textarea
            className={styles.textarea}
            rows={3}
            value={draft.termsIntro}
            onChange={(e) => patch({ termsIntro: e.target.value })}
          />
        </label>

        <div className={styles.termList}>
          {draft.termsSections.map((s) => (
            <div key={s.id} className={styles.termCard}>
              <div className={styles.termTop}>
                <span className={styles.termLbl}>Section</span>
                <button
                  type="button"
                  className={styles.linkDanger}
                  onClick={() => removeTermSection(s.id)}
                >
                  Remove
                </button>
              </div>
              <label className={`${styles.lbl} ${styles.full}`}>
                Title
                <input
                  className={styles.input}
                  value={s.title}
                  onChange={(e) => patchTerm(s.id, { title: e.target.value })}
                />
              </label>
              <label className={`${styles.lbl} ${styles.full}`}>
                Body
                <textarea
                  className={styles.textarea}
                  rows={4}
                  value={s.body}
                  onChange={(e) => patchTerm(s.id, { body: e.target.value })}
                />
              </label>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.toolbar}>
        <button type="submit" className={styles.primary} disabled={busy}>
          Save site settings
        </button>
      </div>
    </form>
  );
}

