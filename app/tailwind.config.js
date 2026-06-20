/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './app/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // RFC design system custom colours (mapped to CSS variables in index.css).
        // `accent` (shadcn object below) is reused as the design-system accent.
        "bg-dark": "var(--bg-dark)",
        "bg-white": "var(--bg-white)",
        "bg-offwhite": "var(--bg-offwhite)",
        "bg-green": "var(--bg-green)",
        "accent-hover": "var(--accent-hover)",
        "text-heading": "var(--text-heading)",
        "text-body-color": "var(--text-body)",
        "text-muted": "var(--text-muted)",
        "border-default": "hsl(var(--border))",
        "border-light": "var(--border-light)",
        "border-dark": "var(--border-dark)",
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
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
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
        rfc: {
          green: {
            50: '#f0f5e8',
            100: '#d4e6c3',
            200: '#b8d4a8',
            300: '#8FBC8F',
            400: '#6B8E23',
            500: '#4A7C2F',
            600: '#2D5016',
            700: '#1e3a0f',
            800: '#152b0a',
            900: '#0d1d06',
          },
          navy: {
            50: '#f0f2f5',
            100: '#d9dfe8',
            200: '#b3c0d1',
            300: '#8da1ba',
            400: '#5a7296',
            500: '#3d5a7d',
            600: '#1a2332',
            700: '#131b26',
            800: '#0d1219',
            900: '#070a0d',
          },
          gold: {
            50: '#fdf8e8',
            100: '#f9edc4',
            200: '#f5e2a0',
            300: '#e8cc6e',
            400: '#C9A227',
            500: '#b08e1f',
            600: '#967a1b',
            700: '#7d6616',
          },
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
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
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
}