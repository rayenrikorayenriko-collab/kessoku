"use client";

import { useState } from "react";
import { Icon } from "./Icon";

type SmartImageProps = {
  src?: string;
  alt: string;
  /** CSS aspect-ratio value, e.g. "4 / 3", "1 / 1", "16 / 9". */
  ratio?: string;
  fit?: "cover" | "contain";
  className?: string;
  imgClassName?: string;
  shimmer?: boolean;
  rounded?: string;
};

/**
 * Fixed-ratio media frame: the picture always keeps its proportions,
 * never stretches and never shifts the layout.
 */
export function SmartImage({
  src,
  alt,
  ratio = "4 / 3",
  fit = "cover",
  className = "",
  imgClassName = "",
  shimmer = false,
  rounded = "rounded-2xl"
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;

  return (
    <div
      className={`relative overflow-hidden bg-surface-muted ${rounded} ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {showFallback ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink-faint">
          <Icon name="image" size={26} />
          <span className="text-[11px] font-medium uppercase tracking-widest">
            Media
          </span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full ${
            fit === "cover" ? "object-cover" : "object-contain"
          } ${imgClassName}`}
        />
      )}
      {shimmer && !showFallback ? <span className="shimmer-layer" /> : null}
    </div>
  );
}
