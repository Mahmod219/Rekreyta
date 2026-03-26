/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#ffffff",
          100: "#f5f3f4",
          200: "#d3d3d3",
          300: "#2ecc91",
          400: "#1bb988",
          500: "#18a277",
          600: "#148c67",
          700: "#44474a",
          800: "#2d3033",
          900: "#161a1d",
        },
        secondery: {
          50: "#cf1e55",
          100: "#b91b4c",
          200: "#a21843",
          300: "#8c143a",
        },
      },
    },
  },
  plugins: [],
};
