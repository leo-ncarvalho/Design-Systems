# Design System: Minimalism

Material Design 3 structure, minimal expression. Uma única fonte (Geist), superfícies tonais, um único acento, movimento curto e funcional.

Fonte da verdade em código: [styles/tokens.css](styles/tokens.css). Referência visual viva: `npm run dev` → `http://localhost:3000`.

## 1. Princípios

1. **Contenção primeiro.** Cada elemento merece seu lugar. Cor e elevação carregam significado, não decoração.
2. **Tokens, não valores.** Nada na interface usa um valor cru que não seja um token nomeado.
3. **Todo estado é desenhado.** Carregando, vazio, erro e desabilitado são cidadãos de primeira classe.
4. **Movimento explica.** Animação esclarece causa e efeito, é curta e sempre respeita `prefers-reduced-motion`.
5. **Acessível por construção.** Contraste, foco, alvos e semântica são regras do sistema.

## 2. Stack

| Camada | Escolha |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript estrito |
| Componentes | Híbrido: `@material/web` 2.x (+ `labs`: card, navigation bar, segmented button) onde cobre bem; React próprio para banner, esqueleto, tabela, stepper, paginação, bottom sheet, tooltip, app bar, avatar, badge, acordeão |
| Toasts | Sonner 2.x (um `Toaster` na raiz, `mobileOffset` com área segura) |
| Tema | next-themes (`data-theme`, claro/escuro/sistema, sem flash) |
| Número animado | NumberFlow |
| Lista longa | react-virtuoso |
| Código de verificação | input-otp |
| Ícones | Phosphor (`@phosphor-icons/react`), peso `light`; `fill` só para estado ligado, `regular` para navegação ativa; 16/18/20/24px; nunca emoji ou glifos. A lista da skill `pick-ui-library` não cobre ícones; a escolha foi nossa |
| Fonte | Geist Sans e Geist Mono (pacote `geist`, via `next/font`) |

Os web components são registrados só no cliente e por grupo (`components/m3-lazy.tsx`): cada seção carrega o que usa quando chega a 800px da viewport. Quando um componente é necessário e a skill `pick-ui-library` tem uma indicação, a indicação vence a implementação própria.

## 3. Cor

Esquema quase monocromático. Tinta e superfícies neutras levemente frias; **um único acento** (azul-cobalto, papel `tertiary`) para foco, links, seleção e progresso. Estratégia: *Restrained*.

### 3.1 Papéis (claro / escuro)

| Papel | Claro | Escuro |
|---|---|---|
| `primary` / `on-primary` | `#111113` / `#ffffff` | `#ededf0` / `#111113` |
| `primary-container` / `on-…` | `#ececf0` / `#111113` | `#26272c` / `#ededf0` |
| `secondary` | `#3a3d44` | `#c6c8ce` |
| `secondary-container` / `on-…` | `#ebedf2` / `#1b1d22` | `#25262b` / `#e3e3e7` |
| `tertiary` (acento) / `on-…` | `#3454d1` / `#ffffff` | `#93a8ff` / `#0f1b57` |
| `tertiary-container` / `on-…` | `#e5eaff` / `#1a2a78` | `#1f2750` / `#dce2ff` |
| `error` / `on-error` | `#b3261e` / `#ffffff` | `#ff8f86` / `#4a0b07` |
| `error-container` / `on-…` | `#fce9e7` / `#5c0f0a` | `#3d1512` / `#ffdad6` |
| `surface` = `background` | `#fbfbfc` | `#0e0e10` |
| `on-surface` | `#111113` | `#ececef` |
| `on-surface-variant` | `#595c63` | `#a1a4ab` |
| `surface-dim` / `surface-bright` | `#e9e9ed` / `#fbfbfc` | `#0b0b0d` / `#26262b` |
| `surface-container-lowest` | `#ffffff` | `#09090b` |
| `surface-container-low` | `#f6f6f8` | `#131316` |
| `surface-container` | `#f1f1f4` | `#17171a` |
| `surface-container-high` | `#ebebef` | `#1d1d21` |
| `surface-container-highest` | `#e5e5ea` | `#232328` |
| `surface-variant` | `#e8e9ed` | `#26272c` |
| `outline` | `#868991` | `#6e717a` |
| `outline-variant` | `#e1e2e7` | `#26272c` |
| `inverse-surface` / `inverse-on-surface` | `#1c1c1f` / `#f2f2f4` | `#ececef` / `#1c1c1f` |
| `inverse-primary` | `#e6e6ea` | `#26272c` |
| `surface-tint` | `#111113` | `#ececef` |
| `scrim` / `shadow` | `#000000` | `#000000` |

