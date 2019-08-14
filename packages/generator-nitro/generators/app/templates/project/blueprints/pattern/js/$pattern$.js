'use strict';

import { Component, EventListener, GondelBaseComponent } from '@gondel/core';
import $ from 'jquery';
import Example from "../../../../src/patterns/molecules/example/js/example";

/**
 * <%= pattern.name %> module implementation.
 * @author <%= user.name %> <<%= user.email %>>
 */

// const selectors = { button: '.js-<%= pattern.css %>__button' };
// const stateClasses = { disabled: 'state-<%= pattern.css %>--disabled' };

@Component('<%= pattern.js %>')
class <%= pattern.js %> extends GondelBaseComponent {
	start() {
		/* eslint-disable no-console */
		console.warn('<%= pattern.js %>.js#start(): remove or implement component');
		/* eslint-enable no-console */
	}

	stop() {
		/* eslint-disable no-console */
		console.warn('<%= pattern.js %>.js#stop(): remove or implement component');
		/* eslint-enable no-console */
	}
}

export default <%= pattern.js %>;
