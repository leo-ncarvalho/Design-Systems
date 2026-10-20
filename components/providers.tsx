"use client";

import { flushSync } from "react-dom";
import { ThemeProvider, useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { X } from "@/components/icons";

type Theme = "light" | "dark";
export type Preference = Theme | "system";

/**
 * Theme: next-themes (no flash on load, system tracking, storage with fallbacks).
 * Components keep one small API: `theme` is what is on screen, `preference` is what the user picked.
 */
export function useTheme() {
  const { theme, resolvedTheme, setTheme } = useNextTheme();
  const setPreference = (next: Preference) => {
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (doc.startViewTransition && !reduce) doc.startViewTransition(() => flushSync(() => setTheme(next)));
    else setTheme(next);
  };
  return {
    theme: (resolvedTheme === "dark" ? "dark" : "light") as Theme,
    preference: (theme ?? "system") as Preference,
    setPreference,
  };
}

/** Marks the last input modality so shadow-DOM controls can show keyboard-only focus rings. */
function useInputModality() {
  useEffect(() => {
    const root = document.documentElement;
    const kb = (e: KeyboardEvent) => {
      if (e.key === "Tab" || e.key.startsWith("Arrow") || e.key === " " || e.key === "Enter") root.dataset.input = "keyboard";
    };
    const ptr = () => { root.dataset.input = "pointer"; };
    window.addEventListener("keydown", kb, true);
    window.addEventListener("pointerdown", ptr, true);
    return () => { window.removeEventListener("keydown", kb, true); window.removeEventListener("pointerdown", ptr, true); };
  }, []);
}

function ToasterWithTheme() {
  const { resolvedTheme } = useNextTheme();
  // Theme is unknown on the server and on first paint; Sonner reads it only once mounted.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <Toaster
      theme={mounted && resolvedTheme === "dark" ? "dark" : "light"}
      position="bottom-right"
      closeButton
      gap={10}
      visibleToasts={4}
      offset={24}
      mobileOffset={{ bottom: "calc(16px + env(safe-area-inset-bottom, 0px))", left: 16, right: 16, top: "calc(16px + env(safe-area-inset-top, 0px))" }}
      icons={{ close: <X size={16} strokeWidth={2.4} aria-hidden /> }}
      toastOptions={{ classNames: { toast: "ds-toast" } }}
    />
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  useInputModality();
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem storageKey="ds-theme" disableTransitionOnChange={false}>
      {children}
      <ToasterWithTheme />
    </ThemeProvider>
  );
}
