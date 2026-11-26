"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "./Icon";

export type SelectOptionItem = { id: string; label: string };

/**
 * Premium custom dropdown — replaces the native <select> entirely.
 * Keyboard accessible (Enter/Space/Arrow/Escape/Home/End) and closes on outside click.
 */
export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = "Pilih salah satu",
  label,
  disabled = false
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOptionItem[];
  placeholder?: string;
  label?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selected = options.find((option) => option.id === value);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) setActiveIndex(-1);
  }, [open]);

  const commit = (index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(option.id);
    setOpen(false);
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        setActiveIndex(Math.max(0, options.findIndex((o) => o.id === value)));
        return;
      }
      const delta = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((prev) => {
        const next = prev + delta;
        if (next < 0) return options.length - 1;
        if (next >= options.length) return 0;
        return next;
      });
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        setActiveIndex(Math.max(0, options.findIndex((o) => o.id === value)));
      } else if (activeIndex >= 0) {
        commit(activeIndex);
      }
    }
  };

  return (
    <div ref={rootRef} className="relative w-full">
      {label ? <span className="field-label">{label}</span> : null}
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        onKeyDown={onKeyDown}
        className={`field flex items-center justify-between gap-3 text-left ${
          open ? "border-accent/50 bg-white" : ""
        } ${disabled ? "opacity-60" : ""}`}
      >
        <span
          className={`truncate ${selected ? "text-ink" : "text-ink-faint"}`}
        >
          {selected ? selected.label : placeholder}
        </span>
        <Icon
          name="chevron-down"
          size={18}
          className={`shrink-0 text-ink-muted transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="glass-strong absolute left-0 right-0 z-40 mt-2 max-h-64 origin-top animate-scale-in overflow-y-auto rounded-2xl p-1.5"
        >
          {options.length === 0 ? (
            <li className="px-3 py-3 text-sm text-ink-muted">
              Belum ada pilihan.
            </li>
          ) : null}
          {options.map((option, index) => {
            const isSelected = option.id === value;
            const isActive = index === activeIndex;
            return (
              <li key={option.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => commit(index)}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                    isActive ? "bg-surface-muted" : ""
                  } ${isSelected ? "font-semibold text-ink" : "text-ink-soft"}`}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected ? (
                    <Icon name="check" size={16} className="text-accent" />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
