import { Component, EventListener, GondelBaseComponent } from '@gondel/core';

enum States {
	Prepare = 'state-a-gondel--prepare',
	Motion = 'state-a-gondel--motion',
}

@Component('Gondel')
export class Gondel extends GondelBaseComponent {
	@EventListener('mouseover')
	private _handleMouseOver() {
		this._ctx.classList.add(States.Prepare);
	}
	@EventListener('mouseout')
	private _handleMouseOut() {
		this._ctx.classList.remove(States.Prepare);
	}
	@EventListener('click')
	private _handleChange() {
		this._ctx.classList.toggle(States.Motion);
	}
}
