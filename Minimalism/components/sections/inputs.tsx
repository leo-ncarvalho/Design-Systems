"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { AlertCircle, Eye, EyeOff, Search, Mail } from "@/components/icons";
import { Group, Section, Spec, Stage } from "@/components/doc";
import { Checkbox, Slider, Switch, TextField } from "@/components/m3-react";
import { M3 } from "@/components/m3-lazy";
import { OtpDemo } from "@/components/otp";
import { DatePickerDemo, SearchBarDemo, TimePickerDemo } from "@/components/sections/extras";

function Fields({ variant }: { variant: "filled" | "outlined" }) {
  const [text, setText] = useState("");
  const [filled, setFilled] = useState("Marina Albuquerque");
  const [area, setArea] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  return (
    <Stage>
      <Spec name="Repouso"><TextField variant={variant} label="Nome" value={text} onValueChange={setText} supportingText="Como aparece no seu perfil" /></Spec>
      <Spec name="Preenchido"><TextField variant={variant} label="Nome" value={filled} onValueChange={setFilled} /></Spec>
      <Spec name="Desabilitado"><TextField variant={variant} label="Nome" value="Marina Albuquerque" disabled /></Spec>
      <Spec name="Somente leitura"><TextField variant={variant} label="ID da conta" value="acc_8F3K29" readOnly /></Spec>
      <Spec name="Erro"><TextField variant={variant} label="E-mail" value="marina@" error errorText="Informe um e-mail completo, como nome@dominio.com" /></Spec>
      <Spec name="Com ícone e sufixo">
        <TextField variant={variant} label="Buscar" value="" suffixText="⌘K">
          <Search slot="leading-icon" size={20} aria-hidden />
        </TextField>
      </Spec>
      <Spec name="Prefixo e sufixo"><TextField variant={variant} label="Valor" value="1.250" prefixText="R$ " suffixText=",00" inputMode="numeric" /></Spec>
      <Spec name="Senha com alternar visibilidade">
        <TextField variant={variant} label="Senha" type={show ? "text" : "password"} value={pw} onValueChange={setPw} autocomplete="new-password">
          <md-icon-button slot="trailing-icon" toggle aria-label={show ? "Ocultar senha" : "Mostrar senha"} aria-pressed={show} onClick={() => setShow((s) => !s)}>
            {show ? <EyeOff size={20} aria-hidden /> : <Eye size={20} aria-hidden />}
          </md-icon-button>
        </TextField>
      </Spec>
      <Spec name="Área de texto com contador" wide>
        <TextField variant={variant} label="Mensagem" type="textarea" rows={3} maxLength={140} value={area} onValueChange={setArea} />
      </Spec>
    </Stage>
  );
}

type Errors = Partial<Record<"name" | "email" | "password" | "terms", string>>;

function validate(v: { name: string; email: string; password: string; terms: boolean }): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = "Informe seu nome com pelo menos 2 caracteres.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) e.email = "Informe um e-mail completo, como nome@dominio.com.";
  if (v.password.length < 8) e.password = "A senha precisa ter 8 caracteres ou mais.";
  if (!v.terms) e.terms = "Aceite os termos para continuar.";
  return e;
}

