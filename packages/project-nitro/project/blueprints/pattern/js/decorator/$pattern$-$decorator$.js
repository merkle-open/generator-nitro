'use strict';

import * as T from 'terrific';
import $ from 'jquery';

/**
 * <%= decorator.name %> decorator implementation for the <%= pattern.name %> module.
 *
 * @author <%= user.name %> <<%= user.email %>>
 */

T.Module.<%= pattern.js %>.<%= decorator.js %> = T.createDecorator({
	start(resolve) {
		const $ctx = $(this._ctx);

		this._parent.start(resolve);
	},
});
