# Nitro Usage

Nitro is a Node.js application for simple and complex frontend development with a tiny footprint.
It provides a proven but flexible structure to develop your frontend code, even in a large team.  
Keep track of your code with a modularized frontend. This app and the suggested concepts could help -
[atomic design](http://bradfrost.com/blog/post/atomic-web-design/) and [BEM](https://en.bem.info/method/definitions/).  
Nitro is simple, fast and flexible. Use this app for all your frontend work.

## Features

* Simple and proven project structure
* CSS/JS concatenation and minification
* LESS/SCSS support (with caching for optimal performance)
* ES2015 with babel transpiling
* Linting, Source Maps, PostCSS & Browsersync
* Jasmine tests with Karma test runner
* Yeoman pattern generator
* [Client side templates](client-templates.md)
* [Static Exports](nitro-exporter.md)

## Preparation

This application was created by the yeoman generator for nitro.  
Before using, you need of course [node](https://nodejs.org/) installed.
Nitro is tested with the current 
["Active LTS" versions of node.js](https://github.com/nodejs/Release#release-schedule) (release 8.x and 10.x).

And also you need [yarn](https://www.npmjs.com/package/yarn).

Install the project dependencies in the project root:

```
yarn install
```

## Starting the app

Use

```
yarn start
```

... to start in development mode

For production (prototype server) mode use:

```
yarn prod
```

The Nitro app will run on port `8080` by default, the proxy on `8081` (only runs with `dev` task).  
If you want the app to run on another port use [config](nitro-config.md) or add env vars to the tasks:

```
PORT=8000 PROXY=8001 yarn start
```

The port to be used in production can be set the same way:

```
PORT=3000 yarn prod
```

This works a bit different on **Windows**. Use the following commands in prompt:

```
set PORT=8000 && set PROXY=8001 && yarn start
set PORT=3001 && yarn prod
```

## Configuring

### Config Package

Nitro uses the flexible [config package](https://www.npmjs.com/package/config) for project configuration. 
This lets you to extend the default configuration for different deployment environments or local usage.  
See details in [config readme](nitro-config.md)

### Global Configuration

Some global configuration is placed in `package.json`

#### Target Browsers

For defining target browsers, [browserslist](https://github.com/ai/browserslist) is used.    
This config is shareable between different frontend tools. If not defined, the default browsers from browserslist would be taken.

## Daily Work - Creating Patterns & Pages

### Creating Patterns

Patterns are created in the `patterns` folder. A pattern is an encapsulated block of markup
with corresponding styles, scripts and data. The pattern data can be described in `schema.json`
with [JSON schema](http://json-schema.org) format (draft-04). Nitro uses [ajv](http://epoberezkin.github.io/ajv/) for validation.

For a better overview it is useful to define different types of patterns in [config](nitro-config.md).

It is recommended to make subfolders like `atoms`, `molecules` & `organisms`.

A pattern uses the following structure:

```
/example
/example/example.hbs
/example/schema.json
/example/css/example.css
/example/js/example.js
/example/_data/example.json
```

Modifiers (CSS) and decorators (JavaScript) are created using the following conventions:

```
/example/css/modifier/example-<modifier>.css
/example/js/decorator/example-<decorator>.js
```

Different data variations have to be placed in the `_data` folder:

```
/example/_data/example-variant.json
```

### Creating pattern with npm script

```
yarn create-pattern
```

This will copy the templates (nitro.patterns.<type>.template) from config to the configured target.

Optionally you can give the name:

```
yarn create-pattern <name>
```

### Creating pattern elements

If you want to split up your pattern into smaller parts you may use elements.
For this, place a new pattern in the folder `elements` inside a pattern.

Element `example-sub` in pattern `example`:

```
/example/elements/example-sub
/example/elements/example-sub/example-sub.hbs
/example/elements/example-sub/css/example-sub.css
/example/elements/example-sub/js/example-sub.js
/example/elements/example-sub/_data/example-sub.json
```

It's recommended to start the name of a subpattern with the pattern name.

### Creating pages

Create a new `*.hbs` file in the `views` folder. (You can make as many subfolders as you want.)

```
/views/index.hbs
/views/content.hbs
/views/content/variant.hbs
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
The default layout template `views/_layouts/default.hbs` is used for every view.
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

Render the example pattern (file: `example.hbs`, data-file: `example.json`):

```
{{pattern name='example'}}
{{pattern name='example' data='example'}}
```

Render a "variant" from the example pattern (file: `example.hbs`, data-file: `example-variant.json`):

```
{{pattern name='example' data='example-variant'}}
```

There also is a possibility to pass data to subpatterns by providing a data object as hash option.

```
{{pattern name='example' data=exampleContent}}
```

...and if you really need this you may provide a second template file. (file: `example-2.hbs`, data-file: `example-variant.json`)

```
{{pattern name='example' data='example-variant' template='example-2'}}
```

To be more flexible, you may also pass individual arguments to the pattern, which overrides the defaults from the data-file.

```
{{pattern name='example' modifier='blue'}}
```

#### Render patterns (simplified notation)

A simplified but less clear variant is to use the pattern helper with one or two parameters.

* the first parameter: pattern folder with the default template file
* the second parameter (optional): the data-file to be used

Render the example pattern (file: `example.hbs`, data-file: `example.json`):

```
{{pattern 'example'}}
{{pattern 'example' 'example'}}
```

Or you may use the simplified notation with a data object as second parameter:

```
{{pattern 'example' exampleContent}}
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

- Pattern with name `example-sub`: `<type>/example-sub/example-sub.hbs`
- Element with name `example-sub`: `<type>/*/elements/example-sub/example-sub.hbs`

### Render partials

Render a partial (HTML snippet). Partials are placed in `views/_partials/` as `*.hbs` files (e.g. `head.hbs`).

```
{{> head}}
```

Partials are registered with [hbs-utils](https://www.npmjs.com/package/hbs-utils#partials), 
so keep in mind that every space or hyphen in filenames is replaced with an underscore.
(e.g. use `{{> file_name}}` to load `views/_partials/file-name.hbs`)

### Render placeholders

Using a placeholder is another way to output some markup. Placeholders are placed in a folder inside `views/_placeholders/` as `*.hbs` files.  
The following two examples do the same and render the file `content/example.hbs` from `views/_placeholders/`.

```
{{placeholder 'content' 'example'}}
{{placeholder name='content' template='example'}}
```

### Passing data

#### Data per page

You may pass data to your templates (view, layout, partial, pattern) per view.  
Put a file with the same name as the view in the folder `views/_data/` with the file extension `.json`. (Use the same folder structure as in `views`)

```
/views/index.hbs
/views/_data/index.json
http://localhost:8080/index

/views/content/variant.hbs
/views/_data/content/variant.json
http://localhost:8080/content-variant
```

It's also possible to use a custom data file by requesting with a query param `?_data=...`:

```
/views/index.hbs
/views/_data/index-test.json
http://localhost:8080/index?_data=index-test
```

##### Use different layout

If you need a different layout for a page, do so in the corresponding view data file.
(View data files needs to be placed in same directory structure than views)

```
    /views/_data/index.json
    {
        "_layout": "home"
    }

    /views/_layouts/home.hbs
    http://localhost:8080/index
```

...or you may change the layout temporarily by requesting a page with the query param `?_layout=...`

```
/views/index.hbs
/views/_layouts/home.hbs
http://localhost:8080/index?_layout=home
```

##### Side Note About Extending Data

Don't overload the view data. It will be deep extended with other data from patterns, request parameters, ....  
It's not recommended to use view data for data variations of patterns.

#### Dynamic view data

If you want to use dynamic view data (i.e. using data from a database or data which is available in different views),
you can define those "routes" in the directory [`project/viewData/`](../viewData/readme.md).

#### Data per pattern

Pattern data will overwrite data from views. (Use as described above)

#### Data in request

You may overwrite data from views & patterns in request parameters.

`?_nitro.pageTitle=Testpage` will overwrite the data for the handlebars expression `{{_nitro.pageTitle}}`

## Assets

One of Nitro's main feature is asset concatenation for CSS and JavaScript files.
If changed, the files will be updated on every change, therefore you'll always get the latest version.

You can configure the include order of your assets by defining patterns in [config](nitro-config.md).

### Prototype Assets

Place [code for development](../../src/proto/readme.md) in the corresponding directories.

## Translations

Nitro uses [i18next](https://www.npmjs.com/package/i18next) as Translation Library and gives you the Handlebars helper `{{t}}`.  
Translations are stored in `project/locales/[lang]/translation.json`.

Express Middleware configuration:

* Fallback language: `default`
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
<link rel="stylesheet" href="/assets/ui.css" type="text/css" />
<link rel="shortcut icon" href="/assets/img/icon/favicon.ico" type="image/x-icon" />
<script src="/assets/ui.js"></script>
background: url(/assets/img/bg/texture.png) scroll 0 0 no-repeat;
<a href="/content.html">Contentpage</a>
```

### Upper & lower case letters

Use all lowercase if possible. (Exception: TerrificJS uses upper case for its namespace `T` and class names `T.Module.Example`)

All files must be lowercase. It's allowed to use uppercase letters for pattern folders, keep care of case sensitive filesystems and use handlebars helpers with the *exact* folder name.

```
{{pattern name='NavMain'}}
```

... looks for a template `navmain.hbs` in the folder `NavMain`.

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

If you need to mock service endpoints, you can simply put JSON files into a directory inside the `/public` directory as
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

1. Replace the line `hbs = require('./app/templating/hbs/engine')` with `nunjucks = require('nunjucks')`
2. Remove the partials line and  `app.engine(config.get('nitro.viewFileExtension'), hbs.__express);`
3. Configure nunjucks as Express' Template Engine with the following block:

```js
nunjucks.configure(
    config.get('nitro.basePath') + config.get('nitro.viewDirectory'),
    {
        autoescape: true,
        express: app
    },
);
```

Now Restart Nitro and it'll run with Nunjucks.

**Be aware**, you'll need to adjust all your views and patterns to work with the new engine. 
Nitro only provides a `pattern` helper for handlebars.

## Miscellaneous

### Commandline

Nitro uses [Gulp](http://gulpjs.com/) under the hood and can therefore be used on the CLI.

### Git Hooks

Nitro tries to install a `post-merge` git hook with every `yarn install` (if we are in git root).

This hook will:

* run `yarn install` if someone changes `yarn.lock`
* sync this git hooks if someone changes one.

You may [change this or add other hooks](../.githooks/readme.md) in `project/.githooks`.

### Contributing

* For bugs and features please use [GitHub Issues](https://github.com/namics/generator-nitro/issues)
* Feel free to fork and send PRs to the current `develop` branch. That's a good way to discuss your ideas.

### Example Project Includes

* [YUI CSS Reset 3.18.1](http://yuilibrary.com/yui/docs/cssreset/)
* Favicon & Home-Icons from Nitro (replace with your own)
* Pattern `example` and `icon` and some styles in src/assets/css (you don't need them)

#### Client Dependencies

The following packages are installed by the [app](#name) generator as dependencies:

* [jQuery 3.2.0](http://jquery.com/)
* [TerrificJS 3.0.0](https://github.com/brunschgi/terrificjs)
* [Handlebars 4.0.7](https://github.com/components/handlebars.js)
* [Babel Polyfill 6.23.0](https://www.npmjs.com/package/babel-polyfill)

### Credits

This app was generated with yeoman and the [generator-nitro](https://www.npmjs.com/package/generator-nitro) package (version 3.5.0).