/** Validation pattern: validate on blur after first touch, summarise on submit, move focus to the first error. */
function SignupForm() {
  const [values, setValues] = useState({ name: "", email: "", password: "", terms: false });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const summary = useRef<HTMLDivElement>(null);
  const refs = { name: useRef<HTMLElement>(null), email: useRef<HTMLElement>(null), password: useRef<HTMLElement>(null) };

  const errors = validate(values);
  const show = (k: keyof Errors) => (touched[k] || submitted ? errors[k] : undefined);
  const touch = (k: string) => setTouched((t) => ({ ...t, [k]: true }));

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    setSubmitted(true);
    const keys = Object.keys(errors) as (keyof Errors)[];
    if (keys.length) {
      requestAnimationFrame(() => summary.current?.focus());
      return;
    }
    setBusy(true);
    toast.promise(new Promise<void>((res, rej) => setTimeout(() => (values.email.startsWith("erro") ? rej(new Error("x")) : res()), 1400)), {
      loading: "Criando conta…",
      success: () => { setBusy(false); return "Conta criada. Bem-vinda, " + values.name.split(" ")[0] + "."; },
      error: () => { setBusy(false); return "Não foi possível criar a conta. Tente novamente."; },
    });
  };

  const list = Object.entries(errors).filter(([k]) => submitted && errors[k as keyof Errors]);
  const focusField = (k: string) => {
    if (k === "terms") document.getElementById("terms")?.focus();
    else (refs as Record<string, React.RefObject<HTMLElement | null>>)[k]?.current?.focus();
  };

  return (
    <form className="form-demo" onSubmit={submit} noValidate aria-label="Criar conta">
      {list.length > 0 ? (
        <div ref={summary} tabIndex={-1} role="alert" className="banner banner--error">
          <AlertCircle size={20} aria-hidden />
          <div>
            <p className="banner__title">Corrija {list.length} {list.length === 1 ? "campo" : "campos"} para continuar</p>
            <ul className="banner__list">
              {list.map(([k, msg]) => (
                <li key={k}>
                  <button type="button" className="link-button" onClick={() => focusField(k)}>{msg}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
      <TextField ref={refs.name} label="Nome completo" value={values.name} onValueChange={(v) => setValues((s) => ({ ...s, name: v }))} onBlurField={() => touch("name")} error={Boolean(show("name"))} errorText={show("name")} required autocomplete="name" />
      <TextField ref={refs.email} label="E-mail" type="email" value={values.email} onValueChange={(v) => setValues((s) => ({ ...s, email: v }))} onBlurField={() => touch("email")} error={Boolean(show("email"))} errorText={show("email")} supportingText="Dica: use um e-mail começando com “erro” para simular falha do servidor" required autocomplete="email">
        <Mail slot="leading-icon" size={20} aria-hidden />
      </TextField>
      <TextField ref={refs.password} label="Senha" type="password" value={values.password} onValueChange={(v) => setValues((s) => ({ ...s, password: v }))} onBlurField={() => touch("password")} error={Boolean(show("password"))} errorText={show("password")} supportingText="Mínimo de 8 caracteres" required autocomplete="new-password" />
      <label htmlFor="terms" className={`check-row ${show("terms") ? "check-row--error" : ""}`}>
        <input
          type="checkbox"
          id="terms"
          className="ds-check"
          checked={values.terms}
          aria-invalid={Boolean(show("terms")) || undefined}
          aria-describedby={show("terms") ? "terms-error" : undefined}
          onChange={(e) => { setValues((s) => ({ ...s, terms: e.target.checked })); touch("terms"); }}
        />
        <span>Aceito os termos de uso e a política de privacidade</span>
      </label>
      {show("terms") ? <p id="terms-error" className="field-error"><AlertCircle size={16} aria-hidden /> {show("terms")}</p> : null}
      <div className="form-demo__actions">
        <md-text-button type="button" onClick={() => { setValues({ name: "", email: "", password: "", terms: false }); setTouched({}); setSubmitted(false); }}>Limpar</md-text-button>
        <md-filled-button type="submit" disabled={busy || undefined} aria-busy={busy}>{busy ? "Criando…" : "Criar conta"}</md-filled-button>
      </div>
    </form>
  );
}

function Selection() {
  const [on, setOn] = useState(true);
  const [a, setA] = useState(true);
  const [b, setB] = useState(false);
  const [vol, setVol] = useState(40);
  const [range, setRange] = useState<[number, number]>([20, 70]);
  const [radio, setRadio] = useState("m");
  const some = a !== b;
  return (
    <>
      <Group title="Checkbox" note="Estados: desmarcado, marcado, indeterminado (seleção parcial), desabilitado e erro. Alvo de toque de 48px.">
        <Stage>
          <Spec name="Desmarcado"><Checkbox label="Opção" /></Spec>
          <Spec name="Marcado"><Checkbox label="Opção" checked /></Spec>
          <Spec name="Indeterminado"><Checkbox label="Opção" indeterminate /></Spec>
          <Spec name="Desabilitado"><span className="inline"><Checkbox label="Opção" disabled /><Checkbox label="Opção" checked disabled /></span></Spec>
          <Spec name="Erro"><md-checkbox aria-label="Obrigatório" aria-invalid="true" class="is-error" /></Spec>
          <Spec name="Selecionar todos (pai e filhos)" wide>
            <div className="check-tree">
              <label><Checkbox label="Todas as notificações" checked={a && b} indeterminate={some} onCheckedChange={(c) => { setA(c); setB(c); }} /><span>Todas as notificações</span></label>
              <label className="indent"><Checkbox label="E-mail" checked={a} onCheckedChange={setA} /><span>E-mail</span></label>
              <label className="indent"><Checkbox label="Push" checked={b} onCheckedChange={setB} /><span>Push</span></label>
            </div>
          </Spec>
        </Stage>
      </Group>

      <Group title="Radio" note="Uma escolha entre poucas; todas visíveis. Navegue com as setas, o grupo é um único tab stop.">
        <Stage>
          <Spec name="Grupo" wide>
            <div role="radiogroup" aria-label="Tamanho" className="radio-group">
              {[["p", "Pequeno"], ["m", "Médio"], ["g", "Grande"]].map(([v, l]) => (
                <label key={v}>
                  <md-radio name="size" value={v} checked={radio === v || undefined} aria-label={l} onChange={() => setRadio(v)} />
                  <span>{l}</span>
                </label>
              ))}
              <label className="is-disabled" aria-disabled="true"><md-radio name="size" value="x" disabled aria-label="Extra grande" /><span>Extra grande (indisponível)</span></label>
            </div>
          </Spec>
        </Stage>
      </Group>

      <Group title="Switch" note="Efeito imediato, sem botão de confirmação. Com ícone, o estado não depende só de cor.">
        <Stage>
          <Spec name="Desligado"><Switch label="Modo avião" /></Spec>
          <Spec name="Ligado"><Switch label="Wi‑Fi" selected={on} onSelectedChange={setOn} /></Spec>
          <Spec name="Com ícones"><Switch label="Notificações" icons selected /></Spec>
          <Spec name="Desabilitado"><span className="inline"><Switch label="Bloqueado" disabled /><Switch label="Bloqueado ligado" disabled selected /></span></Spec>
          <Spec name="Com rótulo" wide><label className="switch-row"><span><strong>Notificações push</strong><small>Avisos de atividade da conta</small></span><Switch label="Notificações push" selected={on} onSelectedChange={setOn} /></label></Spec>
        </Stage>
      </Group>

      <Group title="Slider" note="Contínuo, discreto e intervalo. O valor é anunciado e visível ao arrastar; setas movem um passo.">
        <Stage>
          <Spec name="Contínuo"><Slider label="Volume" value={vol} onValue={setVol} labeled /></Spec>
          <Spec name="Discreto"><Slider label="Qualidade" min={0} max={10} step={2} value={6} ticks labeled /></Spec>
          <Spec name="Intervalo (dois sliders rotulados)">
            <div className="range-pair">
              <label>Preço mínimo: <strong className="tnum">R$ {range[0]}</strong><Slider label="Preço mínimo" value={range[0]} max={range[1]} onValue={(v) => setRange([Math.min(v, range[1]), range[1]])} labeled /></label>
              <label>Preço máximo: <strong className="tnum">R$ {range[1]}</strong><Slider label="Preço máximo" value={range[1]} min={range[0]} onValue={(v) => setRange([range[0], Math.max(v, range[0])])} labeled /></label>
            </div>
          </Spec>
          <Spec name="Desabilitado"><Slider label="Volume" value={30} disabled /></Spec>
        </Stage>
      </Group>
    </>
  );
}

function Selects() {
  const [v, setV] = useState("");
  return (
    <Group title="Select" note="Para 5 ou mais opções. Menos que isso, prefira radio.">
      <Stage>
        {(["outlined", "filled"] as const).map((variant) => {
          const Tag = (`md-${variant}-select`) as "md-outlined-select";
          return (
            <Spec key={variant} name={`${variant === "outlined" ? "Outlined" : "Filled"}`}>
              <Tag label="País" value={v} onChange={(e: React.SyntheticEvent) => setV((e.target as unknown as { value: string }).value)} supporting-text="Para calcular impostos">
                {["Brasil", "Portugal", "Angola", "Moçambique", "Cabo Verde"].map((c) => (
                  <md-select-option key={c} value={c.toLowerCase()}><div slot="headline">{c}</div></md-select-option>
                ))}
              </Tag>
            </Spec>
          );
        })}
        <Spec name="Erro">
          <md-outlined-select label="País" error error-text="Selecione um país">
            <md-select-option value="br"><div slot="headline">Brasil</div></md-select-option>
          </md-outlined-select>
        </Spec>
        <Spec name="Desabilitado">
          <md-outlined-select label="País" disabled value="br">
            <md-select-option value="br"><div slot="headline">Brasil</div></md-select-option>
          </md-outlined-select>
        </Spec>
      </Stage>
    </Group>
  );
}

export function Inputs() {
  return (
    <Section id="inputs" title="Entradas" lead="Campos de texto, seleção e controles. Todo erro nomeia o problema e a saída; nenhum campo depende só de cor para comunicar estado.">
      <M3 groups={["fields", "buttons"]} />
      <Group title="Campos de texto · outlined" note="Variante padrão: contorno em 1px, 2px no foco. Rótulo sempre visível (flutua), nunca substituído por placeholder.">
        <Fields variant="outlined" />
      </Group>
      <Group title="Campos de texto · filled" note="Para formulários densos ou sobre superfícies com contorno. Mesmos estados.">
        <Fields variant="filled" />
      </Group>
      <Group title="Formulário com validação" note="Valida ao sair do campo (após o primeiro toque), resume erros ao enviar, move o foco para o resumo e liga cada erro ao campo. Envio usa toast.promise.">
        <SignupForm />
      </Group>
      <Selects />
      <Selection />
      <Group title="Busca" note="Padrão combobox: setas navegam, Enter escolhe, Esc fecha ou limpa; resultados anunciados em região de status.">
        <Stage><Spec name="Search bar com sugestões" wide><SearchBarDemo /></Spec></Stage>
      </Group>
      <Group title="Código de verificação" note="Um input real por baixo (colar, preenchimento automático e leitor de tela funcionam). Erro limpa ao digitar; o envio acontece ao completar.">
        <Stage><Spec name="OTP de 6 dígitos (erro simulado para qualquer código diferente de 123456)"><OtpDemo /></Spec></Stage>
      </Group>
      <Group title="Data e hora" note="Calendário em grade navegável por teclado (setas, Home/End, Page Up/Down) com datas desabilitadas e hoje marcado; horário com campos spinbutton.">
        <Stage>
          <Spec name="Seletor de data (domingos e datas passadas desabilitados)"><DatePickerDemo /></Spec>
          <Spec name="Seletor de hora"><TimePickerDemo /></Spec>
        </Stage>
      </Group>
    </Section>
  );
}
