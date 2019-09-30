import { Component, GondelBaseComponent } from '@gondel/core';
// import $ from 'jquery';

/**
 * <%= pattern.name %> module implementation.
 * @author <%= user.name %> <<%= user.email %>>
 */

// enum Selectors { Button = '.js-<%= pattern.css %>__button', }
// enum States { Disabled = 'state-<%= pattern.css %>--disabled', }

@Component('<%= pattern.js %>')
export class <%= pattern.js %> extends GondelBaseComponent {
	public start() {
		console.warn('<%= pattern.js %>.js#start(): remove or implement component');
	}

	public stop() {
		console.warn('<%= pattern.js %>.js#stop(): remove or implement component');
	}
}
