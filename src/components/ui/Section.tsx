import type { ReactNode } from "react";

export function Section({
  id,
  children,
  className = ""
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-24 py-16 sm:py-20 md:py-28 ${className}`}>
      <div className="wrap">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-[0.22em] text-accent">
      <span className="h-[6px] w-[6px] rounded-full bg-accent" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  action?: ReactNode;
}) {
  const isCenter = align === "center";
  return (
    <div
      className={`reveal flex flex-col gap-6 ${
        isCenter
          ? "items-center text-center"
          : "md:flex-row md:items-end md:justify-between"
      }`}
    >
      <div className={isCenter ? "max-w-2xl" : "max-w-2xl"}>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2 className="mt-4 text-[clamp(1.75rem,5vw,2.75rem)] font-semibold text-ink">
          {title}
        </h2>
        {description ? (
          <p className="leading-copy mt-4 text-[15px] text-ink-muted sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Hairline() {
  return <div className="h-px w-full bg-line" />;
}
