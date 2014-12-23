describe('Sentinel\'s Handlebars helper loader', function() {
    var hbs = require('hbs');

    beforeEach(function(done) {
        require('../../app/core/hbs')(hbs, done);
    });

    it('has registered the component helper', function(done) {
        expect(hbs.handlebars.helpers.hasOwnProperty('component')).toBe(true);
        done();
    });

    it('component helper is a function', function(done) {
        expect(typeof hbs.handlebars.helpers.component).toBe('function');
        done();
    });
});