Token CSS: `--md-sys-color-<papel>`.

### 3.2 Papéis estendidos (mesma estrutura cor/container)

| Papel | Claro | Escuro |
|---|---|---|
| `--ds-color-success` / `on-success` | `#1b7a49` / `#ffffff` | `#62d392` / `#06301a` |
| `--ds-color-success-container` / `on-…` | `#e2f4ea` / `#0b3b22` | `#12301f` / `#c9f2da` |
| `--ds-color-warning` / `on-warning` | `#8a5a00` / `#ffffff` | `#f0b35a` / `#3a2500` |
| `--ds-color-warning-container` / `on-…` | `#fbefd5` / `#3f2900` | `#3a2a0a` / `#fbe3b8` |

### 3.3 Regras

- Elevação em repouso é **tom** (superfícies) e **contorno** (`outline-variant`), não sombra.
- Estado nunca é comunicado só por cor: sempre ícone ou texto junto.
- Texto sobre cor usa o papel `on-*` correspondente; nunca cinza arbitrário.
- O acento ocupa menos de 10% de qualquer tela.
- Seleção de texto: `tertiary` a 22%. Cursor (`caret-color`) e `accent-color`: `tertiary`.

### 3.4 Contraste (medido na página, tema atual)

Texto ≥ 4.5:1; texto grande e componentes de UI ≥ 3:1. Pares críticos validados: `on-surface/surface` (18.2), `on-surface-variant/surface` (≥ 6), `tertiary/surface` (6.3 claro), `error/surface`, `outline/surface` (3.4 claro), `on-*/*-container`.

## 4. Tipografia (Geist)

| Papel | Tamanho | Linha | Tracking | Peso |
|---|---|---|---|---|
| display-large | 56px | 60px | -0.03em | 500 |
| display-medium | 44px | 48px | -0.028em | 500 |
| display-small | 36px | 40px | -0.024em | 500 |
| headline-large | 32px | 40px | -0.022em | 500 |
| headline-medium | 28px | 36px | -0.02em | 500 |
| headline-small | 24px | 32px | -0.016em | 500 |
| title-large | 22px | 28px | -0.012em | 500 |
| title-medium | 16px | 24px | -0.006em | 500 |
| title-small | 14px | 20px | -0.004em | 500 |
| body-large | 16px | 24px | -0.006em | 400 |
| body-medium | 14px | 20px | -0.003em | 400 |
| body-small | 13px | 18px | 0 | 400 |
| label-large | 14px | 20px | -0.003em | 500 |
| label-medium | 12px | 16px | +0.004em | 500 |
| label-small | 12px | 16px | +0.01em | 500 |

Token CSS: `--md-sys-typescale-<papel>-{font,size,line-height,tracking,weight}`.

- Apenas pesos **400** e **500**. Hierarquia por tamanho e tom, não por negrito.
- Geist Mono (`--ds-font-mono`) para código, tokens, dados e medidas; `font-feature-settings: "zero"`.
- Corpo de texto: 65–75 caracteres por linha (`max-width: 68ch`). Títulos com `text-wrap: balance`, parágrafos com `text-wrap: pretty`.
- Números em tabelas e contadores: `font-variant-numeric: tabular-nums`.
- Campos de formulário nunca abaixo de 16px (evita zoom no iOS).
- Sem texto em gradiente, sem eyebrow/kicker acima de títulos.

