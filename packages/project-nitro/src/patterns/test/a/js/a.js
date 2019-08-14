'use strict';

import { Component, GondelBaseComponent } from '@gondel/core';

@Component('A')
class A extends GondelBaseComponent {
	start() {
		/* eslint-disable no-console */
		console.warn('A #start(): remove or implement component');
		/* eslint-enable no-console */
	}
}

export default A;
