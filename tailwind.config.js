/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#0f172a",
				secondary: "#1E293B",
				accent: {
					DEFAULT: "#38BDF8",
					light: "#7DD3FC",
					dark: "#0284C7",
				},
				code: {
					purple: "#C084FC",
					pink: "#F472B6",
					blue: "#38BDF8",
					green: "#4ADE80",
				},
				black: {
					DEFAULT: "#000",
					100: "#1E1E2D",
					200: "#232533",
				},
				glass: {
					DEFAULT: "rgba(30, 41, 59, 0.7)",
					border: "rgba(148, 163, 184, 0.1)",
				},
				gray: {
					100: "#94A3B8",
					200: "#64748B",
				}
			},
			backdropBlur: {
				'glass': '12px',
			},
			fontFamily: {
				pthin: ["Poppins-Thin", "sans-serif"],
				pextralight: ["Poppins-ExtraLight", "sans-serif"],
				plight: ["Poppins-Light", "sans-serif"],
				pregular: ["Poppins-Regular", "sans-serif"],
				pmedium: ["Poppins-Medium", "sans-serif"],
				psemibold: ["Poppins-SemiBold", "sans-serif"],
				pbold: ["Poppins-Bold", "sans-serif"],
				pextrabold: ["Poppins-ExtraBold", "sans-serif"],
				pblack: ["Poppins-Black", "sans-serif"],
			},
		},
	},
	plugins: [],
};