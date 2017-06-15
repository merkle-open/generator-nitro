# Nitro Usage

Nitro is a Node.js application for simple and complex frontend development with a tiny footprint.
It provides a proven but flexible structure to develop your frontend code, even in a large team.
Keep track of your code with a modularized frontend. This app and the suggested concepts could help -
[atomic design](http://bradfrost.com/blog/post/atomic-web-design/) and [BEM](https://en.bem.info/method/definitions/).  
Nitro is simple, fast and flexible. Use this app for all your frontend work.

## Features

* Simple project structure
* CSS/JS concatenation and minification
* LESS/SCSS support (with caching for optimal performance)
* ES2015 with babel transpiling
* Source Maps, Linting, PostCSS & Browsersync
* Jasmine tests with Karma test runner
* Yeoman pattern generator<% if (options.clientTpl) { %>
* [Client side templates](client-templates.md)<% } %><% if (options.exporter) { %>
* [Static Exports](nitro-exporter.md)<% } %><% if (options.release) { %>
* [Releases](nitro-release.md)<% } %>

## Preparation

This application was created by the yeoman generator for nitro.  
Before using, you need of course [node and npm](https://nodejs.org/) installed.
Currently supported node.js versions are 4.x and 6.x. So everything between should work.  
And also you need the yeoman [generator-nitro](https://www.npmjs.com/package/generator-nitro)
and some dependencies installed globally.

```
npm install -g yo gulp generator-nitro
```

Keep your global packages up to date:

```
npm outdated -g --depth=0
```

Make an update if necessary:

```
npm update -g
```

Install the project dependencies in the project root:

```
npm install
```

## Starting the app

Use

```
npm run dev
```

... to start in development mode

or

```
node server
```

... to start the server only

For production mode add `NODE_ENV=production` environment variable

```
NODE_ENV=production && npm run prod
```

The Nitro app will run on port `8080` by default, the proxy on `8081` (only run with `dev` task).  
If you want the app to run on another port put them before the start task like this:

```
PORT=8000 PROXY=8001 npm run dev
```

The port to be used in production can be set the same way:

```
PORT=3000 node server
```

This works a bit different on **Windows**. Use the following commands in prompt:

```
set PORT=8000 && set PROXY=8001 && npm run dev
set PORT=3000 && node server
set NODE_ENV=production && npm run prod
```

## Daily Work - Creating Patterns & Pages

### Creating Patterns

Patterns are created in the `patterns` folder. A pattern is an encapsulated block of markup
with corresponding styles, scripts and data. The pattern data can be described in `schema.json`
with [JSON schema](http://json-schema.org) format. Nitro uses [ajv](http://epoberezkin.github.io/ajv/) for validation.

For a better overview it is useful to define different types of patterns in `config.json`. It is recommended to make
subfolders like `atoms`, `molecules` & `organisms`

A pattern uses the following structure:

```
/example
/example/example.<%= options.viewExt %>
/example/schema.json
/example/css/example.css
/example/js/example.js
/example/_data/example.json
```

Modifiers (JavaScript) and decorators (CSS) are created using the following conventions:

```
/example/css/modifier/example-<modifier>.css
/example/js/decorator/example-<decorator>.
```

Different data variations have to be placed in the `_data` folder:

```
/example/_data/example-variant.json
```

### Creating patterns with yo

```
yo nitro:pattern
```

This will copy the templates (nitro.patterns.<type>.template) from `config.json` to the configured target.

### Creating pattern elements

If you want to split up your pattern into smaller parts you may use elements.
For this, place a new pattern in the folder `elements` inside a pattern.

Element `example-sub` in pattern `example`:

```
/example/elements/example-sub
/example/elements/example-sub/example-sub.<%= options.viewExt %>
/example/elements/example-sub/css/example-sub.css
/example/elements/example-sub/js/example-sub.js
/example/elements/example-sub/_data/example-sub.json
```

It's recommended to start the name of a subpattern with the pattern name.

### Creating pages

Create a new `*.<%= options.viewExt %>` file in the `views` folder. (You can make as many subfolders as you want.)

```
/views/index.<%= options.viewExt %>
/views/content.<%= options.viewExt %>
/views/content/variant.<%= options.viewExt %>
```

Your new page can then be called by the according URL (with or without an extension).  
Subfolders are represented with a hyphen.

```
http://localhost:8080/index
http://localhost:8080/content
http://localhost:8080/content-variant
```

#### Layout

By default views use a simple layout mechanism.
The default layout template `views/_layouts/default.<%= options.viewExt %>` is used for every view.
The block `{{{body}}}` includes the contents from a view.

Simple default layout:

```html
<!DOCTYPE html>
<html lang="en">
<head></head>
<body>
    {{{body}}}
</body>
</html>
```

To remove the layout feature, simply delete the folder `views/_layout`.

Different layouts are placed in `views/_layouts/`. Link them to your view [in your page datafile](#use-different-layout).

### Render patterns

Pages are meant to be compositions of your patterns. Use the pattern's name as the first parameter. Be aware, the
pattern name is case-sensitive and should be unique.

Nitro uses [handlebars](https://www.npmjs.com/package/hbs) as the view engine and provides custom helpers.

Render the example pattern. (file: `example.<%= options.viewExt %>`, data-file: `example.json`)

```
{{pattern 'example'}}
{{pattern 'example' 'example'}}
```

Render a "variant" from the example pattern. (file: `example.<%= options.viewExt %>`, data-file: `example-variant.json`)

```
{{pattern 'example' 'example-variant'}}
```

Another possibility to use the pattern helper is by providing hash options.

```
{{pattern name='example' data='example-variant'}}
```

...and if you really need this you may provide a second template file. (file: `example-2.<%= options.viewExt %>`, data-file: `example-variant.json`)

```
{{pattern name='example' data='example-variant' template='example-2'}}
```

There also is a possibility to pass data to subpatterns by providing a data object as second parameter or as hash option.

```
{{pattern 'example' exampleContent}}
{{pattern 'example' data=exampleContent}}
```

To be more flexible, you may also pass individual arguments to the pattern, which overrides the defaults.

```
{{pattern 'example' modifier='blue'}}
```

#### Render patterns with children

Maybe using your pattern templates with transclusion could be helpful in some cases.

```html
// example box template
<div class="a-box">
    {{{children}}}
</div>
```

Call it as block like this:

```
{{#pattern 'box'}}
    {{pattern 'example'}}
{{/pattern}}
```

#### Render pattern elements

The pattern helper will find also pattern elements.

```
{{pattern 'example-sub'}}
```

... looks for following paths

- Pattern with name `example-sub`: `<type>/example-sub/example-sub.<%= options.viewExt %>`
- Element with name `example-sub`: `<type>/*/elements/example-sub/example-sub.<%= options.viewExt %>`

### Render partials

Render a partial (HTML snippet). Partials are placed in `views/_partials/` as `*.<%= options.viewExt %>` files (e.g. `head.<%= options.viewExt %>`).

```
{{> head}}
```

### Render placeholders

Using a placeholder is another way to output some markup. Placeholders are placed in a folder inside `views/_placeholders/` as `*.<%= options.viewExt %>` files.  
The following two examples do the same and render the file `content/example.<%= options.viewExt %>` from `views/_placeholders/`.

```
{{placeholder 'content' 'example'}}
{{placeholder name='content' template='example'}}
```

### Passing data

#### Data per page

You may pass data to your templates (view, layout, partial, pattern) per view.  
Put a file with the same name as the view in the folder `views/_data/` with the file extension `.json`. (Use the same folder structure as in `views`)

```
/views/index.<%= options.viewExt %>
/views/_data/index.json
http://localhost:8080/index

/views/content/variant.<%= options.viewExt %>
/views/_data/content/variant.json
http://localhost:8080/content-variant
```

It's also possilbe to use a custom data file by requesting with a query param `?_data=...`:

```
/views/index.<%= options.viewExt %>
/views/_data/index-test.json
http://localhost:8080/index?_data=index-test
```

##### Use different layout

If you need a different layout for a page, do so in the corresponding data file:
```
    /views/_data/index.json
    {
        "_layout": "home"
    }

    /views/_layouts/home.<%= options.viewExt %>
    http://localhost:8080/index
```

...or you may change the layout temporarily by requesting a page with the query param `?_layout=...`

```
/views/index.<%= options.viewExt %>
/views/_layouts/home.<%= options.viewExt %>
http://localhost:8080/index?_layout=home
```

#### Dynamic view data

If you want to use dynamic view data (i.e. using data from a database or data which is available in different views),
you can define those "routes" in the directory [`project/viewData/`](../viewData/readme.md).

#### Data per pattern

Pattern data will overwrite data from views. (Use as described above)

#### Data in request

You may overwrite data from views & patterns in request parameters.

`?pageTitle=Testpage` will overwrite the data for the handlebars expression `{{pageTitle}}`

It's also possible to use dot notation for object data:

`?page.title=Testpage` will overwrite the value for `{{page.title}}`

## Assets

One of Nitro's main feature is asset concatenation for CSS and JavaScript files.
If changed, the files will be updated on every change,
therefore you'll always get the latest version.

### Assets Configuration

You can configure the include order of your assets by defining patterns in `config.json`.

```json
"assets": {
    "app.css": [
        "!assets/css/somefile.*",
        "assets/css/cssreset.css",
        "assets/css/*.*",
        "patterns/**/css/*.*",
        "patterns/**/css/modifier/*.*"
    ],
    "app.js": [
        "!assets/js/somefile.js",
        "assets/vendor/jquery/dist/jquery.min.js",
        "assets/vendor/terrific/dist/terrific.min.js",
        "assets/js/*.js",
        "patterns/**/js/*.js",
        "patterns/**/js/decorator/*.js"
    ]
}
```

#### Pattern

The matching patterns follow the standard node glob patterns.  
Glob patterns are similar to regular expression but simplified. They are used by several shells.  
You should always try to keep the patterns simple. Usually you only need the asterisks `*` `**` and the exclamation mark `!` for negation.

You can read more on the standard [node glob patterns](https://github.com/isaacs/node-glob#glob-primer).

#### Special Pattern Prefixes

* You can negate a pattern by starting with an exclamation mark `!`.
  `!` = exclude pattern
* Define all your dependencies for the compiling-process with the `+` prefix
  `+` = exclude file but prepend it to every compile call for files with the same file extension.

The order of these special patterns does not matter.

#### Examples

* `"!patterns/*/test*"`         Exclude all patterns starting with `test`
* `"!**/*-test.*"`              Exclude all filenames ending with `-test`.
* `"+assets/css/mixins.less"`   Exclude `assets/css/mixins.less` but prepend to every compile call of every .less file

### Other asset files

You can configure as many different assets as you wish.

```
"brand.css": [
    "assets/css/reset.css",
    ...
```

## Translations

Nitro uses [i18next](https://www.npmjs.com/package/i18next) as Translation Library and gives you the Handlebars helper `{{t}}`.  
Translations are stored in `project/locales/[lang]/translation.json`.

Express Middleware configuration:

* Fallback language: `default`
* Language detection from request header
* Language switch with query parameter: `?lang=de`

### Translation handlebars helper

The helper uses the given [library features](http://i18next.com/translate/).

You may use hash values or an object to transfer data to the helper. Use two brackets as interpolation pre- and suffixes
or use `%s` placeholders for sprintf functionality.

Some examples:

```
data = {
   name: 'developer'
}

"test": {
    "example": {
        "string" : "gold",
        "nested": "All that glitters is not $t(test.example.string).",
        "sprintf" : "The first three letters of %s are: %s, %s and %s",
        "interpolation" : "Hello {{name}}"
    }
}

{{t 'test.example.string'}}
{{t 'test.example.nested'}}
{{t 'test.example.sprintf' 'alphabet' 'a' 'l' 'p'}}
{{t 'test.example.interpolation' name='developer'}}
{{t 'test.example.interpolation' data}}
```

## Conventions

### Resource linking

To stay consistent you should favour the use of relative paths with a leading slash.
Link to resources relatively to the `project`-folder **with** a leading slash.

```html
<link rel="stylesheet" href="/assets/app.css" type="text/css" />
<link rel="shortcut icon" href="/assets/img/icon/favicon.ico" type="image/x-icon" />
<script src="/assets/app.js"></script>
background: url(/assets/img/bg/texture.png) scroll 0 0 no-repeat;
<a href="/content.html">Contentpage</a>
```

### Upper & lower case letters

Use all lowercase if possible. (Exception: TerrificJS uses upper case for its namespace `T` and class names `T.Module.Example`)

All files must be lowercase. It's allowed to use uppercase letters for pattern folders, keep care of case sensitive filesystems and use handlebars helpers with the *exact* folder name.

```
{{pattern name='NavMain'}}
```

... looks for a template `navmain.<%= options.viewExt %>` in the folder `NavMain`.

Note that uppercase letters in pattern names are represented in CSS with hyphens.

```
Navigation   -> T.Module.Navigation   -> m-navigation
NavMain      -> T.Module.NavMain      -> m-nav-main
AdminNavMain -> T.Module.AdminNavMain -> m-admin-nav-main
```
### Custom Handlebars helpers

Custom handlebars helpers will be automatically loaded if put into to `project/helpers` directory. An example could look like 
this:

```js
module.exports = function(foo) {
    // Helper Logic
};
```

The helper name will automatically match the filename, so if you name your file `foo.js` your helper will be called `foo`.

### JSON Endpoints

If you need to mock service endpoints, you can put JSON files into a directory inside the `/public` directory as
those are directly exposed.

`/public/service/posts.json` will be available under `/service/posts.json`
and can be used for things like AJAX requests.

### Custom Routes

If you need more custom functionality in endpoints
you can put your custom routes with their logic
into the [`project/routes` directory](project/routes/).

### Using another Template Engine

If you don't want to use [Handlebars](http://handlebarsjs.com/) as Nitro's Template Engine
you can configure your own Engine.  
This example shows how to replace Handlebars with [Nunjucks](https://mozilla.github.io/nunjucks/) as an example.

All these steps need to be performed in `server.js`.

1. Replace the line `hbs = require('./app/core/hbs')` with `nunjucks = require('nunjucks')`
2. Remove the line `app.engine(config.nitro.view_file_extension, hbs.__express);`
3. Configure nunjucks as Express' Template Engine with the following block:

```js
nunjucks.configure(
    config.nitro.base_path + config.nitro.view_directory,
    {
        autoescape: true,
        express: app
    }
);
```

Now Restart Nitro and it'll run with Nunjucks.

**Be aware**, you'll need to adjust all your views and patterns to work with the new engine. 
Nitro only provides a `pattern` helper for handlebars.

## Miscellaneous

### Commandline

Nitro uses [Gulp](http://gulpjs.com/) under the hood and can therefore be used on the CLI.

### Git Hooks

Nitro tries to install a `post-merge` git hook with every `npm install` (if we are in git root).

This hook will:

* run `npm install` if someone changes `package.json`
* sync this git hooks if someone changes one.

You may [change this or add other hooks](../.githooks/readme.md) in `project/.githooks`.

### Contributing

* For bugs and features please use [GitHub Issues](https://github.com/namics/generator-nitro/issues)
* Feel free to fork and send PRs to the current `develop` branch. That's a good way to discuss your ideas.

### Example Project Includes

* [YUI CSS Reset 3.18.1](http://yuilibrary.com/yui/docs/cssreset/)
* Favicon & Home-Icons from Nitro (replace with your own)
* Pattern `example` and some styles in assets/css (you don't need them)

#### Client Dependencies

The following packages are installed by the [app](#name) generator as npm dependencies:

* [jQuery 3.2.0](http://jquery.com/)
* [TerrificJS 3.0.0](https://github.com/brunschgi/terrificjs)<% if (options.clientTpl) { %>
* [Handlebars 4.0.7](https://github.com/components/handlebars.js)<% } %>
* [Babel Polyfill 6.23.0](https://www.npmjs.com/package/babel-polyfill)

### Credits

This app was generated with yeoman and the [generator-nitro](https://www.npmjs.com/package/generator-nitro) package (version <%= version %>).
