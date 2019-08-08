// @ts-check
/* global module */

import { hot } from '@gondel/plugin-hot';

// hot module reloading
hot(module);
// only necessary if we don't use gondel hot reloading
// if (module.hot) { module.hot.accept() }

/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-require-imports */

async function requireAll(requireContext) {
	return requireContext.keys().map(requireContext);
}

// require all ts files from 'proto/js' and'patterns/*/proto'
requireAll(require.context('./proto/js', true, /^.*(ts)$/));
requireAll(require.context('./patterns', true, /[\/\\]proto[\/\\](?:[a-z0-9\-]+).(ts)$/));

// require all scss files from 'proto/css' and 'patterns/*/proto'
requireAll(require.context('./proto/css', true, /^.*(s?css)$/));
requireAll(require.context('./patterns', true, /[\/\\]proto[\/\\](?:[a-z0-9\-]+).(s?css)$/));

// require develop helpers
require('./proto/utils/develop-helpers');

/* eslint-enable @typescript-eslint/no-require-imports */
/* eslint-enable no-useless-escape */
