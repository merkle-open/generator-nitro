/* global module */

import '@babel/polyfill';

if (module.hot) {
	module.hot.accept();
}

function requireAll(requireContext) {
	return requireContext.keys().map(requireContext);
}

/* eslint-disable no-useless-escape */

// all js files from 'proto/js' and'patterns/*/proto'
requireAll(require.context('./proto/js', true,	/^.*(js)$/));
requireAll(require.context('./patterns', true, /[\/\\]proto[\/\\](?:[a-z0-9\-]+).(js)$/));

// all css files from 'proto/css' and 'patterns/*/proto'
requireAll(require.context('./proto/css', true, /^.*(s?css)$/));
requireAll(require.context('./patterns', true, /[\/\\]proto[\/\\](?:[a-z0-9\-]+).(s?css)$/));

/* eslint-enable no-useless-escape */
