'use strict';

/**
 * Nitro Themes Config
 */

const config = {
	themes: [
		{
			id: 'light',
			name: 'Light Theme',
			isDefault: true,
			isLight: true,
		},
		{
			id: 'dark',
			name: 'Dark Theme',
			isDark: true,
		},
	],
};

module.exports = config.themes;
