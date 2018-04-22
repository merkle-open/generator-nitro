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

The generator uses [yarn](https://yarnpkg.com) as package manager because it's much faster than npm.

### Create a new project

This creates a new project in the current directory.

#### The npx way

Using [npx](https://www.npmjs.com/package/npx) (npm >= 5.2):

First, uninstall the previously installed global package "generator-nitro"

```
npm uninstall -g generator-nitro
```

... then run:

```
npx -p yo -p generator-nitro@latest -- yo nitro
```

#### The global way

Install `yo` and `generator-nitro` globally:

```
yarn global add yo generator-nitro
```

Then run:

```
yo nitro
```

### Update a project

Updating a project to the newest nitro version is quite simple:

```
yarn nitro:update
```

### Project Generation

On creating a new project, you will be guided through some configuration options:

* Desired Name `--name=` (default: current directory name)
* Desired CSS preprocessor `--pre=` (`less` or `scss`; default: `scss`)
* Desired view file extension `--viewExt=` (`html`, `hbs` or `mustache`; default: `hbs`)
* Using client side templates `--clientTpl` (default: false)
* Including example code `--exampleCode` (default: false)
* Installing [`nitro-exporter`](https://www.npmjs.com/package/nitro-exporter) `--exporter` (default: false)

The choosen options will be stored for the next project generation.

It's possible to pass in these options through the command line:

```
npx -p yo -p generator-nitro@latest -- yo nitro --name=myproject --pre=less --viewExt=hbs --clientTpl
# or
yo nitro --name=myproject --pre=less --viewExt=hbs --clientTpl
```

You may bypass the questions with `--skip-questions`. This will use the defaults for not specified options

```
npx -p yo -p generator-nitro@latest -- yo nitro --name=myproject --clientTpl --exporter --skip-questions
# or
yo nitro --name=myproject --clientTpl --exporter --skip-questions
```

### Project Update

If you start the generator in an existing project, you will be asked to update the project. 
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

```
yarn test
```

## Contribute

We are more than happy to accept external contributions to the project in the form of feedback, bug reports and pull requests :)

See the [contributing docs](.github/contributing.md)  

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
