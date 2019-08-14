/// <reference types="cypress" />

// test test-page view with test content
context('Test Page Tests', () => {
	beforeEach(() => {
		cy.visit('/test-page');
	});

	describe('HTML Head', () => {
		it('title includes pageTitle', () => {
			cy.title().should('eq', 'pageTitle (view)');
		});
	});

	describe('Content', () => {
		it('headline 1 contains text', () => {
			cy.get('.t-ex__headline:first').contains('Ex Module (data: ex.json)');
		});
		it('headline 2 contains text', () => {
			cy.get('.t-ex--blue > .t-ex__headline').contains('Ex Module with Skin Blue (data: ex-blue.json)');
		});
		it('headline 3 contains text', () => {
			cy.get(':nth-child(4) > .t-ex__headline').contains('Ex Module with buttons');
		});
		it('has correct number of listitem entries', () => {
			cy.get('.t-a > li').should('have.length', 13);
		});
	});

	describe('Actions', () => {
		it('click on more', () => {
			cy.get('.js-t-ex__more').as('more');
			cy.get('.js-t-ex__add').as('add');

			cy.get('@more')
				.click()
				.click();
			cy.get('@more')
				.closest('.t-ex')
				.find('li')
				.should('have.length', 7);

			cy.get('@add').click();
			cy.get('.t-ex').should('have.length', 4);
		});
	});
});
