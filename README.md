# Yeoman Sentinel Generator

> Yeoman generator for Sentinel - lets you quickly set up a project with sensible defaults and best practices.

## Usage

Install `yo` and other required tools
```
npm install -g yo bower grunt-cli gulp mocha
```

Install `generator-sentinel`:
```
npm install -g generator-sentinel
```

Make a new directory, and `cd` into it:
```
mkdir my-new-project && cd $_
```

Run `yo sentinel`, optionally passing an app name:
```
yo sentinel [name]
```

Run `gulp watch` for building and watching your asset changes.

Run `node sentinel` to start your application. 

Open `http://localhost:8080/` in your browser to see the action.

## Generators

Available generators:

* [sentinel] (aka [sentinel:app])
* [sentinel:component](#name)

**Note: Generators are to be run from the root directory of your app.**

### App
Sets up a new sentinel app, generating all the boilerplate you need to get started. 

Example:
```bash
yo sentinel
```

### Component
Generates a frontend component.

Example:
```bash
yo sentinel:component
```

## Bower Components

The following packages are always installed by the [app](#name) generator:

* jquery
* terrific-js


The following additional modules are available as components on bower, and installable via `bower install`:

* …

All of these can be updated with `bower update` as new versions are released.

## Configuration
Yeoman generated projects can be further tweaked according to your needs by modifying project files appropriately.

## Testing

Running `gulp test` will run the unit tests with karma.

## Contribute

See the [contributing docs](https://github.com/yeoman/yeoman/blob/master/contributing.md)

When submitting an issue, please follow the [guidelines](https://github.com/yeoman/yeoman/blob/master/contributing.md#issue-submission). Especially important is to make sure Yeoman is up-to-date, and providing the command or commands that cause the issue.

When submitting a bugfix, write a test that exposes the bug and fails before applying your fix. Submit the test alongside the fix.

When submitting a new feature, add tests that cover the feature.

## Changelog

Recent changes can be viewed on Github on the [Releases Page](https://github.com/namics/generator-sentinel/releases)

## License

[MIT license](http://opensource.org/licenses/MIT)