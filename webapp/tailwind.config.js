/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0f0f13",
        foreground: "#e8e8ed",
        card: "#1a1a24",
        "card-foreground": "#e8e8ed",
        accent: "#2a2a3a",
        "accent-foreground": "#e8e8ed",
        primary: "#6366f1",
        "primary-foreground": "#ffffff",
        secondary: "#252535",
        "secondary-foreground": "#e8e8ed",
        muted: "#1e1e2e",
        "muted-foreground": "#9898a8",
        border: "#2e2e3e",
        ring: "#6366f1",
      },
    },
  },
  plugins: [],
};
