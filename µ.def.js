// Simple deferred implementation.
// Usage:
// var def = new mu.def();
// def.onpass(yay).onpass(dance).onfail(boo);
// def.pass('party'); // yay() and dance() are called with 'party'

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['µ'], factory);
    } else {
        // Browser globals
        factory(µ);
    }
}(function(µ) {
(function(mu, len) {
    mu.def = function() {
        var fn = {},
            that = this;
        ['pass','fail'].forEach(function(m) {
            fn[m] = [];
            that['on'+m] = function(f) {
                fn[m].push(f);
                return that;
            };
            that[m] = function(params) {
                if (that.result) return;
                params = mu.arr(arguments);
                fn[m].forEach(function(f) {
                    f.apply(false,params);
                });
                that.result = m;
            };
        });
    };

    mu.when = function() {
        var ret = new mu.def(),
            defs = mu.arr(arguments),
            vals = [],
            a,
            left = defs[len];
        function ph(n) {
            return function(o) {
                a = arguments;
                vals[n] = a[len] > 1 ? mu.arr(a) : o;
                if (--left < 1) {
                    ret.pass.apply(false,vals);
                }
            };
        }
        function fh() {
            ret.fail(arguments);
        }
        setTimeout(function() {
            var i,d;
            for (i=0; i<defs[len]; i++) {
                d = defs[i];
                if (d instanceof mu.def) {
                    d.onpass(ph(i)).onfail(fh);
                } else {
                    ph(i)(d);
                }
            }
        }, 0);
        return ret;
    };

})(µ, 'length');
}));
