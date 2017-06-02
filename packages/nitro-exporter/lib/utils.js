module.exports = {
	each(exporter, cb) {
		if (exporter.length) {
			exporter.forEach((config) => {
				cb(config);
			});
		} else {
			cb(exporter);
		}
	},
};
