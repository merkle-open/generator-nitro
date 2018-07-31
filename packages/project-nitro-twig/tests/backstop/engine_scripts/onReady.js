'use strict';

module.exports = (engine, scenario, vp) => {
	engine.evaluate(() => {
		// Your web-app is now loaded. Edit here to simulate user interacions or other state changes.
	});
	console.log('onReady.js has run for: ', vp.label);
};
