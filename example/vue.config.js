const VueMultiFileComponentPlugin = require("../dist/plugin");

module.exports = {
  chainWebpack: (config) => {
    config
      .plugin("vue-multi-file-component-plugin")
      .use(VueMultiFileComponentPlugin, [])
      .after("vue-loader")
  }
}
