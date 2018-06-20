'use strict';

import * as T from 'terrific';
import $ from 'jquery';

/**
 * <%= pattern.name %> module implementation.
 *
 * @author <%= user.name %> <<%= user.email %>>
 */

T.Module.<%= pattern.js %> = T.createModule({
	start(resolve) {
		const $ctx = $(this._ctx);

		resolve();
	},
});
