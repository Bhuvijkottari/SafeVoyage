// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'sv-primary': '#1E6F66',
        'sv-mint': '#CFF7E1',
        'sv-deep': '#0F4D4A',
        'sv-bg': '#F2FBF8'
      },
      borderRadius: {
        'xl-2xl': '1.25rem'
      }
    },
  },
  plugins: [],
}
