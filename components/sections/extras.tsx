"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Bell, Bookmark, ChevronLeft, ChevronRight, Compass, Home, Inbox, Menu, Pencil, Search, Settings, Star, User, X } from "@/components/icons";
import { Popover } from "@/components/popover";

/* ------------------------------------------------------------------ Button group */
export function ButtonGroupDemo() {
  const [sel, setSel] = useState<string[]>(["b"]);
  const items = [["a", "Negrito"], ["b", "Itálico"], ["c", "Sublinhado"]];
  return (
    <div className="btn-group" role="group" aria-label="Formatação">
      {items.map(([v, l]) => (
        <button key={v} type="button" aria-pressed={sel.includes(v)} onClick={() => setSel((c) => (c.includes(v) ? c.filter((x) => x !== v) : [...c, v]))}>{l}</button>
      ))}
      <button type="button" disabled>Riscado</button>
    </div>
  );
}

/* ------------------------------------------------------------- Loading indicator */
export function LoadingIndicatorDemo() {
  return (
    <span className="inline">
      <span className="morph" role="status" aria-label="Carregando" />
      <span className="morph morph--contained" role="status" aria-label="Carregando"><i /></span>
    </span>
  );
}

/* ------------------------------------------------------------------ Search bar */
const PEOPLE = ["Ana Lima", "Bruno Carvalho", "Beatriz Montenegro", "Carlos Souza", "Daniela Prado", "Eduardo Nunes", "Fernanda Reis"];

export function SearchBarDemo() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [picked, setPicked] = useState("");
  const listId = useId();
  const results = useMemo(() => PEOPLE.filter((p) => p.toLowerCase().includes(q.trim().toLowerCase())), [q]);
  const choose = (v: string) => { setPicked(v); setQ(v); setOpen(false); setActive(-1); };
  return (
    <div className="search">
      <div className={`search__bar ${open ? "is-open" : ""}`}>
        <Search size={20} aria-hidden />
        <input
          type="text"
          role="combobox"
          aria-label="Buscar pessoas"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          placeholder="Buscar pessoas"
          value={q}
          autoComplete="off"
          onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(-1); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((a) => Math.min(results.length - 1, a + 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
            else if (e.key === "Enter" && active >= 0) { e.preventDefault(); choose(results[active]); }
            else if (e.key === "Escape") { if (open) { e.preventDefault(); setOpen(false); } else setQ(""); }
          }}
        />
        {q ? <button type="button" className="search__clear" aria-label="Limpar busca" onMouseDown={(e) => e.preventDefault()} onClick={() => { setQ(""); setPicked(""); }}><X size={18} aria-hidden /></button> : null}
      </div>
      <ul id={listId} role="listbox" aria-label="Resultados" className="search__list" hidden={!open}>
        {results.length === 0 ? <li role="presentation" className="search__empty">Nenhuma pessoa encontrada para “{q}”.</li> : results.map((r, i) => (
          <li key={r} id={`${listId}-${i}`} role="option" aria-selected={i === active} className={i === active ? "is-active" : ""} onMouseDown={(e) => e.preventDefault()} onClick={() => choose(r)}>{r}</li>
        ))}
      </ul>
      <p className="search__out" role="status">{open ? `${results.length} ${results.length === 1 ? "resultado" : "resultados"}` : picked ? `Selecionado: ${picked}` : ""}</p>
    </div>
  );
}

