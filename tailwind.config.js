/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f6ff',
          100: '#deeaff',
          200: '#c4d7ff',
          300: '#9ebeff',
          400: '#769aff',
          500: '#5272ff',
          600: '#0F52BA', // Main primary color
          700: '#0842a0',
          800: '#0c3784',
          900: '#0f306d',
        },
        secondary: {
          50: '#e7f9f9',
          100: '#d0f3f3',
          200: '#a0e8e8',
          300: '#67d7d7',
          400: '#39c1c1',
          500: '#20B2AA', // Main secondary color
          600: '#198f88',
          700: '#17726c',
          800: '#155b58',
          900: '#134a47',
        },
        accent: {
          50: '#e7f8ef',
          100: '#d0f2df',
          200: '#a0e5c0',
          300: '#67d499',
          400: '#39bd6e',
          500: '#4CAF50', // Main accent color
          600: '#2e8a3a',
          700: '#226c2c',
          800: '#1a5321',
          900: '#154419',
        },
        success: {
          50: '#ebf9eb',
          100: '#d7f3d7',
          200: '#afe7af',
          300: '#87db87',
          400: '#5fcf5f',
          500: '#37c337',
          600: '#2c9c2c',
          700: '#227722',
          800: '#1a5a1a',
          900: '#154415',
        },
        warning: {
          50: '#fff8e6',
          100: '#fff1cc',
          200: '#ffe399',
          300: '#ffd566',
          400: '#ffc733',
          500: '#ffb800',
          600: '#cc9300',
          700: '#997000',
          800: '#664a00',
          900: '#332500',
        },
        error: {
          50: '#fdebeb',
          100: '#fcd7d7',
          200: '#f9afaf',
          300: '#f58787',
          400: '#f25f5f',
          500: '#ef3737',
          600: '#bf2c2c',
          700: '#8f2121',
          800: '#601616',
          900: '#300b0b',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      spacing: {
        '0': '0',
        '1': '0.25rem', // 4px
        '2': '0.5rem',  // 8px
        '3': '0.75rem', // 12px
        '4': '1rem',    // 16px
        '5': '1.25rem', // 20px
        '6': '1.5rem',  // 24px
        '8': '2rem',    // 32px
        '10': '2.5rem', // 40px
        '12': '3rem',   // 48px
        '16': '4rem',   // 64px
        '20': '5rem',   // 80px
        '24': '6rem',   // 96px
        '32': '8rem',   // 128px
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        none: 'none',
      },
    },
  },
  plugins: [],
};
