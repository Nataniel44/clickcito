/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      safelist: [
        "from-blue-500",
        "to-cyan-500",
        "from-yellow-500 to-orange-500",
        "from-yellow-50 to-orange-50",
        "from-emerald-500 to-teal-500",
        "from-emerald-50 to-teal-50",
      ],
    },
  },
  safelist: [
    "from-blue-500",
    "to-cyan-500",
    "from-yellow-500 to-orange-500",
    "from-yellow-50 to-orange-50",
    "from-emerald-500 to-teal-500",
    "from-emerald-50 to-teal-50",
    "from-pink-500 to-rose-500",
  ],
  plugins: [require('tailwind-scrollbar')({ nocompatible: true })],

};
