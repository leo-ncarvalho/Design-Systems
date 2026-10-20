"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * Hold to confirm. Pressing fills slowly (deliberate); releasing snaps back fast (the system responds).
 * Works with pointer, touch and keyboard (hold Space or Enter), and says so to assistive technology.
 */
export function HoldButton({ children, onConfirm, ms = 1200 }: { children: React.ReactNode; onConfirm: () => void; ms?: number }) {
  const [holding, setHolding] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const hint = useId();

  const start = () => {
    if (holding) return;
    setHolding(true);
    timer.current = window.setTimeout(() => { setHolding(false); onConfirm(); }, ms);
  };
  const cancel = () => { window.clearTimeout(timer.current); setHolding(false); };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <>
      <button
        type="button"
        className={`hold ${holding ? "is-holding" : ""}`}
        style={{ ["--hold-ms" as string]: `${ms}ms` }}
        aria-describedby={hint}
        onPointerDown={(e) => { if (e.button === 0) start(); }}
        onPointerUp={cancel}
        onPointerLeave={cancel}
        onPointerCancel={cancel}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={(e) => { if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); start(); } }}
        onKeyUp={(e) => { if (e.key === " " || e.key === "Enter") cancel(); }}
        onBlur={cancel}
      >
        {/* The filled layer carries its own copy of the label, so text flips color exactly where the fill has reached. */}
        <span className="hold__fill" aria-hidden><span className="hold__label hold__label--on">{children}</span></span>
        <span className="hold__label">{children}</span>
      </button>
      <span id={hint} className="sr-only">Mantenha pressionado por {(ms / 1000).toLocaleString("pt-BR")} segundos para confirmar. Solte para cancelar.</span>
    </>
  );
}
