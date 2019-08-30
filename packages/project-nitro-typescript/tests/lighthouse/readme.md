# Lighthouse Score

Quality Testing. Outputs Scores for one page.

[More about lighthouse](https://developers.google.com/web/tools/lighthouse/)

## Configuration

-    The scope of the tests for the score evaluation can [be easily adjusted](./lighthouse.config.js).
-    As default we use a slightly customized [default config](https://github.com/GoogleChrome/lighthouse/blob/master/lighthouse-core/config/default-config.js)
-    The page to test is defined in the npm script `lighthouse-test:run`
-    The report is generated inside '/public/reports/lighthouse'

## Scripts

Use following npm script for your test workflow:

-   `npm run lighthouse-test` to run test suite (should open a browser window with the test results)
