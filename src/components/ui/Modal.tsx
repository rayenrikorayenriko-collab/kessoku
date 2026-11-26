"use client";

import { useEffect, type ReactNode } from "react";
import { Icon } from "./Icon";
import { useBodyLock } from "@/lib/hooks";

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useBodyLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="modal-panel glass-strong"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <h3 className="text-lg font-semibold text-ink">{title}</h3>
            {description ? (
              <p className="mt-1 text-sm text-ink-muted">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            aria-label="Tutup"
            className="icon-btn shrink-0"
            onClick={onClose}
          >
            <Icon name="close" size={18} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer ? (
          <div className="border-t border-line px-6 py-4">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
