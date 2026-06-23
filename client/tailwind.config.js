/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // We can save our custom AniList colors right here!
        'ani-dark': '#0b1622',
        'ani-card': '#151f2e',
        'ani-elevated': '#1c2940', // hover/raised surface
        'ani-blue': '#3db4f2',
        'ani-text': '#edf1f5',
        'ani-subtext': '#9fadbd',
        'ani-red': '#e2626b',
        'ani-movie': '#90cea1', // movie accent (was inline #90cea1)
        'ani-border': '#22304a', // consistent divider/border
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 16px -4px rgba(0, 0, 0, 0.5)',
        'card-hover': '0 16px 40px -8px rgba(0, 0, 0, 0.65)',
        'glow-blue': '0 0 0 1px rgba(61, 180, 242, 0.4), 0 8px 24px -6px rgba(61, 180, 242, 0.35)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
      },
    },
  },
  plugins: [],
}
