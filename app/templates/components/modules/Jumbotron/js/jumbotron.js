(function($) {

    var bar = 'huh';

    var foo = {
        bang: function() {
            if (!!bar) {
                console.log('bang');
            } else {
                console.warn('BANG!');
            }
        }
    };

    foo.bang();
})(jQuery);