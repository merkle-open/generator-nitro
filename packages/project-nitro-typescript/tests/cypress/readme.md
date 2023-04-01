# Cypress e2e Tests

End-to-end testing with cypress.

[More about cypress](https://www.npmjs.com/package/cypress)

## Directories

We use the [default configuration](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests)

- `./cypress/e2e` ist the place for your tests
- `./cypress/screenshots` and `./cypress/videos` directories are excluded from git

## Scripts

Use following npm scripts for your test workflow:

- `npm run cypress-test` to run full cypress test suite (use this to set up your tests)
- `npm test` cypress tests are run in the test chain

## CI setup

Add `CI=true` as environment variable to avoid tons of log lines by installing cypress.

More on [configuation for continous integration](https://docs.cypress.io/guides/continuous-integration/introduction)
