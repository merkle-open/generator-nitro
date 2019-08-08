import { Component, EventListener, GondelBaseComponent } from '@gondel/core';

@Component('Lottie')
export class Lottie extends GondelBaseComponent {
	private animation: any;
	public start() {
		this.initializeAnimation();
	}

	@EventListener('click')
	private _handleClick(): void {
		const action = this.animation.isPaused ? 'play' : 'pause';
		this.animation[action]();
	}

	private initializeAnimation(): void {
		const jsonPath = this._ctx.dataset.jsonPath;

		import(/* webpackChunkName: "lottie" */ 'lottie-web/build/player/lottie_light.js').then((lottie: any) => {
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
