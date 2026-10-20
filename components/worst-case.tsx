"use client";

import { useMemo, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import { Users } from "@phosphor-icons/react";
import { compact, initials, plural } from "@/lib/format";

type Person = { id: string; name: string; email: string; role?: string; status: "Ativo" | "Convidado" | "Expirado"; posts: number };

const DEMO: Person[] = [
  { id: "d1", name: "Ana Lima", email: "ana@acme.com", role: "Designer", status: "Ativo", posts: 12 },
  { id: "d2", name: "Bruno Carvalho", email: "bruno@acme.com", role: "Engenheiro", status: "Ativo", posts: 48 },
  { id: "d3", name: "Carla Souza", email: "carla@acme.com", role: "Produto", status: "Convidado", posts: 3 },
];

/* Realistic worst cases: real naming patterns, real e-mail shapes, no random strings. Spread across rows. */
const WORST: Person[] = [
  { id: "w1", name: "Aleksandra Wiśniewska-Kowalczyk", email: "bartholomew.fitzgerald@northwind-industries-holdings.example.com", role: "Diretora de Operações e Estratégia de Produto para a América Latina", status: "Ativo", posts: 1284592 },
  { id: "w2", name: "Jo", email: "jo@x.co", status: "Convidado", posts: 1 },
  { id: "w3", name: "Maria Fernanda de Albuquerque Montenegro Vasconcelos Neto Pereira", email: "maria.fernanda.albuquerque.montenegro@universidade-federal-do-estado.edu.br", role: "Pesquisa", status: "Expirado", posts: 0 },
  { id: "w4", name: "😀 Ana", email: "ana+etiqueta-muito-longa-para-filtro@exemplo.com", role: "Suporte", status: "Ativo", posts: 99 },
  { id: "w5", name: "محمد علي", email: "mohammed@example.com", role: "Finanças", status: "Ativo", posts: 7 },
  { id: "w6", name: "李小龍", email: "li@example.cn", role: "Engenharia", status: "Convidado", posts: 15 },
  { id: "w7", name: "J", email: "j@j.io", status: "Ativo", posts: 1000 },
  { id: "w8", name: "Montgomery Alexander Pierce III", email: "m.pierce@northwind.example.com", role: "Jurídico", status: "Expirado", posts: 2 },
];

const MODES = ["Demo", "Pior caso", "Vazio", "Um", "1.000 linhas"] as const;
type Mode = (typeof MODES)[number];

function bulk(): Person[] {
  const base = WORST.concat(DEMO);
  return Array.from({ length: 1000 }, (_, i) => ({ ...base[i % base.length], id: `b${i}` }));
}

function badge(s: Person["status"]) {
  return s === "Ativo" ? "badge--success" : s === "Convidado" ? "badge--warning" : "badge--error";
}

function Row({ p }: { p: Person }) {
  return (
    <div className="person" dir="auto">
      {/* flex-shrink: 0 on the avatar keeps it round; initials come from grapheme clusters */}
      <span className="avatar" aria-hidden>{initials(p.name) || "?"}</span>
      <div className="person__text">
        <span className="person__name" title={p.name}>{p.name}</span>
        <span className="person__mail" title={p.email}>{p.email}</span>
        {p.role ? <span className="person__role">{p.role}</span> : null}
      </div>
      <div className="person__meta">
        <span className={`badge ${badge(p.status)}`}>{p.status}</span>
        <span className="tnum muted" title={p.posts.toLocaleString("pt-BR")}>{p.posts >= 10000 ? compact(p.posts) : p.posts.toLocaleString("pt-BR")}</span>
      </div>
    </div>
  );
}

export function WorstCase() {
  const [mode, setMode] = useState<Mode>("Demo");
  const data = useMemo<Person[]>(() => {
    switch (mode) {
      case "Pior caso": return WORST;
      case "Vazio": return [];
      case "Um": return [WORST[1]];
      case "1.000 linhas": return bulk();
      default: return DEMO;
    }
  }, [mode]);

  return (
    <div className="worst">
      <div className="data-toggle" role="group" aria-label="Conjunto de dados">
        {MODES.map((m) => (
          <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}>{m}</button>
        ))}
      </div>
      <p className="muted worst__count" role="status" aria-live="polite">{plural(data.length, "pessoa", "pessoas")}</p>
      <div className="people" aria-label="Pessoas">
        {data.length === 0 ? (
          <div className="people__empty">
            <Users size={28} aria-hidden />
            <strong>Nenhuma pessoa ainda</strong>
            <span>Convide alguém para começar. Esta lista nunca aparece em branco.</span>
          </div>
        ) : (
          <Virtuoso style={{ height: "100%" }} data={data} computeItemKey={(_, p) => p.id} itemContent={(_, p) => <Row p={p} />} />
        )}
      </div>
    </div>
  );
}
