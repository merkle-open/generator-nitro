import { Component, GondelBaseComponent } from '@gondel/core';
import $ from 'jquery';
import 'slick-carousel';

// Workaround for issue with slick carousel and jQuery 4
$.type = function (value) {
	return typeof value;
};

@Component('Slick')
class Slick extends GondelBaseComponent {
	start() {
		$(this._ctx).slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			arrows: true,
			dots: true,
			// autoplay: true,
			// autoplayspeed: 2000,
		});
	}
}

export default Slick;
