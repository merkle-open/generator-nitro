[![NPM version](https://badge.fury.io/js/generator-nitro.svg)](https://npmjs.org/package/generator-nitro)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](http://opensource.org/licenses/MIT)
[![Build Status](https://github.com/merkle-open/generator-nitro/workflows/ci/badge.svg?branch=master)](https://github.com/merkle-open/generator-nitro/actions)

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
Nitro and the Nitro generator are tested with the current ["Active" LTS version](https://github.com/nodejs/Release#release-schedule)
and with the LTS maintenance versions.

### Create a new project

Make sure you are in an existing git repo, or create one with `git init`.

This creates a new project in the current directory
using [npx](https://www.npmjs.com/package/npx) (npm >= 5.2):

```
npx -p yo -p generator-nitro@latest -- yo nitro
```

then install with desired node version

```
npm install
```

### Update a project

Updating a project to the newest nitro version is quite simple:

```
npm run nitro:update
```

... then

- validate all local changes
- run the 'clean' task to remove the package-lock and the 'node_modules' folder
- run 'install'

```
npm run clean
npm install
```

### Project Generation

On creating a new project, you will be guided through some configuration options:

- Desired Name `--name=` (default: current directory name)
- Desired template engine `--templateEngine=` (`hbs` or `twig`; default: `hbs`)
- Desired js compiler `--jsCompiler=` (`ts` or `js`; default: `ts`)
- Using theming feature `--themes` (default: false)
- Using client side templates `--clientTpl` (default: false)
- Including example code `--exampleCode` (default: false)
- Installing nitro-exporter" `--exporter` (default: false)

It's possible to pass in these options through the command line:

```
npx -p yo -p generator-nitro@latest -- yo nitro --name=myproject --templateEngine=hbs --jsCompiler=ts --themes --clientTpl --exampleCode --exporter
```

You may bypass the questions with `--skip-questions`. This will use the defaults for not specified options

```
npx -p yo -p generator-nitro@latest -- yo nitro --name=myproject --clientTpl --exporter --skip-questions
```

### Project Update

If you start the generator in an existing project, you will be asked to update the project.
It is best to overwrite all local files and check the differences after.

Updating to a new major version needs some more work. Please check the [release notes](https://github.com/merkle-open/generator-nitro/releases)

### Generators

Available generators:

- `yo nitro` (aka `yo nitro:app` / generate or update a project)
- `yo nitro:pattern [name]` (create or update a pattern)
- `yo nitro:server` (create an executable light version of the project)

Note: Generators are to be run from the root directory of your project.

## Generated app

Have a look at the [sample project](https://nitro-project-test.netlify.app/)
which contains the examples of a generated project and was statified with the default configuration of the "nitro-exporter".

See how to use the [generated app](https://github.com/merkle-open/generator-nitro/blob/master/packages/project-nitro/project/docs/nitro.md)

## Contribute

We are more than happy to accept external contributions to the project in the form of feedback, bug reports and pull requests :)

See the [contributing docs](../../.github/contributing.md)

## Changelog

Recent changes can be viewed on GitHub on the [Releases Page](https://github.com/merkle-open/generator-nitro/releases)
