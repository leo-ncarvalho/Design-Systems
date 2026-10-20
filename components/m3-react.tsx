"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

/** Subscribe to a native event on a custom element. Handler identity may change freely. */
export function useElementEvent<E extends Event = Event>(
  ref: React.RefObject<HTMLElement | null>,
  type: string,
  handler: ((e: E) => void) | undefined,
) {
  const latest = useRef(handler);
  latest.current = handler;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fn = (e: Event) => latest.current?.(e as E);
    el.addEventListener(type, fn);
    return () => el.removeEventListener(type, fn);
  }, [ref, type]);
}

type TFProps = {
  variant?: "filled" | "outlined";
  label: string;
  value: string;
  onValueChange?: (v: string) => void;
  type?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  error?: boolean;
  errorText?: string;
  supportingText?: string;
  prefixText?: string;
  suffixText?: string;
  maxLength?: number;
  rows?: number;
  placeholder?: string;
  autocomplete?: string;
  inputMode?: string;
  name?: string;
  className?: string;
  children?: React.ReactNode;
  onBlurField?: () => void;
};

/** Controlled wrapper over md-filled/outlined-text-field. Errors are programmatic, not only visual. */
export const TextField = forwardRef<HTMLElement, TFProps>(function TextField(
  { variant = "outlined", value, onValueChange, error, errorText, supportingText, onBlurField, children, ...rest },
  fwd,
) {
  const ref = useRef<HTMLElement>(null);
  useImperativeHandle(fwd, () => ref.current as HTMLElement);
  useElementEvent(ref, "input", () => onValueChange?.((ref.current as unknown as { value: string }).value));
  useElementEvent(ref, "focusout", () => onBlurField?.());
  useEffect(() => {
    const el = ref.current as unknown as { value?: string } | null;
    if (el && el.value !== undefined && el.value !== value) el.value = value;
  }, [value]);
  const Tag = variant === "filled" ? "md-filled-text-field" : "md-outlined-text-field";
  const props: Record<string, unknown> = { ...rest };
  return (
    <Tag
      ref={ref as never}
      value={value}
      error={error || undefined}
      error-text={error ? errorText : undefined}
      supporting-text={supportingText}
      {...props}
    >
      {children}
    </Tag>
  );
});

type SwitchProps = {
  selected?: boolean;
  onSelectedChange?: (s: boolean) => void;
  disabled?: boolean;
  icons?: boolean;
  label: string;
  className?: string;
};

export function Switch({ selected, onSelectedChange, disabled, icons, label, className }: SwitchProps) {
  const ref = useRef<HTMLElement>(null);
  useElementEvent(ref, "change", () => onSelectedChange?.(Boolean((ref.current as unknown as { selected: boolean }).selected)));
  return (
    <md-switch
      ref={ref as never}
      selected={selected || undefined}
      disabled={disabled || undefined}
      icons={icons || undefined}
      aria-label={label}
      className={className}
    />
  );
}

type CheckProps = {
  checked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (c: boolean) => void;
  disabled?: boolean;
  label: string;
  invalid?: boolean;
  describedBy?: string;
};

export function Checkbox({ checked, indeterminate, onCheckedChange, disabled, label, invalid, describedBy }: CheckProps) {
  const ref = useRef<HTMLElement>(null);
  useElementEvent(ref, "change", () => onCheckedChange?.(Boolean((ref.current as unknown as { checked: boolean }).checked)));
  return (
    <md-checkbox
      ref={ref as never}
      checked={checked || undefined}
      indeterminate={indeterminate || undefined}
      disabled={disabled || undefined}
      aria-label={label}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
    />
  );
}

type SliderProps = {
  value?: number;
  valueStart?: number;
  valueEnd?: number;
  min?: number;
  max?: number;
  step?: number;
  labeled?: boolean;
  ticks?: boolean;
  range?: boolean;
  disabled?: boolean;
  label: string;
  onValue?: (v: number) => void;
  onRange?: (a: number, b: number) => void;
};

export function Slider({ value, valueStart, valueEnd, onValue, onRange, label, ...rest }: SliderProps) {
  const ref = useRef<HTMLElement>(null);
  useElementEvent(ref, "input", () => {
    const el = ref.current as unknown as { value: number; valueStart: number; valueEnd: number; range: boolean };
    if (el.range) onRange?.(el.valueStart, el.valueEnd);
    else onValue?.(el.value);
  });
  return (
    <md-slider
      ref={ref as never}
      value={value}
      value-start={valueStart}
      value-end={valueEnd}
      min={rest.min}
      max={rest.max}
      step={rest.step}
      labeled={rest.labeled || undefined}
      ticks={rest.ticks || undefined}
      range={rest.range || undefined}
      disabled={rest.disabled || undefined}
      aria-label={label}
    />
  );
}
