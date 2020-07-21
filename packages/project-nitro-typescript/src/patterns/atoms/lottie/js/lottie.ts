import { Component, EventListener, GondelBaseComponent } from '@gondel/core';

@Component('Lottie')
export class Lottie extends GondelBaseComponent {
	private _animation: any;

	@EventListener('click')
	private _handleClick(): void {
		const action = this._animation.isPaused ? 'play' : 'pause';
		this._animation[action]();
	}

	public start() {
		this._initializeAnimation();
	}

	private _initializeAnimation(): void {
		const jsonPath = this._ctx.dataset.jsonPath;

		import(/* webpackChunkName: "lottie" */ 'lottie-web/build/player/lottie_light.js').then((lottie: any) => {
			this._animation = lottie.loadAnimation({
				container: this._ctx,
				renderer: 'svg',
				loop: true,
				autoplay: true,
				path: jsonPath,
			});
		});
	}
}
