"use client";

import { Component, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AlertCircle, AlertTriangle, CheckCircle2, CloudOff, FileQuestion, Inbox, Info, Lock, RefreshCw, Search, X } from "@/components/icons";
import { Group, Section, Spec, Stage } from "@/components/doc";
import { M3 } from "@/components/m3-lazy";
import { LoadingIndicatorDemo } from "@/components/sections/extras";

/* ---------- Sonner ---------- */
function Toasts() {
  const promise = () =>
    toast.promise(new Promise<{ n: number }>((res) => setTimeout(() => res({ n: 12 }), 1800)), {
      loading: "Importando arquivos…",
      success: (d) => `${d.n} arquivos importados`,
      error: "Falha na importação",
    });
  const failing = () =>
    toast.promise(new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 1500)), {
      loading: "Sincronizando…",
      success: "Sincronizado",
      error: (e: Error) => `Não sincronizou (${e.message}). Tentaremos de novo.`,
    });
  const progress = () => {
    const id = toast.loading("Enviando relatório.pdf · 0%");
    let p = 0;
    const t = window.setInterval(() => {
      p += 20;
      if (p >= 100) { window.clearInterval(t); toast.success("relatório.pdf enviado", { id }); }
      else toast.loading(`Enviando relatório.pdf · ${p}%`, { id });
    }, 450);
  };
  const actions: [string, () => void][] = [
    ["Padrão", () => toast("Rascunho salvo")],
    ["Com descrição", () => toast("Convite enviado", { description: "ana@exemplo.com receberá um e-mail em instantes." })],
    ["Sucesso", () => toast.success("Alterações salvas")],
    ["Erro", () => toast.error("Não foi possível salvar", { description: "Verifique sua conexão e tente de novo." })],
    ["Aviso", () => toast.warning("Armazenamento quase cheio", { description: "Restam 4% do seu plano." })],
    ["Informação", () => toast.info("Nova versão disponível")],
    ["Carregando", () => { const id = toast.loading("Processando…"); setTimeout(() => toast.dismiss(id), 2500); }],
    ["Promise · sucesso", promise],
    ["Promise · falha", failing],
    ["Progresso atualizado", progress],
    ["Com ação (desfazer)", () => toast("Conversa arquivada", { action: { label: "Desfazer", onClick: () => toast.success("Restaurada") } })],
    ["Com cancelar", () => toast("Excluir 3 itens?", { duration: 8000, action: { label: "Excluir", onClick: () => toast.error("3 itens excluídos") }, cancel: { label: "Cancelar", onClick: () => undefined } })],
    ["Persistente", () => toast.error("Sem conexão", { duration: Infinity, description: "Você pode continuar offline; sincronizaremos depois.", closeButton: true })],
    ["Posição superior", () => toast("Notificação no topo", { position: "top-center" })],
    ["Ícone personalizado", () => toast("Sessão expira em 5 min", { icon: <Lock size={16} aria-hidden /> })],
    ["Rajada (agrupamento)", () => { ["Um", "Dois", "Três", "Quatro", "Cinco"].forEach((n, k) => setTimeout(() => toast(`Notificação ${n}`), k * 160)); }],
    ["Dispensar todos", () => toast.dismiss()],
  ];
  return (
    <Stage>
      <Spec name="Cada botão dispara um tipo" wide>
        <div className="inline toast-grid">
          {actions.map(([l, fn]) => (
            <md-outlined-button key={l} onClick={fn}>{l}</md-outlined-button>
          ))}
        </div>
      </Spec>
    </Stage>
  );
}

