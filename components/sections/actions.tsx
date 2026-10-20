"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Bookmark, Check, Heart, Pencil, Plus, Send, Share2, Star, Trash2, X, Download, Settings, Search, ImageIcon } from "@/components/icons";
import { Group, Section, Spec, Stage } from "@/components/doc";
import { M3 } from "@/components/m3-lazy";
import { HoldButton } from "@/components/hold-button";
import { ButtonGroupDemo, LoadingIndicatorDemo } from "@/components/sections/extras";

type Kind = "filled" | "filled-tonal" | "outlined" | "text" | "elevated";
const KINDS: { kind: Kind; label: string }[] = [
  { kind: "filled", label: "Filled" },
  { kind: "filled-tonal", label: "Tonal" },
  { kind: "outlined", label: "Outlined" },
  { kind: "text", label: "Text" },
  { kind: "elevated", label: "Elevated" },
];

function Btn({ kind, children, ...rest }: { kind: Kind; children: React.ReactNode; [k: string]: unknown }) {
  const Tag = `md-${kind}-button` as "md-filled-button";
  return <Tag {...(rest as object)}>{children}</Tag>;
}

/** Button with a real busy state: aria-busy, inert while loading, spinner in the icon slot. */
function LoadingButton({ kind, label, outcome }: { kind: Kind; label: string; outcome: "success" | "error" }) {
  const [busy, setBusy] = useState(false);
  const run = () => {
    if (busy) return;
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      if (outcome === "success") toast.success("Alterações salvas");
      else toast.error("Não foi possível salvar", { description: "Verifique a conexão e tente novamente." });
    }, 1600);
  };
  return (
    <Btn kind={kind} onClick={run} aria-busy={busy} aria-disabled={busy} className={busy ? "is-busy" : undefined} data-busy={busy || undefined}>
      {busy ? <md-circular-progress slot="icon" indeterminate aria-label="Salvando" class="btn-spinner" /> : null}
      {busy ? "Salvando…" : label}
    </Btn>
  );
}

function ToggleIcon({ label, on, off, variant }: { label: string; on: React.ReactNode; off: React.ReactNode; variant: "standard" | "filled" | "tonal" | "outlined" }) {
  const Tag = ({ standard: "md-icon-button", filled: "md-filled-icon-button", tonal: "md-filled-tonal-icon-button", outlined: "md-outlined-icon-button" }[variant]) as "md-icon-button";
  return (
    <Tag toggle aria-label={label}>
      {off}
      <span slot="selected" className="icon-slot">{on}</span>
    </Tag>
  );
}

function Segmented() {
  const [view, setView] = useState("day");
  return (
    <md-outlined-segmented-button-set aria-label="Período">
      {[["day", "Dia"], ["week", "Semana"], ["month", "Mês"]].map(([v, l]) => (
        <md-outlined-segmented-button
          key={v}
          label={l}
          selected={view === v || undefined}
          has-icon={view === v || undefined}
          onClick={() => setView(v)}
        >
          {view === v ? <Check slot="icon" size={16} aria-hidden /> : null}
        </md-outlined-segmented-button>
      ))}
    </md-outlined-segmented-button-set>
  );
}

