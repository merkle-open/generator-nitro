/**
 *
 * 	DASH4 configuration
 *  https://github.com/smollweide/dash4
 *
 */
const { PluginTerminal } = require('@dash4/plugin-terminal');
const { PluginReadme } = require('@dash4/plugin-readme');
const { PluginNpmScripts } = require('@dash4/plugin-npm-scripts');
const { PluginActions } = require('@dash4/plugin-actions');

async function getConfig() {
	return {
		port: 4444,
		tabs: [
			{
				title: 'START',
				rows: [
					[
						new PluginReadme({ file: 'readme.md' }),
					],
					[
						new PluginTerminal({
							title: 'Development Mode',
							cmd: 'npm run dev',
							dark: true,
							autostart: false,
						}),
						new PluginTerminal({
							title: 'Production Mode',
							cmd: 'npm run prod',
							dark: true,
							autostart: false,
						}),
						new PluginTerminal({
							title: 'Cypress Mode',
							cmd: 'npm run cypress-test',
							dark: true,
							autostart: false,
						}),
					],
					[
						new PluginNpmScripts({
							scripts: [
								{ title: 'Run Linting', cmd: 'npm run lint' },
								{ title: 'Run Tests', cmd: 'npm run test' },
								{ title: 'Run Visual Tests', cmd: 'npm run visual-test' },
								{ title: 'Get Lighthouse Score', cmd: 'npm run lighthouse-test' },
							],
						}),
						new PluginNpmScripts({
							scripts: [
								{ title: 'Run Prettier', cmd: 'npm run prettier' },
								{ title: 'Update Dependencies', cmd: 'npm run update-dependencies' },
								{ title: 'Clean', cmd: 'npm run clean' },
							],
						}),
					],
					[
						new PluginActions({
							title: 'Links',
							actions: [
								{
									type: 'link',
									href: 'https://nitro-project-test.netlify.com/',
									title: 'Proto Server',
								},
							],
						}),
					],
				],
			},
			{
				title: 'READMES',
				rows: [
					[
						new PluginReadme({ file: 'project/docs/nitro.md' }),
					],
					[
						new PluginReadme({ file: 'project/docs/nitro-config.md' }),
						new PluginReadme({ file: 'project/docs/nitro-webpack.md' }),
						new PluginReadme({ file: 'project/docs/nitro-exporter.md' }),
					],
				],
			},
		],
	};
}

module.exports = getConfig;
