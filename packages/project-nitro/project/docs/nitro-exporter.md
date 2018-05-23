# nitro-exporter

With this package, Nitro can generate static exports of your project by using `npm run export`.

    $ npm run export

The exporter configuration can be found in [config.json](//github.com/namics/generator-nitro/app/templates/config.json).

## Configuration options

### exporter.dest (String)

The distribution folder for your static export. This is where all your static files will go.

- example: `"dist"`

### exporter.i18n (Array)

Contains a list of language keys. The views will be exported using the specified language keys.
You have to specify all languages addiotionally for the `dump-views` task at [generator-nitro](https://github.com/namics/generator-nitro).
The nitro-exporter will export all dumped views per default. You can filter out specific view exports by either setting `i18n` or `views` option.

- example: `["de"]`

### exporter.publics (Boolean / Array)

Controls which public files should be exported statically. `true` will export all files from your `public` directory.

You can define an array of strings, like `["build/assets/css/app.css", "build/assets/js/app.js"]` to export only those files.

When defining strings you can use globbing patterns.

- example: `true`

### exporter.renames (Array)

Defines file renames. Takes an array of objects with `src`, `base` and `dest`.
Renaming is used with native `gulp.src(...).pipe(gulp.dest(...))`.

- example:

        [{
            "src": "dist/assets/**",
            "base": "dist/assets",
            "dest": "dist/"
        }]


### exporter.replacements (Array)

Defines string replacements. Takes an array of objects with `glob` and `replace`.
`replace` is an array of objects with keys `from` and `to`.

**Please note: renames are executed before replacements!**

- example:

        [{
            "glob": ["dist/*.html", "dist/css/*.css"],
            "replace": [{
                "from": "/assets",
                "to": ""
            }]
        }]

### exporter.views (Boolean / Array)

Controls which views should be exported statically. `true` will export all views from your `views` directory.

You can define an array of strings, like `["index.hbs", "404.hbs"]` to export only those views.

When defining strings you can use globbing patterns.

- example: `true`

### exporter.zip

Defines, if the export should be zipped.

- example: `false`

## Example Exporter Config

```
"exporter": {
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
            "glob": ["dist/*.html", "dist/css/*.css"],
            "replace": [
                {
                    "from": "/assets/",
                    "to": ""
                }
            ]
        },
        {
            "glob": ["dist/js/*.js"],
            "replace": [
                {
                    "from": "/api",
                    "to": "api"
                }
            ]
        },
        {
            "glob": ["dist/*.html"],
            "replace": [
                {
                    "from": "([a-z]+)\\.(css|js)",
                    "to": "$1.min.$2"
                }
            ]
        }
    ],
    "views": true,
    "zip": false
}
```

## Multiple Exporter configurations

You can define multiple exporter configuration objects, by setting the `exporter` to an array.

### Example

```
"exporter": [{
    "dest": "dist",
    "i18n": [],
    "publics": true,
    "renames": [],
    "replacements": [],
    "views": true,
    "zip": false
}, {
    "dest": "static",
    "i18n": [],
    "publics": true,
    "renames": [],
    "replacements": [],
    "views": true,
    "zip": false
}]
```
