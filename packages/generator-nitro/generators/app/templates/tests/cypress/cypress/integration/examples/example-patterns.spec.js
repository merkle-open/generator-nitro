/// <reference types="cypress" />

const port = process.env.PORT || 8888;

// test example-patterns page
context('Example Patterns Page Examples', () => {
	beforeEach(() => {
		cy.visit(`http://localhost:${port}/example-patterns`);
	});

	describe('Querying and Traversing', () => {
		it('has DOM element with content "Example Module"', () => {
			cy.get('.m-example:first').should('contain', 'Example Module');
		});

		it('has a Checkbox pattern inside the pattern "box"', () => {
			cy.get('.a-checkbox')
				.closest('.a-box')
				.should('have.length', 1);
		});
	});

	describe('Form Elements', () => {
		it('clicking on label checks checkbox', () => {
			cy.get('.a-checkbox__input').as('checkbox');

			cy.get('@checkbox').should('not.be.checked');
			cy.get('.a-checkbox__label').click();
			cy.get('@checkbox').should('be.checked');
		});

		it('has a working datepicker', () => {
			cy.get('.flatpickr-calendar').as('calendar');
			cy.get('.a-datepicker__input').as('datepicker');

			cy.get('@datepicker').should('have.length', 2);
			cy.get('@datepicker')
				.first()
				.should('have.value', '01.01.2020');
			cy.get('@datepicker')
				.last()
				.should('have.value', 'January 1, 2020');
			cy.get('@calendar').should('not.be.visible');
			cy.get('@datepicker')
				.last()
				.click();
			cy.get('@calendar').should('be.visible');

			cy.get('[aria-label="January 1, 2020"]').should('have.class', 'selected');
			cy.get('[aria-label="January 3, 2020"]').click();
			cy.get('@datepicker')
				.first()
				.should('have.value', '03.01.2020');
			cy.get('@datepicker')
				.last()
				.should('have.value', 'January 3, 2020');
			cy.get('@calendar').should('not.be.visible');
		});
	});
});
