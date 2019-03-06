/// <reference types="cypress" />

// test test-page view with test content
context('Test Page Tests in default language', () => {
	beforeEach(() => {
		cy.visit('/test-page');
	});

	describe('HTML Head', () => {
		it('title includes index page', () => {
			cy.title().should('eq', 'pageTitle (view)');
		});
	});

	describe('Content', () => {
		it('translations contains', () => {
			cy.get('.t-t > :nth-child(2) > :nth-child(1)')
				.contains('app.company.name');

			cy.get('.t-t > :nth-child(2) > :nth-child(2)')
				.contains('All that glitters is not gold.');

			cy.get('.t-t > :nth-child(2) > :nth-child(3)')
				.contains('The first three letters of alphabet are: a, l and p');

			cy.get('.t-t > :nth-child(2) > :nth-child(4)')
				.contains('Hello');

			cy.get('.t-t > :nth-child(2) > :nth-child(5)')
				.contains('test.example.interpolation1');
		});
	});
});

context('Test Page Tests in german (with language query)', () => {
	beforeEach(() => {
		cy.visit('/test-page?lang=de');
	});

	describe('HTML Head', () => {
		it('title includes index page', () => {
			cy.title().should('eq', 'pageTitle (view)');
		});
	});

	describe('Content', () => {
		it('translations contains', () => {
			cy.get('.t-t > :nth-child(2) > :nth-child(1)')
				.contains('Meine "first" Firma');

			cy.get('.t-t > :nth-child(2) > :nth-child(2)')
				.contains('Nicht alles was glänzt ist Gold');

			cy.get('.t-t > :nth-child(2) > :nth-child(3)')
				.contains('Die ersten drei Buchstaben von alphabet sind: a, l und p');

			cy.get('.t-t > :nth-child(2) > :nth-child(4)')
				.contains('Hallo developer & developer');

			cy.get('.t-t > :nth-child(2) > :nth-child(5)')
				.contains('Die letzten zwei Buchstaben von alphabet sind: t und e');
		});
	});
});


context('Test Page Tests in english (with language query)', () => {
	beforeEach(() => {
		cy.visit('/test-page?lang=en');
	});

	describe('HTML Head', () => {
		it('title includes index page', () => {
			cy.title().should('eq', 'pageTitle (view)');
		});
	});

	describe('Content', () => {
		it('translations contains', () => {
			cy.get('.t-t > :nth-child(2) > :nth-child(1)')
				.contains('my "first" company');
			cy.get('.t-t > :nth-child(2) > :nth-child(2)')
				.contains('All that glitters is not gold.');
			cy.get('.t-t > :nth-child(2) > :nth-child(3)')
				.contains('The first three letters of alphabet are: a, l and p');
			cy.get('.t-t > :nth-child(2) > :nth-child(4)')
				.contains('Hello developer & developer');
			cy.get('.t-t > :nth-child(2) > :nth-child(5)')
				.contains('The last two letters of alphabet are: t and e');
		});
	});
});
