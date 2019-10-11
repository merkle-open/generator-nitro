# Contribute

This repository is based on the mono-repo multi-package tool [lerna](https://github.com/lerna/lerna)
Always run `npm install` in the root of the repository to ensure proper dependency installation.

## Sample projects

The sample projects located under `packages/project-xxx` are used to develop new features before adding them to the
yeoman generator in the package `packages/generator-nitro`.

## Develop a feature

1. Develop your new feature in the respective sample project
2. After it works there, enhance the yeoman generator
3. Add a test in the folder `packages/generator-nitro/tests`
4. Test your yeoman generator change by doing the following
    1. Run `$ npm install` in the ROOT of the repo. 
    2. That links the local generator-nitro to be used when running `yo nitro` int the project `packages/project-new
    3. Switch to the `project-new` folder
    4. Run `$ npm run nitro` and use the yeoman config you adjusted / enhanced
    5. The Generator runs with your local recent changes
    6. Compare the output with your change in the sample project
