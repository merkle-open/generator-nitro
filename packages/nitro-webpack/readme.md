[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Build Status][appveyor-image]][appveyor-url] [![Dependency Status][daviddm-image]][daviddm-url]

# Nitro Webpack

Configurable and easy to use webpack 4 config for nitro projects.

## Usage

```
const options = {
	rules: {
	    js: true,
		ts: false,
		scss: true,
		hbs: true,
		woff: true,
		image: true,
	},
	features: {
	    gitInfo: false,
	},
};
const webpackConfig = require('@nitro/webpack/webpack-config/webpack.config.dev')(options);

module.exports = webpackConfig;
```

## Configuration

### Rules

No loader rule is enabled by default. Activate following prepared rules you need in `options.rules` 

#### `options.rules.js`

* Type: boolean
* default: false

`true` will activate JavaScript support

#### `options.rules.ts`

* Type: boolean
* default: false

`true` will activate TypeScript support

#### `options.rules.scss`

* Type: boolean
* default: false

`true` will activate scss support

#### `options.rules.hbs`

* Type: boolean
* default: false

`true` will activate handlebars handlebars precompiled templates support

#### `options.rules.woff`

* Type: boolean
* default: false

`true` will activate woff font support (in CSS files)

#### `options.rules.image`

* Type: boolean
* default: false

`true` will activate image support ()

### `options.features`

Enable some additional features

#### `options.features.gitInfo`

* Type: boolean
* default: false

(only relevant for production build)

`true` will add infos from git (branchname/last commit) in assets banner text

## Changelog

Recent changes can be viewed on Github on the [Releases Page](https://github.com/namics/generator-nitro/releases)

## License

[MIT license](http://opensource.org/licenses/MIT)

[npm-image]: https://badge.fury.io/js/@nitro/webpack.svg
[npm-url]: https://npmjs.org/package/@nitro/webpack
[travis-image]: https://travis-ci.org/namics/generator-nitro.svg?branch=master
[travis-url]: https://travis-ci.org/namics/generator-nitro
[appveyor-image]: https://ci.appveyor.com/api/projects/status/0580phm813ccdbhr/branch/master?svg=true
[appveyor-url]: https://ci.appveyor.com/project/namics/generator-nitro/branch/master
[daviddm-image]: https://david-dm.org/namics/generator-nitro.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/namics/generator-nitro
