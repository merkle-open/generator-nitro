const { defineConfig } = require('cypress');

module.exports = defineConfig({
	e2e: {
		// specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', // default specPattern
		video: false,
		setupNodeEvents(on, config) {
			// modify config values
			const port = process.env.PORT || 8888;
			config.baseUrl = `http://localhost:${port}`;

			// IMPORTANT return the updated config object
			return config;
		},
	},
});
