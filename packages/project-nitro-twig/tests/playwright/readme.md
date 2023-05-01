# Playwright e2e Tests

End-to-end testing with playwright.

[More about playwright](https://playwright.dev/)

## Directories

- `./e2e` is the place for your tests (you may create subfolders as well)

## Scripts

Use following npm scripts for your test workflow:

- `npm run playwright-test` to run playwright ui-mode (use this to set up your tests)
- `npm test` playwright tests run in the test chain (this also works well in ci environments)

or [run and generate playwright tests directly in VS Code](https://playwright.dev/docs/codegen#generate-tests-in-vs-code)

## CI setup

Add `CI=true` as environment variable.

More on [configuation for continous integration](https://playwright.dev/docs/ci)
