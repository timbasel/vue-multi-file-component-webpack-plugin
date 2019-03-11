import { OptionObject } from "loader-utils";
import { isRegExp } from "util";
import { Compiler, Loader } from "webpack";


const pluginName = "VueMultiFileComponentPlugin";
const defaultOptions: OptionObject = {
  test: /\.vue\./,
};


class VueMultiFileComponentPlugin {
  private options: OptionObject;

  constructor(options?: OptionObject) {
    this.options = Object.assign({}, defaultOptions, options);

    if (!isRegExp(this.options.test)) {
      throw new Error(`[${pluginName}] option 'test' must be of RegExp type`);
    }
  }

  public static loader(options: OptionObject): Loader {
    return { loader: require.resolve("./loader"), options };
  }

  public apply(compiler: Compiler) {
    const plugins = compiler.options.plugins;
    if (!plugins) {
      throw new TypeError(`[${pluginName}] no plugin configuration found`);
    }

    const pluginIndex = plugins.findIndex((plugin) => {
      return plugin.constructor.name === pluginName;
    });
    const vueLoaderPluginIndex = plugins.findIndex((plugin) => {
      return plugin.constructor.name === "VueLoaderPlugin";
    });

    // ensure VueMultiFileComponentPlugin is used after the VueLoaderPlugin
    if (vueLoaderPluginIndex === -1 || vueLoaderPluginIndex > pluginIndex) {
      throw new Error(`[${pluginName}] ${pluginName} must be used after VueLoaderPlugin`);
    }

    if (!compiler.options.module) {
      throw new TypeError(`[${pluginName}] no module configuration found`);
    }

    // create webpack loader rule ()
    const rule = {
      test: this.options.test,
      use: (options: OptionObject) => {
        return /separated/.test(options.resourceQuery) ?
          [] : [ { loader: "vue-loader" }, VueMultiFileComponentPlugin.loader(this.options) ];
      },
    };

    compiler.options.module.rules.push(rule);
  }
}

export default VueMultiFileComponentPlugin;
module.exports = VueMultiFileComponentPlugin;
