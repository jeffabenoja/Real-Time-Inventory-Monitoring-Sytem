/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#7f1d1d",
      },
      boxShadow: {
        login: "25px 30px 55px rgba(85, 87, 115, 0.5)", // Custom box shadow
      },
      height: {
        "dynamic-sm": "calc(100vh - 52px)",
        "dynamic-lg": "calc(100vh - 77px)",
      },
    },
  },
  plugins: [
    function ({ addComponents, theme }) {
      addComponents({
        ".input-field": {
          position: "relative",
          width: "100%",
        },
        ".input-field input": {
          position: "absolute",
          width: "100%",
          outline: "none",
          fontSize: "16px",
          padding: "8px 14px",
          borderRadius: "10px",
          border: "1px solid #333",
          background: "transparent",
          transition: "0.1s ease",
          zIndex: "1000",
        },
        ".input-field label": {
          position: "absolute",
          fontSize: "14px",
          backgroundColor: "#fff",
          color: "#000",
          top: "8px",
          left: "10px",
          padding: "0 25px",
          transition: "0.2s ease",
        },
        ".input-field input:focus": {
          color: theme("colors.primary"),
          borderColor: theme("colors.primary"),
        },
        ".input-field input:focus + label": {
          color: theme("colors.primary"),
          top: "-18px",
          fontSize: "15px",
          transform: "translate(10px, 8px) scale(0.88)",
          zIndex: "1111",
        },
        ".input-field input:valid + label": {
          color: theme("colors.primary"),
          top: "-18px",
          fontSize: "15px",
          transform: "translate(10px, 8px) scale(0.88)",
          zIndex: "1111",
        },
      })
    },
  ],
}
