'use strict';

import * as T from 'terrific';
import $ from 'jquery';

/**
 * Test module implementation.
 *
 * @author Pre Name <pre.name@domain.com>
 */
T.Module.T = T.createModule({
	start(resolve) {
		const $ctx = $(this._ctx);

		/* eslint-disable no-console */
		console.log(`T - start [id:${$ctx.data('t-id')}]`);
		/* eslint-enable no-console */

		resolve();
	},
});
