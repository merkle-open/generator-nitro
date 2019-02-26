/// <reference types="cypress" />

// test 404 page
context('404 Page Test', () => {
	beforeEach(() => {
		cy.visit('/404');
	});

	describe('HTML Head', () => {
		it('charset meta tag is UTF-8', () => {
			cy.document()
				.should('have.property', 'charset')
				.and('eq', 'UTF-8');
		});

		it('title includes 404', () => {
			cy.title().should('include', '404');
		});
	});

	describe('Root DOM node', () => {
		it('has lang attribute', () => {
			cy.root()
				.should('match', 'html')
				.and('have.attr', 'lang', 'en');
		});
	});

	describe('Status Code', () => {
		it('should be 404 for a non existing page', () => {
			cy.request({
				url: '/pagenotfound',
				failOnStatusCode: false,
			}).then((response) => {
				expect(response.status).to.eq(404);
			});
		});
	});
});
