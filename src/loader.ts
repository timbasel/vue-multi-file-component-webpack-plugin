import * as fs from "fs";
import { getOptions, OptionObject } from "loader-utils";
import * as path from "path";
import { loader } from "webpack";


const loaderName = "VueMultiFileComponentLoader";
const defaultOptions: OptionObject = {
  extensions: {
    script: [ /\.js$/, /\.ts$/, /\.jsx$/, /\.tsx$/, /\.coffe$/ ],
    style: [ /\.css$/, /\.scss$/, /\.sass$/, /\.less$/, /\.styl$/ ],
    template: [ /\.html$/, /\.pug$/, /\.jade$/ ],
  },
  test: /\.vue\./,
};


class SingleFileComponent {
  private name: string;
  private options: OptionObject;

  private template: string = "";
  private script: string = "";
  private styles: string[] = [];
  private customs: string[] = [];

  constructor(name: string, options: OptionObject) {
    this.name = name;
    this.options = options;
  }

  public add(file: string) {
    switch (this.getType(file)) {
      case "template":
        if (this.template) {
          throw new Error(`[${loaderName}] duplicate template files found in component '${this.name}'`);
        }
        this.template = file;
        break;

      case "script":
        if (this.script) {
          throw new Error(`[${loaderName}] duplicate script files found in component '${this.name}'`);
        }
        this.script = file;
        break;

      case "style":
        this.styles.push(file);
        break;

      case "custom":
        this.customs.push(file);
        break;
    }
  }

  public build(): string {
    if (!(this.template || this.script)) {
      throw new Error(`[${loaderName}] no template or script file defined for component '${this.name}'`);
    }

    let result = "";

    if (this.template) {
      result += `<template separated src="./${this.template}" lang="${this.getExtension(this.template)}"></template>`;
    }

    if (this.script) {
      result += `<script separated src="./${this.script}" lang="${this.getExtension(this.script)}"></script>`;
    }

    for (const style of this.styles) {
      const scoped = style.split(this.options.test)[1].includes("scoped.") ? " scoped" : "";
      result += `<style separated src="./${style}" lang="${this.getExtension(style)}"${scoped}></style>`;
    }

    for (const custom of this.customs) {
      const type = this.getExtension(custom);
      result += `<${type} separated src="./${custom}"></${type}>`;
    }

    return result;
  }

  private getType(file: string): string {
    for (const [type, extensions] of Object.entries(this.options.extensions) as Array<[string, RegExp[]]>) {
      if (extensions.some((extension) => extension.test(file))) {
        return type;
      }
    }
    return "custom";
  }

  private getExtension(file: string): string {
    return file.split(".").pop() || "";
  }
}


export default function loader(this: loader.LoaderContext, source: string): string | void {
  const options = Object.assign({}, defaultOptions, getOptions(this));
  const name = path.basename(this.resourcePath).split(options.test)[0];

  // find all matching component files in context directory
  const files = fs.readdirSync(this.context).filter((file) => {
    return !file.match(/^\./) && file.match(new RegExp(`^${name}\.`));
  });

  // fail if no valid files were found
  if (files.length <= 0) {
    throw new Error(`[${loaderName}] no valid files found for component '${name}'`);
  }

  // return existing SFC if one is found
  const existingSFC = files.find((file) => /\.vue$/.test(file));
  if (existingSFC !== undefined) {
    return fs.readFileSync(path.resolve(this.context, existingSFC)).toString();
  }

  const sfc = new SingleFileComponent(name, options);
  for (const file of files) {
    sfc.add(file);
  }
  return sfc.build();
}
