"use client";

import { useEffect, useRef, useState } from "react";
import { useConfig } from "@/components/providers/ConfigProvider";
import { usePrefs } from "@/components/providers/PrefsProvider";
import { Icon } from "@/components/ui/Icon";
import { Section, SectionHeading } from "@/components/ui/Section";

const format = (value: number) => new Intl.NumberFormat("id-ID").format(value);

function CountUp({ value, enabled }: { value: number; enabled: boolean }) {
  const [display, setDisplay] = useState(enabled ? 0 : value);
  const ref = useRef<HTMLSpanElement>(null);
  const played = useRef(false);

  useEffect(() => {
    if (!enabled) {
      setDisplay(value);
      return;
    }
    setDisplay(0);
    played.current = false;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || played.current) return;
        played.current = true;
        const duration = 1000;
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(value * eased));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value, enabled]);

  return <span ref={ref}>{format(display)}</span>;
}

export function HashtagSection() {
  const { config } = useConfig();
  const { animations } = usePrefs();
  const anim = config.animation.enabled && animations;
  const data = config.hashtags;

  return (
    <Section id="hashtag">
      <SectionHeading
        eyebrow="Hashtag"
        title={data.title}
        description={data.description}
        align="center"
      />

      <div className={`mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${anim ? "reveal" : ""}`}>
        {(data.items ?? []).map((item) => (
          <div
            key={item.id}
            className="glass group rounded-3xl p-6 transition-transform duration-500 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-white">
                <Icon name="hash" size={20} />
              </span>
              <Icon
                name="arrow-up-right"
                size={18}
                className="text-ink-faint transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </div>
            <p className="mt-5 font-display text-xl font-semibold text-ink">
              {item.tag}
            </p>
            <p className="mt-1 text-[12.5px] font-medium uppercase tracking-[0.14em] text-ink-muted">
              Pemakai
            </p>
            <p className="mt-2 font-display text-[clamp(1.7rem,6vw,2.3rem)] font-semibold text-accent">
              <CountUp value={item.count} enabled={anim} />
            </p>
          </div>
        ))}
      </div>

      {data.note ? (
        <p className="mt-6 flex items-center justify-center gap-2 text-[13px] text-ink-muted">
          <Icon name="info" size={16} />
          {data.note}
        </p>
      ) : null}
    </Section>
  );
}