function Chips() {
  const [filters, setFilters] = useState<string[]>(["Design"]);
  const [inputs, setInputs] = useState(["ana@exemplo.com", "bruno@exemplo.com"]);
  return (
    <>
      <Group title="Chips" note="Assist sugere ação, filter alterna estado, input representa dado do usuário, suggestion propõe resposta.">
        <Stage>
          <Spec name="Assist">
            <md-chip-set aria-label="Ações">
              <md-assist-chip label="Agendar"><Plus slot="icon" size={16} aria-hidden /></md-assist-chip>
              <md-assist-chip label="Indisponível" disabled />
            </md-chip-set>
          </Spec>
          <Spec name="Filter · selecionável">
            <md-chip-set aria-label="Filtros">
              {["Design", "Código", "Pesquisa"].map((f) => (
                <md-filter-chip
                  key={f}
                  label={f}
                  selected={filters.includes(f) || undefined}
                  onClick={() => setFilters((cur) => (cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f]))}
                />
              ))}
              <md-filter-chip label="Arquivado" disabled />
            </md-chip-set>
          </Spec>
          <Spec name="Input · removível">
            <md-chip-set aria-label="Destinatários">
              {inputs.map((m) => (
                <md-input-chip key={m} label={m} remove-only onRemove={() => setInputs((c) => c.filter((x) => x !== m))} />
              ))}
              {inputs.length === 0 ? <button type="button" className="ds-btn-quiet" onClick={() => setInputs(["ana@exemplo.com", "bruno@exemplo.com"])}>Restaurar</button> : null}
            </md-chip-set>
          </Spec>
          <Spec name="Suggestion">
            <md-chip-set aria-label="Sugestões">
              <md-suggestion-chip label="Parece ótimo" onClick={() => toast("Resposta enviada")} />
              <md-suggestion-chip label="Podemos conversar?" onClick={() => toast("Resposta enviada")} />
            </md-chip-set>
          </Spec>
        </Stage>
      </Group>
    </>
  );
}

