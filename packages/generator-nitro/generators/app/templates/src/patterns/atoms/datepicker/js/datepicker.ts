import { Component, GondelBaseComponent } from '@gondel/core';

enum Selectors {
	Input = '.js-a-datepicker__input',
}

@Component('Datepicker')
export class Datepicker extends GondelBaseComponent {
	public start() {
		this._initializeFlatpickr();
	}

	private _initializeFlatpickr() {
		import(/* webpackChunkName: "flatpickr" */ './flatpickr').then((flatpickr) => {
			flatpickr.default(this._ctx.querySelector(Selectors.Input));
		});
	}
}
