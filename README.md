[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

# Yeoman Nitro Generator

> Yeoman generator for Nitro - lets you quickly set up a frontend project with sensible defaults and best practices.

Nitro is a Node.js application for simple and complex frontend development with a tiny footprint.  
It provides a proven but flexible structure to develop your frontend code, even in a large team.  
Keep track of your code with a modularized frontend. This app and the suggested [atomic design](http://bradfrost.com/blog/post/atomic-web-design/), [BEM](https://en.bem.info/method/definitions/) and [terrific](http://terrifically.org) concepts could help.  
Nitro is simple, fast and flexible. Use this app for all your frontend work.

## Usage

Before using, you need of course [node and npm](https://nodejs.org/) installed.  
Nitro and the Nitro generator are tested with the current versions of the node.js releases 0.12 and 4 (LTS). So everything between should work.
The node.js release 0.10 is no longer supported and it's not recommended to update node.js to release 5.

Install `yo` and other required tools:

    npm install -g yo bower gulp jasmine karma-cli

If you want to use TypeScript, you need to install "tsd" (typescript definition repository) as well.

    npm install -g tsd

Install `generator-nitro`:

    npm install -g generator-nitro

## Project Generation

Make a new directory, and `cd` into it:

    mkdir my-new-project && cd my-new-project

Run:

    yo nitro

You will be guided through some configuration options:

* Desired Name (default: current directory name)
* Desired CSS preprocessor (`less` or `scss`; default: `less`)
* Desired JavaScript compiler (`JavaScript` or `TypeScript`; default: `JavaScript`)
* Desired view file extension (`html`, `hbs` or `mustache`; default: `html`)

It's possible to pass in these options through the command line

    yo nitro --name=myproject --pre=scss --js=JavaScript --viewExt=hbs

### Update a project

If you run `yo nitro` from an existing project you may update your project to a newer version.

## Generators

Available generators:

* `yo nitro` (aka `nitro:app`)
* `yo nitro:component [name]`
* `yo nitro:view [name]`

Note: Generators are to be run from the root directory of your project.

## Generated app

See how tho use the [generated app](app/templates/project/docs/nitro.md)

## Testing

Running `npm test` will run the `jasmine` unit tests.

    npm test

## Contribute

See the [contributing docs](https://github.com/yeoman/yeoman/blob/master/contributing.md)  
When submitting an issue, please follow the [guidelines](https://github.com/yeoman/yeoman/blob/master/contributing.md#issue-submission). Especially important is to make sure Yeoman is up-to-date, and providing the command or commands that cause the issue.  
When submitting a bugfix, write a test that exposes the bug and fails before applying your fix. Submit the test alongside the fix.  
When submitting a new feature, add tests that cover the feature.

## Changelog

Recent changes can be viewed on Github on the [Releases Page](https://github.com/namics/generator-nitro/releases)

## License

[MIT license](http://opensource.org/licenses/MIT)


[npm-image]: https://badge.fury.io/js/generator-nitro.svg
[npm-url]: https://npmjs.org/package/generator-nitro
[travis-image]: https://travis-ci.org/namics/generator-nitro.svg?branch=master
[travis-url]: https://travis-ci.org/namics/generator-nitro
[daviddm-image]: https://david-dm.org/namics/generator-nitro.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/namics/generator-nitro
