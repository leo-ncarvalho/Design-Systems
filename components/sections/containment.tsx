"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, ChevronDown, Info, Trash2, Users } from "@/components/icons";
import { Group, Section, Spec, Stage } from "@/components/doc";
import { useElementEvent } from "@/components/m3-react";
import { M3 } from "@/components/m3-lazy";
import { BottomSheet } from "@/components/bottom-sheet";
import { CarouselDemo, EdgeSheet, PopoverDemo, RichTooltipDemo } from "@/components/sections/extras";

type DialogEl = HTMLElement & { show: () => void; close: (r?: string) => void; open: boolean };

function Dialogs() {
  const basic = useRef<DialogEl>(null);
  const danger = useRef<DialogEl>(null);
  const form = useRef<DialogEl>(null);
  const [name, setName] = useState("");
  const [result, setResult] = useState("Nenhum diálogo aberto");
  useElementEvent(basic, "closed", () => setResult(`Básico: ${(basic.current as DialogEl & { returnValue?: string })?.returnValue || "fechado"}`));
  useElementEvent(danger, "closed", () => {
    const r = (danger.current as DialogEl & { returnValue?: string })?.returnValue;
    setResult(`Destrutivo: ${r || "cancelado"}`);
    if (r === "delete") toast.error("Projeto excluído", { description: "Esta ação não pode ser desfeita." });
  });
  useElementEvent(form, "closed", () => {
    const r = (form.current as DialogEl & { returnValue?: string })?.returnValue;
    setResult(`Formulário: ${r || "cancelado"}`);
    if (r === "save" && name.trim()) toast.success(`Projeto “${name.trim()}” criado`);
  });
  return (
    <>
      <div className="inline">
        <md-outlined-button onClick={() => basic.current?.show()}>Diálogo básico</md-outlined-button>
        <md-outlined-button onClick={() => form.current?.show()}>Com formulário</md-outlined-button>
        <md-outlined-button className="is-danger" onClick={() => danger.current?.show()}>Destrutivo</md-outlined-button>
      </div>
      <p className="menu-anchor__out" aria-live="polite">{result}</p>

      <md-dialog ref={basic as never}>
        <div slot="headline">Descartar rascunho?</div>
        <form slot="content" id="dlg-basic" method="dialog">Seu rascunho será removido deste dispositivo.</form>
        <div slot="actions">
          <md-text-button form="dlg-basic" value="keep">Manter</md-text-button>
          <md-text-button form="dlg-basic" value="discard" autofocus>Descartar</md-text-button>
        </div>
      </md-dialog>

      <md-dialog ref={danger as never} type="alert">
        <div slot="headline">Excluir “Projeto Aurora”?</div>
        <Trash2 slot="icon" size={24} aria-hidden />
        <form slot="content" id="dlg-danger" method="dialog">
          Os 48 arquivos e 12 comentários serão removidos permanentemente. Esta ação não pode ser desfeita.
        </form>
        <div slot="actions">
          <md-text-button form="dlg-danger" value="cancel" autofocus>Cancelar</md-text-button>
          <md-filled-button form="dlg-danger" value="delete" className="is-danger">Excluir projeto</md-filled-button>
        </div>
      </md-dialog>

      <md-dialog ref={form as never}>
        <div slot="headline">Novo projeto</div>
        <form slot="content" id="dlg-form" method="dialog" className="dialog-form">
          <md-outlined-text-field label="Nome do projeto" value={name} onInput={(e: React.FormEvent) => setName((e.target as unknown as { value: string }).value)} required />
        </form>
        <div slot="actions">
          <md-text-button form="dlg-form" value="cancel">Cancelar</md-text-button>
          <md-filled-button form="dlg-form" value="save" disabled={!name.trim() || undefined}>Criar</md-filled-button>
        </div>
      </md-dialog>
    </>
  );
}

