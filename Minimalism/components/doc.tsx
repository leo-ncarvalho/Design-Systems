import type { ReactNode } from "react";

export function Section({ id, title, lead, children }: { id: string; title: string; lead: string; children: ReactNode }) {
  return (
    <section id={id} className="doc-section" aria-labelledby={`${id}-h`}>
      <header className="doc-section__head">
        <h2 id={`${id}-h`}>{title}</h2>
        <p>{lead}</p>
      </header>
      <div className="doc-section__body">{children}</div>
    </section>
  );
}

export function Group({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <div className="doc-group">
      <div className="doc-group__head">
        <h3>{title}</h3>
        {note ? <p>{note}</p> : null}
      </div>
      {children}
    </div>
  );
}

/** A stage holding specimens. Each specimen carries its state name beneath it. */
export function Stage({ children, className = "", column = false }: { children: ReactNode; className?: string; column?: boolean }) {
  return <div className={`stage ${column ? "stage--column" : ""} ${className}`}>{children}</div>;
}

export function Spec({ name, children, wide = false }: { name: string; children: ReactNode; wide?: boolean }) {
  return (
    <figure className={`spec ${wide ? "spec--wide" : ""}`}>
      <div className="spec__demo">{children}</div>
      <figcaption>{name}</figcaption>
    </figure>
  );
}

export function Token({ children }: { children: ReactNode }) {
  return <code className="token">{children}</code>;
}
