# Nitro Config

Starting with version 2, nitro uses [config](https://www.npmjs.com/package/config) for project configuration.

This lets you extend the nitro default parameters for different environments (local, development, production, ...).  
The configuration is placed in the [`/config`](../../config) directory. Read more about [configuration files](https://github.com/lorenwest/node-config/wiki/Configuration-Files)

For your own functionality you can add new nodes as you like. It is certainly useful not to use the four main nodes from nitro: `assets`, `code`, `nitro` & `server`.

## Assets Configuration

You can configure the include order of your assets by defining patterns in `config/default/assets.js`.

```js
const config = {
   assets: {
        'app.css': [
            '!src/assets/css/somefile.*',
            'src/assets/css/cssreset.css',
            'src/assets/css/*.*',
            'src/patterns/**/css/*.*',
            'src/patterns/**/css/modifier/*.*',
        ],
        'app.js': [
            '!src/assets/js/somefile.js',
            'src/assets/vendor/jquery/dist/jquery.min.js',
            'src/assets/vendor/terrific/dist/terrific.min.js',
            'src/assets/js/*.js',
            'src/patterns/**/js/*.js',
            'src/patterns/**/js/decorator/*.js',
        ],
   },
};
```

### Pattern

The matching patterns follow the standard node glob patterns.  
Glob patterns are similar to regular expression but simplified. They are used by several shells.  
You should always try to keep the patterns simple. Usually you only need the asterisks `*` `**` and the exclamation mark `!` for negation.

You can read more on the standard [node glob patterns](https://github.com/isaacs/node-glob#glob-primer).

### Special Pattern Prefixes

* You can negate a pattern by starting with an exclamation mark `!`.
  `!` = exclude pattern
* Define all your dependencies for the compiling-process with the `+` prefix
  `+` = exclude file but prepend it to every compile call for files with the same file extension.

The order of these special patterns does not matter.

### Examples

* `"!src/patterns/*/test*"`         Exclude all patterns starting with `test`
* `"!**/*-test.*"`                  Exclude all filenames ending with `-test`.
* `"+src/assets/css/mixins.less"`   Exclude `src/assets/css/mixins.less` but prepend to every compile call of every .less file

### Other asset files

You can configure as many different assets as you wish.

```
    'brand.css': [
        'src/assets/css/reset.css',
        ...
```

## Code

### Validation

#### `code.validation.eslint`

Type: Object

* `code.validation.eslint.live` - default: true

Enable/disable JavaScript linting on change.

#### `code.validation.htmllint`

Type: Object

* `code.validation.htmllint.live` - default: true

Enable/disable HTML linting on change.

#### `code.validation.jsonSchema`

Type: Object

* `code.validation.jsonSchema.live` - default: true  
  Enable/disable JSON-Schema validation on change.
* `code.validation.jsonSchema.logMissingSchemaAsError` - default: false
* `code.validation.jsonSchema.logMissingSchemaAsWarning` - default: true

#### `code.validation.stylelint`

Type: Object

* `code.validation.stylelint.live` - default: true

Enable/disable CSS linting on change.

## Nitro

The node `nitro` contains following properties

### Patterns

#### `nitro.patterns`

Type: Object

Configuration of pattern types. These types are used for:

* handlebars pattern helper (`{{pattern name='pattern'}}`) to evaluate the pathes
* pattern generator `yo nitro:pattern`

A type contains following properties:

* `template` defines the path where the pattern generator looks for the files to copy
* `path` defines the place where the patterns of this type are placed
* `patternPrefix` defines the class prefix

```js
const config = {
	nitro: {
		patterns: {
			atom: {
				template: 'project/blueprints/pattern',
				path: 'src/patterns/atoms',
				patternPrefix: 'a',
			},
			molecule: {
				template: 'project/blueprints/pattern',
				path: 'src/patterns/molecules',
				patternPrefix: 'm',
			},
			organism: {
				template: 'project/blueprints/pattern',
				path: 'src/patterns/organisms',
				patternPrefix: 'o',
			},
		},
	},
};
```

### Mode

#### `nitro.mode.livereload`

Type: Boolean  
Default: true

Browser livereload on changes (develop mode only)

#### `nitro.mode.minified`

Type: Boolean  
Default: false

Indicator to use minified assests.  
This property is passed as `_nitro.minified` to handlebars views.

#### `nitro.mode.offline`

Type: Boolean  
Default: false

If set to true, browsersync will be loaded in offline mode.  
This property is passed as `_nitro.offline` to handlebars views.

### Watch

#### `nitro.watch.partials`

Type: Boolean  
Default: true

If set to false, handlebars partials won't be watched and recompiled on change.

#### `nitro.watch.throttle`

Type: Object

* `nitro.watch.throttle.base` - default: 1000  
  The next code change of each type (CSS, JavaScript) is processed no earlier than <throtte.base> ms after the last run.
* `nitro.watch.throttle.cache` - default: 3000  
  The CSS cache invalidation (on changing css dependencies) is only initiated <throttle.cache> ms after the last run.

### Server

#### `server.port`

Type: Integer
Default: 8080

The express server runs on this port.  
An environment variable PORT will overwrite this property.

#### `server.proxy`

Type: Integer
Default: 8081

The proxy server with livereload functionality runs on this port.  
An environment variable PROXY will overwrite this property.
