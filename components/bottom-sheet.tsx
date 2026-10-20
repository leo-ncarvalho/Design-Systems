"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const DISMISS_DISTANCE = 120; // px
const DISMISS_VELOCITY = 0.11; // px per ms, from the animate skill: a flick is enough
const RUBBER = 0.55;

/** The further past the top edge, the less the sheet follows. */
function rubberband(over: number, dimension: number) {
  return (over * dimension * RUBBER) / (dimension + RUBBER * Math.abs(over));
}

/** Reads the live on-screen offset so an interrupted animation continues from where it is, not from its target. */
function presentedY(el: HTMLElement) {
  const t = getComputedStyle(el).transform;
  return t && t !== "none" ? new DOMMatrixReadOnly(t).m42 : 0;
}

/**
 * Bottom sheet on the native dialog. Enter and exit are CSS transitions (interruptible, same edge in and out).
 * Dragging the header tracks the pointer 1:1, resists upward with rubber banding, and dismisses on distance or velocity.
 */
export function BottomSheet() {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const drag = useRef<{ id: number; grab: number; startY: number; t0: number; y: number } | null>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const clear = (el: HTMLElement) => { el.style.transform = ""; el.style.transition = ""; el.classList.remove("is-dragging"); };

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const sheet = ref.current;
    if (!sheet || drag.current) return; // ignore extra touch points once a drag has begun
    e.currentTarget.setPointerCapture(e.pointerId);
    const y = presentedY(sheet);
    sheet.style.transition = "none";
    sheet.style.transform = `translateY(${y}px)`;
    sheet.classList.add("is-dragging");
    drag.current = { id: e.pointerId, grab: e.clientY - y, startY: y, t0: performance.now(), y };
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = drag.current, sheet = ref.current;
    if (!s || !sheet || e.pointerId !== s.id) return;
    let y = e.clientY - s.grab;
    if (y < 0) y = -rubberband(-y, 160);
    s.y = y;
    sheet.style.transform = `translateY(${y}px)`;
  };

  const onUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = drag.current, sheet = ref.current;
    if (!s || !sheet || e.pointerId !== s.id) return;
    drag.current = null;
    const moved = s.y - s.startY;
    const velocity = Math.abs(moved) / Math.max(1, performance.now() - s.t0);
    const dismiss = moved > 0 && (moved > DISMISS_DISTANCE || velocity > DISMISS_VELOCITY);
    sheet.classList.remove("is-dragging");
    if (dismiss) {
      sheet.style.transition = "transform 200ms var(--ds-ease-out)";
      sheet.style.transform = "translateY(100%)";
      sheet.addEventListener("transitionend", () => { setOpen(false); }, { once: true });
    } else {
      sheet.style.transition = "transform 320ms var(--ds-ease-drawer)";
      sheet.style.transform = "translateY(0)";
      sheet.addEventListener("transitionend", () => clear(sheet), { once: true });
    }
  };

  return (
    <>
      <md-filled-tonal-button onClick={() => setOpen(true)}>Abrir bottom sheet</md-filled-tonal-button>
      <dialog
        ref={ref}
        className="sheet"
        aria-labelledby="sheet-title"
        onClose={() => { if (ref.current) clear(ref.current); setOpen(false); }}
        onClick={(e) => { if (e.target === ref.current) setOpen(false); }}
      >
        <div className="sheet__grab" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
          <div className="sheet__handle" aria-hidden />
          <h4 id="sheet-title">Compartilhar</h4>
        </div>
        <p>Escolha como enviar este arquivo. Arraste o topo para baixo, toque fora ou pressione Esc para fechar.</p>
        <div className="sheet__actions">
          <md-text-button onClick={() => { setOpen(false); toast("Link copiado"); }}>Copiar link</md-text-button>
          <md-filled-button onClick={() => { setOpen(false); toast.success("Convite enviado"); }}>Enviar convite</md-filled-button>
        </div>
      </dialog>
    </>
  );
}
