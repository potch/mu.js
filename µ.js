var µ = (function(win, doc) {

    var call = 'call',
        obj = 'object',
        length = 'length',
        qsa = 'querySelectorAll',
        pn = 'parentNode';

    function mu(sel) {
        var ret,
            i,

        ret = sel.nodeType ? [sel] : doc[qsa](sel),

        eachEl = ret.each = function(fn) {
            each(ret, function(item) {
                fn(item);
            });
            return ret;
        };


        ret.on = function(type, handler) {
            eachEl(function(el) {
                on(el, type, handler)
            });
            return ret;
        };


        ret.delegate = function(type, sel, handler) {
            eachEl(function(dEl) {
                on(dEl, type, function(e,t) {
                    var matches = dEl[qsa](sel);
                    for (var el = t; el[pn] && el != dEl; el = el[pn]) {
                        for (i=0;i<matches[length];i++) {
                            if (matches[i] == el) {
                                handler[call](el, e);
                                return;
                            }
                        }
                    }
                });
            });
            return ret;
        };

        function prop(css_if_true) {
            return function(o) {
                if (typeof o == obj) {
                    for (i in o) {
                        eachEl(function(el) {
                            if (css_if_true) {
                                el.style[i] = o[i];
                            } else {
                                el.setAttribute(i, o[i]);
                            }
                        });
                    }
                    return ret;
                }
                if (css_if_true) {
                    return win.getComputedStyle(ret[0]).getPropertyValue(o);
                } else {
                    return ret[0].getAttribute(o);
                }
            }
        }

        ret.css = prop(1);
        ret.attr = prop();

        return ret;
    };

    var ap = Array.prototype,
        fmt_re = /\{([^}]+)\}/g,
        arg = mu.arg = function(a, i) {
            return ap.slice[call](a,i||0);
        },
        each = function(a, f) {
            ap.forEach[call](a, f);
        },
        on = mu.on = function(obj, type, handler) {
            obj.addEventListener(type, function(e) {
                handler(e, e.target);
            }, false);
        };

        mu.fmt = function(s, vals) {
            if (!(vals instanceof Array || vals instanceof Object))
                vals = arg(arguments, 1);
            return s.replace(fmt_re, function(_, match){ return vals[match]; });
        };

    return mu;
})(window, document);