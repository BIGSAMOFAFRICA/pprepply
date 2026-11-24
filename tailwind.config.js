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
        sans: ['Plus Jakarta Sans', 'DM Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'monospace'],
      },
      colors: {
        bg: {
          DEFAULT: '#F6F5FB',
          subtle: '#F1F0F7',
          surface: '#FFFFFF',
          hover: '#F8F7FD',
        },
        primary: {
          DEFAULT: '#5B5BD6',
          hover: '#4D4DBF',
          soft: '#ECEBFA',
          subtle: '#F4F3FC',
        },
        ink: {
          DEFAULT: '#1F2340',
          muted: '#6B7089',
          faint: '#9EA3B8',
        },
        line: {
          DEFAULT: '#E7E6F0',
          soft: '#F0EFF6',
        },
        status: {
          success: '#3F9B7A',
          'success-soft': '#EAF6F1',
          warning: '#C98A2B',
          'warning-soft': '#FDF6EB',
          danger: '#C0524F',
          'danger-soft': '#FBECEC',
        },
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '28px',
        'pill': '9999px',
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(31, 35, 64, 0.04)',
        'soft-md': '0 4px 20px rgba(31, 35, 64, 0.06)',
        'soft-lg': '0 8px 30px rgba(31, 35, 64, 0.08)',
        'floating': '0 12px 36px -4px rgba(31, 35, 64, 0.1)',
        'pill': '0 4px 16px rgba(91, 91, 214, 0.12)',
      },
      transitionDuration: {
        DEFAULT: '180ms',
      },
    },
  },
  plugins: [],
};
