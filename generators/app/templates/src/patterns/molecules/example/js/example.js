((($) => {
	/**
	 * Example module implementation.
	 *
	 * @author Pre Name <pre.name@domain.com>
	 */
	T.Module.Example = T.createModule({
		start(resolve) {
			const $ctx = $(this._ctx);
			this._events.on('t.sync', this.sync.bind(this));

			/* eslint-disable no-console */
			console.log(`Example - start [id:${$ctx.data('t-id')}]`);
			/* eslint-enable no-console */

			resolve();
		},
		sync() {
			const $ctx = $(this._ctx);

			/* eslint-disable no-console */
			console.log(`Example - sync [id:${$ctx.data('t-id')}]`);
			/* eslint-enable no-console */
		},
	});
})(jQuery));
