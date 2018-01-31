[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Build Status][appveyor-image]][appveyor-url] [![Dependency Status][daviddm-image]][daviddm-url]

# Yeoman Nitro Generator

> Yeoman generator for Nitro - lets you quickly set up a frontend project with sensible defaults and best practices.

Nitro is a Node.js application for simple and complex frontend development with a tiny footprint.  
It provides a proven but flexible structure to develop your frontend code, even in a large team.  
Keep track of your code with a modularized frontend. This app and the suggested
[atomic design](http://bradfrost.com/blog/post/atomic-web-design/) and [BEM](https://en.bem.info/method/definitions/)
concepts could help.  
Nitro is simple, fast and flexible. It works on macOS, Windows and Linux. Use this app for all your frontend work.

## Usage

Before using, you need of course [node](https://nodejs.org/) installed.  
Nitro and the Nitro generator are tested with the current 
["Active LTS" versions of node.js](https://github.com/nodejs/Release#release-schedule) (release 6.x and 8.x).

Install `yarn`, `yo` and `generator-nitro` globally:

    npm install -g yarn yo generator-nitro

Keep your global packages up to date:

    npm outdated -g --depth=0

Do an update if necessary:

    npm update -g

## Project Generation

Create a new directory, and `cd` into it:

    mkdir my-new-project && cd my-new-project

Run:

    yo nitro

You will be guided through some configuration options:

* Desired Name (default: current directory name)
* Desired CSS preprocessor (`less` or `scss`; default: `less`)
* Desired view file extension (`html`, `hbs` or `mustache`; default: `html`)
* Using client side templates (default: false)
* Including example code (default: true)
* Installing [`nitro-exporter`](https://www.npmjs.com/package/nitro-exporter) (default: false)
* Installing [`nitro-release`](https://www.npmjs.com/package/nitro-release) (default: false)

The choosen options will be stored for the next project generation.

It's possible to pass in these options through the command line:

    yo nitro --name=myproject --pre=less --viewExt=hbs --clientTpl --exampleCode --exporter=false --release=false

### Update a project

In your project, first update the generator to the newest version:

    yarn add generator-nitro

If you then run `yo nitro` you will be asked to update the project. 
It is best to overwrite all local files and check the differences after.

Updating to a new major version needs some more work. Please check the [release notes](https://github.com/namics/generator-nitro/releases)

## Generators

Available generators:

* `yo nitro` (aka `yo nitro:app`)
* `yo nitro:pattern [name]`

Note: Generators are to be run from the root directory of your project.

## Generated app

See how to use the [generated app](generators/app/templates/project/docs/nitro.md)

## Testing

Running `yarn test` will run the `jasmine` unit tests.

    yarn test

## Contribute

See the [contributing docs](https://github.com/yeoman/yeoman/blob/master/contributing.md)  
When submitting an issue, please follow the [guidelines](https://github.com/yeoman/yeoman/blob/master/contributing.md#issue-submission).
Especially important is to make sure Yeoman is up-to-date, and providing the command or commands that cause the issue.  
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
[appveyor-image]: https://ci.appveyor.com/api/projects/status/0580phm813ccdbhr/branch/master?svg=true
[appveyor-url]: https://ci.appveyor.com/project/namics/generator-nitro/branch/master
[daviddm-image]: https://david-dm.org/namics/generator-nitro.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/namics/generator-nitro
