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
            var params = µ.arr(arguments);
            fn[m].forEach(function(f) {
                f.apply(false,params);
            });
            that.result = m;
        };
    });
};

µ.when = function() {
    var ret = new µ.def(),
        defs = µ.arr(arguments),
        vals = [],
        left = defs.length;
    function ph(n) {
        return function(o) {
            if (arguments.length > 1) {
                vals[n] = µ.arr(arguments);
            } else {
                vals[n] = o;
            }
            if (--left < 1) {
                ret.pass(vals);
            }
        };
    }
    function fh() {
        ret.fail(arguments);
    }
    setTimeout(function() {
        for (var i=0; i<defs.length; i++) {
            var d = defs[i];
            if (d instanceof µ.def) {
                d.onpass(ph(i)).onfail(fh);
            } else {
                ph(i)(d);
            }
        }
    }, 0);
    return ret;
}
