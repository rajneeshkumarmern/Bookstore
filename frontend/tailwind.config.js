/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        glass:
          '0 8px 32px rgba(0,0,0,0.32), 0 2px 12px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08)',
        'glass-lg':
          '0 28px 72px -16px rgba(0,0,0,0.55), 0 12px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.06)',
        'glass-sm':
          '0 4px 20px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.06)',
        glow: '0 0 60px rgba(251,191,36,0.14), 0 0 1px rgba(251,191,36,0.35)',
        'glow-violet': '0 0 80px rgba(139,92,246,0.15)',
      },
    },
  },
  plugins: [],
}

