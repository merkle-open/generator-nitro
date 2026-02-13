'use strict';

function strip(s) {
	return s.replace(/^['"]|['"]$/g, '');
}

function parseOpenArg(args) {
	for (let i = 0; i < args.length; i++) {
		const a = args[i];

		// case 1: "--open"
		if (a === '--open') {
			const next = args[i + 1];

			// case 2: "--open http://somehost"
			if (next && !next.startsWith('-')) {
				return { open: strip(next) };
			}

			return { open: true };
		}

		// case 3: "--open=http://somehost"
		if (a.startsWith('--open=')) {
			const url = a.slice('--open='.length).trim();
			return { open: strip(url) };
		}
	}

	return { open: false };
}

module.exports = {
	parseOpenArg
};
