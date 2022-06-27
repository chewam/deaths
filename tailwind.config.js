const safelist = []
const numbers = ["300", "400", "500", "600"]
const names = [
  "slate",
  "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
]

for (const name of names) {
  for (const number of numbers) {
    safelist.push(`bg-${name}-${number}`)
  }
}
console.log("safelist", safelist)
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist,
  theme: {
    extend: {
      colors: {
        theme: {
          base: "#60a5fa",
          text: "#d1d5db",
          error: "#dc2626",
          border: "#4b5563",
          secondary: "#16a34a"
        }
      },
      fontFamily: {
        roboto: ["Roboto", "arial", "sans-serif"],
      },
    },
  },
  plugins: [],
}
