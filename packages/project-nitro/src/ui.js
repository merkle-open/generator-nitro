/* global module */

import '@babel/polyfill';
import * as T from 'terrific';
import $ from 'jquery';

import './shared/base/security/js/security';
import './shared/base/reset/css/reset.scss';
import './shared/utils/grid/css/grid.scss';
import './shared/base/document/css/document.scss';
import './shared/base/webfonts/css/webfont-gaegu.scss';
import './shared/base/webfonts/css/webfont-playfair-display.scss';

import './patterns/atoms/box';
import './patterns/atoms/button';
import './patterns/atoms/checkbox';
import './patterns/atoms/cta';
import './patterns/atoms/heading';
import './patterns/atoms/icon';
import './patterns/atoms/image';
import './patterns/atoms/list';
import './patterns/atoms/loader';
import './patterns/atoms/stage';
import './patterns/molecules/example';

import './patterns/test/a';
import './patterns/test/b';
import './patterns/test/Ex';
import './patterns/test/ico';
import './patterns/test/t';
import './patterns/test/tbox';
import './patterns/test/tbutton';
import './patterns/test/tcheckbox';

// needed for hot reload
if (module.hot) {
	module.hot.accept();
}

// custom code
console.log('I\'m from the entry point ui'); // eslint-disable-line

// terrificjs
$(() => {
	const application = new T.Application();
	application.registerModules();
	application.start();
});

// Uncomment one of the following lines to see error handling
// require('unknown-module')
// } syntax-error
