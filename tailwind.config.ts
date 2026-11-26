import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0C0D12",
          soft: "#2A2C36",
          muted: "#6B6E7C",
          faint: "#9A9DA8"
        },
        line: "#E8E9EE",
        accent: {
          DEFAULT: "#C8102E",
          soft: "#E23B4E",
          tint: "#FDF2F3"
        },
        surface: {
          DEFAULT: "#FFFFFF",
          subtle: "#F7F8FA",
          muted: "#F1F2F6"
        }
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif"
        ],
        display: [
          "Sora",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif"
        ]
      },
      borderRadius: {
        xl: "14px",
        "2xl": "18px",
        "3xl": "24px",
        "4xl": "32px"
      },
      boxShadow: {
        soft: "0 1px 2px rgba(12,13,18,0.04), 0 8px 24px -12px rgba(12,13,18,0.10)",
        lift: "0 2px 4px rgba(12,13,18,0.05), 0 18px 40px -20px rgba(12,13,18,0.16)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.6)"
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" }
        },
        shimmer: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(220%)" }
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 0.5s ease both",
        "scale-in": "scale-in 0.35s cubic-bezier(0.22,1,0.36,1) both",
        shimmer: "shimmer 2.6s ease-in-out infinite",
        "spin-slow": "spin-slow 1s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
