'use strict';

import * as T from 'terrific';
import $ from 'jquery';

/**
 * Ex module implementation.
 *
 * @author Pre Name <pre.name@domain.com>
 */

T.Module.Ex = T.createModule({
	start(resolve) {
		const $ctx = $(this._ctx);
		this._events.on('t.sync', this.sync.bind(this));

		/* eslint-disable no-console */
		console.log(`Ex - start [id:${$ctx.data('t-id')}]`);
		console.log('alles gut so?'.startsWith('alles')
			? 'ES2015.startWith feature works'
			: 'broken ES2015.startWith feature');
		/* eslint-enable no-console */

		resolve();
	},
	sync() {
		const $ctx = $(this._ctx);

		/* eslint-disable no-console */
		console.log(`Ex - sync [id:${$ctx.data('t-id')}]`);
		/* eslint-enable no-console */
	},
});
