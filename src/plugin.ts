import { OptionObject } from "loader-utils";
import { Compiler, loader } from "webpack";

class VueMultiFileComponentPlugin {
  private readonly defaultOptions: OptionObject = {
    test: /\.vue\./,
  };

  private options: OptionObject;

  constructor(options?: OptionObject) {
    this.options = Object.assign({}, this.defaultOptions, options);
    this.options;
  }

  public static loader(this: loader.LoaderContext, source: string): string {
    return source;
  }

  public apply(compiler: Compiler) {

  }
}

export default VueMultiFileComponentPlugin;
module.exports = VueMultiFileComponentPlugin;
