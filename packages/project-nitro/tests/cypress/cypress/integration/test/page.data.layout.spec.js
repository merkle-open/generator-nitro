/// <reference types="cypress" />

// test test.data view with test content
context('Test Page Data', () => {
	beforeEach(() => {
		cy.visit('/test-data');
	});

	describe('HTML Head', () => {
		it('title includes "data" page', () => {
			cy.title().should('eq', 'The "data" page');
		});
	});

	describe('Content', () => {
		it('text contains _nitro.pageTitle', () => {
			cy.get('.col-md-8 > :nth-child(1)').contains('The "data" page = pageTitle (view)');
		});
		it('text contains _nitro.pageUrl', () => {
			cy.get('.col-md-8 > :nth-child(2)').contains(`${Cypress.config().baseUrl}/test-data = pageUrl (view)`);
		});
	});

	describe('Layout contents', () => {
		it('elements does not exist', () => {
			cy.get('h1').should('not.exist');

			cy.get('p').should('have.length', 5);
		});
	});
});

context('Test Page Data with different layout', () => {
	beforeEach(() => {
		cy.visit('/test-data?_layout=test');
	});

	describe('HTML Head', () => {
		it('title includes "data" page and PRODUCTION', () => {
			cy.title().should('eq', 'PRODUCTION: The "data" page');
		});
	});

	describe('Content', () => {
		it('text contains _nitro.pageTitle', () => {
			cy.get('.col-md-8 > :nth-child(1)').contains('The "data" page = pageTitle (view)');
		});
		it('text contains _nitro.pageUrl', () => {
			cy.get('.col-md-8 > :nth-child(2)').contains(`${Cypress.config().baseUrl}/test-data?_layout=test = pageUrl (view)`);
		});
	});

	describe('Layout contents', () => {
		it('new elements exists', () => {
			cy.get('h1').contains('alternative layout');

			cy.get('p').should('have.length', 6);

			cy.get('p:last').contains('The "data" page = pageTitle (view)');
		});
	});
});
