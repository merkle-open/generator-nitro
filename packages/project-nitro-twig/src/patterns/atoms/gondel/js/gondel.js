'use strict';

import {Component, EventListener, GondelBaseComponent} from '@gondel/core';

const states = {
	motion: 'state-a-gondel--motion',
};

@Component('Gondel')
class Gondel extends GondelBaseComponent {
	@EventListener('click')
	_handleChange() {
		this._ctx.classList.toggle(states.motion);
	}
}

export default Gondel;
