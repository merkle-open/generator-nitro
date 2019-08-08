import lazySizes from 'lazysizes';
import 'lazysizes/plugins/respimg/ls.respimg';
import 'lazysizes/plugins/object-fit/ls.object-fit';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import __assign from 'core-js/modules/_object-assign.js';

Object.assign = Object.assign || __assign;

/**
 * configuration for lazysizes
 */

enum States {
	Lazyload = 'js-a-image--lazyload',
	Pending = 'state-a-image__image--pending',
	Loading = 'state-a-image__image--loading',
	Loaded = 'state-a-image__image--loaded',
}

Object.assign(lazySizes.cfg, {
	preloadAfterLoad: false,
	loadMode: 1,
	expand: 10,
	expFactor: 1.7,
	lazyClass: States.Lazyload,
	preloadClass: States.Pending,
	loadingClass: States.Loading,
	loadedClass: States.Loaded,
	debug: true,
});
