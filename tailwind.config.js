/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#C9A227",
          light: "#E8C547",
          dark: "#9C7A1A",
        },
        forest: {
          DEFAULT: "#0E5C3F",
          light: "#1A7A56",
          dark: "#073D29",
        },
        cream: "#FBF9F4",
        ink: "#16201C",
        admin: {
          bg: '#F9F8F5',
          surface: '#FFFFFF',
          surface2: '#F2F0EB',
          border: '#E4E0D8',
          text: '#16201C',
          muted: '#6B7280',
          hint: '#9CA3AF',
          gold: '#C9A227',
          goldHover: '#9C7A1A',
          forest: '#0E5C3F',
        },
      },
      fontFamily: {
        display: ["'General Sans'", "Inter", "sans-serif"],
        accent: ["Fraunces", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
}
