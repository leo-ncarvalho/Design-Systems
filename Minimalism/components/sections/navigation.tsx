"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Bell, ChevronLeft, ChevronRight, Compass, FileText, Home, Inbox, Menu, MoreVertical, Search, Settings, User, Check } from "@/components/icons";
import { Group, Section, Spec, Stage } from "@/components/doc";
import { useElementEvent } from "@/components/m3-react";
import { M3 } from "@/components/m3-lazy";
import { EdgeSheet, NavDrawerDemo, NavRailDemo } from "@/components/sections/extras";

function Tabs({ kind }: { kind: "primary" | "secondary" }) {
  const [i, setI] = useState(0);
  const ref = useRef<HTMLElement>(null);
  useElementEvent(ref, "change", () => setI((ref.current as unknown as { activeTabIndex: number }).activeTabIndex));
  const Tab = (kind === "primary" ? "md-primary-tab" : "md-secondary-tab") as "md-primary-tab";
  const labels = ["Visão geral", "Atividade", "Arquivos"];
  const panels = ["Resumo do projeto: status, prazos e responsáveis.", "Histórico recente de alterações da equipe.", "Documentos e ativos compartilhados."];
  return (
    <div className="tabs-demo">
      <md-tabs ref={ref as never} aria-label={`Seções (${kind})`}>
        {labels.map((l, k) => (
          <Tab key={l} id={`${kind}-tab-${k}`} aria-controls={`${kind}-panel`} active={i === k || undefined}>
            {kind === "primary" && k === 0 ? <Home slot="icon" size={20} aria-hidden /> : null}
            {kind === "primary" && k === 1 ? <Bell slot="icon" size={20} aria-hidden /> : null}
            {kind === "primary" && k === 2 ? <FileText slot="icon" size={20} aria-hidden /> : null}
            {l}
          </Tab>
        ))}
      </md-tabs>
      <div id={`${kind}-panel`} role="tabpanel" aria-labelledby={`${kind}-tab-${i}`} className="tabs-demo__panel" key={i}>
        {panels[i]}
      </div>
    </div>
  );
}

function BottomNav() {
  const [i, setI] = useState(0);
  const items = [
    { l: "Início", I: Home }, { l: "Explorar", I: Compass }, { l: "Caixa", I: Inbox, badge: "3" }, { l: "Perfil", I: User },
  ];
  return (
    <md-navigation-bar aria-label="Navegação principal" active-index={i} onNavigation-bar-activated={(e: CustomEvent) => setI(e.detail.activeIndex)}>
      {items.map(({ l, I, badge }, k) => (
        <md-navigation-tab key={l} label={l} onClick={() => setI(k)} active={i === k || undefined} {...(badge ? { "show-badge": true, "badge-value": badge } : {})}>
          <I slot="inactive-icon" size={22} aria-hidden />
          <I slot="active-icon" size={22} strokeWidth={2.4} aria-hidden />
        </md-navigation-tab>
      ))}
    </md-navigation-bar>
  );
}

function TopBars() {
  return (
    <Stage column>
      <Spec name="Small" wide>
        <div className="app-bar">
          <md-icon-button aria-label="Abrir menu"><Menu size={22} aria-hidden /></md-icon-button>
          <h4 className="app-bar__title">Projetos</h4>
          <md-icon-button aria-label="Buscar"><Search size={22} aria-hidden /></md-icon-button>
          <md-icon-button aria-label="Mais opções"><MoreVertical size={22} aria-hidden /></md-icon-button>
        </div>
      </Spec>
      <Spec name="Center-aligned" wide>
        <div className="app-bar app-bar--center">
          <md-icon-button aria-label="Voltar"><ChevronLeft size={22} aria-hidden /></md-icon-button>
          <h4 className="app-bar__title">Detalhes</h4>
          <md-icon-button aria-label="Configurações"><Settings size={22} aria-hidden /></md-icon-button>
        </div>
      </Spec>
      <Spec name="Medium · título expandido" wide>
        <div className="app-bar app-bar--medium">
          <div className="app-bar__row">
            <md-icon-button aria-label="Voltar"><ChevronLeft size={22} aria-hidden /></md-icon-button>
            <span className="app-bar__spacer" />
            <md-icon-button aria-label="Mais opções"><MoreVertical size={22} aria-hidden /></md-icon-button>
          </div>
          <h4 className="app-bar__title app-bar__title--large">Configurações da equipe</h4>
        </div>
      </Spec>
    </Stage>
  );
}

