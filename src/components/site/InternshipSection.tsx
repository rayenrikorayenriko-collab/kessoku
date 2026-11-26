"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useConfig } from "@/components/providers/ConfigProvider";
import { usePrefs } from "@/components/providers/PrefsProvider";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { SmartImage } from "@/components/ui/SmartImage";
import { Section, SectionHeading } from "@/components/ui/Section";

export function InternshipSection() {
  const { config } = useConfig();
  const { animations } = usePrefs();
  const anim = config.animation.enabled && animations;
  const data = config.internships;
  const items = data.items ?? [];

  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const step = useCallback(() => {
    const track = trackRef.current;
    const first = track?.children[0] as HTMLElement | undefined;
    if (!track || !first) return 0;
    const gap = parseFloat(getComputedStyle(track).columnGap || "16") || 16;
    return first.offsetWidth + gap;
  }, []);

  const goTo = useCallback(
    (next: number) => {
      const track = trackRef.current;
      if (!track || items.length === 0) return;
      const clamped = Math.max(0, Math.min(items.length - 1, next));
      track.scrollTo({ left: clamped * step(), behavior: "smooth" });
      setIndex(clamped);
    },
    [items.length, step]
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const s = step();
        if (s > 0) setIndex(Math.round(track.scrollLeft / s));
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [step]);

  const current = openIndex !== null ? items[openIndex] : null;

  return (
    <Section id="magang" className="overflow-hidden">
      <SectionHeading
        eyebrow="Pengalaman"
        title={data.title}
        description={data.description}
        action={
          items.length > 1 ? (
            <div className="hidden items-center gap-2 md:flex">
              <button
                type="button"
                className="icon-btn"
                aria-label="Sebelumnya"
                disabled={index <= 0}
                onClick={() => goTo(index - 1)}
              >
                <Icon name="chevron-left" size={18} />
              </button>
              <button
                type="button"
                className="icon-btn"
                aria-label="Berikutnya"
                disabled={index >= items.length - 1}
                onClick={() => goTo(index + 1)}
              >
                <Icon name="chevron-right" size={18} />
              </button>
            </div>
          ) : null
        }
      />

      {items.length === 0 ? (
        <p className="mt-8 text-sm text-ink-muted">Belum ada pengalaman.</p>
      ) : (
        <div className={`relative mt-9 w-full ${anim ? "reveal" : ""}`}>
          <div
            ref={trackRef}
            className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3"
            style={{
              paddingInline: "calc((100% - min(84vw, 420px)) / 2)"
            }}
          >
            {items.map((item, i) => (
              <article
                key={item.id}
                className="w-[min(84vw,420px)] shrink-0 snap-center"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  className="glass group flex h-full w-full flex-col overflow-hidden rounded-3xl p-3 text-left transition-transform duration-500 hover:-translate-y-1"
                >
                  <SmartImage
                    src={item.image}
                    alt={item.title}
                    ratio="4 / 3"
                    rounded="rounded-2xl"
                    shimmer={
                      config.animation.enabled &&
                      config.animation.shimmer &&
                      animations
                    }
                    imgClassName="transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="chip !bg-white/70">
                        <Icon name="briefcase" size={14} />
                        {item.role}
                      </span>
                      <span className="text-[12px] font-medium text-ink-faint">
                        {item.period}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-lg font-semibold text-ink">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[13px] font-medium text-ink-muted">
                      {item.company}
                    </p>
                    <p className="leading-copy mt-3 line-clamp-3 text-[13.5px] text-ink-muted">
                      {item.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-accent">
                      Lihat detail
                      <Icon name="arrow-up-right" size={14} />
                    </span>
                  </div>
                </button>
              </article>
            ))}
          </div>

          {/* Mobile arrows */}
          {items.length > 1 ? (
            <div className="mt-2 flex items-center justify-center gap-3 md:hidden">
              <button
                type="button"
                className="icon-btn"
                aria-label="Sebelumnya"
                disabled={index <= 0}
                onClick={() => goTo(index - 1)}
              >
                <Icon name="chevron-left" size={18} />
              </button>
              <span className="text-[12.5px] font-semibold text-ink-muted">
                {index + 1} / {items.length}
              </span>
              <button
                type="button"
                className="icon-btn"
                aria-label="Berikutnya"
                disabled={index >= items.length - 1}
                onClick={() => goTo(index + 1)}
              >
                <Icon name="chevron-right" size={18} />
              </button>
            </div>
          ) : null}
        </div>
      )}

      <Modal
        open={current !== null}
        onClose={() => setOpenIndex(null)}
        title={current?.title ?? ""}
        description={current ? `${current.role} · ${current.company}` : ""}
        footer={
          current && items.length > 1 ? (
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                disabled={openIndex === null || openIndex <= 0}
                onClick={() =>
                  setOpenIndex((prev) => Math.max(0, (prev ?? 0) - 1))
                }
              >
                <Icon name="chevron-left" size={16} />
                Sebelumnya
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                disabled={
                  openIndex === null || openIndex >= items.length - 1
                }
                onClick={() =>
                  setOpenIndex((prev) =>
                    Math.min(items.length - 1, (prev ?? 0) + 1)
                  )
                }
              >
                Berikutnya
                <Icon name="chevron-right" size={16} />
              </button>
            </div>
          ) : null
        }
      >
        {current ? (
          <div className="stack gap-4">
            <SmartImage
              src={current.image}
              alt={current.title}
              ratio="4 / 3"
              rounded="rounded-2xl"
            />
            <div className="flex flex-wrap gap-2">
              <span className="chip">
                <Icon name="briefcase" size={14} />
                {current.role}
              </span>
              <span className="chip">
                <Icon name="pin" size={14} />
                {current.company}
              </span>
              <span className="chip">
                <Icon name="layers" size={14} />
                {current.period}
              </span>
            </div>
            <p className="leading-copy text-sm text-ink-muted">
              {current.description}
            </p>
            {current.tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {current.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-accent-tint px-3 py-1 text-[12px] font-medium text-accent"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </Section>
  );
}
