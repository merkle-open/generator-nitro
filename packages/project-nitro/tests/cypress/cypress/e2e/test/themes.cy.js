/// <reference types="cypress" />

// test theming feature
context('Test Theming', () => {
	beforeEach(() => {
		cy.visit('/index');
	});

	describe('Themelist Helper', () => {
		it('helper shows two themes', () => {
			cy.get('.proto-themelist > h2').contains('Available Themes');
			cy.get('.proto-themelist > ul > li').should('have.length', 2);
		});

		it('shows default theme light', () => {
			cy.get('.proto-themelist > ul > :nth-child(1)').contains('Light Theme (current)');
		});
	});

	describe('Theme Switcher works', () => {
		it('shows default theme light', () => {
			cy.get('.proto-themelist > ul > :nth-child(1)').contains('Light Theme (current)');
			cy.get('.proto-themelist > ul a').click();

			cy.get('.proto-themelist > ul > :nth-child(1)').contains('Light Theme');
			cy.get('.proto-themelist > ul > :nth-child(2)').contains('Dark Theme (current)');
		});
	});
});
