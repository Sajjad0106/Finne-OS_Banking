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
        background: "#050505",
        panel: "#0A0A0A",
        gold: {
          DEFAULT: "#2F8E7F", // IDBI Soft Pastel Teal Green
          secondary: "#DF955B", // IDBI Soft Pastel Orange
          50: "#E6F4F2",
          100: "#C2E4DF",
          200: "#9CD1C9",
          300: "#75BDB1",
          400: "#2F8E7F",
          500: "#27786B",
          600: "#206257",
          700: "#184A42",
          800: "#10322C",
          900: "#081A16",
        },
        success: "#00FF9D",
        warning: "#FFB020",
        critical: "#FF4D4D",
        info: "#5DA9FF",
        mutedText: "rgba(255,255,255,0.65)",
      },
      borderRadius: {
        '3xl': '24px',
      },
      backdropBlur: {
        '25': '25px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float-delayed 8s ease-in-out infinite',
        'breath': 'breath 3s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 15px rgba(0, 131, 108, 0.2)' },
          '50%': { opacity: '0.6', boxShadow: '0 0 25px rgba(0, 131, 108, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'float-delayed': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-8px) translateX(5px)' },
        },
        breath: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
