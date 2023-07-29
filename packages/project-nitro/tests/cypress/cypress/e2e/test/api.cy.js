/// <reference types="cypress" />

// test api content
context('Test Countries API', () => {
	const apiUrl = 'api/countries/search';

	describe('Headers', () => {
		it('has application/json headers', () => {
			cy.request(apiUrl).its('headers').its('content-type').should('include', 'application/json');
		});
	});

	describe('Empty Content', () => {
		it('loads zero items', () => {
			cy.request('GET', apiUrl).its('body').should('have.length', 0);

			cy.request('GET', apiUrl).then((response) => {
				expect(response.status).to.eq(200);
				expect(response.body).to.have.length(0);
				expect(response.body).to.be.empty;
			});
		});
	});

	describe('With Search Query', () => {
		const getCountries = (query) => {
			return cy.request({
				method: 'GET',
				url: apiUrl,
				qs: { query },
			});
		};

		it('loads items with query "vi"', () => {
			getCountries('vi').then((response) => {
				expect(response.status).to.eq(200);
				expect(response.body).to.have.length(10);
				expect(response.body[0]).to.have.property('name', 'Bolivia');
			});
		});

		it('loads items with query "ala"', () => {
			getCountries('ala').then((response) => {
				expect(response.status).to.eq(200);
				expect(response.body).to.have.length(6);
				expect(response.body[1]).to.have.property('name', 'Guatemala');
			});
		});

		it('loads items with query "alabama"', () => {
			getCountries('alabama').then((response) => {
				expect(response.status).to.eq(200);
				expect(response.body).to.have.length(0);
			});
		});
	});
});

context('Test Jobs API', () => {
	const apiUrl = 'api/jobs/search';

	describe('Headers', () => {
		it('has application/json headers', () => {
			cy.request(apiUrl).its('headers').its('content-type').should('include', 'application/json');
		});
	});

	describe('Default Content', () => {
		it('loads job items', () => {
			cy.request('GET', apiUrl).its('body').should('have.property', 'success');

			cy.request('GET', apiUrl).then((response) => {
				expect(response.status).to.eq(200);
				expect(response.body).to.have.property('success', true);
				expect(response.body).to.have.property('jobs');
				expect(response.body.jobs).to.have.length(15);
			});
		});
	});

	describe('With Search Query', () => {
		const getJobs = (query) => {
			return cy.request({
				method: 'GET',
				url: apiUrl,
				qs: { query },
			});
		};

		it('loads items with query "Aus"', () => {
			getJobs('Aus').then((response) => {
				expect(response.status).to.eq(200);
				expect(response.body.jobs).to.have.length(1);
				expect(response.body.jobs[0]).to.have.property('profile');
				expect(response.body.jobs[0].profile).to.have.property(
					'title',
					'<mark>Aus</mark>bildung als Versicherungsassistent/in VBV',
				);
			});
		});
	});
});
