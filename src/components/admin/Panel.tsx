"use client";

import type { ReactNode } from "react";

export function PanelHeader({
  title,
  description,
  action
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-display text-xl font-semibold text-ink sm:text-2xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-[13.5px] text-ink-muted">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function SectionBlock({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-line bg-white/60 p-4 sm:p-5">
      <header className="mb-4">
        <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
        {description ? (
          <p className="mt-1 text-[12.5px] text-ink-muted">{description}</p>
        ) : null}
      </header>
      <div className="stack gap-4">{children}</div>
    </section>
  );
}

export function Grid2({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}
