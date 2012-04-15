        var $ = (function(win, doc, undefined) {

    function pico(sel) {
        var ret,
            p,
            forEach = Array.prototype.forEach;

        ret = sel.nodeType ? [sel] : doc.querySelectorAll(sel);

        ret.each = function(fn) {
            forEach.call(ret, function(item) {
                fn.call(item);
            });
            return ret;
        };

        console.log('foo');

        ret.on = function(type, handler) {
            ret.each(function() {
                on(this, type, handler)
            });
            return ret;
        };


        ret.css = function(o) {
            if (typeof o == 'object') {
                for (p in o) {
                    ret.each(function() {
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
                    ret.each(function() {
                        this.setAttribute(p, o[p]);
                    });
                }
                return ret;
            }
            return ret[0].getAttribute(o);
        };


        return ret;
    };

    var fmt_re = /\{([^}]+)\}/g;
    var fmt = pico.fmt = function() {
        return function(s, args) {
            if (!args) return;
            if (!(args instanceof Array || args instanceof Object))
                args = Array.prototype.slice.call(arguments, 1);
            return s.replace(fmt_re, function(_, match){ return args[match]; });
        };
    };

    var on = pico.on = function(el, type, handler) {
        el.addEventListener(type, function(e) {
            handler.call(e.target, e);
        }, false);
    };


    return pico;
})(window, document);