"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Group, Section, Spec, Stage, Token } from "@/components/doc";
import { M3 } from "@/components/m3-lazy";
import { useTheme } from "@/components/providers";
import { contrast, readVar } from "@/lib/color";

const CHECKS: [string, string, string][] = [
  ["Contraste", "Texto 4.5:1, texto grande e componentes 3:1, medido nos dois temas (veja Fundamentos).", "WCAG 1.4.3, 1.4.11"],
  ["Foco visível", "Anel de 2px, offset de 2px, cor de acento. Aparece só por teclado (:focus-visible).", "WCAG 2.4.7, 2.4.11"],
  ["Alvos de toque", "48×48px para ações primárias; mínimo absoluto de 24px com espaço.", "WCAG 2.5.8"],
  ["Teclado", "Tudo operável por teclado; ordem do DOM = ordem visual; sem armadilhas de foco.", "WCAG 2.1.1, 2.1.2"],
  ["Nomes e papéis", "Todo controle tem nome acessível; botões de ícone usam aria-label.", "WCAG 4.1.2"],
  ["Estado sem cor", "Erro, sucesso e seleção sempre trazem ícone ou texto além de cor.", "WCAG 1.4.1"],
  ["Anúncios", "Toasts e erros usam regiões aria-live; erros de formulário vão a um resumo focável.", "WCAG 4.1.3"],
  ["Movimento", "prefers-reduced-motion elimina deslocamento e mantém mudanças de estado.", "WCAG 2.3.3"],
  ["Zoom e reflow", "Funciona a 400% e a 320px de largura sem rolagem horizontal da página.", "WCAG 1.4.10"],
  ["Idioma", "lang definido no documento; números tabulares em dados.", "WCAG 3.1.1"],
];

function ContrastTable() {
  const { theme } = useTheme();
  const [rows, setRows] = useState<{ n: string; fg: string; bg: string; min: number; v: number | null }[]>([]);
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const pairs: [string, string, string, number][] = [
        ["on-surface sobre surface", "--md-sys-color-on-surface", "--md-sys-color-surface", 4.5],
        ["on-surface-variant sobre surface", "--md-sys-color-on-surface-variant", "--md-sys-color-surface", 4.5],
        ["on-surface-variant sobre container-high", "--md-sys-color-on-surface-variant", "--md-sys-color-surface-container-high", 4.5],
        ["on-primary sobre primary", "--md-sys-color-on-primary", "--md-sys-color-primary", 4.5],
        ["tertiary (links) sobre surface", "--md-sys-color-tertiary", "--md-sys-color-surface", 4.5],
        ["error sobre surface", "--md-sys-color-error", "--md-sys-color-surface", 4.5],
        ["on-error-container sobre error-container", "--md-sys-color-on-error-container", "--md-sys-color-error-container", 4.5],
        ["success sobre surface", "--ds-color-success", "--md-sys-color-surface", 4.5],
        ["warning sobre surface", "--ds-color-warning", "--md-sys-color-surface", 4.5],
        ["outline (contorno de campo) sobre surface", "--md-sys-color-outline", "--md-sys-color-surface", 3],
        ["tertiary (anel de foco) sobre surface", "--md-sys-color-tertiary", "--md-sys-color-surface", 3],
      ];
      setRows(pairs.map(([n, f, b, min]) => { const fg = readVar(f), bg = readVar(b); return { n, fg, bg, min, v: contrast(fg, bg) }; }));
    });
    return () => cancelAnimationFrame(id);
  }, [theme]);
  return (
    <div className="table-wrap" tabIndex={0} role="region" aria-label="Contrastes medidos, rolável">
      <table className="table table--compact">
        <caption className="sr-only">Razões de contraste no tema ativo</caption>
        <thead><tr><th scope="col">Par</th><th scope="col" className="num">Razão</th><th scope="col" className="num">Mínimo</th><th scope="col">Resultado</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.n}>
              <th scope="row">{r.n}</th>
              <td className="num tnum mono">{r.v ? r.v.toFixed(2) : "…"}:1</td>
              <td className="num tnum">{r.min}:1</td>
              <td>{r.v && r.v >= r.min ? <span className="badge badge--success">Passa</span> : <span className="badge badge--error">Falha</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LiveRegion() {
  const [msg, setMsg] = useState("");
  return (
    <div className="inline">
      <md-outlined-button onClick={() => setMsg(`Item adicionado às ${new Date().toLocaleTimeString("pt-BR")}`)}>Anunciar mudança</md-outlined-button>
      <p role="status" aria-live="polite" className="live-out">{msg || "Região aria-live vazia"}</p>
    </div>
  );
}

function Targets() {
  return (
    <div className="inline">
      <div className="target"><md-icon-button aria-label="Exemplo"><span className="target__dot" /></md-icon-button><span>48px de alvo, ícone de 24px</span></div>
      <div className="target target--bad"><span className="tiny" aria-hidden /><span>Evite: 16px sem espaço</span></div>
    </div>
  );
}

export function Quality() {
  return (
    <Section id="accessibility" title="Acessibilidade" lead="Regras do sistema, não retoques finais. Alvo: WCAG 2.2 AA em ambos os temas.">
      <M3 groups={["buttons", "nav"]} />
      <Group title="Contraste medido" note="Calculado em tempo real a partir dos tokens do tema ativo. Alterne o tema e a tabela é recalculada.">
        <ContrastTable />
      </Group>
      <Group title="Regras">
        <div className="table-wrap">
          <table className="table table--compact">
            <thead><tr><th scope="col">Regra</th><th scope="col">Como o sistema atende</th><th scope="col">Critério</th></tr></thead>
            <tbody>{CHECKS.map(([a, b, c]) => (<tr key={a}><th scope="row">{a}</th><td>{b}</td><td><Token>{c}</Token></td></tr>))}</tbody>
          </table>
        </div>
      </Group>
      <Group title="Demonstrações">
        <Stage>
          <Spec name="Foco: pressione Tab nesta linha">
            <div className="inline"><md-filled-button>Primeiro</md-filled-button><md-outlined-button>Segundo</md-outlined-button><md-text-button>Terceiro</md-text-button><a href="#accessibility">Link</a></div>
          </Spec>
          <Spec name="Alvo de toque"><Targets /></Spec>
          <Spec name="Anúncio para leitor de tela"><LiveRegion /></Spec>
          <Spec name="Toast acessível">
            <md-outlined-button onClick={() => toast.success("Salvo", { description: "Anunciado em região aria-live polida." })}>Disparar</md-outlined-button>
          </Spec>
        </Stage>
      </Group>
      <Group title="Atalhos de teclado" note="Padrões esperados em componentes compostos.">
        <div className="table-wrap">
          <table className="table table--compact">
            <thead><tr><th scope="col">Componente</th><th scope="col">Teclas</th></tr></thead>
            <tbody>
              {[
                ["Botões, chips, switches", "Enter / Espaço ativa"],
                ["Tabs e radios", "← → navegam, Tab sai do grupo"],
                ["Menu", "↑ ↓ navegam, Enter seleciona, Esc fecha"],
                ["Diálogo", "Tab circula, Esc fecha"],
                ["Slider", "← → um passo, Page Up/Down dez passos, Home/End extremos"],
                ["Toasts", "Alt + T foca a região de toasts (Sonner)"],
              ].map(([a, b]) => (<tr key={a}><th scope="row">{a}</th><td>{b}</td></tr>))}
            </tbody>
          </table>
        </div>
      </Group>
    </Section>
  );
}
