function xLib(s, c) {
    var tpOf = typeof s, matchs;
    if (tpOf === 'function')
    {
        xUtils.domReady(s);
    }
    else if (tpOf === 'string' || (tpOf === 'object' && s.constructor === String)) {
        matchs = xSelector.query(s, c);
        if (matchs.length === 0) {
            return xCore.bind([], xLib);
        }
        if (typeof matchs.push === 'undefined')
            matchs = xUtils.toArray(matchs);
        return xCore.bind(matchs, xLib);
    }
    else if (tpOf === 'object')
    {
        if (typeof s.getElementsByTagName === 'function')
        {
            return xCore.bind([s], xLib);
        }
        else if (typeof s.push !== 'undefined') {
            //Array
            return xCore.bind(s, xLib)
        } else if (typeof s[0] === 'object' && typeof s[0].getElementsByTagName === 'function') {
            //Array Node List
            return xCore.bind(xUtils.toArray(s), xLib)
        }
        else {
            //Oder maibe a window
            return xCore.bind(arguments.length === 1 ? [s] : xUtils.toArray(arguments), xLib);
        }
    }
    return xCore.bind([], xLib);
}


xCore.bind(xLib, {
    constructor: xLib,
    each:
            xArray.each,
    eachEx:
            function(callback, args, item) {
                var k = 0, len = this.length;
                if (typeof callback === 'function') {
                    if (typeof item === 'number') {
                        callback.apply(this[item], args);
                        return this;
                    }
                    for (k = 0; k < len; k++) {
                        if (typeof this[k] !== 'undefined') {
                            callback.apply(this[k], args);
                        }
                    }
                }
                return this;
            },
    extend:
            function() {
                var args = Array.apply(undefined, arguments);
                args.unshift(xLib);
                xCore.bind.call(undefined, args);
                return args;
            },
    eq:
            function(i, c) {
                if (typeof c === 'number')
                    return xCore.bind(this.slice(i, c), xLib);
                return xLib(this[parseInt(i)]);
            },
    parse: (function() {
        var tmp = document.createElement('div');
        return function(html) {
            tmp.innerHTML = html;
            return xCore.bind(xUtils.toArray(tmp.childNodes), xLib);
        };
    })(),
    hasAttr:
            (typeof document.documentElement.hasAttribute === 'undefined' ? function(a, item) {
                if (typeof item === 'undefined')
                    item = 0;
                return typeof this[item].getAttribute(a) === 'string';
            } : function(a, item) {
                if (typeof item === 'undefined')
                    item = 0;
                return this[item].hasAttribute(a);
            }),
    isChild:
            function(c, item) {
                if (typeof item === 'undefined')
                    item = 0;
                var _this = this[item];
                for (var i = 0; i < _this.childNodes.length; i++) {
                    if (_this.childNodes[i] === c)
                        return true;
                }
                return false;
            },
    $:
            function(s) {
                var i, len = this.length, res = [], r;
                for (i = 0; i < len; i++) {
                    r = xSelector.query(s, this[i]);
                    if (r.length !== 0) {
                        res.push.apply(res, typeof r.push === 'function' ? r : xUtils.toArray(r));
                    }
                }
                return xCore.bind(res, xLib);
            },
	me:Array.prototype.indexOf,
    filter:
            function(s) {
                return xLib(xSelector.querySelectors(s, this));
            },
    children:
            function(s) {
                var i, len = this.length, res = [], r;
                if (isTpOf(s, ['string', 'object'], String)) {
                    for (i = 0; i < len; i++) {
                        r = xSelector.query(s, this[i].children);
                        if (r.length !== 0) {
                            res.push.apply(res, typeof r.push === 'function' ? r : xUtils.toArray(r));
                        }
                    }
                } else {
                    for (i = 0; i < len; i++) {
                        r = this[i].children;
                        if (r.length !== 0) {
                            res.push.apply(res, xUtils.toArray(r));
                        }
                    }
                }
                return xCore.bind(res, xLib);
            },
    position:
            function(item) {
                if (typeof item === 'undefined')
                    item = 0;
                var _this = this[item], left = 0, top = 0, doc = document;
                while (_this) {
                    left += _this.offsetLeft;
                    top += _this.offsetTop;
                    _this = _this.offsetParent;
                }
                if (browser.safari && typeof doc.body.leftMargin !== "undefined") {
                    left += doc.body.leftMargin;
                    top += doc.body.topMargin;
                }

                return {
                    x: left,
                    y: top
                }
            },
    left: function(value, item) {
        if (typeof value === 'undefined') {
            if (typeof item !== 'number')
                item = 0;
            var _this = this[item], left = 0, doc = document;
            while (_this) {
                left += _this.offsetLeft;
                _this = _this.offsetParent;
            }
            if (browser.safari && typeof doc.body.leftMargin !== "undefined") {
                left += doc.body.leftMargin;
            }
            return left;
        }
        return this.css('left', value, item);
    },
    top: function(value, item) {
        if (typeof value === 'undefined') {
            if (typeof item !== 'number')
                item = 0;
            var _this = this[item], top = 0, doc = document;
            while (_this) {
                top += _this.offsetTop;
                _this = _this.offsetParent;
            }
            if (browser.safari && typeof doc.body.leftMargin !== "undefined") {
                top += doc.body.topMargin;
            }
            return top;
        }
        return this.css('top', value, item);
    },
    add:
            function(s, c) {
                var r = typeof s === 'object' ? (typeof s.push === 'function' ? s : [s]) : xSelector.query(s, c);
                if (r.length !== 0)
                    this.push.apply(this, xUtils.toArray(r));
                return this;
            },
    append:
            function(c, item) {
                if (typeof item === 'undefined')
                    item = 0;
                var _this = this[item], tpof = typeof c;
                if (tpof === 'string') {
                    _this.innerHTML += c;
                    return this;
                } else if (tpof === 'object') {
                    if (typeof c.length === 'number') {
                        for (var s = 0; s < c.length; s++) {
                            _this.appendChild(c[s]);
                        }
                        return this;
                    }
                    _this.appendChild(c);
                }
                return this;
            },
    idx: function(item) {
        if (typeof item === 'undefined')
            item = 0;
        var _this = this[item], a = _this.parentNode.children;
        for (var i = 0; i < a.length; i++) {
            if (_this === a[i])
                return i;
        }
        return -1;
    },
    is: function(s, item) {
        if (typeof item === 'undefined')
            item = 0;
        var _this = this[item];
        s = xString(s).replaceAll(' ');
        return xSelector.querySelectors(s, {
            childNodes: [_this]
        })[0] === _this;
    },
    classList: function(item) {
        if (typeof item === 'undefined')
            item = 0;
        return String(this[item].className).split(' ');
    },
    puts: function(target, idx) {
        if (typeof target.getElementsByTagName === 'undefined')
            target = target[0];
        if (typeof idx === 'number') {
            idx++;
            if (idx < target.childNodes.length) {
                for (var i = 0; i < this.length; i++) {
                    target.insertBefore(this[i], target.childNodes[idx]);
                }
                return;
            }
        }
        for (i = 0; i < this.length; i++) {
            target.appendChild(this[i]);
        }
    },
    before:
            function(o) {
                if (isTpOf(o, ['string', 'undefined']))
                    return this.previous(o);
                o = xLib(o);
                return this.puts(o[0].parentNode, o.idx());
            },
    after:
            function(o) {
                if (isTpOf(o, ['string', 'undefined']))
                    return this.next(o);
                o = xLib(o);
                return this.puts(o[0].parentNode, o.idx() + 1);
            },
    siblings: function(s, item) {
        if (typeof item !== 'number')
            item = 0;
        var pc;
        if (isTpOf(s, ['string', 'object'], String)) {
            pc = xSelector.querySelectors('> ' + s, this[item].parentNode);
        } else {
            pc = xUtils.toArray(this[item].parentNode.children);
        }
        for (var i = 0; i < pc.length; i++) {
            if (pc[i] === this[item])
                pc.splice(i, 1);
        }
        return xCore.bind(pc, xLib);
    },
    previous:
            function(s) {
                var _this, len = this.length, i, idx, p;
                p = [];
                for (i = 0; i < len; i++) {
                    _this = this[i];
                    idx = this.idx(i);
                    if (idx === 0)
                        continue;
                    idx--;
                    while (idx !== -1) {
                        p.push(_this.parentNode.children[idx]);
                        idx--;
                    }
                }
                if (typeof s !== 'undefined') {
                    p = xSelector.querySelectors(s, p);
                }
                return xLib(p);
            },
    next:
            function(s) {
                var _this, len = this.length, len2, i, idx, p;
                p = [];
                for (i = 0; i < len; i++) {

                    _this = this[i];

                    idx = this.idx(i);

                    len2 = _this.parentNode.children.length;

                    if (idx >= (len2 - 1))
                        continue;
                    idx++;
                    for (; idx < len2; idx++)
                        p.push(_this.parentNode.children[idx]);
                }
                if (typeof s !== 'undefined') {
                    p = xSelector.querySelectors(s, p);
                }
                return xLib(p);
            },
    parent: function(s) {
        var a = [];
        for (var i = 0; i < this.length; i++) {
            a.push(this[i].parentNode);
        }
        if (typeof s === 'undefined')
            return xLib(a);
        return xLib(s, a);
    },
    parents: function(s) {
        var a = [], sub;

        for (var i = 0; i < this.length; i++) {
            sub = this[i].parentNode;
            while (sub.tagName !== 'BODY') {
                a.push(sub);
                sub = sub.parentNode;
            }
        }
        if (typeof s === 'undefined')
            return xLib(a);
        return xLib(s, a);
    },
    isTag:
            function(t, item) {
                if (typeof item === 'undefined')
                    item = 0;
                return this[item].tagName === t.toUpperCase();
            },
    html:
            function(h, item) {
                if (typeof h === 'undefined') {
                    if (typeof item === 'undefined')
                        item = 0;
                    return this[item].innerHTML;
                }
                for (var i = 0; i < this.length; i++) {
                    this[i].innerHTML = h;
                }
                return this;
            },
    innerWidth:
            function(c, item) {
                if (typeof c === 'undefined') {
                    if (typeof item === 'undefined')
                        item = 0;
                    var r = parseInt(this.css('width', undefined, item));
                    if (isNaN(r))
                        return this[item].clientWidth - (parseInt('0' + this.css('padding-right', undefined, item)) + parseInt('0' + this.css('padding-left', undefined, item)));
                    return r;
                }
                if (typeof c !== 'undefined' && c.constructor === Number)
                    c = c + 'px';
                return this.css('width', c);
            },
    innerHeight:
            function(c, item) {
                if (typeof c === 'undefined') {
                    if (typeof item === 'undefined')
                        item = 0;
                    var r = parseInt(this.css('height', undefined, item));
                    if (isNaN(r))
                        return this[item].clientHeight - (parseInt('0' + this.css('padding-top', undefined, item)) + parseInt('0' + this.css('padding-bottom', undefined, item)));
                    return r;
                }
                if (typeof c !== 'undefined' && c.constructor === Number)
                    c = c + 'px';
                return this.css('height', c);
            },
    clientWidth: function(c, item) {
        if (typeof item === 'undefined')
            item = 0;
        if (typeof c === 'undefined') {
            return this[item].clientWidth;
        }
        c = parseInt('0' + c);
        return this.css('width', c - (parseInt('0' + this.css('padding-right', undefined, item)) + parseInt('0' + this.css('padding-left', undefined, item))) + 'px');
    },
    clientHeight: function(c, item) {
        if (typeof item === 'undefined')
            item = 0;
        if (typeof c === 'undefined') {
            return this[item].clientHeight;
        }
        c = parseInt('0' + c);
        return this.css('height', c - (parseInt('0' + this.css('padding-top', undefined, item)) + parseInt('0' + this.css('padding-bottom', undefined, item))) + 'px');
    },
    removeCss: (function() {
        var removeCss = typeof document.documentElement.style.removeProperty !== 'undefined' ? function(a) {
            if (String(a).indexOf('-') !== -1)
                this.style.removeProperty(a);
            else
                this.style[a] = null;
        } : function(a) {
            var ar, l;
            if (String(a).indexOf('-') !== -1) {
                ar = a.split('-');
                l = ar.length
                a = ar[0];
                for (var s = 1; s < l; s++) {
                    a += ar[s].substr(0, 1).toUpperCase();
                    a += ar[s].substr(1);
                }
            }

            this.style[a] = null;
        };
        return function(a) {
            return this.each(removeCss, a);
        }
    })(),
    set: function(prop, value, item) {
        var i, l = this.length, tp;
        tp = typeof prop;
        if (tp !== 'undefined') {
            if (tp === 'object' && prop.constructor !== String) {
                if (typeof value === 'number')
                    xCore.bind(this[value], prop);
                else
                    for (i = 0; i < l; i++)
                    {
                        xCore.bind(this[i], prop);
                    }
            } else {
                if (typeof value === 'number')
                    this[item][prop] = value;
                else
                    for (i = 0; i < l; i++)
                    {
                        this[i][prop] = value;
                    }
            }
        }
        return this;
    },
    get: function(prop, item) {
        if (this.length === 0)
            return null;
        if (typeof item !== 'number')
            item = 0;
        return this[item][prop];
    },
    removeAttr:
            function(a) {
                this.each(this[0].removeAttribute, a);
                return this;
            },
    css: function() {
        var intPXproperties = xArray(
                'top',
                'left',
                'right',
                'bottom',
                'width',
                'height',
                'margin',
                'margin-left',
                'margin-top',
                'margin-bottom',
                'margin-right',
                'marginLeft',
                'marginTop',
                'marginBottom',
                'marginRight',
                'padding',
                'padding-left',
                'padding-top',
                'padding-bottom',
                'padding-right',
                'paddingLeft',
                'paddingTop',
                'paddingBottom',
                'paddingRight'
                );
        if (document.defaultView && document.defaultView.getComputedStyle)
            return function(o, v, item) {
                var i, vv, l;
                if (typeof o === 'object' && o.constructor === Object) {
                    if (typeof item === 'number')
                        i = item, l = item + 1;
                    else
                        l = this.length, i = 0;
                    for (; i < l; i++) {
                        for (var j in o) {
                            vv = o[j];
                            if (typeof vv === 'function') {
                                vv = vv(this[i], j);
                            }

                            if (typeof vv === 'number' && intPXproperties.search(j) !== -1) {
                                vv = vv + 'px';
                            }
                            if (j.indexOf('-') !== -1)
                                this[i].style.setProperty(j, vv, null);
                            else
                                this[i].style[j] = vv;
                        }
                    }
                    return this;
                }
                if (typeof v !== 'undefined') {
                    if (typeof item === 'number')
                        i = item, l = item + 1;
                    else
                        l = this.length, i = 0;
                    for (; i < l; i++) {
                        if (typeof v === 'function') {
                            v = v(this[i], j);
                        }
                        if (typeof v === 'number' && intPXproperties.search(o) !== -1) {
                            v = v + 'px';
                        }
                        if (o.indexOf('-') !== -1)
                            this[i].style.setProperty(o, v, null);
                        else
                            this[i].style[o] = v;
                    }
                    return this;
                }
                if (typeof item === 'undefined')
                    item = 0;

                return document.defaultView.getComputedStyle(this[item], "")[o] == null ?
                        document.defaultView.getComputedStyle(this[item], "").getPropertyValue(o) :
                        document.defaultView.getComputedStyle(this[item], "")[o];

            }
        return function(o, v, item) {
            var i, s, p, l, l2;
            if (typeof o === 'object') {
                if (typeof item === 'number')
                    i = item, l2 = item + 1;
                else
                    l2 = this.length, i = 0;
                for (; i < l2; i++) {
                    for (var j in o) {
                        p = o[j];
                        if (typeof p === 'function')
                            p = p(this[i], j);

                        if (typeof p === 'number' && intPXproperties.search(j) !== -1) {
                            p = p + 'px';
                        }
                        j = j.split('-');
                        l = j.length
                        for (s = 1; s < l; s++) {
                            j[0] += j[s].substr(0, 1).toUpperCase();
                            j[0] += j[s].substr(1);
                        }
                        this[i].style[j[0]] = p;
                    }

                }
                return this;
            }
            o = o.split('-');
            l = o.length;
            for (s = 1; s < l; s++) {
                o[0] += o[s].substr(0, 1).toUpperCase();
                o[0] += o[s].substr(1);
            }
            if (typeof v !== 'undefined') {
                if (typeof item === 'number')
                    i = item, l = item + 1;
                else
                    l = this.length, i = 0;
                for (; i < l; i++) {
                    p = v;
                    if (typeof v === 'function')
                        p = v(this[i], j);
                    if (typeof p === 'number' && intPXproperties.search(j) !== -1) {
                        p = p + 'px';
                    }
                    this[i].style[o[0]] = p;
                }
                return this;
            }
            if (typeof item === 'undefined')
                item = 0;
            s = typeof this[item].currentStyle === 'object' ? 'currentStyle' : 'style';
            return this[item][s][o];
        }
    }(),
    attr: function(a, v, item) {
        var i;
        if (typeof a === 'object') {
            for (i = 0; i < this.length; i++) {
                for (var j in a)
                    this[i].setAttribute(j, a[j]);
            }
            return this;
        }
        if (typeof v !== 'undefined') {
            for (i = 0; i < this.length; i++) {
                this[i].setAttribute(a, v);
            }
            return this;
        }
        if (typeof item !== 'number')
            item = 0;
        return this[item].getAttribute(a);
    },
    opacity: document.defaultView && document.defaultView.getComputedStyle ? function(a, item) {
        if (typeof a !== 'undefined') {
            this.css("opacity", String(parseFloat(a) / 100));
            return this;
        }
        if (typeof item === 'undefined')
            item = 0;
        var t2 = this.css("opacity", undefined, item);
        return t2 ? Number(parseFloat(t2) * 100) : 100;
    } : function(a, item) {
        if (typeof item === 'undefined')
            item = 0;
        if (typeof a === 'undefined') {
            try {
                return  this[item].filters.alpha.opacity;
            } catch (e) {
                return 100;
            }
        }
        a = parseInt(a);
        this.css('filter', 'alpha(opacity=' + a + ')');
        return this;
    },
    detChild: function(c, item) {
        if (typeof item === 'undefined')
            item = 0;
        var _this = this[item], i, r;
        if (typeof c.push === 'function')
        {
            r = [];
            for (i = 0; i < c.length; i++) {
                r.push(c[i]);
                _this.removeChild(c[i]);
            }
            return xLib(r);
        }
        _this.removeChild(c);
        return xLib(c);
    },
    detach: function() {
        return this.each(function(){
			this.parentNode.removeChild(this);
		});
    },
    isClass:
            function(c, item) {
                if (typeof item === 'undefined')
                    item = 0;
                var _cls = this[item].className.split(' '), i;
                for (i = 0; i < _cls.length; i++) {
                    if (_cls[i] === c)
                        return true;
                }
                return false;
            },
    addClass: function(c) {
        for (var i = 0; i < this.length; i++) {
            if (this.isClass(c, i) === false)
                this[i].className = (this[i].className + ' ' + c).trim();
        }
        return this;
    },
    removeClass: function(c) {
        var ls, i, k, r;
        for (i = 0; i < this.length; i++) {
            ls = this[i].className.split(' ');
            r = '';
            for (k = 0; k < ls.length; k++) {
                if (ls[k] !== c && ls[k] !== '')
                    r += ls[k] + ' ';
            }
            this[i].className = r;
        }
        return this;
    },
    setClass: function(c, s) {
        return s ? this.addClass(c) : this.removeClass(c);
    },
    classReplace:
            function(c, n) {
                var ls, i, k, r;
                for (i = 0; i < this.length; i++) {
                    ls = this[i].className.split(' ');
                    r = '';
                    for (k = 0; k < ls.length; k++) {
                        if (ls[k] === c)
                            r += n + ' ';
                        else if (ls[k] !== '')
                            r += ls[k] + ' ';
                    }
                    this[i].className = r;

                }
                return this;
            },
    toggleClass: function(c) {
        var ls, i, k, r, t;
        for (i = 0; i < this.length; i++) {
            ls = this[i].className.split(' ');
            r = '';
            t = false;
            for (k = 0; k < ls.length; k++) {
                if (ls[k] === c) {
                    t = true;
                }
                else if (ls[k] !== '')
                    r += ls[k] + ' ';
            }
            if (t === false)
                r += c;
            this[i].className = r;
        }
        return this;
    },
    stop: function(item) {
        return this.each(function() {
            xFx.stop(this);
        }, null, item);
        return this;
    },
    animate:
            function(options, over, item) {
                return this.each(function() {
                    xFx.animate($(this), options, over);
                }, null, item);
            },
    fadeIn:
            function(time, callback, transition, over) {
                return  this.animate({
                    opacity: 100,
                    transition: transition,
                    time: time,
                    complete: callback
                }, over);
            },
    fadeOut:
            function(time, callback, transition, over) {
                return  this.animate({
                    opacity: 0,
                    transition: transition,
                    time: time,
                    complete: callback
                }, over);
            },
    fadeTo:
            function(alpha, time, callback, transition, over) {
                return   this.animate({
                    opacity: parseInt(alpha),
                    transition: transition,
                    time: time,
                    complete: callback
                }, over);
            },
    isIn: function(c, b) {
        var i, t, len, p, p2;
        if (typeof c.$ === 'undefined')
            c = xLib(c);
        p = this.position();
        if (typeof b !== 'object')
            b = {
                w: this[0].clientWidth,
                h: this[0].clientHeight
            };
        if (c.length === 1) {
            p2 = c.position();
            return xUtils.inBox(p2.x, p2.y, c[0].clientWidth, c[0].clientHeight, p.x, p.y, b.w, b.h) === true ? c : xLib();
        }
        t = xLib();
        len = c.length;
        for (i = 0; i < len; i++) {
            p2 = c.position(i);
            if (xUtils.inBox(p2.x, p2.y, c[i].clientWidth, c[i].clientHeight, p.x, p.y, b.w, b.h) === true)
                t.push(c[i]);

        }
        return t;
    },
    val: (function() {
        var get_set = function(_this, set) {
            if (_this == null)
                return null;
            if (_this.type.toUpperCase() === 'RADIO') {
                if (typeof set !== 'undefined') {
                    $('input::radio(' + _this.name + '):val(' + set + ')').set('checked', true);
                    return set;
                }
                return  $('input::radio(' + _this.name + '):checked').get('value');
            }
            if (_this.type.toUpperCase() === 'CHECKBOX') {
                if (typeof set !== 'undefined') {
                    _this.checked = (set === _this.value);
                    return _this.value = set;
                }
                return !_this.checked || _this.value;
            }
            if (typeof set !== 'undefined') {
                return _this.value = set;
            }
            return _this.value;
        };
        return function(nv, item) {
            if (typeof nv !== 'undefined') {
                if (typeof item === 'number') {
                    get_set(this[item], nv);
                    return this;
                }
                var i = 0, l = this.length;
                for (i = 0; i < l; i++) {
                    get_set(this[i], nv);
                }
                return this;
            }
            if (typeof item !== 'number')
                item = 0;
            return get_set(this[item]);
        }
    })(),
    delay:
            function(/*time,callback,redId,args...*/) {
                var _this = this, args = Array.apply(undefined, arguments), time = args.shift(), callback = args.shift(), retId = args.shift(), id = window.setTimeout(function() {
                    callback.apply(_this, args);
                }, time);
                return retId ? id : this;
            },
    hide: function(time, effect, callback) {
        try {
            //            fadeOut(time, callback, transition, over)
            if (typeof this[effect] !== 'function')
                effect = 'fadeOut';
            return this[effect](time, function() {
                if (typeof callback === 'function') {
                    callback.call(this.target);
                }
                this.target.attr('last-display', this.target.css('display'));
                this.target.css('display', 'none');
            });

        } catch (e) {
            return false;
        }
    },
    show: function(time, effect, callback) {
        try {
            //            fadeOut(time, callback, transition, over)
            this.css({
                display: (this.attr('last-display') || 'block'),
                visibility: 'visible'
            });
            if (typeof this[effect] !== 'function')
                effect = 'fadeIn';
            return this[effect](time, function() {
                if (typeof callback === 'function') {
                    callback.call(this.target);
                }

            });

        } catch (e) {
            return false;
        }
    },
    Slide: function(w, h, ti, callback, transition, over) {
        var o = {};
        if (typeof w === 'number')
            o.width = w;
        if (typeof h === 'number')
            o.height = h;
        o.complete = callback;
        o.time = ti;
        o.transition = transition;
        return this.animate(o, over);
    },
    SlideDown: function(ti, callback, transition, over) {
        return this.each(function() {
            var _$ = $(this), st = _$.dataset('slide-height');

            if (typeof st === 'number') {
                if (st === _$.innerHeight())
                    _$.css('height', 0);
                return _$.Slide(null, st, ti, callback, transition, over);
            } else {
                var dsp = _$.css('display'), ps, vs;

                if (dsp === 'none') {
                    ps = _$.css('position');
                    vs = _$.css('visibility');
                    _$.css({
                        display: 'block',
                        position: 'absolute',
                        visibility: 'hidden'
                    });
                }
                st = _$.innerHeight();
                if (st === 0) {
                    _$.css('height', 'auto');
                    st = _$.innerHeight();
                }
                _$.dataset({
                    'slide-height': st
                });
                if (dsp === 'none') {
                    _$.css({
                        display: dsp,
                        position: ps,
                        visibility: vs
                    });
                }
                _$.css('height', 0);
                return _$.Slide(null, st, ti, callback, transition, over);
            }
        });
    },
    SlideUp: function(ti, callback, transition, over) {
        return this.each(function() {
            var _$ = $(this), st = _$.dataset('slide-height');
            if (typeof st === 'number') {
                if (0 === _$.innerHeight())
                    _$.css('height', st);
                return _$.Slide(null, 0, ti, callback, transition, over);
            } else {
                var dsp = _$.css('display'), ps, vs;

                if (dsp === 'none') {
                    ps = _$.css('position');
                    vs = _$.css('visibility');
                    _$.css({
                        display: 'block',
                        position: 'absolute',
                        visibility: 'hidden'
                    });
                }
                st = _$.innerHeight();
                if (st === 0) {
                    _$.removeCss('height');
                    st = _$.innerHeight();
                    _$.css('height', 0);
                }
                _$.dataset({
                    'slide-height': st
                });
                if (dsp === 'none') {
                    _$.css({
                        display: dsp,
                        position: ps,
                        visibility: vs
                    });
                }
                if (0 === _$.innerHeight())
                    _$.css('height', st);
                return _$.Slide(null, 0, ti, callback, transition, over);
            }
        });
    }
});
// Bind the $ to xLib
xLib.fn = xLib;
xLib.find = xLib.$;
xLib.$$ = xLib.parse;
$ = xLib;