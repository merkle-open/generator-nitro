'use strict';

import lazySizes from 'lazysizes';
import 'lazysizes/plugins/respimg/ls.respimg';
import 'lazysizes/plugins/object-fit/ls.object-fit';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

/**
 * configuration for lazysizes
 */

const stateClasses = {
	lazyload: 'js-a-image--lazyload',
	pending: 'state-a-image__image--pending',
	loading: 'state-a-image__image--loading',
	loaded: 'state-a-image__image--loaded',
};

Object.assign(lazySizes.cfg, {
	preloadAfterLoad: false,
	loadMode: 1,
	expand: 10,
	expFactor: 1.7,
	lazyClass: stateClasses.lazyload,
	preloadClass: stateClasses.pending,
	loadingClass: stateClasses.loading,
	loadedClass: stateClasses.loaded,
	debug: true,
});
