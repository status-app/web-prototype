/* eslint-disable */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    {
      // Text Color
      pattern: /^text-.+$/,
      // variants: ["dark", "hover", "focus", "focus-visible", "group-hover"],
    },
    {
      // Backgrounds
      pattern: /^bg-.+$/,
      variants: ["dark", "hover", "focus", "focus-visible", "group-hover"],
    },
  ],
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
