"use client";

import { useId, useRef, useState } from "react";
import { useElementEvent } from "@/components/m3-react";

/**
 * Non-modal popover on the native Popover API: light dismiss, Esc, top layer and
 * focus return to the trigger come from the platform. Positioned under the trigger.
 */
export function Popover({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  const id = useId();
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useElementEvent<Event & { newState?: string }>(panel, "toggle", (e) => {
    const isOpen = e.newState === "open";
    setOpen(isOpen);
    const t = trigger.current, p = panel.current;
    if (isOpen && t && p) {
      const r = t.getBoundingClientRect();
      const w = p.offsetWidth;
      const left = Math.max(8, Math.min(r.left, window.innerWidth - w - 8));
      p.style.left = `${left}px`;
      p.style.top = `${r.bottom + 8}px`;
      // Origin-aware: the panel grows from the trigger, not from its own corner.
      p.style.transformOrigin = `${r.left + r.width / 2 - left}px 0`;
    }
  });

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="ds-btn ds-btn--outlined"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={id}
        onClick={() => panel.current?.togglePopover()}
      >
        {label}
      </button>
      <div ref={panel} id={id} popover="auto" className={`popover ${className}`}>
        {children}
      </div>
    </>
  );
}
