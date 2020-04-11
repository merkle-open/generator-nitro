[![npm version](https://badge.fury.io/js/%40nitro%2Fwebpack.svg)](https://badge.fury.io/js/%40nitro%2Fwebpack)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](http://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/namics/generator-nitro.svg?branch=master)](https://travis-ci.org/namics/generator-nitro)

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

-   Type: boolean || object
-   default: false
-   file types: js, jsx, mjs

Config:

-   `true` or `{}` activates JavaScript support
-   `{ eslint: true }` additionally adds eslint live linting feature (only relevant for development build)

#### `options.rules.ts`

-   Type: boolean
-   default: false
-   file types: ts, tsx

Config:

-   `true` will activate TypeScript support

#### `options.rules.scss`

-   Type: boolean || object
-   default: false
-   file types: scss, css

Config:

-   `true` or `{}` will activate scss support
-   `{ stylelint: true }` additionally adds stylelint live linting feature (only relevant for development build)

#### `options.rules.hbs`

-   Type: boolean || object
-   default: false
-   file types: hbs

Config:

-   `true` or `{}` will activate handlebars handlebars precompiled templates support
-   `{ include: [] }` additionally adds include config to rule
-   `{ exclude: [] }` additionally adds exclude config to rule

#### `options.rules.woff`

-   Type: boolean || object
-   default: false
-   file types: woff, woff2

Config:

-   `true` or `{}` will activate woff font support (in CSS files)
-   `{ include: [] }` additionally adds include config to rule
-   `{ exclude: [] }` additionally adds exclude config to rule

#### `options.rules.font`

-   type: boolean || object
-   default: false
-   file types: eot, svg, ttf, woff, woff2

Config:

* `true` or `{}` will activate font support for eot, svg, ttf, woff & woff2 fonts (in CSS files)
* `{ include: [] }` additionally adds include config to rule
* `{ exclude: [] }` additionally adds exclude config to rule

⚠ Please use this rule with care. You have to configure includes and exclude when you also use woff and/or image loader. 
Otherwise svg or woff files are processed with multiple configurations.

#### `options.rules.image`

-   Type: boolean || object
-   default: false
-   file types: png, jpg, gif, svg

Config:

-   `true` will activate image support
-   `{ include: [] }` additionally adds include config to rule
-   `{ exclude: [] }` additionally adds exclude config to rule

### `options.features`

Enable some additional features

#### `options.features.banner`

-   Type: boolean
-   default: true

(only relevant for production build)

`true` will add a text banner with infos from package.json to the bundled js & css

#### `options.features.bundleAnalyzer`

-   Type: boolean
-   default: false

`true` will add the bundleAnalyser plugin and opens a browser window with the stats

#### `options.features.theme`

-   Type: string || false
-   default: false

ToDo: Description

#### `options.features.dynamicAlias`

-   Type: object || false
-   default: false

ToDo: Description

## Extending Configuration

### Code Splitting

By default, all js imports from 'node_modules' are extracted to a 'vendors.js' to use in your view files.

Dynamically imported js files will be extracted to `public/js/dynamic/`.
You may use them in a promise chain.

```js
import('package-name').then((pack) => {
	// do something with 'pack'
});

import(/* webpackChunkName: "mychunk" */ 'package-name').then((pack) => {
	// do something with 'pack'
});
```

You may change the default configuration in [`webpackConfig.optimization.splitChunks`](https://webpack.js.org/configuration/optimization/#optimization-splitchunks)

## Changelog

Recent changes can be viewed on Github on the [Releases Page](https://github.com/namics/generator-nitro/releases)
