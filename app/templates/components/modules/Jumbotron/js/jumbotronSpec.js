'use strict';

describe('jumbotron moudule', function(){

    var bar, foo;

    beforeEach(function(){
        bar = 'huh';
        foo = {
            bang: function(){
                if(!bar){
                    return 'zonk';
                }
                return bar;
            }
        };
    });

    it('should have a working method "bang"', function(){
        expect(foo.bang()).toEqual('huh');
    });

});
