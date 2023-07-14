/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                bg: "var(--bg-color)",
                bg_2: "var(--bg-2-color)",
                text: "var(--text-color)",
                text_2: "var(--text-2-color)",
                text_3: "var(--text-3-color)",
                borders: "var(--borders-color)",
                primary: "var(--primary-color)",
            },
        },
    },
    plugins: [],
};