## 5. Forma

| Token | Valor | Uso |
|---|---|---|
| `--md-sys-shape-corner-none` | 0 | Divisores, tabelas |
| `-extra-small` | 8px | Tooltip, foco de botão de ícone |
| `-small` | 12px | Chips, esqueleto, slots do OTP, itens do carrossel de grade |
| `-medium` | 16px | Banner, toast, popover, linhas de lista, item de menu |
| `-large` | 24px | Cartões, FAB, tabela, rail, drawer, lista, app bar |
| `-extra-large` | 32px | Diálogo, bottom sheet, side sheet, moldura de celular, seletor de data, carrossel |
| `-full` | 9999px | Botões, badges, avatares, paginação, busca, segmentado de tema |

Exceções nomeadas: `--ds-field-radius` = 16px (campos de texto e select, preenchido e contornado); `--md-menu-container-shape` = 20px; `--md-checkbox-container-shape` = 6px. Grupo de botões: 20px nas pontas externas, 10px entre itens, 20px no item selecionado.

## 6. Elevação

| Nível | Token | Sombra (claro) | Uso |
|---|---|---|---|
| 0 | | nenhuma | Padrão |
| 1 | `--ds-elev-1` | `0 1px 2px / .06 + 0 1px 1px / .04` | Cartão elevado, pílula de tab |
| 2 | `--ds-elev-2` | `0 2px 6px / .07 + 0 1px 2px / .05` | Menu, popover |
| 3 | `--ds-elev-3` | `0 8px 24px / .09 + 0 2px 6px / .05` | FAB, toast |
| 4 | `--ds-elev-4` | `0 16px 40px / .12 + 0 4px 10px / .06` | Diálogo, sheet |

No escuro as sombras têm opacidade maior (.3–.55). Toda sombra tem deslocamento e desfoque; nunca halo colorido ou sombra rígida.

## 7. Espaçamento

Base 4px: `--ds-space-1…9` = 4, 8, 12, 16, 24, 32, 48, 64, 96.

- Agrupe perto (4–12), separe com folga (24–64). Mais espaço **acima** de um título do que abaixo.
- Gutter da página: `clamp(16px, 4vw, 48px)`.
- Largura máxima de conteúdo: 1080px. Barra lateral: 248px.

## 8. Movimento

### Curvas

