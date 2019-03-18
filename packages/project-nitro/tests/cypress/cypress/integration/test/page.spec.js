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
			cy.get('[data-t-decorator="Template"] > .t-ex__headline').contains('Ex Module with Decorator Template');
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

			cy.get('.col-md-8 > :nth-child(7)').contains('[Partial] pageTitle (view) = pageTitle (view)');
		});
	});
});
