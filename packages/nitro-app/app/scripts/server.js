const express = require('express');
const config = require('config');
const router = require('../core/router');
const compression = require('compression');
const bodyParser = require('body-parser');
const { parseOpenArg } = require('./util/cliOpen');

const app = express();

// Accept --open, --open=<url>, and --open <url>.
const { open } = parseOpenArg(process.argv.slice(2));

const isProduction = config.get('server.production');
const useCompression = config.get('server.compression');
const isTwig = config.get('nitro.templateEngine') === 'twig';

let hmrApp;
let engine;

if (!isProduction) {
	hmrApp = express();
	require('../core/webpack')(app, hmrApp);
}

if (isTwig) {
	engine = require('../templating/twig/engine');
	engine.cache(false);
} else {
	engine = require('../templating/hbs/engine');
	require('../templating/hbs/partials')(engine);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (useCompression) {
	app.use(compression());
}

require('../core/i18n')(app);

require('../core/routeLoader')(app);
app.use(router);

app.set('view engine', config.get('nitro.viewFileExtension'));
app.set('views', config.get('nitro.basePath') + config.get('nitro.viewDirectory'));

if (isTwig) {
	app.engine(config.get('nitro.viewFileExtension'), engine.renderWithLayout);
} else {
	app.engine(config.get('nitro.viewFileExtension'), engine.__express);
}
app.set('view cache', config.get('server.production'));

require('../core/listen')(app, hmrApp, { open });
