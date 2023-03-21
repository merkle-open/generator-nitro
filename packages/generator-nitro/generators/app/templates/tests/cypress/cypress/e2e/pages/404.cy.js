/// <reference types="cypress" />

const page404Url = '/404';
const nonExistingUrl = '/pagenotfound';

// test 404 page
context('404 Page Test', () => {
	beforeEach(() => {
		cy.visit(page404Url);
	});

	describe('HTML Head', () => {
		it('Character encoding is UTF-8', () => {
			cy.document().should('have.property', 'charset').and('eq', 'UTF-8');
		});

		it('Title includes 404', () => {
			cy.title().should('include', '404');
		});
	});

	describe('Root DOM node', () => {
		it('Has lang attribute', () => {
			cy.root().should('match', 'html').and('have.attr', 'lang', 'en');
		});
	});

	describe('Status Code', () => {
		it('Should be 404 for a non existing page', () => {
			cy.request({
				url: nonExistingUrl,
				failOnStatusCode: false,
			}).then((response) => {
				expect(response.status).to.eq(404);
			});
		});
	});
});
