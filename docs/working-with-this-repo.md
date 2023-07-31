# Working with this repo

This repository is based on npm workspaces.

Always run `npm install` in the root of this repository to ensure proper dependency installation.

## Quick start

Before using, you need of course [node](https://nodejs.org/) installed ([Version](.node-version)).  
Nitro and the Nitro generator are tested with the current ["Active" LTS version](https://github.com/nodejs/Release#release-schedule)
and with the LTS maintenance versions.

1.  Install base project:

```
npm install
```

2.  Start example project:

```
cd packages/project-nitro
npm start
```

## Sample projects

The sample projects located under 'packages/project-xxx' are used to develop new features before adding them to the
yeoman generator in the package 'packages/generator-nitro'.

## Develop a feature

1. Develop your new feature in the respective sample project
2. After it works there, enhance the yeoman generator
3. Add a test in the folder 'packages/generator-nitro/tests'
4. Run `npm install` in the root of the repo to link to the yeoman generator with your newest changes
5. Test your yeoman generator change by creating a new project
   1. cd to the 'project-new' package
   2. Run `npm start` and use the yeoman config you adjusted / enhanced
   3. The generator runs with your local recent changes
   4. Compare the output with your change in the sample project
