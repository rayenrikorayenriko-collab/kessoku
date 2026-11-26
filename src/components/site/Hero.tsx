"use client";

import { useConfig } from "@/components/providers/ConfigProvider";
import { usePrefs } from "@/components/providers/PrefsProvider";
import { Icon } from "@/components/ui/Icon";

export function Hero() {
  const { config } = useConfig();
  const { animations } = usePrefs();
  const anim = config.animation.enabled && animations;
  const hero = config.hero;

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative pb-10 pt-28 sm:pt-32 md:pb-16 md:pt-40">
      <div className="wrap">
        <div
          className={`mx-auto max-w-3xl text-center ${anim ? "reveal" : ""}`}
        >
          <h1 className="mt-6 text-[clamp(2.4rem,9vw,4.75rem)] font-semibold leading-[1.02] text-ink">
            {hero.title}
          </h1>

          {hero.subtitle ? (
            <p className="mt-5 font-display text-[clamp(1.05rem,3.4vw,1.5rem)] font-medium text-ink-soft">
              {hero.subtitle}
            </p>
          ) : null}

          {hero.description ? (
            <p className="leading-copy mx-auto mt-5 max-w-2xl text-[15px] text-ink-muted sm:text-base">
              {hero.description}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            {hero.primaryButton?.label ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => scrollTo(hero.primaryButton.href)}
              >
                {hero.primaryButton.label}
                <Icon name="arrow-right" size={17} />
              </button>
            ) : null}
            {hero.secondaryButton?.label ? (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => scrollTo(hero.secondaryButton.href)}
              >
                <Icon name="layers" size={17} />
                {hero.secondaryButton.label}
              </button>
            ) : null}
          </div>
        </div>

        {hero.stats?.length ? (
          <div
            className={`glass mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-2 rounded-3xl p-2 sm:mt-16 sm:gap-4 sm:p-3 ${
              anim ? "reveal" : ""
            }`}
          >
            {hero.stats.map((stat) => (
              <div
                key={stat.id}
                className="rounded-2xl px-2 py-4 text-center sm:px-4 sm:py-5"
              >
                <div className="font-display text-[clamp(1.35rem,5vw,2rem)] font-semibold text-ink">
                  {stat.value}
                </div>
                <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-ink-muted sm:text-xs">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