/* ----------------------------------------------------------------- Date picker */
const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export function DatePickerDemo() {
  const [today, setToday] = useState<Date | null>(null);
  const [month, setMonth] = useState<Date | null>(null);
  const [selected, setSelected] = useState<Date | null>(null);
  const [focus, setFocus] = useState<Date | null>(null);
  const grid = useRef<HTMLTableElement>(null);
  const fmt = useMemo(() => new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }), []);
  const full = useMemo(() => new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }), []);
  const wk = useMemo(() => [0, 1, 2, 3, 4, 5, 6].map((d) => new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(new Date(2024, 0, 7 + d)).replace(".", "")), []);
  useEffect(() => { const t = new Date(); t.setHours(0, 0, 0, 0); setToday(t); setMonth(new Date(t.getFullYear(), t.getMonth(), 1)); setFocus(t); }, []);
  if (!today || !month || !focus) return <div className="skeleton datepicker__ph" aria-hidden />;

  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const lead = first.getDay();
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))];
  while (cells.length % 7) cells.push(null);
  const rows = Array.from({ length: cells.length / 7 }, (_, r) => cells.slice(r * 7, r * 7 + 7));
  const disabled = (d: Date) => d < today || d.getDay() === 0;
  const shift = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const go = (d: Date) => { setFocus(d); setMonth(new Date(d.getFullYear(), d.getMonth(), 1)); requestAnimationFrame(() => grid.current?.querySelector<HTMLElement>('[tabindex="0"]')?.focus()); };
  const onKey = (e: React.KeyboardEvent) => {
    const map: Record<string, () => Date> = {
      ArrowLeft: () => shift(focus, -1), ArrowRight: () => shift(focus, 1), ArrowUp: () => shift(focus, -7), ArrowDown: () => shift(focus, 7),
      Home: () => shift(focus, -focus.getDay()), End: () => shift(focus, 6 - focus.getDay()),
      PageUp: () => new Date(focus.getFullYear(), focus.getMonth() - 1, focus.getDate()), PageDown: () => new Date(focus.getFullYear(), focus.getMonth() + 1, focus.getDate()),
    };
    if (map[e.key]) { e.preventDefault(); go(map[e.key]()); }
  };

  return (
    <div className="datepicker">
      <div className="datepicker__head">
        <span className="datepicker__title" id="dp-title" aria-live="polite">{fmt.format(month)}</span>
        <span className="inline">
          <md-icon-button aria-label="Mês anterior" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft size={20} aria-hidden /></md-icon-button>
          <md-icon-button aria-label="Próximo mês" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight size={20} aria-hidden /></md-icon-button>
        </span>
      </div>
      <table ref={grid} role="grid" aria-labelledby="dp-title" className="datepicker__grid" onKeyDown={onKey}>
        <thead><tr>{wk.map((w, i) => <th key={i} scope="col" abbr={w}>{w.slice(0, 3)}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>
              {r.map((d, ci) => (
                <td key={ci} role="gridcell" aria-selected={d && selected ? sameDay(d, selected) : undefined}>
                  {d ? (
                    <button
                      type="button"
                      tabIndex={sameDay(d, focus) ? 0 : -1}
                      disabled={disabled(d)}
                      aria-label={full.format(d)}
                      aria-current={sameDay(d, today) ? "date" : undefined}
                      aria-pressed={selected ? sameDay(d, selected) : false}
                      className={`${sameDay(d, today) ? "is-today" : ""} ${selected && sameDay(d, selected) ? "is-selected" : ""}`}
                      onClick={() => { setSelected(d); setFocus(d); }}
                    >{d.getDate()}</button>
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="datepicker__foot">
        <span className="muted" role="status">{selected ? full.format(selected) : "Nenhuma data escolhida"}</span>
        <span className="inline">
          <md-text-button onClick={() => setSelected(null)} disabled={!selected || undefined}>Limpar</md-text-button>
          <md-text-button disabled={!selected || undefined} onClick={() => selected && toast.success(`Agendado para ${full.format(selected)}`)}>Confirmar</md-text-button>
        </span>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- Time picker */
function Spin({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  const wrap = (n: number) => (n > max ? min : n < min ? max : n);
  return (
    <input
      className="spin tnum"
      role="spinbutton"
      inputMode="numeric"
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={String(value).padStart(2, "0")}
      value={String(value).padStart(2, "0")}
      onChange={(e) => { const n = parseInt(e.target.value.replace(/\D/g, "").slice(-2) || "0", 10); onChange(Math.min(max, Math.max(min, n))); }}
      onKeyDown={(e) => {
        if (e.key === "ArrowUp") { e.preventDefault(); onChange(wrap(value + 1)); }
        else if (e.key === "ArrowDown") { e.preventDefault(); onChange(wrap(value - 1)); }
        else if (e.key === "PageUp") { e.preventDefault(); onChange(wrap(value + 5)); }
        else if (e.key === "PageDown") { e.preventDefault(); onChange(wrap(value - 5)); }
      }}
    />
  );
}

export function TimePickerDemo() {
  const [h, setH] = useState(9);
  const [m, setM] = useState(30);
  const quick = [[9, 0], [12, 30], [18, 0]];
  return (
    <div className="timepicker">
      <div role="group" aria-label="Horário" className="timepicker__row">
        <Spin label="Hora" value={h} min={0} max={23} onChange={setH} />
        <span aria-hidden className="timepicker__sep">:</span>
        <Spin label="Minuto" value={m} min={0} max={59} onChange={setM} />
      </div>
      <p className="muted timepicker__hint">↑ ↓ ajustam um passo, Page Up/Down cinco.</p>
      <div className="inline" role="group" aria-label="Horários rápidos">
        {quick.map(([qh, qm]) => (
          <button key={`${qh}${qm}`} type="button" className="ds-btn ds-btn--outlined" onClick={() => { setH(qh); setM(qm); }}>{String(qh).padStart(2, "0")}:{String(qm).padStart(2, "0")}</button>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- Carousel */
export function CarouselDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const slides = ["Aurora", "Brisa", "Cais", "Duna", "Eco", "Faro"];
  const update = () => {
    const el = ref.current; if (!el) return;
    const start = el.scrollLeft <= 4, end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    // Same values return the same state object, so scrolling in the middle never re-renders.
    setEdge((cur) => (cur.start === start && cur.end === end ? cur : { start, end }));
  };
  useEffect(update, []);
  const by = (dir: number) => ref.current?.scrollBy({ left: dir * (ref.current.clientWidth * 0.8), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  return (
    <div className="carousel" role="group" aria-roledescription="carrossel" aria-label="Projetos recentes">
      <div ref={ref} className="carousel__track" id="carousel-track" role="region" tabIndex={0} aria-label="Slides, role com setas" onScroll={update}>
        {slides.map((s, i) => (
          <div key={s} role="group" aria-roledescription="slide" aria-label={`${i + 1} de ${slides.length}`} className="carousel__slide">
            <strong>{s}</strong>
            <span>Projeto {i + 1}</span>
          </div>
        ))}
      </div>
      <div className="carousel__nav">
        <md-icon-button aria-label="Slides anteriores" aria-controls="carousel-track" disabled={edge.start || undefined} onClick={() => by(-1)}><ChevronLeft size={20} aria-hidden /></md-icon-button>
        <md-icon-button aria-label="Próximos slides" aria-controls="carousel-track" disabled={edge.end || undefined} onClick={() => by(1)}><ChevronRight size={20} aria-hidden /></md-icon-button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- Rail and drawer */
const DEST = [
  { id: "home", label: "Início", I: Home }, { id: "explore", label: "Explorar", I: Compass }, { id: "inbox", label: "Caixa", I: Inbox, badge: 3 }, { id: "profile", label: "Perfil", I: User },
];

export function NavRailDemo() {
  const [cur, setCur] = useState("home");
  return (
    <nav className="rail" aria-label="Navegação lateral compacta">
      <button type="button" className="rail__menu" aria-label="Abrir menu"><Menu size={22} aria-hidden /></button>
      <button type="button" className="rail__fab" aria-label="Compor"><Pencil size={22} aria-hidden /></button>
      <ul>
        {DEST.map(({ id, label, I, badge }) => (
          <li key={id}>
            <button type="button" className="rail__item" aria-current={cur === id ? "page" : undefined} onClick={() => setCur(id)}>
              <span className="rail__pill"><I size={22} aria-hidden />{badge ? <span className="count rail__badge" aria-label={`${badge} novas`}>{badge}</span> : null}</span>
              <span className="rail__label">{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function NavDrawerDemo() {
  const [cur, setCur] = useState("inbox");
  const groups = [
    { title: "Mensagens", items: [{ id: "inbox", label: "Caixa de entrada", I: Inbox, n: "24" }, { id: "starred", label: "Com estrela", I: Star }, { id: "saved", label: "Salvos", I: Bookmark }] },
    { title: "Conta", items: [{ id: "alerts", label: "Alertas", I: Bell }, { id: "settings", label: "Configurações", I: Settings }] },
  ];
  return (
    <nav className="drawer" aria-label="Navegação lateral expandida">
      {groups.map((g) => (
        <div key={g.title} className="drawer__group">
          <h4 className="drawer__title">{g.title}</h4>
          <ul>
            {g.items.map(({ id, label, I, n }) => (
              <li key={id}>
                <button type="button" aria-current={cur === id ? "page" : undefined} onClick={() => setCur(id)}>
                  <I size={20} aria-hidden /><span>{label}</span>{n ? <span className="drawer__n tnum">{n}</span> : null}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/* --------------------------------------------------- Modal drawer and side sheet */
export function EdgeSheet({ side, label, title, children }: { side: "left" | "right"; label: string; title: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const id = useId();
  const close = () => ref.current?.close();
  return (
    <>
      <md-filled-tonal-button ref={trigger as never} onClick={() => ref.current?.showModal()}>{label}</md-filled-tonal-button>
      <dialog ref={ref} className={`edge edge--${side}`} aria-labelledby={id} onClick={(e) => { if (e.target === ref.current) close(); }} onClose={() => trigger.current?.focus()}>
        <div className="edge__head">
          <h4 id={id}>{title}</h4>
          <md-icon-button aria-label="Fechar" onClick={close}><X size={20} aria-hidden /></md-icon-button>
        </div>
        <div className="edge__body">{children}</div>
      </dialog>
    </>
  );
}

/* ----------------------------------------------------------------- Rich tooltip */
export function RichTooltipDemo() {
  return (
    <Popover label="Dica detalhada" className="rich">
      <strong>Sincronização</strong>
      <p>Os dados são atualizados a cada 5 minutos. Alterações feitas offline entram na fila e sobem ao reconectar.</p>
      <button type="button" className="link-button" onClick={() => toast("Abrindo documentação")}>Saiba mais</button>
    </Popover>
  );
}

export function PopoverDemo() {
  return (
    <Popover label="Popover">
      <p className="popover__text">Painel não modal. Esc ou um toque fora fecham; o foco volta ao botão.</p>
      <button type="button" className="link-button" onClick={() => toast("Ação do popover")}>Ação do painel</button>
    </Popover>
  );
}
