/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        atelier: {
          bg: "#080808",
          dark: "#0d0d0d",
          card: "#121212",
          cardHover: "#181818",
          border: "#222222",
          borderLight: "#333333",
          red: "#ff1e38",
          redGlow: "rgba(255, 30, 56, 0.35)",
          redDark: "#b80018",
          crimson: "#d90429",
          amber: "#ff9f1c",
          muted: "#888888",
          dim: "#555555"
        }
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Rajdhani', 'sans-serif'],
        display: ['Orbitron', 'Chakra Petch', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'glow-red': '0 0 25px rgba(255, 30, 56, 0.45)',
        'glow-red-lg': '0 0 50px rgba(255, 30, 56, 0.55)',
        'hud': 'inset 0 0 15px rgba(255, 30, 56, 0.15), 0 0 20px rgba(0, 0, 0, 0.8)'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.85' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scanline 8s linear infinite',
        'spin-slow': 'spin 12s linear infinite',
      }
    },
  },
  plugins: [],
}
