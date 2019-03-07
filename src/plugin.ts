import { OptionObject } from "loader-utils";
import { Compiler, loader } from "webpack";

class VueMultiFileComponentPlugin {
  constructor(options?: OptionObject) {

  }

  public static loader(this: loader.LoaderContext, source: string): string {
    return source;
  }

  public apply(compiler: Compiler) {

  }
}

export default VueMultiFileComponentPlugin;
module.exports = VueMultiFileComponentPlugin;
