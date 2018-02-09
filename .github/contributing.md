# Contributing

We are more than happy to accept external contributions to the project in the form of feedback, bug reports and even better - pull requests :)

## How to contribute

### Give feedback on issues

We're always looking for more opinions on discussions in the [issue tracker](https://github.com/namics/generator-nitro/issues). 
It's a good opportunity to influence the future direction of nitro and the generator.

### Creating Issues

In order for us to help you please check that you've completed the following steps:

* Make sure you're on the latest version `npm install -g generator-nitro`
* Use the search feature to ensure that the issue hasn't been reported before
* Include as much information about the issue as possible, including any output you've received, what OS and version you're on, etc.
  
[Submit your issue](https://github.com/namics/generator-nitro/issues/new)

### Opening pull requests

* Please check to make sure that there aren't existing pull requests attempting to address the issue mentioned. We also recommend checking for issues related to the issue on the tracker, as a team member may be working on the issue in a branch or fork.
* Non-trivial changes should be discussed in an issue first
* Please check project guidelines from `.editorconfig` & `.eslintrc`
* Develop in a topic branch
* Make sure test-suite passes: `yarn test` (This includes linting).
* Push to your fork and submit a pull request to the development branch

Some things that will increase the chance that your pull request is accepted:

* Write tests
* Write a meaningful commit message
* Write a convincing description of your PR and why we should land it

#### Quick Start

- Install node & yarn and the `yo` package globally
- Fork, then clone the generator-nitro repo and then run `yarn install` in them
- Link the generator using `npm link`. (Before, you may change the generator name in `package.json` to a new name, e.g. `generator-nitro-dev`)
- Run `yo` and you should now see the linked generator in the list (e.g. Nitro Dev)
- Start hacking ;-)

You can keep your repo up to date by running `git pull --rebase upstream master`.
