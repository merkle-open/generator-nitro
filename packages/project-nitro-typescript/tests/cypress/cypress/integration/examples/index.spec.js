/// <reference types="cypress" />

// test index page with example content
context('Index Page Examples', () => {
	beforeEach(() => {
		cy.visit('/index');
	});

	describe('Querying first example', () => {
		it('has DOM element with content "Example Module"', () => {
			cy.get('.m-example:first').should('contain', 'Example Module');
		});

		it('cy.contains() - query DOM elements with matching content', () => {
			cy.get('.m-example:first')
				.contains('Example Module')
				.should('have.class', 'm-example__headline');

			cy.get('.m-example:first')
				.contains('Link 2')
				.should('have.class', 'm-example__link');

			cy.get('.m-example:first')
				.contains('ul', 'Link 4')
				.should('have.class', 'js-m-example__list');
		});

		it('.within() - query DOM elements within a specific element', () => {
			cy.get('.m-example:first').within(() => {
				cy.get('li:first a').should('have.attr', 'href', 'index');
				cy.get('li:last a').should('have.attr', 'href', 'index');
			});
		});
	});

	describe('Querying more examples', () => {
		it('cy.get() - query DOM element', () => {
			cy.get('.m-example:eq(1)').should('contain', 'Example Module with Modifier Blue');
		});

		it('cy.contains() - query DOM elements with matching content', () => {
			cy.get('.m-example:eq(1)')
				.contains('Example Module')
				.should('have.class', 'm-example__headline');

			cy.get('.m-example:eq(1)')
				.contains('Link One')
				.should('have.class', 'm-example__link');
		});


	});

	describe('Client Templates', () => {
		it('query contents', () => {
			cy.get('.m-example:eq(2)')
				.contains('ul', 'Link Three')
				.should('have.class', 'js-m-example__list');

			cy.get('.m-example:eq(2)').within(() => {
				cy.get('button:first').contains('more links');
				cy.get('button:eq(1)').contains('add pattern');
			});
		});

		it('.click() on more button', () => {
			cy.get('.m-example:eq(2)')
				.find('button:first')
				.as('moreButton');
			cy.get('.m-example:eq(2)')
				.find('ul')
				.as('linkList');

			cy.get('@linkList')
				.find('li')
				.should('have.length', 3);
			cy.get('@moreButton').click();
			cy.get('@linkList')
				.find('li')
				.should('have.length', 5);
			cy.get('@moreButton').click();
			cy.get('@linkList')
				.find('li')
				.should('have.length', 7);
		});

		it('.click() on add button', () => {
			cy.get('.m-example:eq(2)')
				.find('button:eq(1)')
				.as('addButton');
			cy.get('.container').as('container');

			cy.get('@container')
				.find('.m-example')
				.should('have.length', 3);
			cy.get('@addButton').click();
			cy.get('@container')
				.find('.m-example')
				.should('have.length', 4);

			// working more button in new example pattern
			cy.get('@container')
				.find('.m-example:eq(3)')
				.as('newExample');
			cy.get('@newExample')
				.find('li')
				.should('have.length', 2);
			cy.get('@newExample')
				.find('button')
				.click();
			cy.get('@newExample')
				.find('li')
				.should('have.length', 4);
		});
	});

	describe('Navigation', () => {
		it('click on "more examples" and go back', () => {
			cy.get('.a-box')
				.contains('more examples')
				.click();

			cy.location('pathname').should('include', 'example-patterns');
			cy.url().should('eq', `${Cypress.config().baseUrl}/example-patterns`);

			cy.go('back');
			cy.location('pathname').should('not.include', 'example-patterns');
			cy.location('pathname').should('include', 'index');
		});
	});
});
