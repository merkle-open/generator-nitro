[![Build Status](https://travis-ci.org/namics/generator-nitro.svg?branch=develop)](https://travis-ci.org/namics/generator-nitro)

# Yeoman Nitro Generator

> Yeoman generator for Nitro - lets you quickly set up a project with sensible defaults and best practices.

## Usage

Install `yo` and other required tools:

```
npm install -g yo bower gulp jasmine karma-cli
```

If you want to use TypeScript, you need to install "tsd" (typescript definition repository) as well.

```
npm install -g tsd
```

Install `generator-nitro`:

```
npm install -g generator-nitro
```

## Project Generation

Make a new directory, and `cd` into it:

```
mkdir my-new-project && cd my-new-project
```

Run:

```
yo nitro
```

You will be guided through some configuration options:

* Desired Name (default: current directory name)
* Desired CSS preprocessor (`less` or `scss`; default: `less`)
* Desired JavaScript compiler (`JavaScript` or `TypeScript`; default: `JavaScript`)

It's possible to pass in these options through the command line

```
yo nitro --name=myproject --pre=scss --js=JavaScript
```

------------
todo: move #16

Start your app:

```
gulp develop
```

The default port is 8080, proxy (develop only) is 8081.  If you want other ports, just add it before gulp task:

```
PORT=8000 PROXY=8001 gulp develop
```

The port for production can be changed the same way:

```
PORT=3000 gulp production
``

On Windows command prompt use:

```
set PORT=8000 && set PROXY=8001 && gulp develop
set PORT=3000 && gulp production
```

## Generators

Available generators:

* [nitro] (aka [nitro:app])
* [nitro:component](#name)

**Note: Generators are to be run from the root directory of your app.**

### App
Sets up a new nitro app, generating all the boilerplate you need to get started. 

Example:
```bash
yo nitro
```

### Component
Generates a frontend component.

Example:
```bash
yo nitro:component
```

## Configuration
Yeoman generated projects can be further tweaked according to your needs by modifying project files appropriately.

### Handlebars helpers
Custom handlebars will be automatically loaded if put into to `project/helpers` directory. An example could look like 
this:

```js
module.exports = function(foo) {
    // Helper Logic
};
```

The helper name will automatically match the filename, so if you name your file `foo.js` your helper will be called  
`foo`.

### JSON Endpoints
If you need to mock service endpoints, you can put JSON files into a directory inside the `/public` directory as 
those are directly exposed.

`/public/service/posts.json` will be available under `/service/posts.json` and can be used for things like AJAX 
requests.

### Custom Routes
If you need more custom functionality in endpoints you can put your custom routes with their logic into the 
`project/routes` directory. The filename is irrelevant and the content can look like this:

```javascript
function getData(req, res, next){
    return res.json({
        data: 'empty'
    });
}

function postData(req, res, next){
    return res.json({
        data: req.body
    });
}

exports = module.exports = function(app){
    app.route('/api/data')
        .get(getData)
        .post(postData);
};
```

These routes will be loaded into Nitro automatically.

### Using another Template Engine
If you don't want to use [Handlebars](http://handlebarsjs.com/) as Nitro's Template Engine you can configure your own Engine.
This example shows how to replace Handlebars with [Nunjucks](https://mozilla.github.io/nunjucks/) as an example.

All these steps need to be performed in `server.js`.

1. Replace the line `hbs = require('./app/core/hbs')` with `nunjucks = require('nunjucks')`
2. Remove the line `app.engine(cfg.nitro.view_file_extension, hbs.__express);`
3. Configure nunjucks as Express' Template Engine with the following block:
```js
nunjucks.configure(
    cfg.nitro.view_directory,
    {
        autoescape: true,
        express: app
    }
);
```
Now Restart Nitro and it'll run with Nunjucks.

**Be aware**, you'll need to adjust all your views and components to work with the new engine. 
Nitro only provides a `component` helper for handlebars.

## Testing

Running `jasmine` will run the unit tests.

## Contribute

See the [contributing docs](https://github.com/yeoman/yeoman/blob/master/contributing.md)

When submitting an issue, please follow the [guidelines](https://github.com/yeoman/yeoman/blob/master/contributing.md#issue-submission). Especially important is to make sure Yeoman is up-to-date, and providing the command or commands that cause the issue.

When submitting a bugfix, write a test that exposes the bug and fails before applying your fix. Submit the test alongside the fix.

When submitting a new feature, add tests that cover the feature.

## Changelog

Recent changes can be viewed on Github on the [Releases Page](https://github.com/namics/generator-nitro/releases)

## License

[MIT license](http://opensource.org/licenses/MIT)
