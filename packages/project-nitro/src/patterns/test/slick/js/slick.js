'use strict';

import { Component, GondelBaseComponent } from '@gondel/core';
import $ from 'jquery';
import 'slick-carousel';

@Component('Slick')
class Slick extends GondelBaseComponent {
	start() {
		$(this._ctx).slick({
			slidesToshow: 1,
			slidesToScroll: 1,
			arrows: true,
			dots: true,
			// autoplay: true,
			// autoplayspeed: 2000,
		});
	}
}

export default Slick;
