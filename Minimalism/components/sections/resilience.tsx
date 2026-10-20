"use client";

import { useEffect, useState } from "react";
import { Group, Section, Spec, Stage, Token } from "@/components/doc";
import { M3 } from "@/components/m3-lazy";
import { WorstCase } from "@/components/worst-case";

const CLASSES: [string, string, string, string][] = [
  ["Compact", "0–599", "4", "16px"],
  ["Medium", "600–839", "8", "24px"],
  ["Expanded", "840–1199", "12", "24px"],
  ["Large", "1200–1599", "12", "24px"],
  ["Extra-large", "1600+", "12", "24px"],
];

function windowClass(w: number) {
  return w < 600 ? "Compact" : w < 840 ? "Medium" : w < 1200 ? "Expanded" : w < 1600 ? "Large" : "Extra-large";
}

function Viewport() {
  const [w, setW] = useState<number | null>(null);
  useEffect(() => {
    const on = () => setW(window.innerWidth);
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return (
    <p className="viewport-readout" role="status">
      Largura atual: <strong className="tnum mono">{w ?? "…"}px</strong> · classe <strong>{w ? windowClass(w) : "…"}</strong>
    </p>
  );
}

function Responsive() {
  return (
    <>
      <Group title="Classes de janela" note="Breakpoints do Material 3. O conteúdo é fluido entre eles; nenhuma largura fixa em pixels para colunas.">
        <Viewport />
        <div className="table-wrap" tabIndex={0} role="region" aria-label="Classes de janela, rolável">
          <table className="table table--compact">
            <thead><tr><th scope="col">Classe</th><th scope="col">Largura (px)</th><th scope="col" className="num">Colunas</th><th scope="col">Margem</th></tr></thead>
            <tbody>{CLASSES.map(([a, b, c, d]) => (<tr key={a}><th scope="row">{a}</th><td className="tnum">{b}</td><td className="num tnum">{c}</td><td className="tnum">{d}</td></tr>))}</tbody>
          </table>
        </div>
      </Group>
      <Group title="Padrões adaptativos" note="Esta página os usa: barra lateral fixa em telas largas vira trilha de navegação rolável em telas estreitas; grades colapsam por container query.">
        <Stage>
          <Spec name="Container query: redimensione a caixa pela alça" wide>
            <div className="resizable">
              <div className="cq-grid">
                {["Um", "Dois", "Três", "Quatro"].map((n) => (<div key={n} className="cq-grid__item">{n}</div>))}
              </div>
            </div>
          </Spec>
        </Stage>
        <ul className="rules">
          <li><strong>Mobile first.</strong> Estilos base são para compact; ganham complexidade em <Token>min-width</Token>.</li>
          <li><strong>Alvos adaptam ao ponteiro.</strong> <Token>@media (pointer: coarse)</Token> garante 48px; hover só em <Token>(hover: hover)</Token>.</li>
          <li><strong>Áreas seguras.</strong> <Token>env(safe-area-inset-*)</Token> em barras fixas; <Token>100dvh</Token> em vez de 100vh.</li>
          <li><strong>Entradas a 16px.</strong> Campos nunca abaixo de 16px para evitar zoom no iOS.</li>
        </ul>
      </Group>
    </>
  );
}

function Stress() {
  return (
    <>
      <Group title="Dados extremos" note="O mesmo componente com dados de demonstração e com o pior caso realista: nomes longos com diacríticos, e-mail comprido, uma letra, emoji, árabe e chinês, cargo ausente, contagens 0, 1 e acima de um milhão. Flex filho encolhe, avatar não amassa, strings quebram, números são tabulares e abreviados.">
        <Stage><Spec name="Alterne os conjuntos: a lista de 1.000 linhas é virtualizada" wide><WorstCase /></Spec></Stage>
      </Group>
      <Group title="Regras de resiliência">
        <ul className="rules">
          <li><strong>Truncar com intenção.</strong> Uma linha: <Token>text-overflow: ellipsis</Token> + <Token>title</Token>. Várias: <Token>line-clamp</Token>. Nomes que se diferenciam no fim (arquivos, e-mails) truncam no meio.</li>
          <li><strong>Flex filho encolhe.</strong> <Token>min-width: 0</Token> em todo item de flex ou grid que contém texto; <Token>flex-shrink: 0</Token> em avatar, ícone e ação.</li>
          <li><strong>Contagens abreviam, nunca truncam.</strong> <Token>Intl.NumberFormat</Token> compacto acima de 10 mil; plural por <Token>Intl.PluralRules</Token>; números sempre tabulares.</li>
          <li><strong>Iniciais por grafema.</strong> <Token>Intl.Segmenter</Token> evita meio emoji; cai para &quot;?&quot; só se o nome estiver vazio.</li>
          <li><strong>Vazio tem texto e ação.</strong> Nunca renderize uma lista em branco; campo opcional ausente some em vez de virar um traço.</li>
          <li><strong>Strings do usuário quebram.</strong> <Token>overflow-wrap: anywhere</Token> e <Token>dir=&quot;auto&quot;</Token> para texto bidirecional.</li>
          <li><strong>Listas longas são virtualizadas.</strong> Virtuoso a partir de algumas centenas de linhas.</li>
        </ul>
      </Group>
    </>
  );
}

export function Resilience() {
  return (
    <Section id="responsive" title="Responsividade e resiliência" lead="O mesmo sistema de 320px a 1600px+, e com os piores dados que um usuário consegue digitar.">
      <M3 groups={["buttons"]} />
      <Responsive />
      <Stress />
    </Section>
  );
}
