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
        'ani-blue': '#3db4f2',
        'ani-text': '#edf1f5',
        'ani-subtext': '#9fadbd',
        'ani-red': '#e2626b'
      }
    },
  },
  plugins: [],
}