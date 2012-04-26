var µ = (function(win, doc) {

    function µ(sel) {
        var ret,
            p,

        ret = sel.nodeType ? [sel] : doc.querySelectorAll(sel),

        eachEl = ret.each = function(fn) {
            each(ret, function(item) {
                fn.call(item);
            });
            return ret;
        };


        ret.on = function(type, handler) {
            eachEl(function() {
                on(this, type, handler)
            });
            return ret;
        };


        ret.css = function(o) {
            if (typeof o == 'object') {
                for (p in o) {
                    eachEl(function() {
                        this.style[p] = o[p];
                    });
                }
                return ret;
            }
            return win.getComputedStyle(ret[0]).getPropertyValue(o);
        };


        ret.attr = function(o) {
            if (typeof o == 'object') {
                for (p in o) {
                    eachEl(function() {
                        this.setAttribute(p, o[p]);
                    });
                }
                return ret;
            }
            return ret[0].getAttribute(o);
        };

        return ret;
    };

    var ap = Array.prototype,
        fmt_re = /\{([^}]+)\}/g,
        arg = function(a, i) {
            return ap.slice.call(a,i||0);
        },
        each = function(a, f) {
            ap.forEach.call(a, f);
        },
        fmt = µ.fmt = function(s, vals) {
            if (!(vals instanceof Array || vals instanceof Object))
                vals = arg(arguments, 1);
            return s.replace(fmt_re, function(_, match){ return vals[match]; });
        },
        on = µ.on = function(obj, type, handler) {
            obj.addEventListener(type, function(e) {
                handler.call(e.target, e);
            }, false);
        };

    return µ;
})(window, document);