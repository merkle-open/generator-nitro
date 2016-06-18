# Static exports

Nitro can generate static exports of your project by using `gulp export` on the CLI.

The exporter configuration can be found at [config.json](../../config.json).

Nitro can also produce releases by using `gulp release` on the CLI.
You can influence the version bump by using the `--bump` option.

All possibilities in examples:

    $ gulp --bump
    \> Version bumped from 0.0.0 -> 0.0.1
    $ gulp --bump=minor
    \> Version bumped from 0.0.1 -> 0.1.0
    $ gulp --bump=major
    \> Version bumped from 0.1.0 -> 1.0.0
    $ gulp --bump=patch
    \> Version bumped from 1.0.0 -> 1.0.1

## Exporter configuration options

### exporter.dest (String)

The distribution folder for your static export. This is where all your static files will go.

- default: `"dist"`

### exporter.i18n (Array)

Contains a list of language keys. The views will be downloaded using the specified language keys.
All defined language keys require a valid `translation.json` file at `project/locales`.

- default: `[]`

### exporter.publics (Boolean / Array)

Controls which public files should be exported statically. `true` will export all files from your `public` directory.

You can define an array of strings, like `["assets/css/app.css", "assets/js/app.js"]` to export only those files.

When defining strings you can use globbing patterns.

- default: `true`

### exporter.renames (Array)

Defines file renames. Takes an array of objects with `src`, `base` and `dest`.
Renaming is used with native `gulp.src(...).pipe(gulp.dest(...))`.

- default:

        [{
            "src": "dist/assets/**",
            "base": "dist/assets",
            "dest": "dist/"
        }]


### exporter.replacements (Array)

Defines string replacements. Takes an array of objects with `glob` and `replace`.
`replace` is an array of objects with keys `from` and `to`.

**Please note: replacements are executed before renames!**

- default:

        [{
            "glob": ["dist/*.html", "dist/css/*.css"],
            "replace": [{
                "from": "/assets",
                "to": "assets"
            }]
        }, {
            "glob": ["dist/js/*.js"],
            "replace": [{
                "from": "/api",
                "to": "api"
            }]
        }]


### exporter.release.bumpFiles (Array)

A list of files, where a version bump should be processed.

- default: `["package.json"]`

### exporter.release.commit

Defines, if the `bumpFiles` should be committed. A commit will have the message `Release VERSION`.

- default: `false`

### exporter.release.push

Defines, if a commit should be pushed automatically. Only pushes, if `commit` is set to `true`.

- default: `false`

### exporter.release.pushBranch

Defines the branch, which should be pushed. This should be the nae of the branch, where the release happens.

- default: `"master"`

### exporter.release.pushTo

Defines the remote origin name.

- default: `"origin"`

### exporter.release.tag

Defines, if a release git tag should be created. The name is `vVERSION`, e.g. `v0.1.0`.

- default: `false`

### exporter.views (Boolean / Array)

Controls which views should be exported statically. `true` will export all views from your `views` directory.

You can define an array of strings, like `["index.hbs", "404.hbs"]` to export only those views.

When defining strings you can use globbing patterns.

- default: `true`

### exporter.zip

Defines, if an export should be zipped.

- default: `false`
