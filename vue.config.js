const { defineConfig } = require("@vue/cli-service");
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
});
