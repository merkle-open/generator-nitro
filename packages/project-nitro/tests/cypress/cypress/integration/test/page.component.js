/// <reference types="cypress" />

// test test-component view with test content
context('Test Components', () => {
	beforeEach(() => {
		cy.visit('/test-component');
	});

	describe('HTML Head', () => {
		it('title includes pageTitle', () => {
			cy.title().should('eq', 'test-component');
		});
	});

	describe('Pattern Ex', () => {
		it('pattern 1 contains correct title', () => {
			cy.get(':nth-child(2) > .t-ex__headline').contains('Ex Module (data: ex.json)');
		});
		it('pattern 2 contains correct title', () => {
			cy.get(':nth-child(3) > .t-ex__headline').contains('Ex Module with Skin Blue (data: ex-blue.json)');
		});
		it('pattern 2 contains correct title', () => {
			cy.get(':nth-child(4) > .t-ex__headline').contains('Ex Module (data: ex.json)');
		});
	});

	describe('Pattern Ex Variants', () => {
		it('pattern 1 contains correct title', () => {
			cy.get(':nth-child(6) > .t-ex__headline').contains('Ex Module with Skin Blue (data: ex-blue.json)');
		});
		it('pattern 2 contains correct title and content', () => {
			cy.get(':nth-child(7) > .t-ex__headline').contains('2. Template - Ex Module (data: ex.json)');
			cy.get(':nth-child(7) > ul > li').should('have.length', 5);
		});
		it('pattern 4 contains correct title and content', () => {
			cy.get(':nth-child(9) > .t-ex__headline').contains('Ex Module (data: ex.json)');
			cy.get(':nth-child(7) > ul > li').should('have.length', 5);
		});
	});

	describe('Pattern Element', () => {
		it('pattern 1 contains correct content', () => {
			cy.get('.t-subelement').contains('The content of the subelement');
		});
	});

	describe('Pattern Failures', () => {
		it('pattern 1 gives correct error message', () => {
			cy.get('.col-md-8 > :nth-child(15)').contains(
				'Pattern `Ex` with template file `XXX.hbs` not found in folder `Ex`.'
			);
		});
		it('pattern 2 gives correct error message', () => {
			cy.get('.col-md-8 > :nth-child(16)').contains(
				'Pattern `Ex` with template file `other-ex.hbs` not found in folder `Ex`.'
			);
		});
		it('pattern 3 gives correct error message', () => {
			cy.get('.col-md-8 > :nth-child(17)').contains(
				'Pattern `Ex` within pattern type `atom` with template file `ex.hbs` not found in folder `Ex`'
			);
		});
		it('pattern 5 gives correct error message', () => {
			cy.get('.col-md-8 > :nth-child(19)').contains(
				'Pattern `btn` with template file `btn.hbs` not found in folder `btn`.'
			);
		});
	});
});
