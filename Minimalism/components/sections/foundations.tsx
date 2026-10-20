"use client";

import { useEffect, useState } from "react";
import { Group, Section, Stage, Spec, Token } from "@/components/doc";
import { useTheme } from "@/components/providers";
import { contrast, readVar } from "@/lib/color";
import { Play } from "@/components/icons";

const PAIRS: { name: string; bg: string; fg: string }[] = [
  { name: "primary", bg: "primary", fg: "on-primary" },
  { name: "primary-container", bg: "primary-container", fg: "on-primary-container" },
  { name: "secondary-container", bg: "secondary-container", fg: "on-secondary-container" },
  { name: "tertiary", bg: "tertiary", fg: "on-tertiary" },
  { name: "tertiary-container", bg: "tertiary-container", fg: "on-tertiary-container" },
  { name: "error", bg: "error", fg: "on-error" },
  { name: "error-container", bg: "error-container", fg: "on-error-container" },
  { name: "surface", bg: "surface", fg: "on-surface" },
  { name: "surface-variant", bg: "surface-variant", fg: "on-surface-variant" },
  { name: "inverse-surface", bg: "inverse-surface", fg: "inverse-on-surface" },
];
const SURFACES = ["surface-container-lowest", "surface-container-low", "surface-container", "surface-container-high", "surface-container-highest"];
const EXTENDED = [
  { name: "success", bg: "--ds-color-success", fg: "--ds-color-on-success" },
  { name: "success-container", bg: "--ds-color-success-container", fg: "--ds-color-on-success-container" },
  { name: "warning", bg: "--ds-color-warning", fg: "--ds-color-on-warning" },
  { name: "warning-container", bg: "--ds-color-warning-container", fg: "--ds-color-on-warning-container" },
];

const sysVar = (n: string) => `--md-sys-color-${n}`;

