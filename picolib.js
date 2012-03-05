var $ = (function(win, doc, undefined) {

    function pico(sel) {
        var ret,
            forEach = Array.prototype.forEach;

        ret = sel.nodeType ? [sel] : doc.querySelectorAll(sel);

        ret.each = (function(fn) {
            forEach.call(this, function(item) {
                fn.call(item);
            });
            return this;
        }).bind(ret);


        ret.on = (function(type, handler) {
            this.each(function() {
                on(this, type, handler)
            });
            return this;
        }).bind(ret);


        ret.css = (function(o) {
            if (typeof o == 'object') {
                for (p in o) {
                    this.each(function() {
                        this.style[p] = o[p];
                    });
                }
                return this;
            }
            return win.getComputedStyle(this[0]).getPropertyValue(o);
        }).bind(ret);


        return ret;
    };

    var on = pico.on = function(el, type, handler) {
        el.addEventListener(type, function(e) {
            handler.call(e.target, e);
        }, false);
    };

    return pico;
})(window, document);
