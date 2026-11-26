"use client";

import { useMemo } from "react";
import { useConfig } from "@/components/providers/ConfigProvider";
import { usePrefs } from "@/components/providers/PrefsProvider";
import { useMediaQuery } from "@/lib/hooks";
import type { BackgroundPreset } from "@/lib/types";

/**
 * Fixed page background. Solid colour, image or video — never a decorative
 * colour gradient. On phones a soft transparency mask fades the bottom into
 * white so the content always stays readable.
 */
export function BackgroundLayer() {
  const { config } = useConfig();
  const { backgroundId } = usePrefs();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const active = useMemo(() => {
    const bg = config.background;
    if (backgroundId !== "default") {
      const preset = bg.presets?.find(
        (item: BackgroundPreset) => item.id === backgroundId
      );
      if (preset) return preset;
    }
    return {
      id: "default",
      label: "Default",
      type: bg.type,
      color: bg.color,
      desktopUrl: bg.desktopUrl,
      mobileUrl: bg.mobileUrl
    };
  }, [config.background, backgroundId]);

  const source =
    isMobile && active.mobileUrl ? active.mobileUrl : active.desktopUrl;
  const veil = config.background.overlayOpacity;

  const maskStyle = config.background.fadeBottom
    ? {
        WebkitMaskImage:
          "linear-gradient(to bottom, #000 0%, #000 62%, transparent 100%)",
        maskImage:
          "linear-gradient(to bottom, #000 0%, #000 62%, transparent 100%)"
      }
    : undefined;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ backgroundColor: active.color || "#ffffff" }}
    >
      {active.type !== "plain" && source ? (
        active.type === "video" ? (
          <video
            key={source}
            src={source}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
            style={maskStyle}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={source}
            src={source}
            alt=""
            className="h-full w-full object-cover"
            style={maskStyle}
          />
        )
      ) : null}

      {active.type !== "plain" && source ? (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: `rgba(255,255,255,${veil})` }}
        />
      ) : null}
    </div>
  );
}
