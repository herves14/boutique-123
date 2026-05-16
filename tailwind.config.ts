import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          black:  '#0A0A0A',
          dark:   '#111111',
          dark2:  '#1A1A1A',
          gold:   '#C9A84C',
          'gold-light': '#E8CC7A',
          cream:  '#F5F0E8',
          'cream-2': '#EDE8DF',
          white:  '#FAFAF8',
          gray:   '#888880',
        },
      },
      fontFamily: {
        cormorant: ['var(--font-cormorant)', 'serif'],
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
      },
      animation: {
        'marquee': 'marquee 22s linear infinite',
        'fade-up': 'fadeUp 0.8s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config