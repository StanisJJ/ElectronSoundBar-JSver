const { defineConfig } = require("@vue/cli-service");
const path = require("path");
module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
  },

  configureWebpack: {
    output: {
      hashFunction: "xxhash64",
      // inne ustawienia...
    },
  },

  chainWebpack: (config) => {
    // Dodaj obsługę loadera dla plików SVG
    config.module.rule("svg").use("file-loader").loader("file-loader").end();
  },

  outputDir: path.resolve(__dirname, "./basic_app/dist"),
  publicPath: "./",
});
