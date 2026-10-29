/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    // Albedo, measure from 2. Spacing, type, line height, radii and widths
    // replace the Tailwind defaults instead of extending them, so no value
    // outside the scale can slip back in through a default utility.
    // Spacing steps are powers of two in px: step-n = 2^n px.
    spacing: {
      0: '0',
      px: '1px',
      'step-2': '4px',
      'step-3': '8px',
      'step-4': '16px',
      'step-5': '32px',
      'step-6': '64px',
      'step-7': '128px',
    },
    // Type sizes are 2^(k/2) rem, with 0.875rem (1 - 2^-3) as the legibility
    // floor. Running text and the first steps carry √2 line height; the two
    // display steps sit at 1.
    fontSize: {
      'type-sm': ['0.875rem', { lineHeight: '1.414' }],
      'type-0': ['1rem', { lineHeight: '1.414' }],
      'type-1': ['1.414rem', { lineHeight: '1.414' }],
      'type-2': ['2rem', { lineHeight: '1.414' }],
      'type-3': ['2.828rem', { lineHeight: '1' }],
      'type-4': ['4rem', { lineHeight: '1' }],
    },
    lineHeight: {
      none: '1',
      normal: '1.414',
    },
    borderRadius: {
      none: '0',
      sm: '4px',
      md: '8px',
      lg: '16px',
      full: '9999px',
    },
    // Shell 1024px. The text column is 32em: 32rem at body size, and the same
    // measure in characters for lead copy set a step larger.
    maxWidth: {
      none: 'none',
      full: '100%',
      shell: '1024px',
      text: '32em',
    },
    extend: {
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        border: "oklch(var(--border) / <alpha-value>)",
        background: "oklch(var(--background) / <alpha-value>)",
        foreground: "oklch(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: "oklch(var(--secondary) / <alpha-value>)",
        muted: {
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
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