function Cards() {
  const [sel, setSel] = useState(false);
  return (
    <Stage>
      <Spec name="Elevated">
        <md-elevated-card className="card"><div className="card__body"><h4>Elevated</h4><p>Separa do fundo por sombra leve. Use com parcimônia.</p></div></md-elevated-card>
      </Spec>
      <Spec name="Filled">
        <md-filled-card className="card"><div className="card__body"><h4>Filled</h4><p>Separa por tom. A escolha padrão do sistema.</p></div></md-filled-card>
      </Spec>
      <Spec name="Outlined">
        <md-outlined-card className="card"><div className="card__body"><h4>Outlined</h4><p>Contorno de 1px, sem sombra; ideal para listas densas.</p></div></md-outlined-card>
      </Spec>
      <Spec name="Interativo · hover, foco e pressionado">
        <button type="button" className="card card--interactive" onClick={() => toast("Abrindo projeto")}>
          <span className="card__body"><strong>Projeto Aurora</strong><span>Atualizado há 2 h</span></span>
        </button>
      </Spec>
      <Spec name="Selecionável">
        <button type="button" role="checkbox" aria-checked={sel} className={`card card--interactive ${sel ? "is-selected" : ""}`} onClick={() => setSel((s) => !s)}>
          <span className="card__body"><strong>Plano Pro</strong><span>{sel ? "Selecionado" : "Toque para selecionar"}</span></span>
        </button>
      </Spec>
      <Spec name="Desabilitado">
        <div className="card card--disabled" aria-disabled="true"><span className="card__body"><strong>Plano Enterprise</strong><span>Indisponível na sua região</span></span></div>
      </Spec>
    </Stage>
  );
}

function Accordion() {
  const [open, setOpen] = useState<number | null>(0);
  const items = [
    ["O que é o sistema?", "Um conjunto de tokens e componentes Material 3 com expressão minimalista."],
    ["Posso trocar a cor de acento?", "Sim. Altere os papéis tertiary em tokens.css; os contrastes são recalculados na página."],
    ["Funciona sem JavaScript?", "O conteúdo estático sim; os componentes interativos dependem de web components."],
  ];
  return (
    <div className="accordion">
      {items.map(([q, a], k) => (
        <div key={q} className={`accordion__item ${open === k ? "is-open" : ""}`}>
          <h4>
            <button type="button" id={`acc-b-${k}`} aria-expanded={open === k} aria-controls={`acc-p-${k}`} onClick={() => setOpen(open === k ? null : k)}>
              <span>{q}</span><ChevronDown size={20} aria-hidden />
            </button>
          </h4>
          <div id={`acc-p-${k}`} role="region" aria-labelledby={`acc-b-${k}`} className="accordion__panel"><div><p>{a}</p></div></div>
        </div>
      ))}
    </div>
  );
}

const ROWS = [
  { n: "Ana Lima", r: "Design", v: 1284, s: "Ativo" },
  { n: "Bruno Carvalho", r: "Engenharia", v: 96, s: "Ativo" },
  { n: "Beatriz de Albuquerque Montenegro Vasconcelos Neto", r: "Pesquisa e estratégia de produto", v: 45210, s: "Pendente" },
  { n: "Li", r: "Design", v: 0, s: "Inativo" },
];