function useHexes(vars: string[]) {
  const { theme } = useTheme();
  const [hex, setHex] = useState<Record<string, string>>({});
  useEffect(() => {
    const id = requestAnimationFrame(() => setHex(Object.fromEntries(vars.map((v) => [v, readVar(v)]))));
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);
  return hex;
}

function ColorRoles() {
  const vars = [
    ...PAIRS.flatMap((p) => [sysVar(p.bg), sysVar(p.fg)]),
    ...SURFACES.map(sysVar),
    sysVar("on-surface"), sysVar("outline"), sysVar("outline-variant"), sysVar("surface"),
    ...EXTENDED.flatMap((p) => [p.bg, p.fg]),
  ];
  const hex = useHexes(vars);
  const ratio = (a: string, b: string) => {
    const r = hex[a] && hex[b] ? contrast(hex[a], hex[b]) : null;
    return r ? r.toFixed(1) : "…";
  };
  return (
    <>
      <ul className="swatches" aria-label="Pares de cor (fundo e conteúdo)">
        {PAIRS.map((p) => (
          <li key={p.name} className="swatch" style={{ background: `var(${sysVar(p.bg)})`, color: `var(${sysVar(p.fg)})` }}>
            <span className="swatch__name">{p.name}</span>
            <span className="swatch__meta mono tnum">{hex[sysVar(p.bg)] ?? ""} · {ratio(sysVar(p.bg), sysVar(p.fg))}:1</span>
          </li>
        ))}
      </ul>
      <Group title="Superfícies e contornos" note="Elevação é comunicada por tom, não por sombra. Sombras só aparecem em camadas flutuantes.">
        <ul className="swatches swatches--row">
          {SURFACES.map((s) => (
            <li key={s} className="swatch swatch--outlined" style={{ background: `var(${sysVar(s)})`, color: "var(--md-sys-color-on-surface)" }}>
              <span className="swatch__name">{s.replace("surface-", "")}</span>
              <span className="swatch__meta mono tnum">{hex[sysVar(s)] ?? ""}</span>
            </li>
          ))}
          <li className="swatch swatch--outlined" style={{ background: "var(--md-sys-color-surface)", boxShadow: "inset 0 0 0 2px var(--md-sys-color-outline)", color: "var(--md-sys-color-on-surface)" }}>
            <span className="swatch__name">outline</span>
            <span className="swatch__meta mono tnum">{hex[sysVar("outline")] ?? ""} · {ratio(sysVar("outline"), sysVar("surface"))}:1</span>
          </li>
          <li className="swatch swatch--outlined" style={{ background: "var(--md-sys-color-surface)", boxShadow: "inset 0 0 0 2px var(--md-sys-color-outline-variant)", color: "var(--md-sys-color-on-surface)" }}>
            <span className="swatch__name">outline-variant</span>
            <span className="swatch__meta mono tnum">{hex[sysVar("outline-variant")] ?? ""}</span>
          </li>
        </ul>
      </Group>
      <Group title="Papéis estendidos" note="Sucesso e aviso seguem a mesma estrutura cor/container do M3. Nunca comunique estado só por cor: acompanhe sempre com ícone e texto.">
        <ul className="swatches swatches--row">
          {EXTENDED.map((p) => (
            <li key={p.name} className="swatch" style={{ background: `var(${p.bg})`, color: `var(${p.fg})` }}>
              <span className="swatch__name">{p.name}</span>
              <span className="swatch__meta mono tnum">{hex[p.bg] ?? ""} · {ratio(p.bg, p.fg)}:1</span>
            </li>
          ))}
        </ul>
      </Group>
    </>
  );
}

const SCALE: { role: string; sample: string }[] = [
  { role: "display-large", sample: "Quietude" },
  { role: "display-medium", sample: "Quietude" },
  { role: "display-small", sample: "Quietude" },
  { role: "headline-large", sample: "Cada elemento merece seu lugar" },
  { role: "headline-medium", sample: "Cada elemento merece seu lugar" },
  { role: "headline-small", sample: "Cada elemento merece seu lugar" },
  { role: "title-large", sample: "Configuração da conta" },
  { role: "title-medium", sample: "Configuração da conta" },
  { role: "title-small", sample: "Configuração da conta" },
  { role: "body-large", sample: "O texto corrido mantém de 65 a 75 caracteres por linha." },
  { role: "body-medium", sample: "O texto corrido mantém de 65 a 75 caracteres por linha." },
  { role: "body-small", sample: "O texto corrido mantém de 65 a 75 caracteres por linha." },
  { role: "label-large", sample: "Salvar alterações" },
  { role: "label-medium", sample: "Salvar alterações" },
  { role: "label-small", sample: "Salvar alterações" },
];

function TypeScale() {
  return (
    <div className="typescale" role="table" aria-label="Escala tipográfica">
      {SCALE.map((s) => {
        const v = (k: string) => `var(--md-sys-typescale-${s.role}-${k})`;
        return (
          <div className="typescale__row" role="row" key={s.role}>
            <span className="typescale__role mono" role="cell">{s.role}</span>
            <span
              role="cell"
              className="typescale__sample"
              style={{ fontSize: v("size"), lineHeight: v("line-height"), letterSpacing: v("tracking"), fontWeight: `var(--md-sys-typescale-${s.role}-weight)` }}
            >
              {s.sample}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function MotionDemo() {
  const [run, setRun] = useState(0);
  const curves = [
    { name: "ds-ease-out", css: "var(--ds-ease-out)", use: "Resposta a toque (padrão da UI)" },
    { name: "standard", css: "var(--md-sys-motion-easing-standard)", use: "Mudanças dentro da tela" },
    { name: "emphasized-decelerate", css: "var(--md-sys-motion-easing-emphasized-decelerate)", use: "Entradas (sheets, diálogos)" },
    { name: "emphasized-accelerate", css: "var(--md-sys-motion-easing-emphasized-accelerate)", use: "Saídas" },
    { name: "linear", css: "linear", use: "Apenas progresso e shimmer" },
  ];
  return (
    <div className="motion-demo">
      <button type="button" className="ds-btn-quiet" onClick={() => setRun((n) => n + 1)}>
        <Play size={16} aria-hidden /> Reproduzir curvas
      </button>
      <ul>
        {curves.map((c) => (
          <li key={c.name}>
            <div className="motion-demo__meta">
              <Token>{c.name}</Token>
              <span>{c.use}</span>
            </div>
            <div className="motion-demo__track" aria-hidden>
              <span key={run} className="motion-demo__dot" style={{ animationTimingFunction: c.css }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const SHAPES: [string, string][] = [
  ["none", "0"], ["extra-small", "4"], ["small", "8"], ["medium", "12"], ["large", "16"], ["extra-large", "28"], ["full", "9999"],
];
const ELEVS: [string, string][] = [
  ["0 · plano", "none"], ["1 · cartão elevado", "var(--ds-elev-1)"], ["2 · menu", "var(--ds-elev-2)"], ["3 · FAB, snackbar", "var(--ds-elev-3)"], ["4 · diálogo", "var(--ds-elev-4)"],
];
const SPACE_PX = [4, 8, 12, 16, 24, 32, 48, 64, 96];

export function Foundations() {
  return (
    <Section id="foundations" title="Fundamentos" lead="Cor, tipografia, forma, elevação, espaçamento e movimento. Tudo o que a interface usa vem destes tokens.">
      <Group title="Cor" note="Esquema quase monocromático: tinta e superfícies neutras com um único acento (azul-cobalto) reservado a foco, links, seleção e progresso. A razão de contraste é medida ao vivo no tema atual.">
        <ColorRoles />
      </Group>
      <Group title="Tipografia" note="Geist para interface, Geist Mono para código, dados e tokens. Pesos 400 e 500 apenas; o tracking negativo cresce com o tamanho.">
        <TypeScale />
      </Group>
      <Group title="Forma" note="Sete degraus de raio. Componentes pequenos usam raios menores, superfícies grandes usam maiores. Botões e chips são completos (full).">
        <Stage>
          {SHAPES.map(([n, px]) => (
            <Spec key={n} name={`${n} · ${px === "9999" ? "∞" : px + "px"}`}>
              <span className="shape-chip" style={{ borderRadius: `var(--md-sys-shape-corner-${n})` }} />
            </Spec>
          ))}
        </Stage>
      </Group>
      <Group title="Elevação" note="Cinco níveis. Em repouso o sistema prefere contorno e tom; a sombra marca o que flutua (menus, diálogos, toasts).">
        <Stage>
          {ELEVS.map(([n, sh]) => (
            <Spec key={n} name={n}>
              <span className="elev-tile" style={{ boxShadow: sh }} />
            </Spec>
          ))}
        </Stage>
      </Group>
      <Group title="Espaçamento" note="Base de 4px. Agrupe perto, separe com folga; mais espaço acima de um título do que abaixo.">
        <ul className="space-scale">
          {SPACE_PX.map((px, i) => (
            <li key={px}>
              <Token>--ds-space-{i + 1}</Token>
              <span className="space-scale__bar" style={{ width: `var(--ds-space-${i + 1})` }} />
              <span className="tnum mono">{px}px</span>
            </li>
          ))}
        </ul>
      </Group>
      <Group title="Movimento" note="Respostas a toque em 100–200ms com ease-out forte; entradas em 250–400ms; nada acima de 500ms. Só transform, opacity e propriedades baratas animam.">
        <MotionDemo />
      </Group>
    </Section>
  );
}
