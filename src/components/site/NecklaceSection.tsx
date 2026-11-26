"use client";

import { useRef, useState } from "react";
import { useConfig } from "@/components/providers/ConfigProvider";
import { usePrefs } from "@/components/providers/PrefsProvider";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHeading } from "@/components/ui/Section";

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function NecklaceSection() {
  const { config } = useConfig();
  const { animations } = usePrefs();
  const cfg = config.necklace;
  const motion =
    config.animation.enabled && config.animation.necklaceMotion && animations;

  const [flipped, setFlipped] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const pointer = useRef({ startX: 0, startY: 0, active: false, moved: false });

  const MAX = 120;

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointer.current = {
      startX: event.clientX,
      startY: event.clientY,
      active: true,
      moved: false
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDragging(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!pointer.current.active) return;
    const dx = event.clientX - pointer.current.startX;
    const dy = event.clientY - pointer.current.startY;
    if (Math.hypot(dx, dy) > 6) pointer.current.moved = true;
    if (!motion) return;
    setOffset({
      x: clamp(dx, -MAX, MAX),
      y: clamp(dy, -MAX, MAX)
    });
  };

  const endPointer = () => {
    if (!pointer.current.active) return;
    const moved = pointer.current.moved;
    pointer.current.active = false;
    setDragging(false);
    setOffset({ x: 0, y: 0 });
    if (!moved) setFlipped((prev) => !prev);
  };

  const rx = motion ? clamp((-offset.y / MAX) * 26, -26, 26) : 0;
  const ry = motion ? clamp((offset.x / MAX) * 42, -42, 42) : 0;

  return (
    <Section id="kalung">
      <SectionHeading
        eyebrow={cfg.subtitle || "Kalung"}
        title={cfg.title}
        description={cfg.description}
        align="center"
      />

      <div className="mt-10 flex flex-col items-center md:mt-14">
        <div className="perspective w-full max-w-[330px] px-2 sm:max-w-[400px]">
          <div
            className={`relative w-full ${motion && !dragging ? "float-idle" : ""}`}
            style={{
              aspectRatio: "1 / 1",
              touchAction: "pan-y",
              cursor: dragging ? "grabbing" : "grab"
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endPointer}
            onPointerCancel={endPointer}
            onPointerLeave={endPointer}
            role="button"
            tabIndex={0}
            aria-label="Kalung interaktif. Geser untuk memutar, tekan untuk membalik."
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setFlipped((prev) => !prev);
              }
            }}
          >
            <div
              className="preserve-3d absolute inset-0"
              style={{
                transform: `rotateX(${rx}deg) rotateY(${ry}deg)`,
                transition: dragging
                  ? "none"
                  : "transform 0.7s var(--ease-smooth)"
              }}
            >
              <div
                className="preserve-3d absolute inset-0"
                style={{
                  transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  transition: "transform 0.85s var(--ease-smooth)"
                }}
              >
                {/* Front */}
                <div className="backface-hidden absolute inset-0 flex items-center justify-center">
                  <NecklaceFace
                    src={cfg.frontImage}
                    alt={cfg.frontLabel || cfg.title}
                  />
                </div>
                {/* Back */}
                <div
                  className="backface-hidden absolute inset-0 flex items-center justify-center"
                  style={{ transform: "rotateY(180deg)" }}
                >
                  <NecklaceFace
                    src={cfg.backImage}
                    alt={cfg.backLabel || cfg.title}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <span className="chip">
            <Icon name="drag" size={15} />
            {flipped ? cfg.backLabel : cfg.frontLabel}
          </span>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setFlipped((prev) => !prev)}
          >
            <Icon name="flip" size={16} />
            Balik
          </button>
        </div>

        {cfg.hint ? (
          <p className="mt-4 max-w-md text-center text-[12.5px] text-ink-muted">
            {cfg.hint}
          </p>
        ) : null}
      </div>
    </Section>
  );
}

function NecklaceFace({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="flex h-[78%] w-[78%] items-center justify-center rounded-full bg-surface-muted text-ink-faint">
        <Icon name="image" size={30} />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      draggable={false}
      onError={() => setFailed(true)}
      className="h-full w-full select-none object-contain drop-shadow-[0_26px_40px_rgba(12,13,18,0.16)]"
    />
  );
}
