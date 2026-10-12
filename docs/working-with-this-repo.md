# Working with this repo

This repository is based on npm workspaces.

Always run `npm ci` in the root of this repository to ensure proper dependency installation.

## Quick start

Before using, you need of course [node](https://nodejs.org/) installed ([Version](.node-version)).  
Nitro and the Nitro generator are currently tested with the node LTS versions 22 and 24.

1.  Install base project:

```
npm ci
```

2.  Start example project:

```
npm start --workspace=project-nitro
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

## Git rules

Use a prefix from [Conventional Commits](https://www.conventionalcommits.org/), such as `feat`, `fix`, `ci`, `test`,
`chore`, or `docs`. Add a scope only when it meaningfully identifies the affected area; otherwise, omit it.

Use these scopes:

- `generator` for changes to `generator-nitro`
- `app` for `@nitro/app`
- `exporter` for `@nitro/exporter`
- `gulp` for `@nitro/gulp`
- `webpack` for the `@nitro` webpack config
- `project` for the example Nitro projects (`project-nitro`, `project-nitro-twig`, and `project-nitro-typescript`)
- `server` for the example project using the "light" server for production preview (`project-prod`)

Changes to the generator's project templates generally use the `project` scope rather than `generator`.

For example: `feat(project): add support for ...`
