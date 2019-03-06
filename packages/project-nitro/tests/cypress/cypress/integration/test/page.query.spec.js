/// <reference types="cypress" />

// test test-page view with test content
context('Test Page Tests with query', () => {
	beforeEach(() => {
		cy.visit('/test-page?lang=en&test.text=blubber&dynInsert.you=winner&_nitro.pageTitle=new');
	});

	describe('HTML Head', () => {
		it('title includes index page', () => {
			cy.title().should('eq', 'new');
		});
	});

	describe('Content', () => {
		it('has correct number of listitem entries', () => {
			cy.get('.t-a > li').should('have.length', 13);
		});

		it('listitem contains', () => {
			cy.get('.t-t > :nth-child(2) > :nth-child(1)')
				.contains('my "first" company');

			cy.get('.t-t > :nth-child(2) > :nth-child(4)')
				.contains('Hello winner & winner');

			cy.get('.t-t > :nth-child(4) > :nth-child(1)')
				.contains('blubber = test.text (t)');

			cy.get('.t-t > :nth-child(4) > :nth-child(2)')
				.contains('blubber = test.text (t)');
		});

		it('content contains', () => {
			cy.get('.col-md-8 > :nth-child(7)')
				.contains('[Partial] new = pageTitle (view)');
		});
	});
});

context('Test Page Tests with different view data', () => {
	beforeEach(() => {
		cy.visit('/test-page?_data=test/data');
	});

	describe('HTML Head', () => {
		it('title includes index page', () => {
			cy.title().should('eq', 'The "data" page');
		});
	});

	describe('Content', () => {
		it('has correct number of listitem entries', () => {
			cy.get('.t-a > li').should('have.length', 5);
		});

		it('content contains', () => {
			cy.get('.col-md-8 > :nth-child(7)')
				.contains('[Partial] The "data" page = pageTitle (view)');
		});
	});
});


