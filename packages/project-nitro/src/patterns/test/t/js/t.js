'use strict';

import { Component, GondelBaseComponent } from '@gondel/core';

@Component('T')
class T extends GondelBaseComponent {
	start() {
		/* eslint-disable no-console */
		console.warn('T #start(): remove or implement component');
		/* eslint-enable no-console */
	}
}

export default T;
