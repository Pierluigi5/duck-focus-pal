import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Duck-themed custom colors
				duck: {
					yellow: 'hsl(var(--duck-yellow))',
					orange: 'hsl(var(--duck-orange))',
					blue: 'hsl(var(--duck-blue))',
					green: 'hsl(var(--duck-green))',
					pink: 'hsl(var(--duck-pink))'
				},
				// Timer state colors
				focus: 'hsl(var(--focus-color))',
				break: 'hsl(var(--break-color))',
				longBreak: 'hsl(var(--long-break-color))'
			},
			backgroundImage: {
				'gradient-duck': 'var(--gradient-duck)',
				'gradient-focus': 'var(--gradient-focus)',
				'gradient-break': 'var(--gradient-break)'
			},
			boxShadow: {
				'soft': 'var(--shadow-soft)',
				'duck': 'var(--shadow-duck)'
			},
			fontFamily: {
				'rounded': ['Inter', 'system-ui', 'sans-serif']
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				// Duck-specific animations
				'duck-bounce': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'duck-wiggle': {
					'0%, 100%': { transform: 'rotate(0deg)' },
					'25%': { transform: 'rotate(-3deg)' },
					'75%': { transform: 'rotate(3deg)' }
				},
				'duck-float': {
					'0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
					'33%': { transform: 'translateY(-5px) rotate(1deg)' },
					'66%': { transform: 'translateY(5px) rotate(-1deg)' }
				},
				'progress-fill': {
					'0%': { transform: 'scaleX(0)' },
					'100%': { transform: 'scaleX(1)' }
				},
				'pulse-soft': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(100%)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'duck-bounce': 'duck-bounce 2s ease-in-out infinite',
				'duck-wiggle': 'duck-wiggle 1s ease-in-out infinite',
				'duck-float': 'duck-float 3s ease-in-out infinite',
				'progress-fill': 'progress-fill 0.3s ease-out',
				'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
				'slide-up': 'slide-up 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
