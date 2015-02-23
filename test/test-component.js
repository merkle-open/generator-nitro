'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');
var fs = require('fs-extra');

describe('splendid:component', function () {
    describe('when creating a component "Test" that does not support skins', function () {
        before(function (done) {
            helpers.run(path.join( __dirname, '../component'))
                .inDir(path.join(os.tmpdir(), './temp-test'), function (dir) {
                    fs.copySync(path.join(__dirname, '../app/templates/project'), path.join(dir, 'project'));
                    fs.copySync(path.join(__dirname, '../app/templates/config.json'), path.join(dir, 'config.json'));
                })
                .withPrompts({ name: 'Test', type: 'element' })
                .on('end', done);
        });

        it('the skin files are not created', function () {
            assert.noFile([
                'components/elements/Test/css/skins',
                'components/elements/Test/js/skins'
            ]);
        });

        it('the component files are created', function () {
            assert.file([
                'components/elements/Test',
                'components/elements/Test/test.html',
                'components/elements/Test/css/test.less',
                'components/elements/Test/js/test.js'
            ]);
        });
    });

    describe('when creating a component "Test" that does support skins', function () {
        describe('but no skin is given', function () {
            before(function (done) {
                helpers.run(path.join(__dirname, '../component'))
                    .inDir(path.join(os.tmpdir(), './temp-test'), function (dir) {
                        fs.copySync(path.join(__dirname, '../app/templates/project'), path.join(dir, 'project'));
                        fs.copySync(path.join(__dirname, '../app/templates/config.json'), path.join(dir, 'config.json'));
                    })
                    .withPrompts({name: 'Test', type: 'module'})
                    .on('end', done);
            });

            it('the skin files are not created', function () {
                assert.noFile([
                    'components/elements/Test/css/skins',
                    'components/elements/Test/js/skins'
                ]);
            });

            it('the component files are created', function () {
                assert.file([
                    'components/modules/Test',
                    'components/modules/Test/test.html',
                    'components/modules/Test/css/test.less',
                    'components/modules/Test/js/test.js'
                ]);
            });
        });

        describe('and a skin "More" is given', function () {
            before(function (done) {
                helpers.run(path.join(__dirname, '../component'))
                    .inDir(path.join(os.tmpdir(), './temp-test'), function (dir) {
                        fs.copySync(path.join(__dirname, '../app/templates/project'), path.join(dir, 'project'));
                        fs.copySync(path.join(__dirname, '../app/templates/config.json'), path.join(dir, 'config.json'));
                    })
                    .withPrompts({name: 'Test', type: 'module', skin: 'More'})
                    .on('end', done);
            });

            it('the component and skin files are created', function () {
                assert.file([
                    'components/modules/Test',
                    'components/modules/Test/test.html',
                    'components/modules/Test/test-more.html',
                    'components/modules/Test/css/test.less',
                    'components/modules/Test/css/skins/test-more.less',
                    'components/modules/Test/js/test.js',
                    'components/modules/Test/js/skins/test-more.js'
                ]);
            });

            it('the component css class is mod-test', function () {
                assert.fileContent([['components/modules/Test/css/test.less', /\.mod-test \{/]])
            });

            it('the skin css class is skin-test-more', function () {
                assert.fileContent([['components/modules/Test/css/skins/test-more.less', /\.skin-test-more \{/]])
            });

            it('the component js class is Tc.Module.Test', function () {
                assert.fileContent([['components/modules/Test/js/test.js', /Tc\.Module\.Test = Tc\.Module\.extend\(\{/]])
            });

            it('the skin js class is Tc.Module.Test.More', function () {
                assert.fileContent([['components/modules/Test/js/skins/test-more.js', /Tc\.Module\.Test\.More = function\(parent\) \{/]])
            });
        });
    });

    describe('when creating a component "NavMain" with a skin "SpecialCase"', function () {
        before(function (done) {
            helpers.run(path.join(__dirname, '../component'))
                .inDir(path.join(os.tmpdir(), './temp-test'), function (dir) {
                    fs.copySync(path.join(__dirname, '../app/templates/project'), path.join(dir, 'project'));
                    fs.copySync(path.join(__dirname, '../app/templates/config.json'), path.join(dir, 'config.json'));
                })
                .withPrompts({name: 'NavMain', type: 'module', skin: 'SpecialCase'})
                .on('end', done);
        });

        it('the component and skin files are created', function () {
            assert.file([
                'components/modules/NavMain',
                'components/modules/NavMain/navmain.html',
                'components/modules/NavMain/navmain-specialcase.html',
                'components/modules/NavMain/css/navmain.less',
                'components/modules/NavMain/css/skins/navmain-specialcase.less',
                'components/modules/NavMain/js/navmain.js',
                'components/modules/NavMain/js/skins/navmain-specialcase.js'
            ]);
        });

        it('the component css class is mod-nav-main', function () {
            assert.fileContent([['components/modules/NavMain/css/navmain.less', /\.mod-nav-main \{/]])
        });

        it('the skin css class is skin-nav-main-special-case', function () {
            assert.fileContent([['components/modules/NavMain/css/skins/navmain-specialcase.less', /\.skin-nav-main-special-case \{/]])
        });

        it('the component js class is Tc.Module.NavMain', function () {
            assert.fileContent([['components/modules/NavMain/js/navmain.js', /Tc\.Module\.NavMain = Tc\.Module\.extend\(\{/]])
        });

        it('the skin js class is Tc.Module.NavMain.SpecialCase', function () {
            assert.fileContent([['components/modules/NavMain/js/skins/navmain-specialcase.js', /Tc\.Module\.NavMain\.SpecialCase = function\(parent\) \{/]])
        });
    });

    describe('when creating a component "nav-main" with a skin "special-case"', function () {
        before(function (done) {
            helpers.run(path.join(__dirname, '../component'))
                .inDir(path.join(os.tmpdir(), './temp-test'), function (dir) {
                    fs.copySync(path.join(__dirname, '../app/templates/project'), path.join(dir, 'project'));
                    fs.copySync(path.join(__dirname, '../app/templates/config.json'), path.join(dir, 'config.json'));
                })
                .withPrompts({name: 'nav-main', type: 'module', skin: 'special-case'})
                .on('end', done);
        });

        it('the component and skin files are created', function () {
            assert.file([
                'components/modules/nav-main',
                'components/modules/nav-main/navmain.html',
                'components/modules/nav-main/navmain-specialcase.html',
                'components/modules/nav-main/css/navmain.less',
                'components/modules/nav-main/css/skins/navmain-specialcase.less',
                'components/modules/nav-main/js/navmain.js',
                'components/modules/nav-main/js/skins/navmain-specialcase.js'
            ]);
        });

        it('the component css class is mod-nav-main', function () {
            assert.fileContent([['components/modules/nav-main/css/navmain.less', /\.mod-nav-main \{/]])
        });

        it('the skin css class is skin-nav-main-special-case', function () {
            assert.fileContent([['components/modules/nav-main/css/skins/navmain-specialcase.less', /\.skin-nav-main-special-case \{/]])
        });

        it('the component js class is Tc.Module.NavMain', function () {
            assert.fileContent([['components/modules/nav-main/js/navmain.js', /Tc\.Module\.NavMain = Tc\.Module\.extend\(\{/]])
        });

        it('the skin js class is Tc.Module.NavMain.SpecialCase', function () {
            assert.fileContent([['components/modules/nav-main/js/skins/navmain-specialcase.js', /Tc\.Module\.NavMain\.SpecialCase = function\(parent\) \{/]])
        });
    });
});

