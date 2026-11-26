"use client";

import { useConfig } from "@/components/providers/ConfigProvider";
import { usePrefs } from "@/components/providers/PrefsProvider";
import { SmartImage } from "@/components/ui/SmartImage";
import { Section, SectionHeading } from "@/components/ui/Section";

export function AboutSection() {
  const { config } = useConfig();
  const { animations } = usePrefs();
  const anim = config.animation.enabled && animations;
  const about = config.about;

  return (
    <Section id="tentang">
      <SectionHeading eyebrow="Tentang" title={about.title} description={about.subtitle} />

      <div className="mt-10 grid items-center gap-8 md:mt-14 md:grid-cols-2 md:gap-12">
        <div className={anim ? "reveal" : ""}>
          <p className="leading-copy whitespace-pre-line text-[15px] text-ink-muted sm:text-[16.5px]">
            {about.body}
          </p>

          {about.highlights?.length ? (
            <div className="mt-8 grid grid-cols-3 gap-3">
              {about.highlights.map((item) => (
                <div
                  key={item.id}
                  className="hairline rounded-2xl bg-white/70 px-3 py-4 text-center"
                >
                  <div className="font-display text-[clamp(1.1rem,4.5vw,1.6rem)] font-semibold text-ink">
                    {item.value}
                  </div>
                  <div className="mt-1 text-[10.5px] font-medium uppercase tracking-[0.12em] text-ink-muted">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <figure className={`${anim ? "reveal" : ""} mx-auto w-full max-w-md md:max-w-none`}>
          <div className="glass rounded-3xl p-3">
            <SmartImage
              src={about.imageUrl}
              alt={about.imageCaption || about.title}
              ratio="4 / 5"
              rounded="rounded-2xl"
              className="mx-auto w-full"
              shimmer={config.animation.enabled && config.animation.shimmer && animations}
            />
          </div>
          {about.imageCaption ? (
            <figcaption className="mt-3 text-center text-[12.5px] text-ink-muted">
              {about.imageCaption}
            </figcaption>
          ) : null}
        </figure>
      </div>
    </Section>
  );
}
