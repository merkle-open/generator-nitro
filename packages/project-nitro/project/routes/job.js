const path = require('path');
const fs = require('fs');
const utils = require('./helpers/utils.js');

function search(req, res, next) {
	const data = JSON.parse(fs.readFileSync(path.join(__dirname, './data/jobs.json')));
	let jobs = data.jobs;
	const filters = data.filter;
	const activeFilters = {};
	const messages = data.messages;

	/* set filters */
	const setFilter = (name, value) => {
		if (name === 'query') {
			activeFilters[name] = value;
			filters[name] = value;
		} else if (filters[name].enabled) {
			const items = filters[name].items;
			// items.forEach
			for (const id in items) {
				if (items.hasOwnProperty(id)) {
					const item = items[id];
					if (item.id === value) {
						item.active = true;
						if (value !== 'all') {
							activeFilters[name] = value;
						}
					} else {
						item.active = false;
					}
				}
			}
		}
	};

	// query search
	if (req.query.query) {
		setFilter('query', req.query.query);
	}

	if (req.query.expert) {
		setFilter('expert', req.query.expert);
	}

	if (req.query.location) {
		setFilter('location', req.query.location);
	}

	if (req.query.sort) {
		setFilter('sort', req.query.sort);
	}

	/* calculate results */
	const applyFilter = (filter) => {
		// calculate results
		if (activeFilters[filter]) {
			jobs = jobs.filter((job) => {
				if (filter === 'query') {
					if (job.profile && job.profile.title && job.profile.title.indexOf(activeFilters[filter]) > -1) {
						// mark matched substring in title
						job.profile.title = job.profile.title.replace(
							activeFilters[filter],
							'<mark>' + activeFilters[filter] + '</mark>'
						);
						return true;
					}
				} else if (Array.isArray(job[filter])) {
					if (job[filter] && job[filter].indexOf(activeFilters[filter]) > -1) {
						return true;
					}
				}

				return false;
			});
		}
	};

	for (const name in filters) {
		if (filters.hasOwnProperty(name)) {
			applyFilter(name);

			if (filters[name].items) {
				filters[name].items.forEach((item) => {
					//item.count = utils.getRandomInt(3,55);
					item.count = 55;
				});
			}
		}
	}

	const response = {
		success: true,
		messages: {
			noResults: jobs.length > 0 ? '' : messages.noResults,
		},
		jobs: jobs,
		filter: filters,
	};

	setTimeout(function() {
		return res.json(response);
	}, utils.getRandomInt(250, 2000));
}

module.exports = function(app) {
	app.route('/api/jobs/search').get(search);
};
