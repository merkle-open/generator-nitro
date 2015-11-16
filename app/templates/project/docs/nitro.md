# Nitro Usage

Nitro is a Node.js application for simple and complex frontend development with a tiny footprint.  
It provides a proven but flexible structure to develop your frontend code, even in a large team.  
Keep track of your code with a modularized frontend. This app and the suggested concepts could help - 
[atomic design](http://bradfrost.com/blog/post/atomic-web-design/), [BEM](https://en.bem.info/method/definitions/) 
and [terrific](http://terrifically.org).  
Nitro is simple, fast and flexible. Use this app for all your frontend work.

## Features

* Simple project structure
* CSS/JS concatenation and minification
* LESS/SCSS support
* Caching (LESS/SCSS) for optimal performance
* Jasmine tests with Karma test runner
* Bower support
* Yeoman component generator

## Preparation

This application was created by the yeoman [nitro generator](https://www.npmjs.com/package/generator-nitro).  
Before using, you need of course [node and npm](https://nodejs.org/) installed.  
And also you need the yeoman [nitro generator](https://www.npmjs.com/package/generator-nitro) 
and some dependencies installed globally.

    npm install -g yo bower gulp jasmine karma-cli generator-nitro

## Daily Work - Creating Components & Pages

### Creating Components

Components are created in the `components` folder. A component is an encapsulated block of markup 
with corresponding styles, scripts and data.  
For a better overview it is useful to define different types of components. It is recommended to make 
subfolders like `atoms`, `molecules` & `organisms`  
A component uses the following structure:

    /Example
    /Example/example.html
    /Example/css/example.css
    /Example/js/example.js
    /Example/_data/example.json

Terrific modifiers & decorators are created using the following conventions:

    /Example/css/modifier/example-<modifier>.css
    /Example/js/decorator/example-<decorator>.js

Different data variantions has to be placed in the `_data` folder:

    /Example/_data/example-variant.json

### Creating Components with yo

    yo nitro:component

### Using gulp

#### Starting the app

The Nitro app will run on port `8080` by default, the proxy on `8081` (only run with `develop` task). If you want the
app to run on another port put them before the gulp task like this:

    PORT=8000 PROXY=8001 gulp develop

The port to be used in production can be set the same way:
 
    PORT 3000 gulp production 

This works a bit different on **Windows**. Use the following commands in prompt:
 
    set PORT=8000 && set PROXY=8001 && gulp develop
    set PORT=3000 && gulp production

### Creating pages

Create a new `*.html` file in the `views` folder. You can make as many subfolders as you want.

    /views/index.html
    /views/content.html
    /views/content/variant.html

Your new page can then be called by the according URL (with or without an extension). 
Subfolders are represented with a dash.

    http://localhost:8080/index
    http://localhost:8080/content
    http://localhost:8080/content-variant

### Render Components

Pages are meant to be compositions of your components. Use the component's name as the first parameter. Be aware, the
component name is case-sensitive.

Nitro uses [handlebars](https://www.npmjs.com/package/hbs) as the view engine and provides custom helpers.

Render the Example component. (file: `example.html`, data-file: `example.json`)

    {{component 'Example'}}
    {{component 'Example', 'example'}}

Render a "variant" from the Example component. (file: `example.html`, data-file: `example-variant.json`)

    {{component 'Example' 'example-variant'}}
    
Another possibility to use the component helper is by providing hash options.

    {{component name='Example' data='example-variant'}}

...and if you really need this you may provide a second template file. (file: `example-2.html`, data-file: `example-variant.json`)

    {{component name='Example' data='example-variant' template='example-2'}}

### Render Partials

Render a partial (HTML snippet). Partials are placed in `views/_partials/` as `*.html` files (e.g. `head.html`).

    {{> head}}

### Passing data

#### Data per view

You may pass data to your templates (view, partial, component) per view.  
Put a file with the same name as the view in the folder `views/_data/` with the file extension `.json`. 
(Use the same folder structure as in `views`)

    /views/index.html
    /views/_data/index.json
    http://localhost:8080/index

    /views/content/variant.html
    /views/_data/content/variant.json
    http://localhost:8080/content-variant

It's also possilbe to use a custom data file by requesting with a query param `?_data=...`:

    /views/index.html
    /views/_data/index-test.json
    http://localhost:8080/index?_data=index-test

#### Dynamic view data

If you want to use dynamic view data (i.e. using data from a database or data which is available in different views), 
you can define those "routes" in the directory [`project/viewData`](project/viewData/). 

#### Data per component

Component data will overwrite data from views. (Use as described above)

#### Data in request

You may overwrite data from views & components in request parameters.

`?pageTitle=Testpage` will overwrite the the data for the handlebars expression `{{pageTitle}}`

It's also possilbe to use dot notation for object data:

`?page.title=Testpage` will overwrite the value for `{{page.title}}` 

## Assets

Nitro's main feature is asset concatenation for CSS and JavaScript files. If changed, the files will be updated on
every request, therefore you'll always get the latest version.

### Assets Configuration

You can configure the include order of your assets by defining patterns in `config.json`.

    "assets": {
        "app.css": [
            "!assets/css/somefile.*",
            "assets/css/cssreset.css",
            "assets/css/*.*",
            "components/**/css/*.*",
            "components/**/css/modifier/*.*"
        ],
        "app.js": [
            "!assets/js/somefile.js",
            "assets/vendor/terrific/dist/terrific.min.js",
            "assets/vendor/terrific/dist/terrific.min.js",
            "assets/js/*.js",
            "components/**/js/*.js",
            "components/**/js/decorator/*.js"
        ]
    }

#### Pattern

The matching patterns follow the standard node glob patterns.  
Glob patterns are similar to regular expression but simplified. They are used by several shells.  
You should always try to keep the patterns simple. Usually you only need the asterisks `*` `**` 
and the exclamation mark `!` for negation.

You can read more on the standard [node glob patterns](https://github.com/isaacs/node-glob#glob-primer).

#### Special Pattern Prefixes

* You can negate a pattern by starting with an exclamation mark `!`.
  `!` = exclude pattern
* Define all your dependencies for the compiling-process with the `+` prefix
  `+` = exclude file but prepend it to every compile call for files with the same file extension.

The order of these special patterns does not matter.

#### Examples

* `"!components/*/Test*"          Exclude all components starting with `Test`
* `"!**/*-test.*"`                Exclude all filenames ending with `-test`.
* `"+assets/css/mixins.less"`     Exclude `assets/css/mixins.less` but prepend to every compile call of every .less file

### Other Asset Files

You can configure as many different assets as you wish.

    "brand.css": [
        "assets/css/reset.css",
        ...

## Translations

Nitro uses [i18next](http://i18next.com/node/index.html) as Translation Library 
and gives you the Handlebars helper `{{t}}`.  
Translations are stored in `project/locales/[lang]/translation.json`.

Express Middleware configuration:

* Fallback language: `default`
* Language detection from request header
* Language switch with query parameter: `?lang=de`

### Translation handlebars helper

The helper combines the given [library features](http://i18next.com/node/pages/doc_features.html) with a second system of translation features.

The library needs one object to transfer data and uses two underscores as interpolation pre- and suffixes 
or uses `%s` placeholders for sprintf functionality.

Some examples:

    data = {
       name: "developer"
    }
    
    "test": {
        "example": {
            "string" : "gold",
            "nested": "All that glitters is not $t(test.example.string).",
            "sprintf" : "The first three letters of %s are: %s, %s and %s",
            "interpolation" : "Hello __name__"
        }
    }

    {{t "test.example.string"}}
    {{t "test.example.nested"}}
    {{t "test.example.sprintf" "alphabet" "a" "l" "p"}}
    {{t "test.example.interpolation" data}}

The Second system uses brackets as interpolation pre- and suffixes and numbered or named placeholders:

    "test": {
        "example": {
            "interpolation1" : "The last two letters of {1} are: {3} and {2}",
            "interpolation2" : "The first letter of {word} is: {one}"
        }
    }
    
    {{t "test.example.interpolation1" "alphabet" "e" "t"}}
    {{t "test.example.interpolation2" word="alphabet" one="a"}}

## Conventions

### Resource linking

To stay consistent you should favour the use of relative paths with a leading slash. 
Link to resources relatively to the `project`-folder **with** a leading slash.

    <link rel="stylesheet" href="/assets/app.css" type="text/css" />
    <link rel="shortcut icon" href="/assets/img/icon/favicon.ico" type="image/x-icon" />
    <script src="/assets/app.js"></script>
    background: url(/assets/img/bg/texture.png) scroll 0 0 no-repeat;
    <a href="/content.html">Contentpage</a>

### Upper & lower case letters

Use all lowercase if possible.

Exceptions:

* Component folders must match terrific classes, therefore they are case-sensitive.
* TerrificJS uses upper case for its namespace `T` and class names `T.Module.Example`

Use the component helper with the *exact* component name:

    {{component 'NavMain'}}

Note that camel case ComponentNames are represented in CSS with dashes.

    Navigation   -> T.Module.Navigation   -> m-navigation
    NavMain      -> T.Module.NavMain      -> m-nav-main
    AdminNavMain -> T.Module.AdminNavMain -> m-admin-nav-main
    
### Custom Handlebars helpers

Custom handlebars will be automatically loaded if put into to `project/helpers` directory. An example could look like 
this:

    module.exports = function(foo) {
        // Helper Logic
    };

The helper name will automatically match the filename, so if you name your file `foo.js` your helper will be called  
`foo`.

### JSON Endpoints

If you need to mock service endpoints, you can put JSON files into a directory inside the `/public` directory as 
those are directly exposed.

`/public/service/posts.json` will be available under `/service/posts.json` and can be used for things like AJAX 
requests.

### Custom Routes

If you need more custom functionality in endpoints you can put your custom routes with their logic into the 
[`project/routes` directory](project/routes/).

### Using another Template Engine

If you don't want to use [Handlebars](http://handlebarsjs.com/) as Nitro's Template Engine 
you can configure your own Engine.  
This example shows how to replace Handlebars with [Nunjucks](https://mozilla.github.io/nunjucks/) as an example.

All these steps need to be performed in `server.js`.

1. Replace the line `hbs = require('./app/core/hbs')` with `nunjucks = require('nunjucks')`
2. Remove the line `app.engine(cfg.nitro.view_file_extension, hbs.__express);`
3. Configure nunjucks as Express' Template Engine with the following block:

    nunjucks.configure(
        cfg.nitro.view_directory,
        {
            autoescape: true,
            express: app
        }
    );
    
Now Restart Nitro and it'll run with Nunjucks.

**Be aware**, you'll need to adjust all your views and components to work with the new engine. 
Nitro only provides a `component` helper for handlebars.

## Commandline

Nitro uses [Gulp](http://gulpjs.com/) under the hood and can therefore be used on the CLI.

## Contributing

* For Bugs and Features please use [GitHub](https://github.com/namics/generator-nitro/issues)
* Feel free to fork and send PRs. That's the best way to discuss your ideas.

## Example Project Includes

* [YUI CSS Reset 3.18.1](http://yuilibrary.com/yui/docs/cssreset/)
* Favicon & Home-Icons from Nitro (replace with your own)
* Component `Example` and some styles in assets/css (you don't need them)

### Bower Components

The following packages are always installed by the [app](#name) generator:

* [jQuery 2.1.4](http://jquery.com/)
* [TerrificJS 3.0.0](https://github.com/brunschgi/terrificjs)

All of these can be updated with `bower update` as new versions are released.

## Credits

Nitro is an alternative to [Terrific Micro](https://github.com/namics/terrific-micro) which is developed by Namics AG.

## License

Released under the [MIT license](LICENSE)
