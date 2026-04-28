/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{md,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './types/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    {
      pattern: /(bg|text|border|from|to|via|ring)-\[#[0-9A-Fa-f]+\]/,
    },
    {
      pattern: /(bg|text|border)-(white|black)\/\[?[0-9.]+\]?/,
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg:       '#0A0F1E',
        surface:  '#0F1629',
        elevated: '#162038',
        floating: '#1C2A4A',
        primary:  '#00CFFF',
        accent:   '#00FFB3',
        muted:    '#8A9CC8',
        subtle:   '#4D5E87',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
