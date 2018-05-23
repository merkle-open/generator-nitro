# Backstop Visual Tests

Regression testing with backstopjs.  
For running these tests you need chrome headless installed.

[More about backstopjs](https://www.npmjs.com/package/backstopjs)

## Directories

default configuration:

* this directory is meant to be the place to setup your tests and to have a place for your reference screenshots.
* test results are placed in a /project/tmp/reports/... folder 
* the reports are generated inside public/reports/backstop/html

## Scripts

Use following npm scripts for your test workflow:

* `yarn visual-reference` generates new reference screenshots with current configuration
* `yarn visual-test` runs the tests, compares the results against the reference screenshots 
and generates a report under `public/reports/backstop/html/`
* `yarn visual-approve` updates the references with results from last test
