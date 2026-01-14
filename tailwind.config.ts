import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "900px",
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        "text-secondary": "hsl(var(--text-secondary))",
        "text-tertiary": "hsl(var(--text-tertiary))",
        "heading-primary": "hsl(var(--heading-primary))",
        "heading-secondary": "hsl(var(--heading-secondary))",
        "surface-elevated": "hsl(var(--surface-elevated))",
        "surface-subtle": "hsl(var(--surface-subtle))",
        "accent-purple": "hsl(var(--accent-purple))",
        "accent-blue": "hsl(var(--accent-blue))",
        "accent-cyan": "hsl(var(--accent-cyan))",
        "accent-pink": "hsl(var(--accent-pink))",
        "accent-orange": "hsl(var(--accent-orange))",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'document-title': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'document-h2': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'document-h3': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],
        'document-body': ['1rem', { lineHeight: '1.7' }],
        'document-small': ['0.875rem', { lineHeight: '1.5' }],
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
        "float": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "33%": { transform: "translateY(-20px) rotate(5deg)" },
          "66%": { transform: "translateY(10px) rotate(-3deg)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "25%": { transform: "translate(30px, -30px) scale(1.05)" },
          "50%": { transform: "translate(-20px, 20px) scale(0.95)" },
          "75%": { transform: "translate(20px, 10px) scale(1.02)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.1)" },
        },
        "gradient-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "aurora": {
          "0%": { transform: "translateX(-20%) translateY(-10%) rotate(-5deg)" },
          "25%": { transform: "translateX(10%) translateY(5%) rotate(3deg)" },
          "50%": { transform: "translateX(20%) translateY(-5%) rotate(5deg)" },
          "75%": { transform: "translateX(-10%) translateY(10%) rotate(-3deg)" },
          "100%": { transform: "translateX(-20%) translateY(-10%) rotate(-5deg)" },
        },
        "aurora-slow": {
          "0%": { transform: "translateX(10%) translateY(-15%) rotate(3deg) scale(1)" },
          "33%": { transform: "translateX(-15%) translateY(10%) rotate(-5deg) scale(1.1)" },
          "66%": { transform: "translateX(20%) translateY(5%) rotate(7deg) scale(0.95)" },
          "100%": { transform: "translateX(10%) translateY(-15%) rotate(3deg) scale(1)" },
        },
        "aurora-reverse": {
          "0%": { transform: "translateX(15%) translateY(0%) rotate(5deg)" },
          "50%": { transform: "translateX(-25%) translateY(-10%) rotate(-7deg)" },
          "100%": { transform: "translateX(15%) translateY(0%) rotate(5deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 8s ease-in-out infinite",
        "float-slow": "float-slow 15s ease-in-out infinite",
        "pulse-glow": "pulse-glow 6s ease-in-out infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "aurora": "aurora 20s ease-in-out infinite",
        "aurora-slow": "aurora-slow 30s ease-in-out infinite",
        "aurora-reverse": "aurora-reverse 25s ease-in-out infinite reverse",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
