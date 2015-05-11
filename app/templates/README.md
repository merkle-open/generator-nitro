Nitro
=====

Nitro is a Node.js application for simple and complex frontend development with a tiny footprint. It provides a
proven but flexible structure to develop your frontend code, even in a large team. Keep track of your code with a
modularized frontend. This app and the suggested [terrific concept](http://terrifically.org) could help. Nitro
is simple, fast and flexible. Use this app for all your frontend work, but keep in mind it's not intended to use in
production environment.

## Quickstart
To run nitro you only need [node](http://nodejs.org/).

Make sure you have the following global dependencies installed
```
npm install -g yo bower gulp jasmine karma-cli
```

Run the Yeoman Project Generator (you probably have already done this)
 ```
yo nitro
```

Start your app and build amazing things
```
gulp develop
```

### Features
* Simple project structure
* CSS/JS concatenation and minification
* LESS/SCSS support
* Caching (LESS/SCSS) for optimal performance
* Jasmine tests with Karma test runner
* Bower support
* Yeoman component generator

## Daily Work - Creating Components & Pages

### Creating Components

Components are created in the `components` folder. A component is an encapsulated block of markup with corresponding styles and scripts.
A terrific module uses the following structure:

    /Example
    /Example/example.html
    /Example/css/example.css
    /Example/js/example.js

Terrific Skins (css or js) are created using the following conventions:

    /Example/css/skins/example-skinname.css
    /Example/js/skins/example-skinname.js

Create additional content templates directly in the component folder:

    /Example/example-variant.html

### Creating Components & Skins with yo
    yo nitro:component

#### Components Configuration
tbd

### Creating pages

Create a new `*.html` file in the `views` folder. You can make as many subfolders as you want.

    /views/index.html
    /views/content.html
    /views/content/variant.html

Your new page can then be called by the according URL (with or without an extension). Subfolders are represented with a dash.

    http://localhost/project/index
    http://localhost/project/content
    http://localhost/project/content-variant

### Render Components

Pages are meant to be compositions of your components. Use the component's name as the first parameter. Be aware, the
component name is case-sensitive

Nitro uses [handlebars](https://www.npmjs.com/package/hbs) as the view engine and provides custom helpers.

Render the Example component. (file: `example.html`)

    {{component 'Example'}}

Render the "variant" template from the Example component. (file: `example-variant.html`)
    {{component 'Example' 'variant'}}

### Render Partials

Render a partial (HTML snippet). Partials are placed in `views/_partials/` as `*.html` files (e.g. `head.html`).

    {{> head}}

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
            "components/modules/*/css/*.*",
            "components/modules/*/css/skins/*.*"
        ],
        "app.js": [
            "!assets/js/somefile.js",
            "assets/js/jquery-1.11.2.min.js",
            "assets/js/terrific-2-1.0.js",
            "assets/js/*.js",
            "components/modules/*/js/*.js",
            "components/modules/*/js/skins/*.js"
        ]
    }

#### Pattern

The matching patterns follow the standard glob patterns.
Glob patterns are similar to regular expression but simplified. They are used by several shells.
You should always try to keep the patterns simple. Usually you only need the asterisk `*` which
matches zero or more characters.

You can read more on standard glob patterns on [php.net](http://www.php.net/manual/en/function.glob.php) and
[cowburn.info](http://cowburn.info/2010/04/30/glob-patterns/).

#### Other Asset Files

You can configure as many different assets as you wish.

    "brand.css": [
        "assets/css/reset.css",
        ...

### Asset Minification
tbd - or kill it?

### JavaScript Debugging
tbd - or kill it? or source maps?


## Conventions

### Resource linking

To stay portable you should favour the use of relative paths. Link to resources relatively to the `project`-folder **without** a leading slash.

    <link rel="stylesheet" href="app.css" type="text/css" />
    <link rel="shortcut icon" href="assets/img/icon/favicon.ico" type="image/x-icon" />
    <script src="app.js"></script>
    <img src="components/modules/Example/img/example.png" alt="" />
    background: url(assets/img/bg/texture.png) scroll 0 0 no-repeat;
    <a href="content.html">Contentpage</a>

### Upper & lower case letters
Use all lowercase if possible.

Exceptions:

* Component folders must match terrific classes, therefore they are case-sensitive.
* TerrificJS uses upper case for its namespace `Tc` and class names `Tc.Module.Example`

Use the component helper with the *exact* component name:

    {{component 'NavMain'}}

Note that camel case ComponentNames are represented in CSS with dashes.

    Navigation   -> Tc.Module.Navigation   -> mod-navigation
    NavMain      -> Tc.Module.NavMain      -> mod-nav-main
    AdminNavMain -> Tc.Module.AdminNavMain -> mod-admin-nav-main

## Commandline

Nitro uses [Gulp](http://gulpjs.com/) under the hood and can therefore be used on the CLI.

## Security
tbd

## Contributing

* For Bugs and Features please use [GitHub](https://github.com/namics/nitro/issues)
* Feel free to fork and send PRs. That's the best way to discuss your ideas.

## Example Project Includes

* [YUI CSS Reset 3.18.1](http://yuilibrary.com/yui/docs/cssreset/)
* Favicon & Home-Icons from Nitro (replace with your own)
* Component `Example` and some styles in assets/css (you don't need them)

## Bower Components

The following packages are always installed by the [app](#name) generator:

* [jQuery 1.11.2](http://jquery.com/)
* [TerrificJS 2.1.0](http://terrifically.org/api/)

All of these can be updated with `bower update` as new versions are released.


## Credits
Nitro is an alternative to [Terrific Micro](https://github.com/namics/terrific-micro) which was initiated by
[Roger Dudler](https://github.com/rogerdudler) and maintained by Namics AG.

## License

Released under the [MIT license](LICENSE)














## Should I check in dependencies?

[What npm says](https://www.npmjs.org/doc/misc/npm-faq.html#should-i-check-my-node_modules-folder-into-git-):
Usually, no. Allow npm to resolve dependencies for your packages.

For packages you deploy, such as websites and apps, you should use npm shrinkwrap to lock down your full dependency
tree.

**Don't checkin node_modules and use npm-shrinkwrap for deployments.**

[What bower says](http://addyosmani.com/blog/checking-in-front-end-dependencies/):
If you aren’t authoring a package that is intended to be consumed by others (e.g., you’re building a web app), you
should always check installed packages into source control.

Therefore node_modules **is** ignored, bower_components (well in this case assets/vendor) **is not**.