| Token | Valor | Uso |
|---|---|---|
| `--ds-ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | Resposta a toque, hover, toggle (padrão da UI) |
| `--md-sys-motion-easing-standard` | `(0.2, 0, 0, 1)` | Mudanças dentro da tela, acordeão (`-decelerate` `(0, 0, 0, 1)` e `-accelerate` `(0.3, 0, 1, 1)` também existem) |
| `…-emphasized-decelerate` | `(0.05, 0.7, 0.1, 1)` | Entradas: sheet, diálogo |
| `…-emphasized-accelerate` | `(0.3, 0, 0.8, 0.15)` | Saídas |
| `--ds-ease-in-out` | `(0.77, 0, 0.175, 1)` | Movimento na tela de um ponto a outro (raro) |
| `--ds-ease-drawer` | `(0.32, 0.72, 0, 1)` | Entrada de sheets e painéis laterais |
| `linear` | | Apenas shimmer, progresso e preenchimento de segurar |

### Durações

| Tipo | Duração |
|---|---|
| Pressionar, hover, toggle | 100–160ms (`short2`–`short3`) |
| Tooltip, menu, popover | 150–200ms |
| Diálogo e sheet (entrada) | 250–400ms |
| Diálogo e sheet (saída) | 150–250ms |
| Troca de tema | 260–300ms (View Transitions) |
| Acordeão | 250ms |
| Shimmer de esqueleto | 1600ms em loop |

Tokens `--md-sys-motion-duration-short1…long2` = 50, 100, 150, 200, 250, 300, 350, 400, 450, 500ms.

### Regras

- Frequência decide: ações repetidas muitas vezes por dia não animam ou animam em < 100ms.
- Ease-out para resposta; nunca ease-in em UI.
- Nunca partir de `scale(0)`: entradas começam em 0.95 com opacidade; `transform-origin` no gatilho.
- Pressionado: `scale(0.97)` em 100ms.
- Só `transform`, `opacity` e (com cuidado) `clip-path`/`filter`. Altura apenas via `grid-template-rows`.
- Estados reversíveis usam transições CSS (interrompíveis), não keyframes. Painéis que abrem e fecham (sheet, drawer, side sheet, popover) usam `@starting-style` e `allow-discrete`; keyframes ficam para o que roda uma vez ou em loop (shimmer, spinner, tique).
- Entrada e saída pela mesma borda; saída mais rápida que a entrada (painéis: 320ms em `--ds-ease-drawer` entrando, 200ms em `--ds-ease-out` saindo).
- Ações irreversíveis pedem gesto deliberado: segurar para confirmar (preenchimento linear 1200ms; solta e volta em 200ms; funciona com Espaço e Enter).
- Gestos: arraste 1:1 com o ponteiro, captura de ponteiro, ignora um segundo toque, elástico além da borda, fecha por distância (>120px) ou velocidade (>0,11 px/ms), recomeça do valor exibido se interrompido; o `transform` vai direto no elemento, nunca por variável CSS herdada.
- Entradas escalonadas: 40ms por item.
- `prefers-reduced-motion`: durações colapsam a 1ms, deslocamentos somem, mudança de estado permanece; spinner desacelera em vez de parar.

## 9. Componentes

Cada item está na página com todos os estados.

| Grupo | Componentes | Estados mostrados |
|---|---|---|
| Ações | Botão (filled, tonal, outlined, text, elevated), FAB (small, regular, large, extended, secondary, surface), botão de ícone (standard, filled, tonal, outlined, toggle), segmentado, chips (assist, filter, input, suggestion) | repouso, hover, foco, pressionado, desabilitado, carregando, falha, destrutivo, selecionado |
| Entradas | Campo de texto (outlined, filled), textarea com contador, senha, prefixo/sufixo, select, checkbox, radio, switch, slider | repouso, preenchido, foco, desabilitado, somente leitura, erro, indeterminado, com ícone |
| Navegação | Tabs (primary, secondary), barra de navegação, app bar (small, center, medium), menu, lista, stepper, paginação, breadcrumb | ativo, desabilitado, com badge, atual |
| Contenção | Cartão (elevated, filled, outlined, interativo, selecionável), diálogo (básico, formulário, destrutivo), bottom sheet, acordeão, tabela, divisor, badge, avatar, tooltip | aberto/fechado, ordenação, vazio, truncamento |
| Código e dados | OTP, seletor de data (grade navegável), seletor de hora (spinbutton), busca com combobox, carrossel com snap, rail, drawer (permanente e modal), side sheet, grupo de botões, loading indicator, segurar para confirmar | digitando, erro, completo, desabilitado, datas indisponíveis, vazio, pior caso |
| Feedback | Toast (Sonner), banner, progresso (linear, circular), esqueleto, spinner, pontos, barra de topo, estados vazios, erro de rede, 404, sem permissão, error boundary | info, sucesso, aviso, erro, carregando, persistente |

### 9.1 Medidas

| Componente | Medida |
|---|---|
| Botão | altura 40px; alvo de toque 48px (área estendida) |
| Botão de ícone | 40px (ícone 20–24px) |
| FAB | small 40, regular 56, large 96 |
| Campo de texto | altura 56px; contorno 1px, 2px no foco |
| Chip | altura 32px, raio 12px |
| Switch | trilha 52×32px |
| Campo de texto | raio 16px (`--ds-field-radius`) |
| Cartão | raio 24px, padding 16px |
| Diálogo | largura máx. 560px, raio 32px |
| Toast | raio 16px, padding 14×16px, elevação 3 |
| Avatar | 28 / 40 / 56px |
| Badge | altura 24px; contador 20px |
| Esqueleto | linha 12px, título 20px, avatar 40px |

### 9.2 Toasts (Sonner)

- Posição padrão: inferior direita; `closeButton`, `gap: 10`, `visibleToasts: 4`.
- Ícone de tipo na cor semântica do tema (não do inverso).
- Superfície: segue o tema (`surface-container-lowest` no claro, `surface-container-highest` no escuro, token `--ds-toast-bg`), texto `on-surface`, contorno `outline-variant`; ícone de tipo na cor semântica do tema; botão de fechar sem fundo, dentro do toast, só no hover ou foco.
- Tipos usados: padrão, `success`, `error`, `warning`, `info`, `loading`, `promise`, com `description`, com `action`/`cancel`, persistente (`duration: Infinity`), posição customizada, ícone customizado, atualização por `id`.
- Erros que exigem decisão ficam persistentes e com ação. Mensagem diz o que houve e o que fazer.
- Anunciados em região `aria-live`; atalho `Alt + T` foca a região.

### 9.3 Tratamento de erros

| Camada | Padrão |
|---|---|
| Campo | `error` + `error-text` programático; mensagem nomeia problema e saída; ícone junto da cor |
| Formulário | Valida ao sair do campo (após o primeiro toque); ao enviar, resumo `role="alert"` recebe foco e lista erros que levam ao campo |
| Assíncrono | `toast.promise` (carregando → sucesso/erro); falha preserva o que o usuário digitou |
| Otimista | Aplica na hora; em falha, reverte e avisa por toast |
| Bloco | Error boundary isola o erro e oferece "Recarregar bloco" |
| Tela | Estados dedicados: offline (nova tentativa), 404, sem permissão, vazio, sem resultados |

### 9.4 Carregamento

| Duração esperada | Padrão |
|---|---|
| < 300ms | Nada |
| 300ms – 1s | Indicador discreto (spinner inline, pontos) |
| > 1s | Esqueleto com a mesma geometria do conteúdo (sem salto de layout) |
| > 10s | Progresso determinado com estimativa |

Indeterminado quando a duração é desconhecida; determinado quando há progresso real. Botão em carregamento: `aria-busy`, inerte, spinner no slot de ícone, rótulo no gerúndio.

### 9.5 Móvel (nativo)

Linha de base em [styles/base.css](styles/base.css) e [app/layout.tsx](app/layout.tsx): `viewport-fit=cover` com `interactive-widget=resizes-content`; `theme-color` por esquema; sem tap highlight; `touch-action: manipulation`, `user-select: none` e `-webkit-touch-callout: none` só em controles; `overscroll-behavior: contain` em scrollers internos; `100dvh` em painéis; campos a 16px; todo hover em `(hover: hover) and (pointer: fine)`. Nunca `user-scalable=no`.
Alvos: áreas de toque efetivas de 44px ou mais em todos os controles (48px nos botões, chips, switch, radio, FAB e botões de ícone), medidas em ponteiro grosso. Precisa de confirmação em celular real: hover preso, atraso de toque, borracha de rolagem, safe areas e teclado virtual.

### 9.6 Dados extremos

O seletor **Demo / Pior caso / Vazio / Um / 1.000 linhas** ([components/worst-case.tsx](components/worst-case.tsx)) é o teste de regressão da lista de pessoas. Regras: iniciais por grafema (`Intl.Segmenter`), contagem compacta acima de 10 mil, plural por `Intl.PluralRules`, `dir="auto"`, campo opcional ausente some, lista longa virtualizada.

## 10. Acessibilidade (alvo WCAG 2.2 AA)

- **Foco:** anel de 2px, offset 2px, cor de acento, só por teclado (`:focus-visible`). Em `forced-colors`, usa `Highlight`.
- **Alvos:** 48px para ações primárias; mínimo absoluto 24px com espaço (2.5.8).
- **Teclado:** tudo operável; ordem do DOM = ordem visual; link "Pular para o conteúdo".
- **Nomes:** todo controle tem nome acessível; botões de ícone usam `aria-label`; toggles expõem `aria-pressed`.
- **Estado:** `aria-current`, `aria-expanded`, `aria-sort`, `aria-busy`, `aria-invalid` onde aplicável.
- **Anúncios:** regiões `aria-live="polite"` para mudanças; `role="alert"` para erros.
- **Movimento:** ver seção 8. Reduced motion troca deslocamento por fade ou por passos e mantém cor e estado; `prefers-contrast: more` usa contornos sólidos.
- **Zoom e reflow:** sem rolagem horizontal da página de 320px a 1600px+; tabelas rolam dentro de região focável.
- **Idioma:** `lang="pt-BR"`.
- **Superfícies do navegador:** seleção, cursor, barras de rolagem e `accent-color` temados.

Atalhos: botões/chips/switch (Enter/Espaço); tabs e radio (← →); menu (↑ ↓ Enter Esc); diálogo (Tab circula, Esc fecha); slider (← → um passo, Page Up/Down dez, Home/End).

## 11. Responsividade

Classes de janela M3: Compact 0–599 (4 colunas, margem 16), Medium 600–839 (8, 24), Expanded 840–1199 (12, 24), Large 1200–1599, Extra-large 1600+.

- Mobile first: estilos base são compact; complexidade entra em `min-width`.
- Medium usa rail, Expanded usa drawer permanente, Compact usa drawer modal.
- Barra lateral fixa ≥ 1024px; abaixo, vira trilha de navegação horizontal rolável.
- Grades por container query (`@container`), não por viewport.
- Hover só sob `(hover: hover)`; alvos ampliam sob `(pointer: coarse)`.
- `100dvh` em vez de `100vh`; `env(safe-area-inset-*)` em barras fixas.
- Dados extremos tratados: truncamento com reticências e `title`, `min-width: 0` em filhos de flex, contagens abreviadas (999k+), estados vazios com ação.

## 12. Tema claro e escuro

- Atributo `data-theme="light|dark"` em `<html>`; sem atributo, segue `prefers-color-scheme`.
- next-themes aplica o tema salvo antes da primeira pintura (sem flash) e acompanha o sistema enquanto a escolha for "sistema". Escolha persistida em `localStorage` (`ds-theme`). Seletor de três posições (claro, sistema, escuro) como radiogrupo.
- Troca com View Transitions (260ms), sem animação sob `prefers-reduced-motion`.
- Escuro: superfícies sobem em tom (`#09090b` → `#232328`), acento clareia (`#93a8ff`), sombras mais densas.

