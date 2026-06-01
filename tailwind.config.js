/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			backdropBlur: {
				sm: '4px',
			},
			transitionTimingFunction: {
				smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
			},
			keyframes: {
				'fade-up': {
					from: { opacity: '0', transform: 'translateY(10px)' },
					to: { opacity: '1', transform: 'translateY(0)' },
				},
			},
			animation: {
				'fade-up': 'fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
			},
		},
	},
	plugins: [],
};
