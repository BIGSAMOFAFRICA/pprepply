/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-syne)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
        display: ['var(--font-syne)', 'sans-serif'],
      },
      colors: {
        bg: {
          DEFAULT: '#080C14',
          secondary: '#0D1420',
          card: '#111827',
          hover: '#1a2436',
        },
        accent: {
          DEFAULT: '#00E5A0',
          dim: '#00b37e',
          glow: 'rgba(0,229,160,0.15)',
          subtle: 'rgba(0,229,160,0.08)',
        },
        cyan: {
          accent: '#22D3EE',
          glow: 'rgba(34,211,238,0.15)',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.06)',
          accent: 'rgba(0,229,160,0.3)',
        },
        text: {
          primary: '#F0F4FF',
          secondary: '#8899AA',
          muted: '#4A5568',
        },
      },
      backgroundImage: {
        'grid-pattern': 'radial-gradient(rgba(0,229,160,0.06) 1px, transparent 1px)',
        'glow-accent': 'radial-gradient(ellipse at top, rgba(0,229,160,0.12) 0%, transparent 60%)',
        'glow-cyan': 'radial-gradient(ellipse at bottom right, rgba(34,211,238,0.1) 0%, transparent 60%)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      boxShadow: {
        'glow-sm': '0 0 20px rgba(0,229,160,0.15)',
        'glow-md': '0 0 40px rgba(0,229,160,0.2)',
        'glow-lg': '0 0 80px rgba(0,229,160,0.15)',
        'card': '0 1px 0 rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.4)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'scan': 'scan 3s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,229,160,0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(0,229,160,0.4)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
      },
    },
  },
  plugins: [],
};
