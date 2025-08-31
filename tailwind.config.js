/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Neo Brutalism Color Palette
        violet: {
          200: '#A8A6FF',
          300: '#918efa',
          400: '#807dfa',
        },
        pink: {
          200: '#FFA6F6',
          300: '#fa8cef',
          400: '#fa7fee',
        },
        red: {
          200: '#FF9F9F',
          300: '#fa7a7a',
          400: '#f76363',
        },
        orange: {
          200: '#FFC29F',
          300: '#FF965B',
          400: '#fa8543',
        },
        yellow: {
          200: '#FFF066',
          300: '#FFE500',
          400: '#FFE500',
        },
        lime: {
          200: '#B8FF9F',
          300: '#9dfc7c',
          400: '#7df752',
        },
        cyan: {
          200: '#A6FAFF',
          300: '#79F7FF',
          400: '#53f2fc',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #000000',
        'brutal-sm': '2px 2px 0px 0px #000000',
        'brutal-lg': '8px 8px 0px 0px #000000',
        'brutal-xl': '12px 12px 0px 0px #000000',
        'brutal-inner': 'inset 4px 4px 0px 0px #000000',
        'brutal-glow': '0 0 20px rgba(255, 229, 0, 0.5)',
        'brutal-text': '2px 2px 0px 0px #000000',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
        '6': '6px',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "brutal-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "brutal-shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-2px)" },
          "75%": { transform: "translateX(2px)" },
        },
        "brutal-pulse": {
          "0%, 100%": { boxShadow: "4px 4px 0px 0px #000000" },
          "50%": { boxShadow: "6px 6px 0px 0px #000000" },
        },
        "brutal-glow": {
          "0%, 100%": { boxShadow: "0 0 10px rgba(255, 229, 0, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(255, 229, 0, 0.6)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "brutal-bounce": "brutal-bounce 0.6s ease-in-out",
        "brutal-shake": "brutal-shake 0.5s ease-in-out",
        "brutal-pulse": "brutal-pulse 1s ease-in-out infinite",
        "brutal-glow": "brutal-glow 2s ease-in-out infinite",
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}