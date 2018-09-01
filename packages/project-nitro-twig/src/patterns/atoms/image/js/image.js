'use strict';

import lazySizes from 'lazysizes';
import 'lazysizes/plugins/respimg/ls.respimg';
import 'lazysizes/plugins/object-fit/ls.object-fit';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';

/**
 * configuration for lazysizes
 *
 * @author ernscht <ernscht@gmail.com>
 */

const stateClasses = {
	lazyload: 'js-a-image--lazyload',
	pending: 'state-a-image--pending',
	loading: 'state-a-image--loading',
	loaded: 'state-a-image--loaded',
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
