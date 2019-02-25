# Cypress e2e Tests

End to end testing with cypress.

[More about cypress](https://www.npmjs.com/package/cypress)

## Directories

We use the [default configuration](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Folder-Structure)

* `./cypress/integration` ist the place for your tests
* `./cypress/screenshots` and `./cypress/videos` directories are excluded from git

## Scripts

Use following npm scripts for your test workflow:

* `npm run cypress-test` to run full cypress test suite (use this to set up your tests)
* `npm run test:cypress` to run cypress tests in headless mode (use this for ci)

## CI setup

Add `CI=true` as environment variable to avoid tons of log lines by installing cypress.

More on [configuation for continous integration](https://docs.cypress.io/guides/guides/continuous-integration.html)
