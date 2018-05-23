'use strict';

import * as T from 'terrific';
import $ from 'jquery';

/**
 * Blue decorator implementation for the Example module.
 *
 * @author Pre Name <pre.name@domain.com>
 */
T.Module.Example.Blue = T.createDecorator({
	start(resolve) {
		const $ctx = $(this._ctx);

		/* eslint-disable no-console */
		console.log(`Example Decorator Blue - start id: [${$ctx.data('t-id')}]`);
		/* eslint-enable no-console */

		// calling original method
		this._parent.start(resolve);
	},
	sync() {
		const $ctx = $(this._ctx);

		/* eslint-disable no-console */
		console.log(`Example Decorator Blue - sync id: [${$ctx.data('t-id')}]`);
		/* eslint-enable no-console */

		// calling original method
		this._parent.sync();
	},
});
