export function readVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function parse(hex: string): [number, number, number] | null {
  const m = hex.replace("#", "");
  if (m.length === 3) return [0, 1, 2].map((i) => parseInt(m[i] + m[i], 16)) as [number, number, number];
  if (m.length === 6) return [0, 2, 4].map((i) => parseInt(m.slice(i, i + 2), 16)) as [number, number, number];
  return null;
}

function lum([r, g, b]: [number, number, number]) {
  const f = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export function contrast(a: string, b: string): number | null {
  const pa = parse(a), pb = parse(b);
  if (!pa || !pb) return null;
  const la = lum(pa), lb = lum(pb);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
