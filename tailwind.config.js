/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // 品牌主色
        brand: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#bcd3ff',
          300: '#8eb6ff',
          400: '#598eff',
          500: '#3366ff',
          600: '#1f45f5',
          700: '#1934e1',
          800: '#1a2cb6',
          900: '#1c2c8f',
        },
        // 差异高亮：绿色 = 更优（国际通用直觉），红色 = 更差
        better: {
          bg: '#f0fdf4',
          border: '#95de64',
          text: '#237804',
          strong: '#16a34a',
        },
        worse: {
          bg: '#fff1f0',
          border: '#ffa39e',
          text: '#cf1322',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          '"Helvetica Neue"',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.22s ease-out both',
      },
    },
  },
  plugins: [],
};
