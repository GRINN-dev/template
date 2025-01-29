const baseConfig = require("@grinn/eslint-config/base-cjs");

const config = [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
];

module.exports = config;
