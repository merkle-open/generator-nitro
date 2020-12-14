// infos & outline from:
// https://stackoverflow.com/questions/54320025/tap-into-webpack-resolve-loader-to-add-fallback

class DynamicAliasResolver {
	constructor({ search, replace /*, fallback*/ }) {
		this.search = search;
		this.replace = replace;
		// this.fallback = fallback;
		this.filterFunction =
			this.search instanceof RegExp ? (value) => search.test(value) : (value) => value.indexOf(search) !== -1;
	}
	apply(resolver) {
		// current & next hook
		const source = 'resolve';
		const target = resolver.ensureHook('parsedResolve');

		resolver.getHook(source).tapAsync('DynamicAliasResolver', (request, resolveContext, cb) => {
			// change request if we find search term
			if (this.filterFunction(request.request)) {
				// possible improvement: check for existing file and use fallback
				request.request = request.request.replace(this.search, this.replace);
				// continue to the next hook
				return resolver.doResolve(target, request, null, resolveContext, cb);
			}
			// continue
			return cb();
		});
	}
}

module.exports = DynamicAliasResolver;
