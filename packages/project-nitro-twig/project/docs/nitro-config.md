# Nitro Config

Nitro uses [config](https://www.npmjs.com/package/config) for project configuration.

This lets you extend the nitro default parameters for different environments (local, development, production, ...).  
The configuration is placed in the [`/config`](../../config) directory. Read more about [configuration files](https://github.com/lorenwest/node-config/wiki/Configuration-Files)

For your own functionality you can add new nodes as you like. It is certainly useful not to use
the main nodes from nitro: `code`, `nitro`,`server`, `gulp`, `feature`, `exporter` & `themes`.

## Code

### Validation

#### `code.validation.eslint`

Type: Object

- `code.validation.eslint.live` - default: false

Enable/disable JavaScript linting on change.

#### `code.validation.htmllint`

Type: Object

- `code.validation.htmllint.live` - default: true

Enable/disable HTML linting on change.

#### `code.validation.jsonSchema`

Type: Object

- `code.validation.jsonSchema.live` - default: true  
  Enable/disable JSON-Schema validation on change.
- `code.validation.jsonSchema.logMissingSchemaAsError` - default: false
- `code.validation.jsonSchema.logMissingSchemaAsWarning` - default: true

#### `code.validation.stylelint`

Type: Object

- `code.validation.stylelint.live` - default: false

Enable/disable CSS linting on change.

## Nitro

The node `nitro` contains following properties

### Simple Properties

- `nitro.viewFileExtension`: String (default: 'hbs') - possible values: 'hbs' or 'twig'
  Extension of all view files (pattern & views)
- `nitro.templateEngine`: String (default: 'hbs') - possible values: 'hbs' or 'twig'
  Currently used serverside rendering engine

### Patterns

#### `nitro.patterns`

Type: Object

Configuration of pattern types. These types are used for:

- handlebars pattern helper (`{{pattern name='pattern'}}`) to evaluate the pathes
- pattern generator `npm run nitro:pattern`

A type contains following properties:

- `template` defines the path where the pattern generator looks for the files to copy
- `path` defines the place where the patterns of this type are placed
- `patternPrefix` defines the class prefix

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

- Type: Boolean
- Default: true

Browser livereload on changes (develop mode only)

#### `nitro.mode.offline`

- Type: Boolean
- Default: false

If set to true, browsersync will be loaded in offline mode.  
This property is passed as `_nitro.offline` to handlebars views.

### Watch

#### `nitro.watch.partials`

- Type: Boolean
- Default: true

If set to false, handlebars partials won't be watched and recompiled on change.

#### `nitro.watch.delay`

- Type: Integer
- Default: 1000

The millisecond 'delay' between a file change and task execution.

## Server

### `server.port`

- Type: Integer
- Default: 8080

The express server runs on this port.  
An environment variable PORT will overwrite this property.

### `server.proxy`

- Type: Object

The proxy server config with livereload functionality. (Used in develop mode only)

#### `server.proxy.port`

- Type: Integer
- Default: 8081

An environment variable PROXY will overwrite this property.

#### `server.proxy.https`

- Type: Object | false
- Default: false

Enabling the https mode requires an ssl certificate:

- `server.proxy.https.cert` (path to the certificate file)
- `server.proxy.https.key` (path to the certificate key)

#### `server.proxy.host`

- Type: String

Defines a custom host for your external url (e.g. nitro.local)

#### `server.proxy.open`

- Type: Boolean | String

Decide [which URL to open automatically in your browser](https://www.browsersync.io/docs/options#option-open) when proxy server starts.  
Possible values: false, 'local', 'external'

#### Example config for http proxy (default)

```js
server: {
    port: 8080,
    proxy: {
        port: 8081,
        https: false,
    },
}
```

#### Example config for https proxy

Generate your own certificate e.g. with [mkcert](https://github.com/FiloSottile/mkcert)

```js
server: {
    port: 8080,
    proxy: {
        port: 8081,
        https: {
            cert: './project/server/localhost.pem',
            key: './project/server/localhost-key.pem',
        },
        host: 'nitro.dev',
        open: 'external',
    },
}
```

### `server.compression`

- Type: Boolean
- Default: true

If set to `true`, all requests through express will be compressed.

## Gulp

### `gulp.dumpViews`

Type: Object

Used in gulp task `dump-views`

#### `gulp.dumpViews.viewFilter`

Type: Function

Filters unwanted views (should return false for unwanted view urls). By default, all views will be dumped.

e.g.: `viewFilter: (url) => url !== 'incomplete'`

### `gulp.copyAssets`

Type: Array of Objects

Copies all source files to dest folder

Object Properties:

- `gulp.copyAssets.src` String (default: '')
- `gulp.copyAssets.dest` String (default: '')

### `gulp.minifyImages`

Type: Array of Objects

Copies and minifies all source images to dest folder

Object Properties:

- `gulp.minifyImages.src` String (default: ''; example: 'src/shared/assets/img/\*\*/\*')
- `gulp.minifyImages.dest` String (default: ''; example: 'public/assets/img')

### `gulp.svgSprites`

Type: Array of Objects

Generates icon sprite with the name of the last folder in src. If src is an array, it uses the last folder from the first entry.

Properties:

- `gulp.svgSprites.src` String || String[] (default: ''; example: 'src/patterns/atoms/icon/img/icons/\*.svg')
- `gulp.svgSprites.dest` String (default: ''; example: 'public/assets/svg')

## Feature

### i18next express middleware

The node `feature.i18next` contains:

- two configuration objects for i18next express middleware (default)
- or the boolean `false` to disable the feature completely.

If you want to change the defaults in `feature.i18next.options` (configuration options)
and `feature.i18next.optionsMiddleware` (mainly for express routes to ignore),
check following documentations:

- [i18next express middleware](https://github.com/i18next/i18next-express-middleware)
- [configuration options](https://www.i18next.com/overview/configuration-options)
