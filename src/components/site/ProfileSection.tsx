"use client";

import { useConfig } from "@/components/providers/ConfigProvider";
import { usePrefs } from "@/components/providers/PrefsProvider";
import { Icon } from "@/components/ui/Icon";
import { SmartImage } from "@/components/ui/SmartImage";
import { Section } from "@/components/ui/Section";

export function ProfileSection() {
  const { config } = useConfig();
  const { animations } = usePrefs();
  const anim = config.animation.enabled && animations;
  const profile = config.profile;

  return (
    <Section id="profil">
      <div className={`grid gap-8 md:grid-cols-[minmax(0,360px)_minmax(0,1fr)] md:items-center md:gap-12`}>
        <div className={`${anim ? "reveal" : ""}`}>
          <div className="glass rounded-3xl p-3">
            <SmartImage
              src={profile.photoUrl}
              alt={profile.name}
              ratio="1 / 1"
              rounded="rounded-2xl"
              shimmer={config.animation.enabled && config.animation.shimmer && animations}
            />
          </div>
        </div>

        <div className={anim ? "reveal" : ""}>
          <span className="text-[11.5px] font-semibold uppercase tracking-[0.22em] text-accent">
            Profil
          </span>
          <h2 className="mt-3 text-[clamp(1.9rem,6vw,3rem)] font-semibold text-ink">
            {profile.name}
          </h2>
          <p className="mt-2 font-display text-base font-medium text-ink-soft sm:text-lg">
            {profile.role}
          </p>

          {profile.location ? (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="chip">
                <Icon name="pin" size={15} />
                {profile.location}
              </span>
            </div>
          ) : null}

          {profile.bio ? (
            <p className="leading-copy mt-6 max-w-2xl text-[15px] text-ink-muted sm:text-base">
              {profile.bio}
            </p>
          ) : null}

          {profile.socials?.length ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {profile.socials.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                >
                  <Icon name={social.icon} size={16} />
                  {social.label}
                  <Icon name="arrow-up-right" size={14} className="text-ink-faint" />
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
