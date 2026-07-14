/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      // Type scale on the golden ratio: every size is φ^(n/4) rem, base 1rem.
      // Line heights step down the same ladder: φ for running text to 1 for display.
      fontSize: {
        xs: ['0.786rem', { lineHeight: '1.618' }],
        sm: ['0.887rem', { lineHeight: '1.618' }],
        base: ['1rem', { lineHeight: '1.618' }],
        lg: ['1.128rem', { lineHeight: '1.618' }],
        xl: ['1.272rem', { lineHeight: '1.618' }],
        '2xl': ['1.434rem', { lineHeight: '1.618' }],
        '3xl': ['1.618rem', { lineHeight: '1.272' }],
        '4xl': ['2.058rem', { lineHeight: '1.272' }],
        '5xl': ['2.618rem', { lineHeight: '1.128' }],
        '6xl': ['3.33rem', { lineHeight: '1.128' }],
        '7xl': ['4.236rem', { lineHeight: '1' }],
        '8xl': ['5.388rem', { lineHeight: '1' }],
        '9xl': ['6.854rem', { lineHeight: '1' }],
      },
      // Spacing tokens on the same ladder: φ^(n/2) rem. Use these instead of the
      // default numeric spacing for gaps, margins, and paddings.
      spacing: {
        'phi-3xs': '0.382rem',
        'phi-2xs': '0.618rem',
        'phi-xs': '0.786rem',
        'phi-sm': '1rem',
        'phi-md': '1.272rem',
        'phi-lg': '1.618rem',
        'phi-xl': '2.058rem',
        'phi-2xl': '2.618rem',
        'phi-3xl': '3.33rem',
        'phi-4xl': '4.236rem',
        'phi-5xl': '5.388rem',
        'phi-6xl': '6.854rem',
      },
      colors: {
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
