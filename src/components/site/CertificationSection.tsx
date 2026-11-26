"use client";

import { useRef, useState } from "react";
import { useConfig } from "@/components/providers/ConfigProvider";
import { usePrefs } from "@/components/providers/PrefsProvider";
import { Icon } from "@/components/ui/Icon";
import { SmartImage } from "@/components/ui/SmartImage";
import { Section, SectionHeading } from "@/components/ui/Section";

export function CertificationSection() {
  const { config } = useConfig();
  const { animations } = usePrefs();
  const data = config.certifications;
  const items = data.items ?? [];
  const motionActive =
    config.animation.enabled && config.animation.coverflowMotion && animations;

  const [current, setCurrent] = useState(0);
  const pointer = useRef({ x: 0, active: false });
  const [dragging, setDragging] = useState(false);

  const total = items.length;
  const go = (next: number) => {
    if (total === 0) return;
    setCurrent(((next % total) + total) % total);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointer.current = { x: event.clientX, active: true };
    setDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };
  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointer.current.active) return;
    const dx = event.clientX - pointer.current.x;
    pointer.current.active = false;
    setDragging(false);
    if (Math.abs(dx) > 42) go(current + (dx < 0 ? 1 : -1));
  };

  if (total === 0) {
    return (
      <Section id="sertifikasi">
        <SectionHeading
          eyebrow="Sertifikasi"
          title={data.title}
          description={data.description}
          align="center"
        />
        <p className="mt-8 text-center text-sm text-ink-muted">
          Belum ada sertifikat.
        </p>
      </Section>
    );
  }

  return (
    <Section id="sertifikasi" className="overflow-hidden">
      <SectionHeading
        eyebrow="Sertifikasi"
        title={data.title}
        description={data.description}
        align="center"
      />

      <div
        className={`perspective relative mt-8 select-none sm:mt-10 ${motionActive ? "reveal" : ""}`}
        style={{
          height: "calc(min(76vw, 460px) * 0.72 + 128px)",
          perspective: "1500px",
          touchAction: "pan-y"
        }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="group"
        aria-roledescription="carousel"
        aria-label={data.title}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") go(current - 1);
          if (event.key === "ArrowRight") go(current + 1);
        }}
      >
        {items.map((item, i) => {
          const d = i - current;
          const dp = Math.max(-2, Math.min(2, d));
          const abs = Math.abs(d);
          const hidden = abs > 2;
          const x = dp * 58;
          const z = -Math.abs(dp) * 72;
          const ry = dp * -32;
          const scale = 1 - Math.abs(dp) * 0.12;
          const opacity = hidden ? 0 : abs === 2 ? 0.3 : 1;

          return (
            <div
              key={item.id}
              className="absolute left-1/2 top-1/2 w-[min(76vw,460px)]"
              style={{
                transform: `translate(-50%, -50%) translateX(${x}%) translateZ(${z}px) rotateY(${ry}deg) scale(${scale})`,
                opacity,
                zIndex: 20 - Math.abs(dp),
                pointerEvents: hidden ? "none" : "auto",
                transition: dragging
                  ? "none"
                  : `transform ${0.7 / (config.animation.durationScale || 1)}s var(--ease-smooth), opacity 0.6s var(--ease-smooth)`
              }}
            >
              <button
                type="button"
                aria-label={`Lihat ${item.title}`}
                aria-current={d === 0}
                onClick={() => go(i)}
                className={`glass block w-full rounded-3xl p-3 text-left transition-shadow ${
                  d === 0 ? "shadow-lift" : ""
                }`}
              >
                <SmartImage
                  src={item.image}
                  alt={item.title}
                  ratio="4 / 3"
                  rounded="rounded-2xl"
                  shimmer={
                    d === 0 &&
                    config.animation.enabled &&
                    config.animation.shimmer &&
                    animations
                  }
                />
                <div className="px-2 pb-2 pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="chip !bg-white/70">
                      <Icon name="award" size={14} />
                      {item.date}
                    </span>
                    <span className="truncate text-[12px] font-medium text-ink-faint">
                      {item.issuer}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold text-ink">
                    {item.title}
                  </h3>
                  <p className="leading-copy mt-2 line-clamp-2 text-[13px] text-ink-muted">
                    {item.description}
                  </p>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="icon-btn"
            aria-label="Sertifikat sebelumnya"
            onClick={() => go(current - 1)}
          >
            <Icon name="chevron-left" size={18} />
          </button>
          <span className="min-w-[72px] text-center text-[12.5px] font-semibold text-ink-muted">
            {current + 1} / {total}
          </span>
          <button
            type="button"
            className="icon-btn"
            aria-label="Sertifikat berikutnya"
            onClick={() => go(current + 1)}
          >
            <Icon name="chevron-right" size={18} />
          </button>
        </div>

        {total > 1 ? (
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Ke sertifikat ${i + 1}`}
                onClick={() => go(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-6 bg-accent"
                    : "w-1.5 bg-line hover:bg-ink-faint"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </Section>
  );
}
