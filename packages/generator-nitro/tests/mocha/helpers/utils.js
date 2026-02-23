const crypto = require('crypto');
const os = require('os');
const path = require('path');

// to avoid mixing up properties with global '.yo-rc-global.json',  we have to pass in all prompt options for test cases
// (see bug: https://github.com/yeoman/yeoman-test/issues/45)
const defaultPrompts = {
	templateEngine: 'hbs',
	jsCompiler: 'ts',
	themes: false,
	clientTpl: false,
	exampleCode: false,
	exporter: false,
};

const getRandomString = (length = 20) => {
	return crypto.randomBytes(length).toString('hex').substring(0, length);
};

function getTempFolder(base, randomize = true) {
	const folder = randomize ? `${base}-${getRandomString(3)}` : base;
	return path.join(os.tmpdir(), `nitro/${folder}`)
}

module.exports = {
	defaultPrompts,
	getTempFolder,
};
