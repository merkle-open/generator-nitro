# Static exports

Nitro can generate static exports of your project by using `gulp export` on the CLI.

    $ gulp export

The exporter configuration can be found at [config.json](../../config.json).

Nitro can also produce releases by using `gulp release` on the CLI.
You can influence the version bump by using the `--bump` option.

All possibilities in examples:

    $ gulp release --bump
    \> Version bumped from 0.0.0 -> 0.0.1

    $ gulp release --bump=minor
    \> Version bumped from 0.0.1 -> 0.1.0

    $ gulp release --bump=major
    \> Version bumped from 0.1.0 -> 1.0.0

    $ gulp release --bump=patch
    \> Version bumped from 1.0.0 -> 1.0.1

## Configuration options

### Exporter Configuration

#### exporter.dest (String)

The distribution folder for your static export. This is where all your static files will go.

- example: `"dist"`

#### exporter.i18n (Array)

Contains a list of language keys. The views will be downloaded using the specified language keys.
All defined language keys require a valid `translation.json` file at `project/locales`.

- example: `["de"]`

#### exporter.publics (Boolean / Array)

Controls which public files should be exported statically. `true` will export all files from your `public` directory.

You can define an array of strings, like `["assets/css/app.css", "assets/js/app.js"]` to export only those files.

When defining strings you can use globbing patterns.

- example: `true`

#### exporter.renames (Array)

Defines file renames. Takes an array of objects with `src`, `base` and `dest`.
Renaming is used with native `gulp.src(...).pipe(gulp.dest(...))`.

- example:

        [{
            "src": "dist/assets/**",
            "base": "dist/assets",
            "dest": "dist/"
        }]


#### exporter.replacements (Array)

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

#### exporter.views (Boolean / Array)

Controls which views should be exported statically. `true` will export all views from your `views` directory.

You can define an array of strings, like `["index.hbs", "404.hbs"]` to export only those views.

When defining strings you can use globbing patterns.

- example: `true`

#### exporter.zip

Defines, if the export should be zipped.

- example: `false`


### Release Configuration

#### exporter.release.bumpFiles (Array)

A list of files, where a version bump should be processed.

- example: `["package.json"]`

#### exporter.release.commit (Boolean)

Defines, if the `bumpFiles` should be committed. A commit will have the message `Release VERSION`.

- example: `false`

#### exporter.release.commitMessage (String)

Defines the commit message. Use `%VERSION%` to replace with current (bumped) version.

- example: `"Release %VERSION%"`

#### exporter.release.push (Boolean)

Defines, if a commit should be pushed automatically. Only pushes, if `commit` is set to `true`.

- example: `false`

#### exporter.release.pushBranch (String)

Defines the branch, which should be pushed. This should be the nae of the branch, where the release happens.

- example: `"master"`

#### exporter.release.pushTo (String)

Defines the remote origin name.

- example: `"origin"`

#### exporter.release.tag (Boolean)

Defines, if a release git tag should be created. The name is `vVERSION`, e.g. `v0.1.0`.

- example: `false`

#### exporter.release.tagName (String)

Defines the tag name. Use `%VERSION%` to replace with current (bumped) version.

- example: `"v%VERSION%"`

## Example Exporter Config

```
"exporter": {
    "dest": "dist",
    "i18n": [],
    "publics": true,
    "release": {
        "bumpFiles": ["package.json"],
        "commit": false,
        "push": false,
        "pushBranch": "master",
        "pushTo": "origin",
        "tag": false
    },
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
        }
    ],
    "views": true,
    "zip": false
}
```
