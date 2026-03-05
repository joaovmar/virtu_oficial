/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'virtu-gold': '#C5A96F',
        'virtu-gold-hover': '#b59a60',
        'virtu-dark': '#1a1a1a',
        'virtu-cream': '#F7F5F2',
        'virtu-teal': '#1C3E35',
        'virtu-teal-dark': '#153028',
        'virtu-teal-light': '#2F5C5A',
        'virtu-green': '#3B8B88',
      },
      fontFamily: {
        'display': ['"Playfair Display"', 'serif'],
        'sans': ['"DM Sans"', 'sans-serif'],
        'cursive': ['"Playfair Display"', 'serif'], // using Playfair italic as cursive fallback for now
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
      }
    },
  },
  plugins: [],
};
