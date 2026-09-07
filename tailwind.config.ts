import type { Config } from 'tailwindcss';

// Tailwind оставлен для утилит раскладки. Основа оформления — классы
// макета в app/globals.css, поэтому preflight отключён: он спорил бы
// с базовыми стилями макета.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        bg: '#0e0f12',
        ink: '#eceef2',
        dim: '#9aa0ab',
        faint: '#5d626d',
        accent: '#d9a066',
      },
      fontFamily: {
        display: ['Unbounded', 'system-ui', 'sans-serif'],
        body: ['Golos Text', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
