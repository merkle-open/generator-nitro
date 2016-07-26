var utils = require('./utils');
var Promise = require('es6-promise').Promise;

module.exports = function (gulp, plugins) {
  return function(){
    var assets = utils.getSourcePatterns('js');

    var tsDefinition = {
      typescript: require('typescript'),
      declarationFiles: false,
      removeComments: true,
      target: 'ES5'
    };

    var promises = [];

    assets.forEach(function (asset) {
      var assets = utils.splitJsAssets(asset);

      promises.push(new Promise(function(resolve) {
        gulp.src(assets.ts)
          .pipe(plugins.plumber())
          .pipe(plugins.typescript(tsDefinition))
          .js
          .pipe(plugins.concat(asset.name.replace('.js', '.ts.js')))
          .pipe(gulp.dest('public/assets/js'))
          .on('end', function() {
            resolve();
          });
      }));
    });

    return Promise.all(promises);
  };
};

