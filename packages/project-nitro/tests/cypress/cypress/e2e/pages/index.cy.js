/// <reference types="cypress" />

// test empty index page
context('Index Page Test', () => {
	beforeEach(() => {
		cy.visit('/index');
	});

	describe('Location', () => {
		it('Has no hash', () => {
			cy.hash().should('be.empty');
		});

		it('Passes window.location tests', () => {
			const baseUrl = Cypress.config().baseUrl;

			cy.location().should((location) => {
				expect(location.hash).to.be.empty;
				expect(location.href).to.eq(`${baseUrl}/index`);
				expect(location.origin).to.eq(`${baseUrl}`);
				expect(location.pathname).to.eq('/index');
				expect(location.search).to.be.empty;
			});
		});
	});

	describe('HTML Head', () => {
		it('Character encoding is UTF-8', () => {
			cy.document().should('have.property', 'charset').and('eq', 'UTF-8');
		});

		it('Title includes index page', () => {
			cy.title().should('include', 'index page');
		});
	});

	describe('Root DOM node', () => {
		it('Has correct lang attribute', () => {
			cy.root().should('match', 'html').and('have.attr', 'lang', 'en');
		});
	});
});
