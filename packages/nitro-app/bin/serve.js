#!/usr/bin/env node

/**
 * CLI flag `--open` opens a browser after starting the server
 *   --open
 *   --open <url>
 *   --open=<url>
 *
 * If the flag is provided without a URL, the URL to open is computed by `../app/core/listen`.
 * If a URL is provided, it overrides the computed URL.
 *
 * Examples
 *
 * # 1) start nitro server
 * nitro-app-serve
 *
 * # 2) ... and opens computed URL in browser
 * nitro-app-serve --open
 *
 * # 3) ... and opens exact URL in browser
 * nitro-app-serve --open http://localhost:5050/styleguide
 *
 * # 4) also valid
 * nitro-app-serve --open=https://local:3000/documentation
 *
 */

require('../app/scripts/server.js');
