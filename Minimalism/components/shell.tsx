"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "@/components/icons";
import { useTheme, type Preference } from "@/components/providers";

export const NAV = [
  { id: "foundations", label: "Fundamentos" },
  { id: "actions", label: "Ações" },
  { id: "inputs", label: "Entradas" },
  { id: "navigation", label: "Navegação" },
  { id: "containment", label: "Contenção" },
  { id: "feedback", label: "Feedback" },
  { id: "motion", label: "Movimento" },
  { id: "accessibility", label: "Acessibilidade" },
  { id: "responsive", label: "Responsividade" },
] as const;

const PREFS: { value: Preference; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Tema claro", Icon: Sun },
  { value: "system", label: "Tema do sistema", Icon: Monitor },
  { value: "dark", label: "Tema escuro", Icon: Moon },
];

/** Three-way theme choice as a radio group: arrow keys move and select, one tab stop. */
export function ThemeToggle() {
  const { preference, setPreference } = useTheme();
  const move = (e: React.KeyboardEvent, i: number) => {
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (i + dir + PREFS.length) % PREFS.length;
    setPreference(PREFS[next].value);
    (e.currentTarget.parentElement?.children[next] as HTMLElement | undefined)?.focus();
  };
  return (
    <div className="theme-toggle" role="radiogroup" aria-label="Tema">
      {PREFS.map(({ value, label, Icon }, i) => (
        <button key={value} type="button" role="radio" aria-checked={preference === value} aria-label={label} title={label}
          tabIndex={preference === value ? 0 : -1} onClick={() => setPreference(value)} onKeyDown={(e) => move(e, i)}>
          <Icon size={18} aria-hidden />
        </button>
      ))}
    </div>
  );
}

export function SideNav() {
  const [active, setActive] = useState<string>(NAV[0].id);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (vis) setActive(vis.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    NAV.forEach((n) => { const el = document.getElementById(n.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return (
    <nav className="sidenav" aria-label="Seções">
      <ul>
        {NAV.map((n) => (
          <li key={n.id}>
            <a href={`#${n.id}`} aria-current={active === n.id ? "location" : undefined}>{n.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