function MenuDemo() {
  const menu = useRef<HTMLElement & { open: boolean }>(null);
  const [last, setLast] = useState("Nenhuma ação ainda");
  // If the menu closes while focus fell into a hidden item, hand it back to the trigger.
  useElementEvent(menu, "closed", () => {
    const a = document.activeElement;
    if (!a || a === document.body || a.closest("md-menu")) document.getElementById("menu-trigger")?.focus();
  });
  return (
    <div className="menu-anchor">
      <md-outlined-button
        id="menu-trigger"
        aria-haspopup="menu"
        onClick={() => { if (menu.current) menu.current.open = !menu.current.open; }}
        onKeyDown={(e: React.KeyboardEvent) => { if (e.key === "Escape" && menu.current?.open) menu.current.open = false; }}
      >
        Opções
      </md-outlined-button>
      <md-menu ref={menu as never} anchor="menu-trigger" positioning="popover">
        {["Renomear", "Duplicar", "Mover para…"].map((l) => (
          <md-menu-item key={l} onClick={() => setLast(l)}><div slot="headline">{l}</div></md-menu-item>
        ))}
        <md-divider role="separator" tabindex={-1} />
        <md-menu-item disabled><div slot="headline">Arquivar (indisponível)</div></md-menu-item>
        <md-menu-item className="menu-danger" onClick={() => { setLast("Excluir"); toast.error("Item excluído"); }}><div slot="headline">Excluir</div></md-menu-item>
      </md-menu>
      <p className="menu-anchor__out" aria-live="polite">Última ação: {last}</p>
    </div>
  );
}

function ListDemo() {
  const rows = [
    { i: "AL", n: "Ana Lima", t: "Enviei a versão final dos tokens para revisão.", h: "09:41" },
    { i: "B", n: "B", t: "Uma única letra no nome: o avatar e o título aguentam.", h: "Ontem" },
    { i: "EQ", n: "Equipe de design (arquivada)", t: "Desabilitado", h: "", off: true },
  ];
  return (
    <ul className="list-demo ds-list" aria-label="Conversas">
      {rows.map((r) => (
        <li key={r.n}>
          <button type="button" disabled={r.off} onClick={() => toast("Abrindo conversa")}>
            <span className="avatar" aria-hidden>{r.i}</span>
            <span className="ds-list__text"><strong className="truncate">{r.n}</strong><span className="truncate muted">{r.t}</span></span>
            {r.h ? <span className="ds-list__meta">{r.h}</span> : null}
          </button>
        </li>
      ))}
      <li>
        <a href="#navigation"><Settings size={20} aria-hidden /><span className="ds-list__text"><strong>Link com ícone</strong></span><ChevronRight size={20} aria-hidden /></a>
      </li>
    </ul>
  );
}

function Stepper() {
  const [step, setStep] = useState(1);
  const steps = ["Conta", "Perfil", "Revisão", "Concluído"];
  return (
    <div>
      <ol className="stepper" aria-label="Progresso do cadastro">
        {steps.map((s, k) => (
          <li key={s} className={k < step ? "is-done" : k === step ? "is-current" : ""} aria-current={k === step ? "step" : undefined}>
            <span className="stepper__dot">{k < step ? <Check size={14} strokeWidth={3} aria-hidden /> : k + 1}</span>
            <span className="stepper__label">{s}<span className="sr-only">{k < step ? " (concluído)" : k === step ? " (atual)" : " (pendente)"}</span></span>
          </li>
        ))}
      </ol>
      <div className="inline" style={{ marginTop: 16 }}>
        <md-text-button disabled={step === 0 || undefined} onClick={() => setStep((s) => Math.max(0, s - 1))}>Voltar</md-text-button>
        <md-filled-tonal-button disabled={step === steps.length - 1 || undefined} onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}>Avançar</md-filled-tonal-button>
      </div>
    </div>
  );
}