/* ---------- Banners ---------- */
type Tone = "info" | "success" | "warning" | "error";
const TONE_ICON = { info: Info, success: CheckCircle2, warning: AlertTriangle, error: AlertCircle } as const;
function Banner({ tone, title, children, onClose, action }: { tone: Tone; title: string; children?: React.ReactNode; onClose?: () => void; action?: React.ReactNode }) {
  const I = TONE_ICON[tone];
  return (
    <div className={`banner banner--${tone}`} role={tone === "error" ? "alert" : "status"}>
      <I size={20} aria-hidden />
      <div className="banner__main">
        <p className="banner__title">{title}</p>
        {children ? <p className="banner__text">{children}</p> : null}
        {action}
      </div>
      {onClose ? <button type="button" className="banner__close" aria-label="Dispensar aviso" onClick={onClose}><X size={18} aria-hidden /></button> : null}
    </div>
  );
}

function Banners() {
  const [shown, setShown] = useState(true);
  return (
    <Stage column>
      <Banner tone="info" title="Manutenção programada">Sábado, das 02h às 04h. O app ficará somente leitura.</Banner>
      <Banner tone="success" title="Pagamento confirmado">O recibo foi enviado ao seu e-mail.</Banner>
      <Banner tone="warning" title="Sua assinatura vence em 3 dias" action={<button type="button" className="link-button">Renovar agora</button>}>Após o vencimento, o acesso passa para o plano gratuito.</Banner>
      <Banner tone="error" title="Não foi possível carregar os projetos" action={<button type="button" className="link-button" onClick={() => toast("Tentando novamente…")}>Tentar novamente</button>}>Código de erro 503. Seus dados estão seguros.</Banner>
      {shown ? <Banner tone="info" title="Dispensável" onClose={() => setShown(false)}>Use o botão à direita para fechar este aviso.</Banner> : (
        <md-text-button onClick={() => setShown(true)}>Restaurar aviso dispensado</md-text-button>
      )}
    </Stage>
  );
}

/* ---------- Loading ---------- */
function Determinate() {
  const [p, setP] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => setP((v) => { if (v >= 100) { setRunning(false); return 100; } return v + 4; }), 120);
    return () => window.clearInterval(t);
  }, [running]);
  return (
    <div className="progress-demo">
      <md-linear-progress value={p / 100} aria-label="Upload" />
      <div className="inline">
        <span className="tnum mono">{p}%</span>
        <md-text-button onClick={() => { setP(0); setRunning(true); }} disabled={running || undefined}>{running ? "Enviando…" : p === 100 ? "Reenviar" : "Iniciar envio"}</md-text-button>
      </div>
    </div>
  );
}

function LazyContent() {
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const load = useCallback((fail: boolean) => {
    setState("loading");
    window.setTimeout(() => setState(fail ? "error" : "ready"), 1700);
  }, []);
  return (
    <div className="lazy" aria-live="polite" aria-busy={state === "loading"}>
      {state === "idle" ? <p className="lazy__idle">Nenhum dado carregado.</p> : null}
      {state === "loading" ? (
        <div className="skeleton-card" aria-label="Carregando conteúdo" role="status">
          <span className="skeleton skeleton--avatar" />
          <div className="skeleton-card__lines">
            <span className="skeleton skeleton--line" style={{ width: "60%" }} />
            <span className="skeleton skeleton--line" style={{ width: "90%" }} />
            <span className="skeleton skeleton--line" style={{ width: "40%" }} />
          </div>
        </div>
      ) : null}
      {state === "ready" ? <div className="loaded-card rise"><span className="avatar">AL</span><div><strong>Ana Lima</strong><p>Conteúdo carregado. O esqueleto manteve a mesma geometria, sem salto de layout.</p></div></div> : null}
      {state === "error" ? <Banner tone="error" title="Falha ao carregar" action={<button type="button" className="link-button" onClick={() => load(false)}>Tentar novamente</button>}>A conexão expirou.</Banner> : null}
      <div className="inline">
        <md-outlined-button onClick={() => load(false)} disabled={state === "loading" || undefined}>Carregar</md-outlined-button>
        <md-outlined-button onClick={() => load(true)} disabled={state === "loading" || undefined}>Simular falha</md-outlined-button>
        <md-text-button onClick={() => setState("idle")}>Limpar</md-text-button>
      </div>
    </div>
  );
}

