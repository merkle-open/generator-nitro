[![npm version](https://badge.fury.io/js/%40nitro%2Fexporter.svg)](https://badge.fury.io/js/%40nitro%2Fexporter)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](http://opensource.org/licenses/MIT)
[![Build Status](https://github.com/merkle-open/generator-nitro/workflows/ci/badge.svg?branch=master)](https://github.com/merkle-open/generator-nitro/actions)

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

The export folder for your static export. This is where all your static files will go.

example: `'export'`

### exporter.i18n (Array)

Contains a list of language keys. The views will be exported using the specified language keys. (`?lang=<lang>`)

- Using an empty array will export the default language
- Use `default` for default language in an array with configured languages

example: `['de', 'default']`

### exporter.publics (Boolean / Array)

Controls which public files should be exported statically. `true` will export all files from your `public` directory.

You can define an array of strings, like `['public/assets/css/app.css', 'public/assets/js/app.js']` to export only those files.

When defining strings you can use globbing patterns.

example: `['public/*', 'public/assets/**/*', 'public/content/**/*']`

### exporter.renames (Array)

Defines file renames. Takes an array of objects with `src`, `base` and `dest`.
Renaming is used with native `gulp.src(...).pipe(gulp.dest(...))`.

example:

```
[
    {
        src: 'export/assets/**',
        base: 'export/assets',
        dest: 'export/',
    },
]
```

### exporter.replacements (Array)

Defines string replacements. Takes an array of objects with `glob` and `replace`.
`replace` is an array of objects with keys `from` and `to`.

**Please note: renames are executed before replacements!**

example:

```
[
    {
        glob: ['export/*.html', 'export/css/*.css'],
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

example: `true`

### exporter.additionalRoutes (Array)

Controls which additional routes should be exported.

example: `['api/service/countries.json', 'api/service/products.json']`

### exporter.minifyHtml

Defines, if the exported html pages should be minified.

example: `false`

### exporter.zip

Defines, if the export should be zipped.

example: `false`

## Example Exporter Config

```
"exporter": [
    {
        "dest": "export",
        "i18n": [],
        "publics": true,
        "renames": [
            {
                "src": "export/assets/**",
                "base": "export/assets",
                "dest": "export/"
            }
        ],
        "replacements": [
            {
                glob: ['export/*.html'],
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
                glob: ['export/css/*.css'],
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
                "glob": ["export/js/*.js"],
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
        "minifyHtml": false,
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
        dest: 'export',
        i18n: [],
        publics: true,
        renames: [],
        replacements: [],
        views: true,
        minifyHtml: false,
        zip: false,
    },
    {
        dest: 'static',
        i18n: [],
        publics: true,
        renames: [],
        replacements: [],
        views: true,
        minifyHtml: true,
        zip: false,
    },
]
```
