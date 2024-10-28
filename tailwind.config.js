/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/flowbite/**/*.js",
    "./src/**/*.{html,ts}",

  ],

  plugins: [
    require('flowbite/plugin')
],
}
