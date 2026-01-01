import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        'rainbow-border': 'rainbow-border 3s linear infinite',
        'gradient-x': 'gradient-x 3s ease infinite',
        'gradient-flow': 'gradient-flow 3s ease infinite',
        'scan': 'scan 2s linear infinite',
        'pulse-rgb': 'pulse-rgb 2s ease-in-out infinite',
      },
      keyframes: {
        'rainbow-border': {
          '0%, 100%': { 
            borderColor: 'rgb(255, 0, 0) rgb(0, 255, 0) rgb(0, 0, 255) rgb(255, 255, 0)' 
          },
          '25%': { 
            borderColor: 'rgb(0, 255, 0) rgb(0, 0, 255) rgb(255, 255, 0) rgb(255, 0, 0)' 
          },
          '50%': { 
            borderColor: 'rgb(0, 0, 255) rgb(255, 255, 0) rgb(255, 0, 0) rgb(0, 255, 0)' 
          },
          '75%': { 
            borderColor: 'rgb(255, 255, 0) rgb(255, 0, 0) rgb(0, 255, 0) rgb(0, 0, 255)' 
          },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-flow': {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' }
        },
        'scan': {
          '0%': { 'background-position': '-100% 0' },
          '100%': { 'background-position': '200% 0' }
        },
        'pulse-rgb': {
          '0%, 100%': {
            'box-shadow': '0 0 20px rgba(255, 0, 0, 0.5)',
            'border-color': 'rgb(255, 0, 0)'
          },
          '33%': {
            'box-shadow': '0 0 20px rgba(0, 255, 0, 0.5)',
            'border-color': 'rgb(0, 255, 0)'
          },
          '66%': {
            'box-shadow': '0 0 20px rgba(0, 0, 255, 0.5)',
            'border-color': 'rgb(0, 0, 255)'
          },
        }
      },
      backgroundSize: {
        'gradient-flow': '200% 200%',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;