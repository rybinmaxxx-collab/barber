import type { Config } from 'tailwindcss';

// Tailwind включён по ТЗ и используется для утилит раскладки.
// Основа оформления — BEM-классы из ТЗ в app/globals.css: они переносятся 1:1,
// поэтому preflight отключён, чтобы не спорить с ними за базовые стили.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0a',
        'ink-soft': '#0f0f0f',
        bone: '#f5f5f5',
        brass: '#c9a96e',
      },
      fontFamily: {
        display: ['Oswald', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
