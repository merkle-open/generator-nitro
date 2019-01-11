[![npm version](https://badge.fury.io/js/%40nitro%2Fexporter.svg)](https://badge.fury.io/js/%40nitro%2Fexporter)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](http://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/namics/generator-nitro.svg?branch=master)](https://travis-ci.org/namics/generator-nitro)

# Nitro Exporter

With this package, Nitro can generate static exports of your project by using `npm run export`.

```
npm run export
```

## Requirements

The gulp task "dump-views" must be present in your project.

## Configuration options

The exporter configuration can be found in your [config](../../config).

### exporter.dest (String)

The distribution folder for your static export. This is where all your static files will go.

- example: `'dist'`

### exporter.i18n (Array)

Contains a list of language keys. The views will be exported using the specified language keys.
You have to specify all languages additionally for the `dump-views` task at [generator-nitro](https://github.com/namics/generator-nitro).
The nitro-exporter will export all dumped views per default. You can filter out specific view exports by either setting `i18n` or `views` option.

- example: `['de']`

### exporter.publics (Boolean / Array)

Controls which public files should be exported statically. `true` will export all files from your `public` directory.

You can define an array of strings, like `['public/assets/css/app.css', 'public/assets/js/app.js']` to export only those files.

When defining strings you can use globbing patterns.

- example: `['public/*', 'public/assets/**/*', 'public/content/**/*']`

### exporter.renames (Array)

Defines file renames. Takes an array of objects with `src`, `base` and `dest`.
Renaming is used with native `gulp.src(...).pipe(gulp.dest(...))`.

- example:

```
[
    {
        src: 'dist/assets/**',
        base: 'dist/assets',
        dest: 'dist/',
    },
]
```

### exporter.replacements (Array)

Defines string replacements. Takes an array of objects with `glob` and `replace`.
`replace` is an array of objects with keys `from` and `to`.

**Please note: renames are executed before replacements!**

- example:

```
[
    {
        glob: ['dist/*.html', 'dist/css/*.css'],
        replace: [
            {
                from: '/assets',
                to: '',
            },
        ],
    },
]
```

### exporter.views (Boolean / Array)

Controls which views should be exported statically. `true` will export all views from your `views` directory.

You can define an array of strings, like `['index', '404']` to export only those views.

When defining strings you can use globbing patterns.

- example: `true`

### exporter.zip

Defines, if the export should be zipped.

- example: `false`

## Example Exporter Config

```
"exporter": [
    {
        "dest": "dist",
        "i18n": [],
        "publics": true,
        "renames": [
            {
                "src": "dist/assets/**",
                "base": "dist/assets",
                "dest": "dist/"
            }
        ],
        "replacements": [
            {
                glob: ['dist/*.html'],
                replace: [
                    {
                        from: '/assets/',
                        to: '',
                    },
                    {
                        from: '/content/',
                        to: 'content/',
                    },
                    {
                        from: ' href="/?([a-z0-9-]+)"',
                        to: ' href="$1.html"',
                    },
                ],
            },
            {
                glob: ['dist/css/*.css'],
                replace: [
                    {
                        from: '/assets/',
                        to: '../',
                    },
                    {
                        from: '/content/',
                        to: '../content/',
                    },
                ],
            },
            {
                "glob": ["dist/js/*.js"],
                "replace": [
                    {
                        from: '/assets/',
                        to: '',
                    },
                    {
                        "from": "/api",
                        "to": "api"
                    }
                ]
            },
        ],
        "views": true,
        "zip": false,
    }
]
```

## Multiple Exporter configurations

You can define multiple exporter configuration objects, by setting the `exporter` to an array.

### Example

```
exporter: [
    {
        dest: 'dist',
        i18n: [],
        publics: true,
        renames: [],
        replacements: [],
        views: true,
        zip: false,
    },
    {
        dest: 'static',
        i18n: [],
        publics: true,
        renames: [],
        replacements: [],
        views: true,
        zip: false,
    },
]
```
