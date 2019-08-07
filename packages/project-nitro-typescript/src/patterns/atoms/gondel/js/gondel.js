'use strict';

import { Component, EventListener, GondelBaseComponent } from '@gondel/core';

const states = {
	prepare: 'state-a-gondel--prepare',
	motion: 'state-a-gondel--motion',
};

@Component('Gondel')
class Gondel extends GondelBaseComponent {
	@EventListener('mouseover')
	_handleMouseOver() {
		this._ctx.classList.add(states.prepare);
	}
	@EventListener('mouseout')
	_handleMouseOut() {
		this._ctx.classList.remove(states.prepare);
	}
	@EventListener('click')
	_handleChange() {
		this._ctx.classList.toggle(states.motion);
	}
}

export default Gondel;
