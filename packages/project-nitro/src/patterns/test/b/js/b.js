'use strict';

import { Component, GondelBaseComponent } from '@gondel/core';

@Component('B')
class B extends GondelBaseComponent {
	start() {
		/* eslint-disable no-console */
		console.warn('B #start(): remove or implement component');
		/* eslint-enable no-console */
	}
}

export default B;
