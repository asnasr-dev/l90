import styles from "./Stars.module.css";

export function Stars({ value, size = "md" }: { value: number; size?: "sm" | "md" }) {
  const full = Math.round(Math.min(5, Math.max(0, value)));
  return (
    <span
      className={`${styles.wrap} ${size === "sm" ? styles.sm : ""}`}
      aria-label={`${full} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < full ? styles.on : styles.off}>
          ★
        </span>
      ))}
    </span>
  );
}

export function averageRating(ratings: number[]): number {
  if (!ratings.length) return 0;
  return ratings.reduce((a, b) => a + b, 0) / ratings.length;
}
