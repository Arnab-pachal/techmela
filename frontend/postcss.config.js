
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    "postcss-preset-env": {
      stage: 1,
      features: {
        "color-functional-notation": true, 
      },
    },
  },
};
