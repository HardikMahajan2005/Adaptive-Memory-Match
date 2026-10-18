/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#070B18',
          surface: '#10182B',
          elevated: '#17223A',
          card: 'rgba(23, 34, 58, 0.65)',
          border: 'rgba(255, 255, 255, 0.12)',
        },
        light: {
          bg: '#F3F6FC',
          surface: '#FFFFFF',
          elevated: '#F8FAFC',
          card: 'rgba(255, 255, 255, 0.75)',
          border: 'rgba(255, 255, 255, 0.6)',
        },
        accent: {
          blue: '#3B82F6',
          cyan: '#38BDF8',
          violet: '#8B5CF6',
          mint: '#34D399',
          coral: '#FB7185',
          amber: '#FBBF24',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glass-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)',
        'glass-hover': '0 12px 40px 0 rgba(59, 130, 246, 0.3), inset 0 1px 2px 0 rgba(255, 255, 255, 0.3)',
        'card-glow-blue': '0 0 25px -4px rgba(56, 189, 248, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
        'card-glow-coral': '0 0 25px -4px rgba(251, 113, 133, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
        'card-glow-amber': '0 0 25px -4px rgba(251, 191, 36, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
        'card-glow-mint': '0 0 25px -4px rgba(52, 211, 153, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
        'card-glow-violet': '0 0 25px -4px rgba(139, 92, 246, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '16px',
        'glass-lg': '24px',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
