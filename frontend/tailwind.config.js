/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      /* ====================================================
         CORES - Extraídas do Figma (get_variable_defs + get_design_context)
         ==================================================== */
      colors: {
        'virtu': {
          'green': '#348981',        // #1 virtú - verde principal
          'green-dark': '#1e3d34',   // verde escuro "virtú."
          'dark': '#282828',         // #2 virtú - texto principal
          'gold': '#c1a784',         // dourado
          'gold-hover': '#b09472',   // dourado hover
          'text': '#414141',         // texto nav links
          'muted': '#858585',        // texto footer links
          'light': '#c0c0c0',        // headers footer
          'placeholder': '#c9c9c9',  // placeholder inputs
          'bg': '#fbfbfb',           // background footer
          'border': '#eeeeee',       // borda footer
        },
      },
      /* ====================================================
         FONTES - Capturadas do Figma
         Sora (principal), Newsreader (display italic), Montserrat (copyright)
         ==================================================== */
      fontFamily: {
        'sans': ['"Sora"', 'sans-serif'],
        'display': ['"Newsreader"', 'serif'],
        'copyright': ['"Montserrat"', 'sans-serif'],
      },
      /* ====================================================
         BORDER RADIUS - Do Figma
         ==================================================== */
      borderRadius: {
        'pill': '20.921px',    // botões nav/CTA
        'card': '44px',        // cards de vídeo
        'input': '59.358px',   // inputs do form
        'banner': '38.176px',  // botão "Fale com um especialista"
      },
      /* ====================================================
         GRADIENTS - Do Figma
         ==================================================== */
      backgroundImage: {
        'gradient-cta': 'linear-gradient(to right, #348981, #c1a784)',
        'gradient-cta-reverse': 'linear-gradient(to right, #c1a784, #348981)',
      },
    },
  },
  plugins: [],
};
