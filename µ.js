var µ = (function(win, doc) {

    var call = 'call',
        obj = 'object',
        length = 'length',
        qsa = 'querySelectorAll',
        forEach = 'forEach',
        pn = 'parentNode';

    function mu(sel) {
        var i,
            ret = sel.nodeType ? [sel] : arr(doc[qsa](sel));

        function prop(css_if_true) {
            return function(o) {
                if (typeof o == obj) {
                    for (i in o) {
                        ret[forEach](function(el) {
                            if (css_if_true) {
                                el.style.setProperty(i, o[i]);
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
            };
        }

        extend(ret, {
            on : function(type, handler) {
                ret[forEach](function(el) {
                    on(el, type, handler)
                });
                return ret;
            },
            delegate : function(type, sel, handler) {
                ret[forEach](function(dEl) {
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
            },
            css : prop(1),
            attr : prop()
        });

        return ret;
    };

    var fmt_re = /\{([^}]+)\}/g,
        arr = mu.arr = function(a, i) {
            return Array.prototype.slice[call](a,i||0);
        },
        extend = mu.extend = function(d, s) {
            for (p in s) {
                d[p] = s[p];
            }
        },
        on = mu.on = function(obj, type, handler) {
            obj.addEventListener(type, function(e) {
                handler(e, e.target);
            }, false);
        };

        mu.fmt = function(s, vals) {
            if (!(vals instanceof Array || vals instanceof Object))
                vals = arr(arguments, 1);
            return s.replace(fmt_re, function(_, match){ return vals[match]; });
        };

    return mu;
})(window, document);