export function Actions() {
  return (
    <Section id="actions" title="Ações" lead="Botões, FABs, botões de ícone, segmentados e chips. A ênfase decresce de Filled para Text; use no máximo um Filled por contexto.">
      <M3 groups={["buttons", "chips"]} />
      <Group title="Botões" note="Cinco tipos, cada um em todos os estados. Altura 40px com alvo de toque estendido a 48px.">
        <Stage column>
          {[
            { name: "Repouso", props: {} },
            { name: "Com ícone", props: { icon: true } },
            { name: "Desabilitado", props: { disabled: true } },
          ].map((row) => (
            <div key={row.name} className="state-row">
              <span className="state-row__label">{row.name}</span>
              <div className="state-row__items">
                {KINDS.map(({ kind, label }) => (
                  <Btn key={kind} kind={kind} disabled={row.props.disabled as boolean | undefined} aria-label={undefined}>
                    {row.props.icon ? <Plus slot="icon" size={18} aria-hidden /> : null}
                    {label}
                  </Btn>
                ))}
              </div>
            </div>
          ))}
          <div className="state-row">
            <span className="state-row__label">Carregando (clique)</span>
            <div className="state-row__items">
              {KINDS.map(({ kind, label }) => (
                <LoadingButton key={kind} kind={kind} label={label} outcome="success" />
              ))}
            </div>
          </div>
          <div className="state-row">
            <span className="state-row__label">Falha após carregar</span>
            <div className="state-row__items">
              <LoadingButton kind="filled" label="Enviar" outcome="error" />
              <LoadingButton kind="outlined" label="Enviar" outcome="error" />
            </div>
          </div>
          <div className="state-row">
            <span className="state-row__label">Destrutivo</span>
            <div className="state-row__items">
              <button type="button" className="ds-btn ds-btn--danger" onClick={() => toast.error("Item excluído", { action: { label: "Desfazer", onClick: () => toast.success("Restaurado") } })}>
                <Trash2 size={18} aria-hidden /> Excluir
              </button>
              <button type="button" className="ds-btn ds-btn--danger-quiet" onClick={() => toast.error("Item excluído")}>Excluir</button>
              <button type="button" className="ds-btn ds-btn--danger" disabled><Trash2 size={18} aria-hidden /> Excluir</button>
            </div>
          </div>
          <div className="state-row">
            <span className="state-row__label">Segurar para confirmar</span>
            <div className="state-row__items">
              <HoldButton onConfirm={() => toast.error("Conta excluída", { description: "Os dados foram removidos permanentemente." })}>
                <Trash2 size={18} aria-hidden /> Segure para excluir a conta
              </HoldButton>
            </div>
          </div>
        </Stage>
      </Group>

      <Group title="FAB" note="A ação primária da tela. Um por tela. Extended é preferível quando há espaço, pois nomeia a ação.">
        <Stage>
          <Spec name="Small"><md-fab size="small" aria-label="Adicionar"><Plus slot="icon" size={20} aria-hidden /></md-fab></Spec>
          <Spec name="Regular"><md-fab aria-label="Editar"><Pencil slot="icon" size={24} aria-hidden /></md-fab></Spec>
          <Spec name="Large"><md-fab size="large" aria-label="Adicionar"><Plus slot="icon" size={36} aria-hidden /></md-fab></Spec>
          <Spec name="Extended"><md-fab label="Compor" variant="primary"><Pencil slot="icon" size={24} aria-hidden /></md-fab></Spec>
          <Spec name="Secondary"><md-fab variant="secondary" aria-label="Compartilhar"><Share2 slot="icon" size={24} aria-hidden /></md-fab></Spec>
          <Spec name="Surface"><md-fab variant="surface" aria-label="Buscar"><Search slot="icon" size={24} aria-hidden /></md-fab></Spec>
        </Stage>
      </Group>

      <Group title="Botões de ícone" note="Sempre com nome acessível. Variantes toggle trocam o ícone e expõem aria-pressed.">
        <Stage>
          <Spec name="Standard"><md-icon-button aria-label="Configurações"><Settings size={20} aria-hidden /></md-icon-button></Spec>
          <Spec name="Filled"><md-filled-icon-button aria-label="Enviar"><Send size={20} aria-hidden /></md-filled-icon-button></Spec>
          <Spec name="Tonal"><md-filled-tonal-icon-button aria-label="Baixar"><Download size={20} aria-hidden /></md-filled-tonal-icon-button></Spec>
          <Spec name="Outlined"><md-outlined-icon-button aria-label="Imagem"><ImageIcon size={20} aria-hidden /></md-outlined-icon-button></Spec>
          <Spec name="Desabilitado"><md-icon-button disabled aria-label="Configurações indisponível"><Settings size={20} aria-hidden /></md-icon-button></Spec>
          <Spec name="Toggle · standard"><ToggleIcon variant="standard" label="Favoritar" off={<Heart size={20} aria-hidden />} on={<Heart size={20} fill="currentColor" aria-hidden />} /></Spec>
          <Spec name="Toggle · filled"><ToggleIcon variant="filled" label="Marcar" off={<Bookmark size={20} aria-hidden />} on={<Bookmark size={20} fill="currentColor" aria-hidden />} /></Spec>
          <Spec name="Toggle · tonal"><ToggleIcon variant="tonal" label="Destacar" off={<Star size={20} aria-hidden />} on={<Star size={20} fill="currentColor" aria-hidden />} /></Spec>
          <Spec name="Toggle · outlined"><ToggleIcon variant="outlined" label="Fechar" off={<X size={20} aria-hidden />} on={<Check size={20} aria-hidden />} /></Spec>
        </Stage>
      </Group>

      <Group title="Botão segmentado" note="Para 2 a 5 opções mutuamente exclusivas. Seleção marcada por ícone de check, não só por cor.">
        <Stage>
          <Spec name="Single select"><Segmented /></Spec>
          <Spec name="Desabilitado">
            <md-outlined-segmented-button-set aria-label="Período">
              <md-outlined-segmented-button label="Dia" disabled />
              <md-outlined-segmented-button label="Semana" disabled />
            </md-outlined-segmented-button-set>
          </Spec>
        </Stage>
      </Group>

      <Group title="Grupo de botões" note="Opções relacionadas conectadas num só bloco. Cada botão é um toggle com aria-pressed.">
        <Stage><Spec name="Seleção múltipla, com item desabilitado"><ButtonGroupDemo /></Spec></Stage>
      </Group>

      <Chips />
    </Section>
  );
}
