"use client";

import { useState } from "react";
import { OTPInput, REGEXP_ONLY_DIGITS, type SlotProps } from "input-otp";
import { toast } from "sonner";

function Slot({ char, isActive, hasFakeCaret }: SlotProps) {
  return (
    <div className={`otp__slot ${isActive ? "is-active" : ""}`}>
      {char}
      {hasFakeCaret ? <span className="otp__caret" aria-hidden /> : null}
    </div>
  );
}

/** Verification code field (input-otp): one real input underneath, so paste, autofill and screen readers work. */
export function OtpDemo() {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const verify = (code: string) => {
    setBusy(true);
    setError(false);
    window.setTimeout(() => {
      setBusy(false);
      if (code === "123456") toast.success("Código confirmado");
      else { setError(true); toast.error("Código incorreto", { description: "Confira o código e tente de novo. Dica: o correto é 123456." }); }
    }, 900);
  };

  return (
    <div className="otp-wrap">
      <OTPInput
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS}
        inputMode="numeric"
        autoComplete="one-time-code"
        aria-label="Código de verificação de 6 dígitos"
        aria-invalid={error || undefined}
        aria-describedby="otp-help"
        disabled={busy}
        value={value}
        onChange={(v) => { setValue(v); if (error) setError(false); }}
        onComplete={verify}
        containerClassName={`otp ${error ? "otp--error" : ""}`}
        render={({ slots }) => (
          <>
            <div className="otp" role="presentation">{slots.slice(0, 3).map((s, i) => <Slot key={i} {...s} />)}</div>
            <span className="otp__sep" aria-hidden />
            <div className="otp" role="presentation">{slots.slice(3).map((s, i) => <Slot key={i} {...s} />)}</div>
          </>
        )}
      />
      <p id="otp-help" className={`otp__help ${error ? "is-error" : ""}`} role={error ? "alert" : undefined} aria-live="polite">
        {busy ? "Verificando…" : error ? "O código não confere. Tente de novo." : "Digite ou cole os 6 dígitos que enviamos por SMS."}
      </p>
    </div>
  );
}
