import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        game: {
          navy: "#0a1128",
          deep: "#050814",
          surface: "#101b38",
          surfaceHover: "#16254c",
          panel: "#132145",
          gold: "#f59e0b",
          goldLight: "#fde047",
          goldDark: "#b45309",
          turquoise: "#0ea5e9",
          cyan: "#06b6d4",
          emerald: "#10b981",
          terracotta: "#ea580c",
          coral: "#f43f5e",
          cream: "#FAF3E3",
          sand: "#E7D6AF",
          sky: "#38bdf8",
        },
      },
      boxShadow: {
        "gold-glow": "0 0 25px rgba(245, 158, 11, 0.45)",
        "gold-glow-lg": "0 0 45px rgba(245, 158, 11, 0.65)",
        "turquoise-glow": "0 0 25px rgba(14, 165, 233, 0.45)",
        "portal-glow": "0 0 50px rgba(6, 182, 212, 0.6)",
        "panel-inner": "inset 0 1px 0 rgba(255, 255, 255, 0.12)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)",
        "gold-button": "linear-gradient(180deg, #fcd34d 0%, #f59e0b 60%, #d97706 100%)",
        "blue-gradient": "linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)",
        "panel-gradient": "linear-gradient(180deg, rgba(22, 37, 76, 0.95) 0%, rgba(10, 17, 40, 0.95) 100%)",
        "world-gradient": "radial-gradient(ellipse at top, #1e3a8a 0%, #0a1128 70%)",
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "spin-slow": "spin 25s linear infinite",
        "shimmer": "shimmer 2.5s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", filter: "drop-shadow(0 0 15px rgba(245, 158, 11, 0.4))" },
          "50%": { opacity: "1", filter: "drop-shadow(0 0 35px rgba(245, 158, 11, 0.8))" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