## 13. Estrutura do projeto

```
app/                 layout.tsx (fontes, tema), page.tsx, globals.css, icon.svg
components/
  providers.tsx      next-themes, Toaster, modalidade de entrada
  m3-lazy.tsx        registro por grupo dos web components (cliente)
  icons.tsx          Phosphor com peso por regra
  popover.tsx, bottom-sheet.tsx, hold-button.tsx, otp.tsx, worst-case.tsx
  m3-react.tsx       wrappers controlados: TextField, Switch, Checkbox, Slider
  m3.d.ts            tipos JSX dos custom elements
  doc.tsx            Section, Group, Stage, Spec, Token
  shell.tsx          navegação lateral, alternador de tema
  sections/          foundations, actions, inputs, navigation, containment,
                     feedback, motion, quality, resilience, extras
lib/                 color.ts (contraste), format.ts (formatação e Intl)
styles/              tokens.css, base.css, components.css, extras.css, docs.css
design-system.md     este documento
```

## 14. Como estender

1. Novo valor visual → novo token em `tokens.css` (claro **e** escuro).
2. Novo componente → estilo em `components.css` usando só tokens; mostrar todos os estados na página.
3. Todo componente interativo: foco, hover (sob `(hover: hover)`), pressionado, desabilitado, carregando, erro quando aplicável.
4. Verificar: contraste nos dois temas, 320px sem rolagem horizontal, teclado, `prefers-reduced-motion`.
