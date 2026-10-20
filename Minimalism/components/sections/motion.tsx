"use client";

import { useRef, useState } from "react";
import NumberFlow from "@number-flow/react";
import { toast } from "sonner";
import { Check, Copy, Heart, Minus, Plus, RotateCcw } from "@/components/icons";
import { Group, Section, Spec, Stage, Token } from "@/components/doc";
import { M3 } from "@/components/m3-lazy";
import { PopoverDemo } from "@/components/sections/extras";

function Like() {
  const [on, setOn] = useState(false);
  return (
    <button type="button" className={`like ${on ? "is-on" : ""}`} aria-pressed={on} aria-label="Curtir" onClick={() => setOn((v) => !v)}>
      <Heart size={22} fill={on ? "currentColor" : "none"} aria-hidden />
    </button>
  );
}

function CopyButton() {
  const [done, setDone] = useState(false);
  const t = useRef<number | undefined>(undefined);
  return (
    <button
      type="button"
      className="ds-btn-quiet copy"
      onClick={() => {
        void navigator.clipboard?.writeText("npm i sonner").catch(() => undefined);
        setDone(true);
        window.clearTimeout(t.current);
        t.current = window.setTimeout(() => setDone(false), 1600);
      }}
    >
      <span className="copy__icons" aria-hidden>
        <Copy size={16} className={done ? "is-out" : ""} />
        <Check size={16} className={done ? "" : "is-out"} />
      </span>
      <span aria-live="polite">{done ? "Copiado" : "Copiar comando"}</span>
    </button>
  );
}

function Counter() {
  const [n, setN] = useState(7);
  return (
    <div className="counter">
      <md-icon-button aria-label="Diminuir" onClick={() => setN((v) => Math.max(0, v - 1))}><Minus size={18} aria-hidden /></md-icon-button>
      {/* NumberFlow animates per digit, stays interruptible and honors prefers-reduced-motion. */}
      <output className="counter__value tnum" aria-live="polite" aria-label={`Quantidade: ${n}`}>
        <NumberFlow value={n} locales="pt-BR" />
      </output>
      <md-icon-button aria-label="Aumentar" onClick={() => setN((v) => v + 1)}><Plus size={18} aria-hidden /></md-icon-button>
    </div>
  );
}

function Draw() {
  const [k, setK] = useState(0);
  return (
    <div className="draw">
      <svg key={k} viewBox="0 0 52 52" width="52" height="52" role="img" aria-label="Concluído">
        <circle className="draw__ring" cx="26" cy="26" r="23" fill="none" strokeWidth="2.5" />
        <path className="draw__tick" d="M15 27l8 8 14-16" fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <md-text-button onClick={() => setK((v) => v + 1)}><RotateCcw slot="icon" size={16} aria-hidden />Repetir</md-text-button>
    </div>
  );
}

function Shake() {
  const [bad, setBad] = useState(0);
  const [v, setV] = useState("");
  return (
    <div className="shake-demo">
      <div key={bad} className={bad ? "shake" : ""}>
        <md-outlined-text-field label="Código" value={v} error={bad > 0 && !/^\d{4}$/.test(v) || undefined} error-text={bad > 0 && !/^\d{4}$/.test(v) ? "O código tem 4 dígitos" : ""} onInput={(e: React.FormEvent) => setV((e.target as unknown as { value: string }).value)} />
      </div>
      <md-filled-tonal-button onClick={() => { if (!/^\d{4}$/.test(v)) setBad((n) => n + 1); else toast.success("Código válido"); }}>Verificar</md-filled-tonal-button>
    </div>
  );
}

function Stagger() {
  const [k, setK] = useState(0);
  return (
    <div>
      <ul key={k} className="stagger">
        {["Briefing", "Wireframes", "Protótipo", "Revisão", "Entrega"].map((s, i) => (
          <li key={s} className="stagger__item" style={{ ["--i" as string]: i }}>{s}</li>
        ))}
      </ul>
      <md-text-button onClick={() => setK((v) => v + 1)}><RotateCcw slot="icon" size={16} aria-hidden />Repetir</md-text-button>
    </div>
  );
}

