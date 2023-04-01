import { test, expect } from '@playwright/test';

test.describe('Index Page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/index');
	});

	test.describe('Location', () => {
		test('Has no hash', async ({ page }) => {
			expect(page.url().includes('#')).toBeFalsy();
		});

		test('Passes window.location tests', async ({ page }, testInfo) => {
			const baseUrl = testInfo.project.use.baseURL;
			const location = await page.evaluate(() => window.location);

			expect(location.hash).toEqual('');
			expect(location.href).toEqual(`${baseUrl}/index`);
			expect(location.origin).toEqual(`${baseUrl}`);
			expect(location.pathname).toEqual('/index');
			expect(location.search).toEqual('');
		});
	});

	test.describe('HTML Head', () => {
		test('Character encoding is UTF-8', async ({ page }) => {
			const charset = await page.evaluate(() => window.document.characterSet);
			expect(charset).toEqual('UTF-8');
		});

		test('Title includes index page', async ({ page }) => {
			await expect(page).toHaveTitle(/index page/);
		});
	});

	test.describe('Root DOM node', () => {
		test('Has correct lang attribute', async ({ page }) => {
			const lang = await page.locator('html').getAttribute('lang');
			expect(lang).toEqual('en');
		});
	});
});
