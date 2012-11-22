(function($) {

    var getId = function(el) {
        var i, br = el.parentNode.getElementsByTagName('LI');
        for (i = 0; i < br.length; i++) {
            if (br[i] === el)
                return i;
        }
        return -1;
    }, methods = {
    init:function() {
        this.each(function() {
            var t = $(this);
            if (!t.dataset('pTab')) {
                $('ul.pTabTitleBar', this).click(function(ev) {
                    ev = xEvent(ev);
                    var id;
                    if (ev.target.tagName === 'A') {
                        id = getId(ev.target.parentNode);
                        t.pTabs('open', id);
                        ev.preventDefault();
                    }
                });
                t.dataset('pTab', true);
            }

        });
    },
            open:function(idx) {
        if (typeof idx === 'number') {
            return this.each(function() {
                var t = $(this), tL, _t, a;

                _t = t.children('ul.pTabTitleBar > li').removeClass('active').eq(idx).addClass('active');

                t.children('div').removeClass('active');

                tL = t.children('div').eq(idx).addClass('active');

                if ((a = _t.dataset('tab'))) {
                    xJax({
                        url: a,
                        success: function(html) {
                            if (t.fireEvent('tabopen', {target: tL}, 0, true) !== false) {
                                tL[0].innerHTML = html;
                            }
                        }
                    });
                } else {
                    t.fireEvent('tabopem', {target: tL}, 0, true);
                }
            });
        }
        return this;
    }
    };

    $.pTabs = function() {
        if (arguments.length === 0 || (typeof arguments[0] === 'object' && arguments[0].constructor === Object)) {
            return methods.init.call(this, arguments[0]);
        }
        var args = xUtils.toArray(arguments);
        var m = args.shift();
        if (typeof methods[m] === 'function') {
            return methods[m].apply(this, args);
        }
        throw 'Method not implemented!';
    }
})(xLib);
