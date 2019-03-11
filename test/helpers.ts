import * as fs from "fs";
import { OptionObject } from "loader-utils";
import * as path from "path";


export const defaultDir = path.resolve(__dirname, "files");
export const defaultConfig: OptionObject = { context: defaultDir };


export function createTestFile(filename: string, content: string, dir: string = defaultDir): string {
  fs.writeFileSync(path.resolve(dir, filename), content);
  return content;
}

export function createTestDirectory(dir: string = defaultDir) {
  fs.mkdirSync(dir);
}

export function removeTestDirectory(dir: string = defaultDir) {
  for (const filepath of fs.readdirSync(dir)) {
    const absoluteFilepath = path.resolve(dir, filepath.toString());
    if (fs.statSync(absoluteFilepath).isDirectory()) {
      removeTestDirectory(absoluteFilepath);
    } else {
      fs.unlinkSync(absoluteFilepath);
    }
  }

  fs.rmdirSync(dir);
}

export function createWebpackConfig(resource: string, additionalConfig?: OptionObject): any {
  const config = Object.assign({}, defaultConfig, additionalConfig);
  config.resourcePath = resource;
  return config;
}
