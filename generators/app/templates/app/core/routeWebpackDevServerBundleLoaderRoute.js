'use strict';

const config = require('config');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

/**
 * overwrite hardcoded SockJS config -> WebpackDevServer
 **/
module.exports = function (app) {
	app.get('/webpack-dev-server/bundle.js', (req, res) => {

		const protocol = req.query.protocol || 'http';
		const hostname = req.query.hostname || 'localhost';
		const port = req.query.port || 3000;

		fetch(`${protocol}://${hostname}:${port}/static/js/bundle.js`)
			.then((fetchRes) => fetchRes.text())
			.then((body) => {
				res.end(body.replace(`// Connect to WebpackDevServer via a socket.
var connection = new SockJS(
  url.format({
    protocol: window.location.protocol,
    hostname: window.location.hostname,
    port: window.location.port,
    // Hardcoded in WebpackDevServer
    pathname: '/sockjs-node',
  })
);`, `// Connect to WebpackDevServer via a socket.
var connection = new SockJS(
  url.format({
    protocol: '${protocol}:',
    hostname: '${hostname}',
    port: ${port},
    // Hardcoded in WebpackDevServer
    pathname: '/sockjs-node',
  })
);`));
			})
			.catch((err) => {
				console.error(err)
			});
	});

	app.get('/webpack-dev-server/bundle.js.map', (req, res) => {

		const protocol = req.query.protocol || 'http';
		const hostname = req.query.hostname || 'localhost';
		const port = req.query.port || 3000;

		fetch(`${protocol}://${hostname}:${port}/static/js/bundle.js.map`)
			.then((fetchRes) => fetchRes.text())
			.then((body) => {
				res.end(body);
			})
			.catch((err) => {
				console.error(err)
			});
	});
};
