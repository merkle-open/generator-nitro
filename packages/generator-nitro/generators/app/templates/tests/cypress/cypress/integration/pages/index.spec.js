/// <reference types="cypress" />

const port = process.env.PORT || 8888;

// test empty index page
context('Index Page Test', () => {
	beforeEach(() => {
		cy.visit(`http://localhost:${port}/index`);
	});

	describe('Location', () => {
		it('has no hash', () => {
			cy.hash().should('be.empty');
		});

		it('passes window.location tests', () => {
			cy.location().should((location) => {
				expect(location.hash).to.be.empty;
				expect(location.href).to.eq(`http://localhost:${port}/index`);
				expect(location.host).to.eq(`localhost:${port}`);
				expect(location.hostname).to.eq('localhost');
				expect(location.origin).to.eq(`http://localhost:${port}`);
				expect(location.pathname).to.eq('/index');
				expect(location.port).to.eq(String(port));
				expect(location.protocol).to.eq('http:');
				expect(location.search).to.be.empty;
			});
		});
	});

	describe('HTML Head', () => {
		it('charset meta tag is UTF-8', () => {
			cy.document()
				.should('have.property', 'charset')
				.and('eq', 'UTF-8');
		});

		it('title includes index page', () => {
			cy.title().should('include', 'index page');
		});
	});

	describe('Root DOM node', () => {
		it('has lang attribute', () => {
			cy.root()
				.should('match', 'html')
				.and('have.attr', 'lang', 'en');
		});
	});
});
