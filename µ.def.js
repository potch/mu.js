// Simple deferred implementation.
// Usage:
// var def = new µ.def();
// def.onpass(yay).onpass(dance).onfail(boo);
// def.pass('party'); // yay() and dance() are called with 'party'

µ.def = function() {
    var fn = {},
        that = this;
    ['pass','fail'].forEach(function(m) {
        fn[m] = [];
        that['on'+m] = function(f) {
            fn[m].push(f);
            return that;
        };
        that[m] = function() {
            var params = arg(arguments);
            fn[m].forEach(function(f) {
                f.apply(false,params);
            });
            that.result = m;
        };
    });
};
