module.exports = {
  presets: ["@vue/app"],
  plugins: [
    [
      "@babel/transform-runtime",
      {
        corejs: 3
      }
    ],
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: 3
      }
    ]
  ]
};
