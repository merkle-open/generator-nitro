# Backstop Visual Tests

Visual regression testing with backstopjs.  
For running these tests you need docker installed.

[More about backstopjs](https://www.npmjs.com/package/backstopjs)

## Directories

default configuration:

- this directory is meant to be the place to setup your tests and to have a place for your reference screenshots.
- test results are placed in the '/project/tmp/reports' folder
- the reports are generated inside '/public/reports/backstop'

## Scripts

Use following npm scripts for your test workflow:

- `npm run visual-test` runs the tests, compares the results against the reference screenshots
  and generates a report under '/public/reports/backstop/html/'
  (use this also for creating new reference screenshots, ignore the failed tests and approve with `npm run visual-approve`)
- `npm run visual-approve` updates the references with results from last test
