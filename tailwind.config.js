/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {

        primary_main: '#820000',
        primary_hover: '#750000',
        primary_active: '#620000',
        primary_disabled: '#9EA9BB',

        secondary_main: '#FEFDFA',
        secondary_hover: '#FDF8F0',
        secondary_active: '#F7E7CE',
        secondary_disabled: '#FDF8F0',

        tertiary_main: '#FCFFED',
        tertiary_hover: '#E3E6D5',
        tertiary_active: '#CACCBE',
        tertiary_disabled: '#FEFFF9',

        fourthiary_main: '#2C353B',
        fourthiary_hover: '#232A2F',
        fourthiary_active: '#232A2F',
        fourthiary_disabled: '#BEC0C2',

        Text:'#303F58',
        Text_2:'#4B5C79'

      },

    },
  },
  plugins: [],
}