function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return base || "item";
}

export function uniqueSlug(name: string, existing: Set<string>): string {
  let s = slugify(name);
  if (!existing.has(s)) return s;
  let n = 2;
  while (existing.has(`${s}-${n}`)) n += 1;
  return `${s}-${n}`;
}