function Pagination() {
  const [p, setP] = useState(4);
  const total = 12;
  const pages = [1, "…", p - 1, p, p + 1, "…", total].filter((x, k, a) => (typeof x === "string" ? true : x >= 1 && x <= total && a.indexOf(x) === k));
  return (
    <nav aria-label="Paginação" className="pagination">
      <md-icon-button aria-label="Página anterior" disabled={p === 1 || undefined} onClick={() => setP((n) => n - 1)}><ChevronLeft size={20} aria-hidden /></md-icon-button>
      <ul>
        {pages.map((x, k) => (
          <li key={k}>
            {x === "…" ? <span aria-hidden className="pagination__gap">…</span> : (
              <button type="button" className="page-btn tnum" aria-current={x === p ? "page" : undefined} aria-label={`Página ${x}`} onClick={() => setP(x as number)}>{x}</button>
            )}
          </li>
        ))}
      </ul>
      <md-icon-button aria-label="Próxima página" disabled={p === total || undefined} onClick={() => setP((n) => n + 1)}><ChevronRight size={20} aria-hidden /></md-icon-button>
    </nav>
  );
}

export function Navigation() {
  return (
    <Section id="navigation" title="Navegação" lead="Tabs, barra de navegação, barras superiores, menus, listas, paginação e estágios. Sempre indique o local atual com mais que cor.">
      <M3 groups={["nav", "buttons"]} />
      <Group title="Tabs" note="Primary para seções principais da página; secondary para subdividir conteúdo. Setas movem entre tabs; o painel é associado por aria-controls.">
        <Stage>
          <Spec name="Primary" wide><Tabs kind="primary" /></Spec>
          <Spec name="Secondary" wide><Tabs kind="secondary" /></Spec>
        </Stage>
      </Group>
      <Group title="Barra de navegação" note="Para 3 a 5 destinos em telas compactas. Rótulo sempre visível; badge numérico para pendências.">
        <Stage><Spec name="Compact" wide><div className="phone-frame"><BottomNav /></div></Spec></Stage>
      </Group>
      <Group title="Barras superiores">
        <TopBars />
      </Group>
      <Group title="Menu" note="Abre ancorado ao gatilho, fecha com Esc e devolve o foco. Ação destrutiva por último e em cor de erro.">
        <Stage><Spec name="Menu com item desabilitado e destrutivo"><MenuDemo /></Spec></Stage>
      </Group>
      <Group title="Lista">
        <Stage><Spec name="Uma e duas linhas · com avatar, desabilitado e link" wide><ListDemo /></Spec></Stage>
      </Group>
      <Group title="Rail e drawer" note="Medium usa rail (ícone e rótulo, 80px); Expanded usa drawer permanente. Em telas compactas o drawer é modal e abre sob demanda.">
        <Stage>
          <Spec name="Navigation rail · Medium"><NavRailDemo /></Spec>
          <Spec name="Navigation drawer · Expanded"><NavDrawerDemo /></Spec>
          <Spec name="Drawer modal · Compact">
            <EdgeSheet side="left" label="Abrir drawer" title="Navegação">
              <NavDrawerDemo />
            </EdgeSheet>
          </Spec>
        </Stage>
      </Group>
      <Group title="Etapas" note="Estado comunicado por número/ícone e texto oculto para leitores de tela, além de cor.">
        <Stage><Spec name="Stepper" wide><Stepper /></Spec></Stage>
      </Group>
      <Group title="Paginação e trilha">
        <Stage>
          <Spec name="Paginação"><Pagination /></Spec>
          <Spec name="Breadcrumb">
            <nav aria-label="Trilha de navegação">
              <ol className="breadcrumb">
                <li><a href="#navigation">Projetos</a></li>
                <li><a href="#navigation">Design system</a></li>
                <li aria-current="page">Componentes</li>
              </ol>
            </nav>
          </Spec>
        </Stage>
      </Group>
    </Section>
  );
}
