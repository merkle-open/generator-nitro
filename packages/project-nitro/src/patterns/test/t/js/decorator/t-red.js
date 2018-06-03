'use strict';

import * as T from 'terrific';
import $ from 'jquery';

/**
 * Red decorator implementation for the Test module.
 *
 * @author Pre Name <pre.name@domain.com>
 */
T.Module.T.Red = T.createDecorator({
	start(resolve) {
		const $ctx = $(this._ctx);

		/* eslint-disable no-console */
		console.log(`T Decorator Red - start id: [${$ctx.data('t-id')}]`);
		/* eslint-enable no-console */

		// calling original method
		this._parent.start(resolve);
	},
});
