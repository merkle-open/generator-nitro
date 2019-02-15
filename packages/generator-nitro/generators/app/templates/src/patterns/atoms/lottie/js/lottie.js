'use strict';

import { Component, EventListener, GondelBaseComponent } from '@gondel/core';

@Component('Lottie')
class Lottie extends GondelBaseComponent {
	start() {
		this.initializeAnimation();
	}

	@EventListener('click')
	_handleClick() {
		const action = this.animation.isPaused ? 'play' : 'pause';
		this.animation[action]();
	}

	initializeAnimation() {
		const jsonPath = this._ctx.dataset.jsonPath;

		import(/* webpackChunkName: "lottie" */ 'lottie-web/build/player/lottie_light.js').then((lottie) => {
			this.animation = lottie.loadAnimation({
				container: this._ctx,
				renderer: 'svg',
				loop: true,
				autoplay: true,
				path: jsonPath,
			});
		});
	}
}

export default Lottie;
