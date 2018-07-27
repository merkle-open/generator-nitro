# nitro webpack

Configurable and easy to use webpack config for nitro projects.

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