function TopProgress() {
  const [on, setOn] = useState(false);
  const t = useRef<number | undefined>(undefined);
  return (
    <div className="topbar-demo">
      <div className={`topbar ${on ? "is-on" : ""}`} aria-hidden />
      <md-outlined-button onClick={() => { setOn(true); window.clearTimeout(t.current); t.current = window.setTimeout(() => setOn(false), 2200); }}>Simular navegação</md-outlined-button>
    </div>
  );
}

function Loading() {
  return (
    <>
      <Group title="Indicadores" note="Indeterminado quando a duração é desconhecida; determinado quando há progresso real. Sempre com nome acessível.">
        <Stage>
          <Spec name="Circular · indeterminado"><md-circular-progress indeterminate aria-label="Carregando" /></Spec>
          <Spec name="Circular · determinado"><md-circular-progress value={0.65} aria-label="65%" /></Spec>
          <Spec name="Loading indicator (forma que se transforma)"><LoadingIndicatorDemo /></Spec>
          <Spec name="Circular · 4 cores de acento"><md-circular-progress indeterminate four-color aria-label="Carregando" /></Spec>
          <Spec name="Linear · indeterminado" wide><md-linear-progress indeterminate aria-label="Carregando" /></Spec>
          <Spec name="Linear · buffer" wide><md-linear-progress value={0.4} buffer={0.7} aria-label="Buffer" /></Spec>
          <Spec name="Linear · determinado, com controle" wide><Determinate /></Spec>
        </Stage>
      </Group>
      <Group title="Padrões de carregamento" note="Escolha pela duração esperada: até 300ms nada; 300ms–1s indicador discreto; acima de 1s esqueleto; acima de 10s progresso com estimativa.">
        <Stage>
          <Spec name="Spinner inline"><span className="inline"><span className="spinner" role="status" aria-label="Carregando" /><span>Atualizando…</span></span></Spec>
          <Spec name="Pontos"><span className="dots" role="status" aria-label="Digitando"><i /><i /><i /></span></Spec>
          <Spec name="Barra de topo (navegação)"><TopProgress /></Spec>
          <Spec name="Esqueleto de texto" wide>
            <div className="skeleton-text" role="status" aria-label="Carregando texto">
              <span className="skeleton skeleton--title" />
              <span className="skeleton skeleton--line" />
              <span className="skeleton skeleton--line" />
              <span className="skeleton skeleton--line" style={{ width: "70%" }} />
            </div>
          </Spec>
          <Spec name="Esqueleto de lista" wide>
            <div className="skeleton-list" role="status" aria-label="Carregando lista">
              {[0, 1, 2].map((k) => (
                <div key={k} className="skeleton-card"><span className="skeleton skeleton--avatar" /><div className="skeleton-card__lines"><span className="skeleton skeleton--line" style={{ width: `${70 - k * 12}%` }} /><span className="skeleton skeleton--line" style={{ width: "40%" }} /></div></div>
              ))}
            </div>
          </Spec>
          <Spec name="Esqueleto → conteúdo → erro (interativo)" wide><LazyContent /></Spec>
          <Spec name="Atualização otimista"><Optimistic /></Spec>
        </Stage>
      </Group>
    </>
  );
}

function Optimistic() {
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);
  const click = () => {
    const next = !liked;
    setLiked(next);
    setPending(true);
    window.setTimeout(() => {
      setPending(false);
      if (Math.random() < 0.35) { setLiked(!next); toast.error("Não foi possível salvar. Revertido."); }
    }, 900);
  };
  return (
    <button type="button" className={`ds-btn-quiet ${pending ? "is-pending" : ""}`} aria-pressed={liked} onClick={click}>
      {liked ? "Salvo" : "Salvar"} <span className="sr-only">{pending ? "(sincronizando)" : ""}</span>
    </button>
  );
}

