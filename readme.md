[![License](https://img.shields.io/badge/license-MIT-green.svg)](http://opensource.org/licenses/MIT)
[![Build Status](https://github.com/namics/generator-nitro/workflows/ci/badge.svg?branch=master)](https://github.com/namics/generator-nitro/actions)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

# Nitro

Nitro is a Node.js application for simple and complex frontend development with a tiny footprint.
It provides a proven but flexible structure to develop your frontend code, even in a large team.

The codebase is split up in different packages, organized in this monorepo.
Besides the main functionality including a yeoman generator, this repo includes also example projects.

- [`packages/generator-nitro`](./packages/generator-nitro) (yeoman generator) [![NPM version](https://badge.fury.io/js/generator-nitro.svg)](https://npmjs.org/package/generator-nitro)
- `packages/nitro-app` (main serverside app) [![npm version](https://badge.fury.io/js/%40nitro%2Fapp.svg)](https://badge.fury.io/js/%40nitro%2Fapp)
- `packages/nitro-exporter` (nitro exporter package) [![npm version](https://badge.fury.io/js/%40nitro%2Fexporter.svg)](https://badge.fury.io/js/%40nitro%2Fexporter)
- `packages/nitro-gulp` (nitro gulp task runner) [![npm version](https://badge.fury.io/js/%40nitro%2Fgulp.svg)](https://badge.fury.io/js/%40nitro%2Fgulp)
- `packages/nitro-webpack` (nitro webpack config) [![npm version](https://badge.fury.io/js/%40nitro%2Fwebpack.svg)](https://badge.fury.io/js/%40nitro%2Fwebpack)
- `packages/project-new` (folder to test the generator)
- [`packages/project-nitro`](./packages/project-nitro) (example project with handlebars rendering engine)
- `packages/project-nitro-twig` (example project with twig rendering engine)
- `packages/project-nitro-typescript` (example project with typescript)
- `packages/project-prod` (example for minimum version for production use)

## Getting started

### Generate or update a project

Have a look at the [usage section of the package 'generator-nitro'](./packages/generator-nitro/readme.md#usage) on how to create
or update a project.

### Sample project

Have a look at the [sample project](https://nitro-project-test.netlify.app/)
which contains the examples of a generated project and was statified with the default configuration of the 'nitro-exporter'.

### Working with this repo

Have a look at the [usage documentation](./docs/working-with-this-repo.md) to see how to work with this repository.

## Changelog

Recent changes can be viewed on Github on the [Releases Page](https://github.com/namics/generator-nitro/releases)
