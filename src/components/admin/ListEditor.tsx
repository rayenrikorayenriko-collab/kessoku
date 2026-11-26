"use client";

import { useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

type WithId = { id: string };

export function ListEditor<T extends WithId>({
  items,
  onChange,
  createItem,
  renderItem,
  itemTitle,
  addLabel = "Tambah item"
}: {
  items: T[];
  onChange: (items: T[]) => void;
  createItem: () => T;
  renderItem: (item: T, patch: (partial: Partial<T>) => void) => ReactNode;
  itemTitle: (item: T, index: number) => string;
  addLabel?: string;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  const patchAt = (index: number, partial: Partial<T>) => {
    const next = items.map((item, i) =>
      i === index ? { ...item, ...partial } : item
    );
    onChange(next);
  };

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const add = () => {
    const item = createItem();
    onChange([...items, item]);
    setOpenId(item.id);
  };

  return (
    <div className="stack gap-3">
      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line px-4 py-6 text-center text-[13px] text-ink-faint">
          Belum ada item.
        </p>
      ) : null}

      {items.map((item, index) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-2xl border border-line bg-white/70"
          >
            <div className="flex items-center gap-2 px-3 py-3">
              <button
                type="button"
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
                onClick={() => setOpenId(isOpen ? null : item.id)}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-ink-muted">
                  <Icon name="grip" size={15} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-medium text-ink">
                    {itemTitle(item, index) || `Item ${index + 1}`}
                  </span>
                  <span className="block text-[11px] text-ink-faint">
                    {isOpen ? "Tutup" : "Klik untuk mengedit"}
                  </span>
                </span>
              </button>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  className="icon-btn !h-9 !w-9"
                  aria-label="Naikkan"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                >
                  <Icon name="chevron-down" size={16} className="rotate-180" />
                </button>
                <button
                  type="button"
                  className="icon-btn !h-9 !w-9"
                  aria-label="Turunkan"
                  disabled={index === items.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <Icon name="chevron-down" size={16} />
                </button>
                <button
                  type="button"
                  className="icon-btn !h-9 !w-9 !text-accent"
                  aria-label="Hapus"
                  onClick={() => remove(index)}
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
            </div>

            {isOpen ? (
              <div className="animate-fade-in border-t border-line px-3 py-4 sm:px-4">
                <div className="stack gap-4">
                  {renderItem(item, (partial) => patchAt(index, partial))}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}

      <button type="button" className="btn btn-outline" onClick={add}>
        <Icon name="plus" size={16} />
        {addLabel}
      </button>
    </div>
  );
}
