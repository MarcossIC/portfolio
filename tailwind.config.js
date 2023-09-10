/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontSize:{
        secondTitle: "clamp(1.5rem, 8vw, 4rem)",
        largeTitle: "clamp(1.5rem, 7vw, 3rem)",
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        transparents: {
          "purple": "#66008057"
        },
        dark: "#1b1b1b",
        light: "#f5f5f5",
        primary: "#b565fd", // 240,86,199
        primaryDark: "#58E6D9", // 80,230,217
        primaryBlueDark: "#050816",
        secondary: "#aaa6c3",
        tertiary: "#151030",
    },
    boxShadow: {
      card: "rgba(0, 0, 0, 0.17) 0px -23px 25px 0px inset, rgba(0, 0, 0, 0.15) 0px -36px 30px 0px inset, rgba(0, 0, 0, 0.1) 0px -79px 40px 0px inset, rgba(0, 0, 0, 0.06) 0px 2px 1px, rgba(0, 0, 0, 0.09) 0px 4px 2px, rgba(0, 0, 0, 0.09) 0px 8px 4px, rgba(0, 0, 0, 0.09) 0px 16px 8px, rgba(0, 0, 0, 0.09) 0px 32px 16px",
      skiil: "0px 5px 20px 5px rgba(0, 0, 0, 0.33),0px 4px 28px 7px rgba(0, 0, 0, 0.38) inset",
      liquid: "inset 20px 20px 20px rgb(157 0 255 / 5%), 25px 35px 20px rgba(0,0,0,0.05), 25px 30px 30px rgba(0,0,0,0.05), inset -9px -11px 50px 5px rgb(40 0 60 / 54%)",
    },
    screens: {
      xs: "450px",
      mxs: "576px",
      tablet: "780px",
      mlg: "992px"
    },
    maxWidth: {
      maxCalc: "calc(100vh - 305px)",
    },
    },
  },
  plugins: [],
}
