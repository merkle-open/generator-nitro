// This mocha setup hook preloads the Yeoman modules with a separate 60-second timeout
// to prevent test timeouts.
exports.mochaHooks = {
	async beforeAll() {
		this.timeout(60000);

		await Promise.all([
			import('yeoman-environment'),
			import('yeoman-generator'),
		]);
	},
};
