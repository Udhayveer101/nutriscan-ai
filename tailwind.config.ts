import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          950: "#0b1a12",
          900: "#0d4c26",
          800: "#116534",
          700: "#15803d",
          600: "#16a34a",
          500: "#22c55e",
          400: "#4ade80",
          50: "#f0fdf4",
        },
        navy: {
          900: "#0d2016",
          800: "#123024",
          700: "#0e5231",
          600: "#116534",
        },
        emerald: {
          DEFAULT: "#0d9488",
          light: "#34d399",
          dark: "#0f766e",
        },
        ink: {
          DEFAULT: "#0e2015",
          2: "#12281b",
          3: "#2c4636",
        },
        sage: {
          DEFAULT: "#3c5445",
          muted: "#6a8271",
          muted2: "#7d9488",
          muted3: "#8aa093",
        },
        bone: "#f6f5f1",
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono-label)", "ui-monospace", "monospace"],
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        shimmer: "shimmer 2s infinite linear",
        "pulse-slow": "pulse 3s infinite",
        float: "float 6s ease-in-out infinite",
        floaty: "floaty 4.5s ease-in-out infinite",
        floaty2: "floaty2 5.5s ease-in-out infinite",
        beam: "beam 3.6s linear infinite",
        drift: "drift 14s ease-in-out infinite",
        "drift-rev": "drift 18s ease-in-out infinite reverse",
        blink: "blink 1.2s step-end infinite",
        cpulse: "cpulse 2.4s ease-in-out infinite",
        fillW: "fillW 1.3s .5s cubic-bezier(.2,.7,.2,1) both",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        floaty2: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        beam: {
          "0%": { top: "-32%", opacity: "0" },
          "12%": { opacity: "1" },
          "88%": { opacity: "1" },
          "100%": { top: "112%", opacity: "0" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0,0)" },
          "50%": { transform: "translate(20px,-16px)" },
        },
        blink: {
          "0%, 48%": { opacity: "1" },
          "49%, 100%": { opacity: "0" },
        },
        cpulse: {
          "0%, 100%": { opacity: ".45" },
          "50%": { opacity: "1" },
        },
        fillW: {
          from: { width: "0" },
          to: { width: "var(--w, 70%)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
