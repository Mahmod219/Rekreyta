/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx,mdx}",
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

        // 🔥 هذا أهم جزء
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#2ecc91", // 👈 اللون الأساسي
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },

        tremor: {
          brand: {
            faint: "#eff6ff",
            muted: "#bfdbfe",
            subtle: "#60a5fa",
            DEFAULT: "#2ecc91",
            emphasis: "#1d4ed8",
            inverted: "#ffffff",
          },
        },
      },
    },
  },

  plugins: [],
};
// /** @type {import('tailwindcss').Config} */
// export const content = [
//   "./pages/**/*.{js,ts,jsx,tsx,mdx}",
//   "./components/**/*.{js,ts,jsx,tsx,mdx}",
//   "./app/**/*.{js,ts,jsx,tsx,mdx}",
//   // مسار مكتبة Tremor ضروري جداً لتتعرف على الكلاسات
//   "./node_modules/@tremor/**/*.{js,ts,jsx,tsx,mdx}",
// ];
// export const safelist = [
//   {
//     pattern:
//       /^(bg|text|border|ring|stroke|fill)-(emerald|indigo|brand|blue|gray|red|yellow|orange)-/,
//     variants: ["hover", "ui-selected"],
//   },
// ];
// export const theme = {
//   transparent: "transparent",
//   current: "currentColor",
//   extend: {
//     colors: {
//       // ألوانك الخاصة (Rekreyta)
//       primary: {
//         50: "#ffffff",
//         300: "#2ecc91",
//       },
//       // إعدادات ألوان Tremor الإجبارية
//       brand: {
//         500: "#2ecc91",
//       },
//       tremor: {
//         brand: {
//           faint: "#eff6ff",
//           muted: "#bfdbfe",
//           subtle: "#60a5fa",
//           DEFAULT: "#2ecc91", // لونك الأخضر الجميل
//           emphasis: "#1d4ed8",
//           inverted: "#ffffff",
//         },
//         background: {
//           muted: "#f9fafb",
//           subtle: "#f3f4f6",
//           DEFAULT: "#ffffff",
//           emphasis: "#374151",
//         },
//         border: {
//           DEFAULT: "#e5e7eb",
//         },
//         ring: {
//           DEFAULT: "#e5e7eb",
//         },
//         content: {
//           subtle: "#9ca3af",
//           DEFAULT: "#6b7280",
//           emphasis: "#374151",
//           strong: "#111827",
//           inverted: "#ffffff",
//         },
//       },
//     },
//     boxShadow: {
//       "tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
//       "tremor-card":
//         "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
//       "tremor-dropdown":
//         "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
//     },
//     borderRadius: {
//       "tremor-small": "0.375rem",
//       "tremor-default": "0.5rem",
//       "tremor-full": "9999px",
//     },
//   },
// };
// export const plugins = [];
