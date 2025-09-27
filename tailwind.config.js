/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				'dark-primary': '#202531',
				'dark-secondary': '#322f42',
				'purple-dark': '#4b396f',
				'purple-light': '#b6a2c9',
				'gray-light': '#c5c3c4',
			}
		}
	},
	plugins: []
};