function SlidingTabs() {
  const [i, setI] = useState(0);
  const labels = ["Hoje", "Semana", "Mês", "Ano"];
  return (
    <div className="slide-tabs" role="tablist" aria-label="Período" style={{ ["--n" as string]: labels.length, ["--i" as string]: i }}>
      <span className="slide-tabs__pill" aria-hidden />
      {labels.map((l, k) => (
        <button key={l} type="button" role="tab" aria-selected={i === k} tabIndex={i === k ? 0 : -1} onClick={() => setI(k)}
          onKeyDown={(e) => {
            const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
            if (!dir) return;
            const next = (i + dir + labels.length) % labels.length;
            setI(next);
            (e.currentTarget.parentElement?.querySelectorAll("button")[next] as HTMLElement | undefined)?.focus();
          }}>
          {l}
        </button>
      ))}
    </div>
  );
}

export function Motion() {
  return (
    <Section id="motion" title="Movimento e microinterações" lead="Animação explica causa e efeito. Curtas, a partir de estados já visíveis, e todas desligadas ou reduzidas com prefers-reduced-motion.">
      <M3 groups={["buttons", "fields"]} />
      <Group title="Princípios">
        <ul className="rules">
          <li><strong>Frequência decide.</strong> Ações repetidas centenas de vezes por dia (atalhos, trocas de aba) não animam, ou animam em menos de 100ms.</li>
          <li><strong>Ease-out para resposta.</strong> <Token>--ds-ease-out</Token> nas interações; ease-in nunca, parece lento.</li>
          <li><strong>Nunca parta de escala 0.</strong> Entradas começam em 0.95 com opacidade, e a origem fica no gatilho.</li>
          <li><strong>Só propriedades baratas.</strong> transform, opacity e, com cuidado, clip-path e filter. Nunca largura ou altura (exceto via grid-rows).</li>
          <li><strong>Interrompível.</strong> Transições CSS (não keyframes) para estados que o usuário pode reverter no meio.</li>
        </ul>
      </Group>
      <Group title="Microinterações" note="Clique, foque ou use o teclado em cada uma. Pressionado: escala 0.97 em 100ms.">
        <Stage>
          <Spec name="Pressionar"><md-filled-tonal-button className="press-demo">Pressione e segure</md-filled-tonal-button></Spec>
          <Spec name="Curtir (pop com mola leve)"><Like /></Spec>
          <Spec name="Ícone que se transforma"><CopyButton /></Spec>
          <Spec name="Contador (dígitos rolam)"><Counter /></Spec>
          <Spec name="Sucesso desenhado"><Draw /></Spec>
          <Spec name="Erro (balanço curto)"><Shake /></Spec>
          <Spec name="Indicador deslizante"><SlidingTabs /></Spec>
          <Spec name="Popover com origem no gatilho"><PopoverDemo /></Spec>
          <Spec name="Entrada escalonada (40ms)"><Stagger /></Spec>
        </Stage>
      </Group>
      <Group title="Duração por tipo" note="Valores usados no sistema.">
        <div className="table-wrap" tabIndex={0} role="region" aria-label="Durações, rolável">
        <table className="table table--compact">
          <thead><tr><th scope="col">Tipo</th><th scope="col" className="num">Duração</th><th scope="col">Curva</th></tr></thead>
          <tbody>
            {[
              ["Pressionar, hover, toggle", "100–160ms", "ds-ease-out"],
              ["Tooltip, menu, popover", "150–200ms", "ds-ease-out"],
              ["Diálogo, bottom sheet (entrada)", "250–400ms", "emphasized-decelerate"],
              ["Diálogo, sheet (saída)", "150–250ms", "emphasized-accelerate"],
              ["Troca de tema", "300ms", "standard"],
              ["Acordeão", "250ms", "standard"],
              ["Shimmer de esqueleto", "1600ms (loop)", "linear"],
            ].map(([a, b, c]) => (
              <tr key={a}><th scope="row">{a}</th><td className="num tnum">{b}</td><td><Token>{c}</Token></td></tr>
            ))}
          </tbody>
        </table>
        </div>
      </Group>
    </Section>
  );
}
