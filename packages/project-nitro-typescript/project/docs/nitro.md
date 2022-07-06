# Nitro Usage

Nitro is a Node.js application for simple and complex frontend development with a tiny footprint.
It provides a proven but flexible structure to develop your frontend code, even in a large team.  
Keep track of your code with a modularized frontend. This app and the suggested concepts could help -
[atomic design](http://bradfrost.com/blog/post/atomic-web-design/) and [BEM](https://en.bem.info/method/definitions/).  
Nitro is simple, fast and flexible. Use this app for all your frontend work.

## Features

- Simple and proven project structure
- Webpack Builder with HMR
- Gulp Tasks for additional functionality
- Linting, Source Maps, PostCSS & Browsersync
- Setup for e2e and visual regression testing (cypress, backstopjs) & lighthouse
- Pattern generator
- [Client side templates](./client-templates.md)
- [Static Exports](./nitro-exporter.md)

## Preparation

This application was created by the yeoman generator for nitro.  
Before using, you need of course [node](https://nodejs.org/) installed.
Nitro is always tested with the current
["Active LTS" version of node.js](https://github.com/nodejs/Release#release-schedule) (release 16.x)
and at the moment also with the LTS maintenance version (release 14.x).

Install the project dependencies in the project root:

```
npm install
```

## Starting the app

Use

```
npm start
```

... to start in development mode

For production (prototype server) mode use:

```
npm run prod
```

The Nitro app will run on port `8080` by default, the proxy on `8081` (only runs in develpment mode).  
If you want the app to run on another port use [config](./nitro-config.md) or add env vars to the tasks:

```
PORT=8000 PROXY=8001 npm start
```

The port to be used in production can be set the same way:

```
PORT=3000 npm run prod
```

This works a bit different on **Windows**. Use the following commands in prompt:

```
set PORT=8000 && set PROXY=8001 && npm start
set PORT=3001 && npm run prod
```

### Usage with docker

For information on how to use Nitro with docker, please refer to [nitro-docker.md](./nitro-docker.md).

## Configuring

### Config Package

Nitro uses the flexible [config package](https://www.npmjs.com/package/config) for project configuration.
This lets you to extend the default configuration for different deployment environments or local usage.  
See details in [config readme](./nitro-config.md)

### Global Configuration

Some global configuration is placed in [`package.json`](../../package.json)

#### Target Browsers

For defining target browsers, [browserslist](https://github.com/ai/browserslist) is used.  
This config is shareable between different frontend tools. If not defined, the default browsers from browserslist would be taken.

#### Git Hooks

Nitro uses [husky](https://github.com/typicode/husky) for githooks.

Githooks tasks are placed in the folder '.husky' and the corresponding "lint-staged" configuration in [package.json](../../package.json)

## Daily Work - Creating Patterns & Pages

### Creating Patterns

Patterns are created in the `src/patterns` folder. A pattern is an encapsulated block of markup
with corresponding styles, scripts and data. The pattern data can be described in `schema.json`
with [JSON schema](http://json-schema.org) (currently draft-07).
Nitro uses [ajv](https://github.com/ajv-validator/ajv/) for validation.

For a better overview it is useful to define different types of patterns in [config](nitro-config.md).

It is recommended to make subfolders like `atoms`, `molecules`, `organisms`, ...

A pattern uses the following structure:

```
example/
example/readme.md
example/example.hbs
example/schema.json
example/css/example.scss
example/js/example.js
example/_data/example.json
```

Modifiers (CSS) and decorators (JavaScript) are created using the following conventions:

```
example/css/modifier/example-<modifier>.scss
example/js/decorator/example-<decorator>.js
```

Different data variations may be placed in the `_data` folder:

```
example/_data/example-variant.json
```

### Creating pattern with npm script

```
npm run nitro:pattern
```

This will copy the templates (nitro.patterns.\<type\>.template) from config to the configured target.

Optionally you can give the name:

```
npm run nitro:pattern <name>
```

### Creating pattern elements

If you want to split up your pattern into smaller parts you may use elements.
For this, place a new pattern in the folder `elements` inside a pattern.

Element `example-sub` in pattern `example`:

```
example/elements/example-sub/
example/elements/example-sub/readme.md
example/elements/example-sub/example-sub.hbs
example/elements/example-sub/css/example-sub.scss
example/elements/example-sub/js/example-sub.js
example/elements/example-sub/_data/example-sub.json
```

It's recommended to start the name of a subpattern with the pattern name and to use the same pattern type for the sub element.

### Creating pages

Create a new `*.hbs` file in the `/src/views` folder. (You can make as many subfolders as you want.)

```
/src/views/index.hbs
/src/views/content.hbs
/src/views/content/variant.hbs
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
The default layout template `/src/views/_layouts/default.hbs` is used for every view.
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

To remove the layout feature, simply delete the folder `/src/views/_layout`.

Different layouts are placed in `/src/views/_layouts/`. Link them to your view [in your page datafile](#use-different-layout).

### Render patterns

Pages are meant to be compositions of your patterns. Use the pattern's name as the first parameter.

Be aware, the pattern name is case-sensitive and should be unique (at least per pattern type, see more on that below).
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

By using the `type` parameter, you can restrict the search for a pattern to a specific pattern type (atoms / molecules / ect).
This is useful, when you e.g. have a cms pattern called `accordion`, which then calls an organism also called `accordion`:

```
{{pattern name='example' type='organism'}}
```

If no `type` parameter is provided and multiple pattern with the same name and different pattern types exist,
the pattern helper searches within all pattern types and returns the first pattern found (in alphabetical order).

To be more flexible, you may also pass additional arguments to the pattern, which overrides the defaults from the data-file.

```
{{pattern name='example' modifier='blue'}}
```

#### Render patterns with children

Maybe using your pattern templates with transclusion could be helpful in some cases.

```html
// example box template
<div class="a-box">{{{children}}}</div>
```

Call it as block like this:

```
{{#pattern name='box'}}
    {{pattern name='example'}}
{{/pattern}}
```

#### Render pattern elements

The pattern helper will find also pattern elements.

```
{{pattern name='example-sub'}}
```

... looks for following paths

- Pattern with name `example-sub`: `<type>/example-sub/example-sub.hbs`
- Element with name `example-sub`: `<type>/*/elements/example-sub/example-sub.hbs`

Please note:
The parameter `type` is also available for rendering pattern elements the same as for normal patterns. Therefore, the same
rules and restrictions regarding unique names apply. Additionally, for pattern elements, their name should also be unique
within a certain pattern type as otherwise, the pattern helper would just return the first found match.

### Render partials

Render a partial (hbs snippet). Partials are placed in `src/views/_partials/` as `*.hbs` files (e.g. `head.hbs`).

```
{{> head}}
```

Partials are registered with [hbs-utils](https://www.npmjs.com/package/hbs-utils#partials),
so keep in mind that every space or hyphen in filenames is replaced with an underscore.
(e.g. use `{{> file_name}}` to load `/src/views/_partials/file-name.hbs`)

### Render placeholders

Using a placeholder is another way to output some markup. Placeholders are placed in a folder inside `/src/views/_placeholders/` as `*.hbs` files.  
The following example renders the file `content/example.hbs` from `/src/views/_placeholders/`.

```
{{placeholder name='content' template='example'}}
```

### Render page lists

To render all pages in the `src/views` folder, just call the hbs helper `{{viewlist}}`. The helper renders an `<ul>` list
containing links to the respective pages.

#### Filter generated list

With parameter include, all views containing at least one of the terms in their path will be displayed

```
{{viewlist include="<term-1>,<term-2>"}}
```

With parameter exclude, all views containing none of the terms will be displayed

```
{{viewlist exclude="<term-1>,<term-2>"}}
```

With parameter include and exclude combined, all views containing at least one of the terms but none of the excluded ones will be displayed

```
{{viewlist include="<term-1>" exclude="<term-2>"}}
```

### Passing data

#### Data per page

You may pass data to your templates (view, layout, partial, pattern) per view.  
Put a file with the same name as the view in the folder `/src/views/_data/` with the file extension `.json`. (Use the same folder structure as in `/src/views`)

```
/src/views/index.hbs
/src/views/_data/index.json
http://localhost:8080/index

/src/views/content/variant.hbs
/src/views/_data/content/variant.json
http://localhost:8080/content-variant
```

It's also possible to use a custom data file by requesting with a query param `?_data=...`:

```
/src/views/index.hbs
/src/views/_data/index-test.json
http://localhost:8080/index?_data=index-test
```

##### Use different layout

If you need a different layout for a page, do so in the corresponding view data file.
(View data files needs to be placed in same directory structure than views)

```
# /src/views/_data/index.json
{
    "_layout": "home"
}

# /src/views/_layouts/home.hbs
http://localhost:8080/index
```

...or you may change the layout temporarily by requesting a page with the query param `?_layout=...`

```
# /src/views/index.hbs
# /src/views/_layouts/home.hbs
http://localhost:8080/index?_layout=home
```

##### Side Note About Extending Data

Don't overload the view data. It will be deep extended with other data from patterns, request parameters, ....  
It's not recommended to use view data for data variations of patterns.

#### Dynamic view data

If you want to use dynamic view data (i.e. using data from a database or data which is available in different views),
you can define those "routes" in the directory [`/project/viewData/`](../viewData/readme.md).

#### Data per pattern

Pattern data will overwrite data from views. (Use as described above)

#### Data in request

You may overwrite data from views & patterns in request parameters.

`?_nitro.pageTitle=Testpage` will overwrite the data for the hbs expression `{{_nitro.pageTitle}}`

### Using Nitro Data in Views

By default Nitro provides some data to be used in your views:

- `{{ _nitro.pageUrl }}` (String) outputs full url including protocol and host
- `{{ _nitro.pageTitle }}` (String) outputs string generated from the view name by default
- `{{#if _nitro.production}}{{/if}}` (Boolean) is true when environment variable `NODE_ENV` is set to `production`
- `{{#if _nitro.test}}{{/if}}` (Boolean) is true when environment variable `NITRO_MODE` ist set to `test`
- `{{#if _nitro.offline}}{{/if}}` (Boolean) is true when config param 'nitro.mode.offline' is true

## Assets

For final use, all assets are copied from the 'src' to the 'public' folder.

### Webpack

The main assets will be bundled with an easy to use webpack config.

The configuration includes loaders for JavaScript, TypeScript, CSS & SCSS,
clientside handlebars, webfonts and images (with minification). It also includes an iconfont generator.

You only have to enable the desired loaders and features. And of course, it is possible to extend the configuration to your needs.

The configuration is placed in '/config/webpack'  
See [readme](./nitro-webpack.md) for configuration options.

### Other Assets

Nitro also gives you some gulp tasks to use for additional assets you need in your build.
You may copy assets, minify images or generate svg sprites.

Configuration for gulp tasks is done in [config package](../../config/default/gulp.js) and ['gulpfile.js'](../../gulpfile.js)

### Prototype Assets

Place [code for development](../../src/proto/readme.md) in the corresponding directories.

### Asset helper

The asset helper makes it possible to easily link your public assets in your markup.
It can be used to change asset pathes depending on the environment.

```
<link href="{{asset name='/css/ui.min.css'}}" rel="stylesheet">
<link rel="apple-touch-icon" sizes="180x180" href="{{asset name='/img/icon/apple-touch-icon.png'}}">
```

## Translations

Nitro uses [i18next](https://www.npmjs.com/package/i18next) as Translation Library and gives you the helper described in the following section.  
Translations are stored in `/project/locales/[lang]/translation.json`.

Express Middleware configuration:

- Fallback language: `default`
- Language switch with query parameter: `?lang=de`

### Translation hbs helper

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

To stay consistent you should favour the use of relative paths with a leading slash in all your view files.
Link to resources relatively to the `project`-folder **with** a leading slash.

```html
<link
  rel="stylesheet"
  href="/assets/css/ui.min.css"
  type="text/css"
/>
<link
  rel="shortcut icon"
  href="/assets/img/icon/favicon.ico"
  type="image/x-icon"
/>
<script defer src="/assets/js/ui.min.js"></script>
<a href="/content">Contentpage</a>
```

...or use the 'asset' .hbs helper for public assets

```
<link rel="stylesheet" href="{{asset name='/css/ui.min.css'}}" type="text/css" />
```

### Upper & lower case letters

Use all lowercase if possible.

All files must be lowercase. It's allowed to use uppercase letters for pattern folders, keep care of case sensitive filesystems and use handlebars helpers with the _exact_ folder name.

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

## Miscellaneous

### Custom Routes

If you need more custom functionality in endpoints
you can put your custom routes with their logic
into the [`/project/routes` directory](../routes/).

### Custom hbs helpers

Custom hbs helpers will be automatically loaded
if put into to [`project/helpers`](../helpers/readme.md) directory.

### API Endpoints

If you need to mock service endpoints...

#### Simple

You can simply put static files inside the `/public/api` directory, as this route is directly exposed.

`/public/api/posts.json` will be available under `/api/posts.json`
or `/public/api/snippets/teaser.html` under `/api/snippets/teaser.html`

#### More Complex

If you need more control, you may place some functionality in [`/project/routes`](../routes/readme.md).

## Commandline

Use or create new scripts in `package.json` to run with npm.

## Contributing

- For bugs and features please use [GitHub Issues](https://github.com/merkle-open/generator-nitro/issues)
- Feel free to fork and send PRs to the current `develop` branch. That's a good way to discuss your ideas.

## Credits

This app was generated with yeoman and the [generator-nitro](https://www.npmjs.com/package/generator-nitro) package (version 7.0.3).
