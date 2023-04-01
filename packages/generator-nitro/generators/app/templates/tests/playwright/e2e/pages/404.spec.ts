import { test, expect } from '@playwright/test';

const page404Url = '/404';
const nonExistingUrl = '/pagenotfound';

test.describe('404 Page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto(page404Url);
	});

	test.describe('HTML Head', () => {
		test('character encoding is UTF-8', async ({ page }) => {
			const charset = await page.evaluate(() => window.document.characterSet);
			expect(charset).toEqual('UTF-8');
		});

		test('Title includes 404', async ({ page }) => {
			await expect(page).toHaveTitle(/404/);
		});
	});

	test.describe('Root DOM node', () => {
		test('Has correct lang attribute', async ({ page }) => {
			const lang = await page.locator('html').getAttribute('lang');
			expect(lang).toEqual('en');
		});
	});
});

test.describe('404 Page', () => {
	test.describe('Status Code', () => {
		test('Should be 404 for a non existing page', async ({ page }) => {
			page.on('response', (response) => {
				if (response.url().includes(nonExistingUrl)) {
					expect(response.status()).toBe(404);
				}
			});
			await page.goto(nonExistingUrl);
		});
	});
});
