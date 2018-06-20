/* global module */

import '@babel/polyfill';
import * as T from 'terrific';
import $ from 'jquery';

import './shared/base/reset/css/reset.scss';
import './shared/utils/grid/css/grid.scss';
import './shared/base/document/css/document.scss';

import './patterns/atoms/icon';
import './patterns/molecules/example';

if (module.hot) {
	module.hot.accept();
}

// custom code
console.log('I\'m from the entry point ui'); // eslint-disable-line

// terrifijs
$(document).ready(() => {
	const application = new T.Application();
	application.registerModules();
	application.start();
});

// Uncomment one of the following lines to see error handling
// require('unknown-module')
// } syntax-error
