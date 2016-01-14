'use strict';

var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var os = require('os');
var fs = require('fs-extra');
var ejs = require('ejs');

var configData = {
	options: {
		pre: 'less',
		js: 'JavaScript'
	}
};

describe('nitro:view', function() {
	describe('when creating a view "Test"', function() {
		var prompts = {
			name: 'test',
			title: 'Test Page'
		};

		beforeEach(function(done) {
			helpers.run(path.join(__dirname, '../view'))
				.inDir(path.join(os.tmpdir(), './temp-test'), function(dir) {
					fs.copySync(
						path.join(__dirname, '../app/templates/project'),
						path.join(dir, 'project')
					);
					fs.writeFileSync(
						path.join(dir, 'config.json'),
						ejs.render(fs.readFileSync(path.join(__dirname, '../app/templates/config.json'), 'utf8'), configData)
					);
				})
				.withPrompts(prompts)
				.on('end', done);
		});

		it('the view and data files are created', function() {
			assert.file([
				'views/' + prompts.name + '.html',
				'views/_data/' + prompts.name + '.json'
			]);
		});

		it('its data file contains the correct page title', function() {
			var match = new RegExp('"' + prompts.title + '"');

			assert.fileContent([['views/_data/test.json', match]]);
		});
	});
});
