"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { uploadMedia } from "@/lib/store";

/* -------------------------------------------------------------------------- */
/* Text                                                                        */
/* -------------------------------------------------------------------------- */

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input
        className="field"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint ? <span className="mt-1.5 block text-[11.5px] text-ink-faint">{hint}</span> : null}
    </label>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  hint
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <textarea
        className="field resize-y"
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint ? <span className="mt-1.5 block text-[11.5px] text-ink-faint">{hint}</span> : null}
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/* Switch                                                                      */
/* -------------------------------------------------------------------------- */

export function SwitchField({
  label,
  description,
  checked,
  onChange
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-line bg-white/70 px-4 py-3.5 text-left transition-colors hover:border-ink/20"
    >
      <span>
        <span className="block text-[14px] font-medium text-ink">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-[12px] text-ink-muted">{description}</span>
        ) : null}
      </span>
      <span
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${
          checked ? "bg-accent" : "bg-line"
        }`}
      >
        <span
          className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-soft transition-all duration-300"
          style={{ left: checked ? "22px" : "2px" }}
        />
      </span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Range                                                                       */
/* -------------------------------------------------------------------------- */

export function RangeField({
  label,
  value,
  min,
  max,
  step = 0.1,
  suffix = "",
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="field-label flex items-center justify-between">
        <span>{label}</span>
        <span className="normal-case tracking-normal text-ink-soft">
          {value}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        className="w-full accent-[color:var(--accent)]"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/* Media                                                                       */
/* -------------------------------------------------------------------------- */

export function MediaField({
  label,
  value,
  onChange,
  accept = "image/*",
  hint
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  accept?: string;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const isVideo = /\.(mp4|webm|mov|m4v)$/i.test(value) || accept.includes("video");

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const url = await uploadMedia(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <span className="field-label">{label}</span>
      <div className="flex items-start gap-3 rounded-2xl border border-line bg-white/70 p-3">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
          {value ? (
            isVideo ? (
              <video src={value} muted className="h-full w-full object-cover" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="" className="h-full w-full object-cover" />
            )
          ) : (
            <span className="flex h-full w-full items-center justify-center text-ink-faint">
              <Icon name={isVideo ? "video" : "image"} size={22} />
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <input
            className="field !py-2.5 text-[13px]"
            placeholder="https://… atau unggah berkas"
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              disabled={busy}
              onClick={() => inputRef.current?.click()}
            >
              <Icon name={busy ? "flip" : "download"} size={15} className={busy ? "animate-spin-slow" : ""} />
              {busy ? "Mengunggah…" : "Unggah"}
            </button>
            {value ? (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => onChange("")}
              >
                <Icon name="trash" size={15} />
                Hapus
              </button>
            ) : null}
          </div>
          {hint ? <p className="mt-1.5 text-[11.5px] text-ink-faint">{hint}</p> : null}
          {error ? <p className="mt-1.5 text-[11.5px] text-accent">{error}</p> : null}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => onFile(event.target.files?.[0])}
      />
    </div>
  );
}
