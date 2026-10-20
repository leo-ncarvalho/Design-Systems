/* Data formatting that survives real names, real counts and real languages. */

const seg = typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter(undefined, { granularity: "grapheme" }) : null;

function firstGrapheme(word: string): string {
  if (seg) {
    const it = seg.segment(word)[Symbol.iterator]().next();
    return it.done ? "" : it.value.segment;
  }
  return Array.from(word)[0] ?? "";
}

/** Initials from grapheme clusters: first and last word, never half an emoji. Empty input returns "". */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  const a = firstGrapheme(words[0]);
  const b = words.length > 1 ? firstGrapheme(words[words.length - 1]) : "";
  return (a + b).toLocaleUpperCase();
}

/** 1284592 -> "1,3 mi" (locale aware), 999 -> "999". Never truncates the underlying number. */
export function compact(n: number, locale = "pt-BR"): string {
  return new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

/** "1 membro", "0 membros", "1.284 membros" through Intl.PluralRules. */
export function plural(n: number, one: string, other: string, locale = "pt-BR"): string {
  const rule = new Intl.PluralRules(locale).select(n);
  // CLDR files 0 under "one" in Portuguese, but "0 membro" reads wrong in UI copy.
  return `${new Intl.NumberFormat(locale).format(n)} ${rule === "one" && n !== 0 ? one : other}`;
}

/** Splits a file name or e-mail so the end (extension, domain) stays visible when the start is truncated. */
export function splitEnd(value: string, keep = 10): [string, string] {
  if (value.length <= keep * 2) return [value, ""];
  return [value.slice(0, value.length - keep), value.slice(-keep)];
}