function Table() {
  const [dir, setDir] = useState<"asc" | "desc">("desc");
  const [empty, setEmpty] = useState(false);
  const rows = [...ROWS].sort((a, b) => (dir === "asc" ? a.v - b.v : b.v - a.v));
  return (
    <>
      <div className="inline" style={{ marginBottom: 12 }}>
        <md-text-button onClick={() => setEmpty((e) => !e)}>{empty ? "Mostrar dados" : "Simular lista vazia"}</md-text-button>
      </div>
      <div className="table-wrap" tabIndex={0} role="region" aria-label="Tabela de pessoas, rolável">
        <table className="table">
          <caption className="sr-only">Pessoas e visitas</caption>
          <thead>
            <tr>
              <th scope="col">Nome</th>
              <th scope="col">Área</th>
              <th scope="col" className="num" aria-sort={dir === "asc" ? "ascending" : "descending"}>
                <button type="button" className="sort" onClick={() => setDir((d) => (d === "asc" ? "desc" : "asc"))}>
                  Visitas {dir === "asc" ? <ArrowUp size={14} aria-hidden /> : <ArrowDown size={14} aria-hidden />}
                </button>
              </th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {empty ? (
              <tr><td colSpan={4} className="table__empty"><Users size={20} aria-hidden /> Nenhuma pessoa encontrada. Ajuste os filtros ou convide alguém.</td></tr>
            ) : rows.map((r) => (
              <tr key={r.n}>
                <th scope="row" className="cell-trunc" title={r.n}>{r.n}</th>
                <td className="cell-trunc" title={r.r}>{r.r}</td>
                <td className="num tnum">{r.v.toLocaleString("pt-BR")}</td>
                <td><span className={`badge badge--${r.s === "Ativo" ? "success" : r.s === "Pendente" ? "warning" : "neutral"}`}>{r.s}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function Containment() {
  return (
    <Section id="containment" title="Contenção" lead="Cartões, diálogos, sheets, divisores, acordeões e tabelas. Cada camada tem um papel; sobreposições só quando a tarefa exige interrupção.">
      <M3 groups={["surfaces", "buttons", "fields", "nav"]} />
      <Group title="Cartões" note="Sem cartões aninhados. Elevated, filled e outlined diferem só pela separação; interativos ganham hover, foco e estado pressionado.">
        <Cards />
      </Group>
      <Group title="Diálogos" note="Foco preso dentro, Esc fecha, foco retorna ao gatilho. Ação segura recebe o foco inicial em diálogos destrutivos.">
        <Stage><Spec name="Básico, com formulário e destrutivo" wide><Dialogs /></Spec></Stage>
      </Group>
      <Group title="Bottom sheet" note="Para ações contextuais em telas compactas. Elemento dialog nativo: modal, com Esc e clique fora.">
        <Stage><Spec name="Modal"><BottomSheet /></Spec></Stage>
      </Group>
      <Group title="Side sheet" note="Painel lateral modal para detalhes e edição sem sair da página. Foco preso, Esc e botão fechar, foco retorna ao gatilho.">
        <Stage>
          <Spec name="Side sheet com formulário">
            <EdgeSheet side="right" label="Abrir side sheet" title="Detalhes do projeto">
              <md-outlined-text-field label="Nome" value="Projeto Aurora" />
              <md-outlined-text-field label="Responsável" value="Ana Lima" />
              <div className="edge__actions"><md-filled-button onClick={() => toast.success("Alterações salvas")}>Salvar</md-filled-button></div>
            </EdgeSheet>
          </Spec>
        </Stage>
      </Group>
      <Group title="Carrossel" note="Rolagem com snap; botões desabilitam nas pontas; cada slide anuncia sua posição. A trilha é focável e rola com as setas.">
        <Stage><Spec name="Carrossel com slides rotulados" wide><CarouselDemo /></Spec></Stage>
      </Group>
      <Group title="Acordeão" note="Altura animada por grid-template-rows (sem medir em JS). aria-expanded em cada botão.">
        <Stage><Spec name="Disclosure" wide><Accordion /></Spec></Stage>
      </Group>
      <Group title="Tabela" note="Números tabulares alinhados à direita, nomes longos truncados com title, rolagem horizontal focável e estado vazio.">
        <Table />
      </Group>
      <Group title="Divisores, badges, avatares e dicas">
        <Stage>
          <Spec name="Divider"><div className="divider-demo"><span>Acima</span><md-divider /><span>Abaixo</span></div></Spec>
          <Spec name="Badge"><span className="inline"><span className="badge badge--neutral">Neutro</span><span className="badge badge--success">Ativo</span><span className="badge badge--warning">Pendente</span><span className="badge badge--error">Falhou</span><span className="badge badge--accent">Novo</span></span></Spec>
          <Spec name="Badge numérico"><span className="inline"><span className="count">3</span><span className="count">99+</span><span className="count count--dot" role="img" aria-label="Nova atividade" /></span></Spec>
          <Spec name="Avatar"><span className="inline"><span className="avatar">AL</span><span className="avatar avatar--lg">B</span><span className="avatar avatar--sm">LM</span><span className="avatar-stack" role="group" aria-label="Quatro participantes"><span className="avatar">AL</span><span className="avatar">BC</span><span className="avatar">+4</span></span></span></Spec>
          <Spec name="Tooltip rico (popover)"><RichTooltipDemo /></Spec>
          <Spec name="Popover"><PopoverDemo /></Spec>
          <Spec name="Tooltip · hover e foco">
            <span className="tooltip-host">
              <md-icon-button aria-label="Informações" aria-describedby="tip-1"><Info size={20} aria-hidden /></md-icon-button>
              <span role="tooltip" id="tip-1" className="tooltip">Dados atualizados a cada 5 minutos</span>
            </span>
          </Spec>
        </Stage>
      </Group>
    </Section>
  );
}
