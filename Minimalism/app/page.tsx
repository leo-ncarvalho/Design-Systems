import { SideNav, ThemeToggle } from "@/components/shell";
import { Foundations } from "@/components/sections/foundations";
import { Actions } from "@/components/sections/actions";
import { Inputs } from "@/components/sections/inputs";
import { Navigation } from "@/components/sections/navigation";
import { Containment } from "@/components/sections/containment";
import { Feedback } from "@/components/sections/feedback";
import { Motion } from "@/components/sections/motion";
import { Quality } from "@/components/sections/quality";
import { Resilience } from "@/components/sections/resilience";

export default function Page() {
  return (
    <div className="shell">
      <header className="topbar-shell">
        <span className="brand">Minimalism</span>
        <ThemeToggle />
      </header>
      <aside className="shell__aside">
        <SideNav />
      </aside>
      <main id="main" className="shell__main" tabIndex={-1}>
        <section className="intro" aria-labelledby="intro-h">
          <h1 id="intro-h">Design system</h1>
          <p>
            Material Design 3 em expressão mínima. Um único acento, superfícies tonais e Geist como voz. Esta página mostra
            todos os componentes em todos os estados, nos temas claro e escuro.
          </p>
        </section>
        <Foundations />
        <Actions />
        <Inputs />
        <Navigation />
        <Containment />
        <Feedback />
        <Motion />
        <Quality />
        <Resilience />
        <footer className="doc-footer">
          <p>Material Design 3 · Geist · Sonner. Os parâmetros completos estão em design-system.md.</p>
        </footer>
      </main>
    </div>
  );
}
