import { expect } from "chai";
import { createTestDirectory, createTestFile, createWebpackConfig, removeTestDirectory } from "./helpers";

import loader from "../src/loader";


describe("Multi-File Component Loader", () => {
  beforeEach(() => {
    createTestDirectory();
  });

  afterEach(() => {
    removeTestDirectory();
  });


  describe("Basic Components", () => {
    it("should return valid SFC if called for a single template component file", async () => {
      const source = createTestFile("component.vue.html", "<!-- component.vue.html -->");
      const config = createWebpackConfig("component.vue.html");

      const expected = `<template separated src="./component.vue.html" lang="html"></template>`;

      expect(loader.apply(config, [source])).to.equal(expected);
    });

    it("should return valid SFC if called for a single script component file", async () => {
      const source = createTestFile("component.vue.js", "// component.vue.js");
      const config = createWebpackConfig("component.vue.js");

      const expected = `<script separated src="./component.vue.js" lang="js"></script>`;

      expect(loader.apply(config, [source])).to.equal(expected);
    });

    it("should return valid SFC if called for a two file component", async () => {
      const source = createTestFile("component.vue.js", "// component.vue.js");
      createTestFile("component.vue.html", "<!-- component.vue.html -->");
      const config = createWebpackConfig("component.vue.js");

      const expected =
        `<template separated src="./component.vue.html" lang="html"></template>` +
        `<script separated src="./component.vue.js" lang="js"></script>`;

      expect(loader.apply(config, [source])).to.equal(expected);
    });

    it("should return valid SFC if called for a three file component", async () => {
      const source = createTestFile("component.vue.js", "// component.vue.js");
      createTestFile("component.vue.html", "<!-- component.vue.html -->");
      createTestFile("component.vue.css", "/* component.vue.css */");
      const config = createWebpackConfig("component.vue.js");

      const expected =
        `<template separated src="./component.vue.html" lang="html"></template>` +
        `<script separated src="./component.vue.js" lang="js"></script>` +
        `<style separated src="./component.vue.css" lang="css"></style>`;

      expect(loader.apply(config, [source])).to.equal(expected);
    });

    it("should return valid SFC if called for a component with a scoped style component file", async () => {
      const source = createTestFile("component.vue.html", "<!-- component.vue.html -->");
      createTestFile("component.vue.scoped.css", "/* component.vue.scoped.css */");
      const config = createWebpackConfig("component.vue.html");

      const expected =
        `<template separated src="./component.vue.html" lang="html"></template>` +
        `<style separated src="./component.vue.scoped.css" lang="css" scoped></style>`;

      expect(loader.apply(config, [source])).to.equal(expected);
    });

    it("should return valid SFCs if called for components inside the same directory", async () => {
      const firstSource = createTestFile("first_component.vue.html", "<!-- first_component.vue.html -->");
      const secondSource = createTestFile("second_component.vue.html", "<!-- second_component.vue.html -->");
      const firstConfig = createWebpackConfig("first_component.vue.html");
      const secondConfig = createWebpackConfig("second_component.vue.html");

      const firstExpected = `<template separated src="./first_component.vue.html" lang="html"></template>`;
      const secondExpected = `<template separated src="./second_component.vue.html" lang="html"></template>`;

      expect(loader.apply(firstConfig, [firstSource])).to.equal(firstExpected);
      expect(loader.apply(secondConfig, [secondSource])).to.equal(secondExpected);
    });

    it("should return existing SFC for component the loader is called with", async () => {
      const sfc = `<template><!-- component.vue --></template>`;
      const source = createTestFile("component.vue.html", "<!-- component.vue.html -->");
      createTestFile("component.vue", sfc);
      const config = createWebpackConfig("component.vue.html");

      const expected = sfc;

      expect(loader.apply(config, [source])).to.equal(expected);
    });
  });


  describe("Custom Components", () => {
    it("should return valid SFC if called for a PUG template component file", async () => {
      const source = createTestFile("component.vue.pug", "// component.vue.pug");
      const config = createWebpackConfig("component.vue.pug");

      const expected = `<template separated src="./component.vue.pug" lang="pug"></template>`;

      expect(loader.apply(config, [source])).to.equal(expected);
    });

    it("should return valid SFC if called for a TypeScript script component file", async () => {
      const source = createTestFile("component.vue.ts", "// component.vue.ts");
      const config = createWebpackConfig("component.vue.ts");

      const expected = `<script separated src="./component.vue.ts" lang="ts"></script>`;

      expect(loader.apply(config, [source])).to.equal(expected);
    });

    it("should return valid SFC if called for a SCSS style component file", async () => {
      const source = createTestFile("component.vue.html", "<!-- component.vue.html -->");
      createTestFile("component.vue.scss", "// component.vue.scss");
      const config = createWebpackConfig("component.vue.html");

      const expected =
        `<template separated src="./component.vue.html" lang="html"></template>` +
        `<style separated src="./component.vue.scss" lang="scss"></style>`;

      expect(loader.apply(config, [source])).to.equal(expected);
    });

    it("should return valid SFC if called with DOCS custom component file", async () => {
      const source = createTestFile("component.vue.html", "<!-- component.vue.html -->");
      createTestFile("component.vue.docs", "component.vue.docs");
      const config = createWebpackConfig("component.vue.html");

      const expected =
        `<template separated src="./component.vue.html" lang="html"></template>` +
        `<docs separated src="./component.vue.docs"></docs>`;

      expect(loader.apply(config, [source])).to.equal(expected);
    });
  });


  describe("Error Handling", () => {
    it("should throw an error if called with non existend component file", async () => {
      const config = createWebpackConfig("component.vue.js");

      const expected = `[VueMultiFileComponentLoader] no valid files found for component 'component'`;

      expect(() => loader.apply(config, [""])).to.throw(Error, expected);
    });

    it("should throw an error if called with component without a template or script component file", async () => {
      const source = createTestFile("component.vue.css", "/* component.vue.css */");
      const config = createWebpackConfig("component.vue.css");

      const expected = `[VueMultiFileComponentLoader] no template or script file defined for component 'component'`;

      expect(() => loader.apply(config, [source])).to.throw(Error, expected);
    });

    it("should throw an error if duplicate template files are found for the same component", async () => {
      const source = createTestFile("component.vue.html", "<!-- component.vue.html -->");
      createTestFile("component.vue.pug", "// component.vue.pug");
      const config = createWebpackConfig("component.vue.html");

      const expected = `[VueMultiFileComponentLoader] duplicate template files found in component 'component'`;

      expect(() => loader.apply(config, [source])).to.throw(Error, expected);
    });

    it("should throw an error if duplicate script files are found for the same component", async () => {
      const source = createTestFile("component.vue.js", "// component.vue.js");
      createTestFile("component.vue.ts", "// component.vue.ts");
      const config = createWebpackConfig("component.vue.js");

      const expected = `[VueMultiFileComponentLoader] duplicate script files found in component 'component'`;

      expect(() => loader.apply(config, [source])).to.throw(Error, expected);
    });
  });
});