/* ---------- Errors ---------- */
class Boundary extends Component<{ children: React.ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div className="state-panel" role="alert">
          <AlertCircle size={28} aria-hidden />
          <h4>Algo saiu do esperado neste bloco</h4>
          <p>O restante da página continua funcionando. Detalhe técnico: <code>{this.state.error.message}</code></p>
          <md-filled-tonal-button onClick={() => this.setState({ error: null })}>Recarregar bloco</md-filled-tonal-button>
        </div>
      );
    }
    return this.props.children;
  }
}
function Bomb() {
  const [boom, setBoom] = useState(false);
  if (boom) throw new Error("Falha simulada de renderização");
  return <md-outlined-button onClick={() => setBoom(true)}>Provocar erro de renderização</md-outlined-button>;
}

function States() {
  const [online, setOnline] = useState(false);
  return (
    <Stage>
      <Spec name="Vazio · primeiro uso">
        <div className="state-panel"><Inbox size={28} aria-hidden /><h4>Nenhum projeto ainda</h4><p>Crie o primeiro para começar a organizar seu trabalho.</p><md-filled-button onClick={() => toast("Novo projeto")}>Criar projeto</md-filled-button></div>
      </Spec>
      <Spec name="Vazio · sem resultados de busca">
        <div className="state-panel"><Search size={28} aria-hidden /><h4>Nada encontrado para “aurorx”</h4><p>Verifique a ortografia ou remova filtros.</p><md-text-button>Limpar filtros</md-text-button></div>
      </Spec>
      <Spec name="Erro de rede · com nova tentativa">
        <div className="state-panel" role="alert"><CloudOff size={28} aria-hidden /><h4>Você está offline</h4><p>Reconecte para ver as atualizações mais recentes.</p><md-filled-tonal-button onClick={() => { setOnline(true); toast.success("Reconectado"); setTimeout(() => setOnline(false), 1800); }}><RefreshCw slot="icon" size={18} aria-hidden />{online ? "Conectado" : "Tentar novamente"}</md-filled-tonal-button></div>
      </Spec>
      <Spec name="404 · não encontrado">
        <div className="state-panel"><FileQuestion size={28} aria-hidden /><h4>Página não encontrada</h4><p>O endereço pode ter mudado ou nunca ter existido.</p><md-text-button href="#foundations">Voltar ao início</md-text-button></div>
      </Spec>
      <Spec name="Sem permissão">
        <div className="state-panel"><Lock size={28} aria-hidden /><h4>Acesso restrito</h4><p>Peça permissão a quem administra este espaço.</p><md-outlined-button>Solicitar acesso</md-outlined-button></div>
      </Spec>
      <Spec name="Error boundary (clique para quebrar)">
        <Boundary><div className="state-panel state-panel--calm"><h4>Bloco isolado</h4><p>Um erro aqui não derruba a página.</p><Bomb /></div></Boundary>
      </Spec>
    </Stage>
  );
}

export function Feedback() {
  return (
    <Section id="feedback" title="Feedback" lead="Toasts, avisos, carregamento, estados vazios e de erro. O sistema sempre diz o que aconteceu e o que fazer em seguida.">
      <M3 groups={["buttons", "progress", "surfaces"]} />
      <Group title="Toasts · Sonner" note="Efêmeros e não bloqueantes. Erros que exigem decisão ficam persistentes com ação. Anunciados via região aria-live. Pausam ao passar o mouse; arrastar dispensa.">
        <Toasts />
      </Group>
      <Group title="Avisos (banners)" note="Persistentes e ligados ao contexto da página. Ícone + título + texto; cor nunca é o único sinal.">
        <Banners />
      </Group>
      <Loading />
      <Group title="Estados vazios e de erro" note="Cada tela tem um estado vazio útil, um estado de erro recuperável e um limite que impede que um erro local derrube o todo.">
        <States />
      </Group>
    </Section>
  );
}
