/// <reference types="cypress" />

// test features on test-page view
context('Test Page Tests (features)', () => {
	beforeEach(() => {
		cy.visit('/test-page');
	});

	describe('Translations', () => {
		it('text contains', () => {
			cy.get('.t-t > :nth-child(2) > :nth-child(1)').contains('app.company.name');

			cy.get('.t-t > :nth-child(2) > :nth-child(3)').contains(
				'The first three letters of alphabet are: a, l and p'
			);

			cy.get('.t-t > :nth-child(4) > :nth-child(2)').contains('test.text (t) = test.text (t)');

			cy.get('.t-t > :nth-child(8) > :nth-child(1)').contains('user.name: my name');

			cy.get('.t-t > :nth-child(8) > :nth-child(2)').contains('user.email: me@test.com');

			cy.get('p').contains('content string');

			cy.get('.t-a > :nth-child(1)').contains('ffffffrom b');

			cy.get('.t-a > :nth-child(6)').contains('from viewwwwwww');
		});
	});

	describe('Viewlist Helper', () => {
		it('helper shows correct number of pages', () => {
			cy.get('.cy-viewlist > :nth-child(1) > ul > li').should('have.length', 6);
			cy.get('.cy-viewlist > :nth-child(2) > ul > li').should('have.length', 3);
			cy.get('.cy-viewlist > :nth-child(3) > ul > li').should('have.length', 2);
		});
	});

	describe('Custom Helpers', () => {
		it('eq helper in subfolder works', () => {
			cy.get('.col-md-8 > :nth-child(7)').contains('[Partial] pageTitle (view) = pageTitle (view)');
			cy.get('.shouldnotberendered').should('not.exist');
		});
	});
});
