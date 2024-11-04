[![npm version](https://badge.fury.io/js/%40nitro%2Fwebpack.svg)](https://badge.fury.io/js/%40nitro%2Fwebpack)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](http://opensource.org/licenses/MIT)
[![Build Status](https://github.com/merkle-open/generator-nitro/workflows/ci/badge.svg?branch=master)](https://github.com/merkle-open/generator-nitro/actions)

# Nitro Webpack

Configurable and easy to use webpack 4 config for nitro projects.

## Usage

```
const options = {
    rules: {
        js: {
            eslint: false,
        },
        ts: false,
        scss: {
            stylelint: false,
        },
        hbs: true,
        woff: true,
        font: false,
        image: true,
    },
    features: {
        banner: true,
        bundleAnalyzer: false,
        theme: false,
        dynamicAlias: false,
    },
};
const webpackConfig = require('@nitro/webpack/webpack-config/webpack.config.dev')(options);

module.exports = webpackConfig;
```

## Configuration

### Rules

No loader rule is enabled by default. Activate following prepared rules you need in `options.rules`

#### `options.rules.js`

- Type: boolean || object
- default: false
- file types: js, jsx, mjs

Config:

- `true` or `{}` activates JavaScript support
- `{ eslint: true }` additionally adds eslint live linting feature (only relevant for development build)

#### `options.rules.ts`

- Type: boolean
- default: false
- file types: ts, tsx

Config:

- `true` will activate TypeScript support

#### `options.rules.scss`

- Type: boolean || object
- default: false
- file types: scss, css

Config:

- `true` or `{}` will activate scss support
- `{ publicPath: '../' }` provide a separate public path for stylesheets. By default, webpack uses the value from 'output.publicPath'. (only relevant for production build)
- `{ implementation: require('node-sass') }` gives the possibility to use 'node-sass' as sass implementation. (you have to add 'node-sass' as a dev-dependency in your project)
- `{ sassOptions: { ... } }` gives the possibility to add options for the ['dart-sass'](https://sass-lang.com/documentation/js-api/interfaces/options/) or ['node-sass'](https://github.com/sass/node-sass/#options) implementation (e.g. ignore some deprecations for dart-sass with `silenceDeprecations: [...]`)

#### `options.rules.hbs`

- Type: boolean || object
- default: false
- file types: hbs

Config:

- `true` or `{}` will activate handlebars precompiled templates support
- `{ include: [] }` additionally adds include config to rule
- `{ exclude: [] }` additionally adds exclude config to rule

#### `options.rules.woff`

- Type: boolean || object
- default: false
- file types: woff, woff2

Config:

- `true` or `{}` will activate woff font support (in CSS files)
- `{ include: [] }` additionally adds include config to rule
- `{ exclude: [] }` additionally adds exclude config to rule

#### `options.rules.font`

- type: boolean || object
- default: false
- file types: eot, svg, ttf, woff, woff2

Config:

- `true` or `{}` will activate font support for eot, svg, ttf, woff & woff2 fonts (in CSS files)
- `{ include: [] }` additionally adds include config to rule
- `{ exclude: [] }` additionally adds exclude config to rule

⚠ Please use this rule with care. You have to configure includes and exclude when you also use woff and/or image loader.
Otherwise svg or woff files are processed with multiple configurations.

#### `options.rules.image`

- Type: boolean || object
- default: false
- file types: png, jpg, gif, svg

Config:

- `true` will activate image support
- `{ include: [] }` additionally adds include config to rule
- `{ exclude: [] }` additionally adds exclude config to rule

### `options.features`

Enable some additional features

#### `options.features.banner`

- Type: boolean
- default: true

(only relevant for production build)

`true` will add a text banner with infos from package.json to the bundled js & css

#### `options.features.bundleAnalyzer`

- Type: boolean
- default: false

`true` will add the bundleAnalyser plugin and opens a browser window with the stats

#### `options.features.theme`

- Type: string || false
- default: false

A string will activate theming support:

- webpack uses `./src/ui.${theme}` as entrypoint (instead of `./src/ui`)
- a subfolder within assets is used for the output path and publicPath (`/assets/${theme}/`)

It makes sense to use a dynamic value e.g. an environment variable, as shown in the example configuration.

#### `options.features.dynamicAlias`

- Type: object || false
- default: false

A proper configured dynamicAlias feature will activate the DynamicAliasResolverPlugin
which can change import paths in source files dynamically on compile time as desired.

Properties:

- `options.features.dynamicAlias.search` (string || RegExp)
  search term to be replaced (e.g. '/theme/light')
- `options.features.dynamicAlias.replace` (string)
  string as replacement (e.g. `/theme/${theme}`)

## Extending Configuration

### Code Splitting

By default, all js imports from 'node_modules' are extracted to a 'vendors.js' to use in your view files.

Dynamically imported js files will be extracted to `public/js/dynamic/`.
You may use them in a promise chain.

```js
import('package-name').then((pack) => {
  // do something with 'pack'
});

import(
  /* webpackChunkName: "mychunk" */ 'package-name'
).then((pack) => {
  // do something with 'pack'
});
```

You may change the default configuration in [`webpackConfig.optimization.splitChunks`](https://webpack.js.org/configuration/optimization/#optimization-splitchunks)

## Changelog

Recent changes can be viewed on Github on the [Releases Page](https://github.com/merkle-open/generator-nitro/releases)
