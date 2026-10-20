"use client";

import { useEffect, useRef } from "react";

/* Material web components load by group, only when their section nears the viewport. */
const GROUPS = {
  buttons: async () => {
    await Promise.all([
      import("@material/web/button/elevated-button.js"),
      import("@material/web/button/filled-button.js"),
      import("@material/web/button/filled-tonal-button.js"),
      import("@material/web/button/outlined-button.js"),
      import("@material/web/button/text-button.js"),
      import("@material/web/fab/fab.js"),
      import("@material/web/iconbutton/filled-icon-button.js"),
      import("@material/web/iconbutton/filled-tonal-icon-button.js"),
      import("@material/web/iconbutton/icon-button.js"),
      import("@material/web/iconbutton/outlined-icon-button.js"),
      import("@material/web/labs/segmentedbutton/outlined-segmented-button.js"),
      import("@material/web/labs/segmentedbuttonset/outlined-segmented-button-set.js"),
      import("@material/web/progress/circular-progress.js"),
    ]);
  },
  chips: async () => {
    await Promise.all([
      import("@material/web/chips/assist-chip.js"),
      import("@material/web/chips/chip-set.js"),
      import("@material/web/chips/filter-chip.js"),
      import("@material/web/chips/input-chip.js"),
      import("@material/web/chips/suggestion-chip.js"),
    ]);
  },
  fields: async () => {
    await Promise.all([
      import("@material/web/textfield/filled-text-field.js"),
      import("@material/web/textfield/outlined-text-field.js"),
      import("@material/web/select/filled-select.js"),
      import("@material/web/select/outlined-select.js"),
      import("@material/web/select/select-option.js"),
      import("@material/web/checkbox/checkbox.js"),
      import("@material/web/radio/radio.js"),
      import("@material/web/switch/switch.js"),
      import("@material/web/slider/slider.js"),
    ]);
  },
  nav: async () => {
    await Promise.all([
      import("@material/web/tabs/primary-tab.js"),
      import("@material/web/tabs/secondary-tab.js"),
      import("@material/web/tabs/tabs.js"),
      import("@material/web/list/list.js"),
      import("@material/web/list/list-item.js"),
      import("@material/web/menu/menu.js"),
      import("@material/web/menu/menu-item.js"),
      import("@material/web/divider/divider.js"),
      import("@material/web/labs/navigationbar/navigation-bar.js"),
      import("@material/web/labs/navigationtab/navigation-tab.js"),
    ]);
  },
  surfaces: async () => {
    await Promise.all([
      import("@material/web/dialog/dialog.js"),
      import("@material/web/divider/divider.js"),
      import("@material/web/labs/card/elevated-card.js"),
      import("@material/web/labs/card/filled-card.js"),
      import("@material/web/labs/card/outlined-card.js"),
    ]);
  },
  progress: async () => {
    await Promise.all([
      import("@material/web/progress/circular-progress.js"),
      import("@material/web/progress/linear-progress.js"),
    ]);
  },
} as const;

export type M3Group = keyof typeof GROUPS;
const loaded = new Set<M3Group>();

export function loadM3(...groups: M3Group[]) {
  return Promise.all(
    groups.filter((g) => !loaded.has(g)).map((g) => { loaded.add(g); return GROUPS[g](); }),
  );
}

/** Place inside a section: registers the groups when the section is within 800px of the viewport. */
export function M3({ groups }: { groups: M3Group[] }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const host = ref.current?.parentElement;
    if (!host) return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { void loadM3(...groups); io.disconnect(); }
    }, { rootMargin: "800px 0px" });
    io.observe(host);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <span ref={ref} hidden />;
}
