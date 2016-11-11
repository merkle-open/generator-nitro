module.exports = {
	each(exporter, callback) {
		if (exporter.length) {
			exporter.forEach((config) => {
				callback(config);
			});
		} else {
			callback(exporter);
		}
	}
};
