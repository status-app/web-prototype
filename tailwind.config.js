/* eslint-disable */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      transitionProperty: {
        width: "width",
      },
    },
  },
  plugins: [
    require("tailwind-fontawesome")({
      version: 6,
    }),
    require("tailwind-children"),
  ],
};
