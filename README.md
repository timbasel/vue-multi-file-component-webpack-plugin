# Vue Multi-File Component Webpack Plugin

The Vue Multi-File Component Webpack Plugin allows you to split Vue's Single-File Components into separate component files and have still have them loaded by the regular [vue-loader](https://github.com/vuejs/vue-loader).

## Installation

```bash
yarn add -D vue-multi-file-component-webpack-plugin
```

or

```bash
npm install -D vue-multi-file-component-webpack-plugin
```

### Configuration

For a VueCLI 3 generated project create a `vue.config.js` in the root of your project.

```javascript
const VueMultiFileComponentPlugin = require("vue-mulit-file-component-webpack-plugin")

module.exports = {
  chainWebpack: (config) => {
    config
      .plugin("vue-multi-file-component-plugin")
      .use(VueMultiFileComponentPlugin, []) // pass custom options as one object inside the array
      .after("vue-loader")
  }
}
```

For projects using a `webpack.config.js` for configuration add the Plugin below the VueLoaderPlugin creation.

```javascript
const VueMultiFileComponentPlugin = require("vue-mulit-file-component-webpack-plugin")

module.exports = {
  module: {
    rules: [
      // ...
    ]
  },
  plugins: [
    // ...
    new VueLoaderPlugin(),
    // ...
    new VueMultiFileComponentPlugin(), // pass custom options as one object
  ]
}
```

### Options

| Option              | Default Value                                               | Description |
| ------------------- | ----------------------------------------------------------- | ----------- |
| test                | `/\.vue\./`                                                 | matching rule for files handled by the loader |
| extensions          | `extensions: { script: [ /\.js$/, /\.ts$/, /\.jsx$/, /\.tsx$/, /\.coffe$/ ], style: [ /\.css$/, /\.scss$/, /\.sass$/, /\.less$/, /\.styl$/ ], template: [ /\.html$/, /\.pug$/, /\.jade$/ ] }` | file extensions for matching the component type |

**WARNING:** Using the `extensions` option will overwrite the default arrays, meaning you have to define all extension for all component types you wish to resolve.

## License

MIT License © Tim Basel

## Acknowledgements

- [vue-separate-files-loader](https://github.com/NetCZ/vue-separate-files-webpack-loader)
- [vue-builder-webpack-plugin](https://github.com/pksunkara/vue-builder-webpack-plugin)
- [vue-separate-files-loader](https://github.com/pksunkara/vue-builder-webpack-plugin)
