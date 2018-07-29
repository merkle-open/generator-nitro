'use strict';

import * as T from 'terrific';

/**
 * fds decorator implementation for the b module.
 *
 * @author Pre Name <pre.name@domain.com>
 */
T.Module.B.Fds = T.createDecorator({
	start(resolve) {
		// calling original method
		this._parent.start(resolve);
	},
});
