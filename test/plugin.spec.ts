import { expect } from "chai";
import * as path from "path";
import { Compiler, default as webpack } from "webpack";

import VueMultiFileComponentPlugin from "../src/plugin";


// VueLoaderPlugin Mock
class VueLoaderPlugin {
  public apply(compiler: Compiler) {} // tslint:disable-line:no-empty
}


describe("Multi-File Component Plugin", () => {
  describe("Construction", () => {
    it("should apply plugin with default plugin options", async () => {
      const plugin = new VueMultiFileComponentPlugin();

      const compiler = webpack({ plugins: [ new VueLoaderPlugin(), plugin ] });

      const expected = {
        test: /\.vue\./,
        use: [
          { loader: "vue-loader" },
          { loader: path.resolve(__dirname, "..", "src/loader.ts"), options: { test: /\.vue\./ } },
        ],
      };

      if (!compiler.options.module) { throw new Error("No module options defined."); }
      const rule = compiler.options.module.rules[0] as any;

      expect(rule.test).to.deep.equal(expected.test);
      expect(rule.use).to.be.a("function");
      expect(rule.use({resourceQuery: undefined})).to.deep.equal(expected.use);
    });

    it("should apply plugin with custom test plugin option", async () => {
      const plugin = new VueMultiFileComponentPlugin({ test: /\.test\./ });

      const compiler = webpack({ plugins: [ new VueLoaderPlugin(), plugin ] });

      const expected = { test: /\.test\./ };

      if (!compiler.options.module) { throw new Error("No module options defined"); }
      expect(compiler.options.module.rules[0].test).to.deep.equal(expected.test);
    });
  });


  describe("Error Handling", () => {
    it("should throw an error if 'test' option is not of RegExp type", async () => {
      const expected = "[VueMultiFileComponentPlugin] option 'test' must be of RegExp type";

      expect(() => new VueMultiFileComponentPlugin({ test: "string" })).to.throw(Error, expected);
    });

    it("should throw an error if called wihout a VueLoaderPlugin defined", async () => {
      const plugin = new VueMultiFileComponentPlugin();

      const expected = "[VueMultiFileComponentPlugin] VueMultiFileComponentPlugin must be used after VueLoaderPlugin";

      expect(() => webpack({ plugins: [ plugin ] })).to.throw(Error, expected);
    });

    it("should throw an error if called with an invalid plugin order", async () => {
      const plugin = new VueMultiFileComponentPlugin();

      const expected = "[VueMultiFileComponentPlugin] VueMultiFileComponentPlugin must be used after VueLoaderPlugin";

      expect(() => webpack({ plugins: [ plugin, new VueLoaderPlugin() ] })).to.throw(Error, expected);
    });
  });
});
