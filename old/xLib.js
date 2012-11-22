String.prototype.endsWith = function(o) {
    return this.slice(this.length - o.length) === o;
};
String.prototype.startsWith=function(o){
    return this.slice(0,o.length)===o;
};
var iextend = function() {
    var args = arguments;
    if (args.length === 1)
        args = [ this, args[0] ];
    for ( var prop in args[1])
        args[0][prop] = args[1][prop];
    return args[0];
};

var addEvent = function() {
    if (window.addEventListener) {
        return function(e, o, f) {
            o.addEventListener(e, f, true);
        };

    }
    if (document.attachEvent) {
        return function(e, o, f) {
            o.attachEvent("on" + e, function(ev) {
                ev = typeof ev === 'undefined' ? window.event : ev;
                ev.target = ev.srcElement;
                ev.currentTarget = ev.toElement;
                return f.call(o, ev);
            });
        };

    }
    return function(e, o, f) {
        o["on" + e] = f;
    };

}();

var createEvent = function() {
    if (document.createEventObject) {
        return function(evType) {
            return document.createEventObject();
        };
    } else if (document.createEvent) {
        return function(evType) {
            return document.createEvent(evType);
        };
    }
    return false;

}();

var SendEvent = function() {
    if (document.createEventObject) {
        return function(ev, evType, obj) {
            return obj.fireEvent('on' + evType, ev);
        };
    } else if (document.createEvent) {
        return function(ev, evType, obj) {
            ev.initEvent(evType, true, true);
            return obj.dispatchEvent(ev);
        };

    }
    return false;
}();

window.Cookies = {
    set : function(n, v, h) {
        if (h) {
            var d = new Date();
            d.setTime(d.getTime() + (h * 60 * 60 * 1000));
            var e = "; expires=" + d.toGMTString();
        } else
            e = "";
        document.cookie = n + "=" + v + e + "; path=/";
    },
    get : function(n) {
        var nE = n + "=";
        var q = document.cookie.split(';');
        for ( var i = 0; i < q.length; i++) {
            var c = q[i];
            while (c.charAt(0) === ' ')
                c = c.substring(1, c.length);
            if (c.indexOf(nE) === 0)
                return c.substring(nE.length, c.length);
        }
        return null;
    },
    unset : function(n) {
        this.set(n, "", -1);
    }
};
var u = navigator.userAgent.toLowerCase();
browser = {
    version : (u.match(/.+(?:rv|it|ra|ie)[\/:]([\d.]+)/) || [])[1],
    safari : /webkit/.test(u),
    opera : /opera/.test(u),
    msie : /msie/.test(u) && !/opera/.test(u),
    mozilla : /mozilla/.test(u) && !/(compatible|webkit)/.test(u),
    refresh : function() {
        window.location.reload(true);
    },
    hash : function() {
        var parans = [];
        var h;
        var p = window.location.hash.slice(1).split('&');
        for ( var i = 0; i < p.length; i++) {
            h = window.unescape(p[i]).split('=');
            parans[h[0]] = typeof h[1] === 'undefined' ? '' : h[1];
        }
        return parans;
    }
};
GET = [];
var l = window.location.href;
l = l.slice(0, l.indexOf('#') + 1);
var s = l.slice(l.indexOf('?') + 1).split('&');
for ( var i = 0; i < s.length; i++) {
    h = window.unescape(s[i]).split('=');
    GET[h[0]] = typeof h[1] === 'undefined' ? '' : h[1];
}
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(obj, start) {
        var len = this.length;
        for ( var i = (start || 0); i < len; i++) {
            if (this[i] == obj)
                return i;
        }
        return -1;
    };
}
window.xSelector={
    id_rgx : /^\#([\w\-]{1,})/i,
    id_only_rgx : /^\#([\w\-]{1,})$/i,
    class_rgx : /^\.([\w\-]{1,})/i,
    tag_rgx : /^([\w\-]{1,})/i,
    tag_only_rgx : /^([a-z]{1}[\w\-]{1,})$/i,
    attr_rgx : /^\[([\w\-]{1,})(\!\=|\!\=\=|\!\?|\!|\=\=|\<\=|\>\=|\*\=|\^\=|\$\=|\~\=|\|\=|\=|\>|\<|\?)[\"\']{0,1}([^\]\"\']*)[\"\']{0,1}\]/i,
    pseu_rgx : /^\:([\w\:]{1}[\w\-]{1,})(?:\(([^\)]{1,})*\))*/i,
    getChildsBytag : function(c, t) {
        if (t === '*')
            return c.childNodes;
        var s = [];
        for ( var i = 0; i < c.childNodes.length; i++) {
            if (c.childNodes[i].tagName === t.toUpperCase())
                s.push(c.childNodes[i]);
        }
        return s;
    },
    toNumber : function(v) {
        var n = /([0-9-]{1,})/;
        return n.test(v) ? new Number(n.exec(v)[1]) : 0;
    },
    plugins : {
        'first-child':function(){
            if(this.parentNode.firstChild===this){
                return true;
            }
            return false;
        },
        'eq':function(idx,p){
            if(String(idx)===p)return true;
            return false;
        },
        'last-child':function(){
            if(this.parentNode.lastChild===this){
                return true;
            }
            return false;
        }
    }
    ,
    querySelectors: function(s,p) {
        s = s.split(',');
        var cs;
        var o = [];
        var matchs = null;
        var temp;
        var t;
        var put;
        var attr;
        var ch;
        var te;
        var tt;
        if(typeof p === 'undefined')
            p=document;
        for ( var i = 0; i < s.length; i++) {
            cs = s[i].split(' ');
            for ( var j = 0; j < cs.length; j++) {
                ch = (cs[j] === ">");
                if (ch)
                    j++;
                t = xSelector.tag_rgx.test(cs[j]) ? xSelector.tag_rgx.exec(cs[j])[1] : '*';
                cs[j] = cs[j].replace(xSelector.tag_rgx, '');
                attr = [];
                if (matchs === null) {
                    matchs = ch ? (t === '*' ? p.childNodes : xSelector.getChildsBytag(p, t)) : p.getElementsByTagName(t);
                } else {
                    temp = [];
                    for ( var n = 0; n < matchs.length; n++) {
                        te = ch ? (t === '*' ? matchs[n].childNodes : S
                            .getChildsBytag(matchs[n], t)) : matchs[n]
                        .getElementsByTagName(t);
                        for ( var h = 0; h < te.length; h++) {
                            temp.push(te[h]);
                        }
                    }
                    matchs = temp;
                    temp = null;
                }
				
				
                while(cs[j]!==tt){
                    if(tt!==cs[j])tt=cs[j];
                    if (xSelector.id_rgx.test(cs[j])) {
                        attr.push([ '#', xSelector.id_rgx.exec(cs[j])[1]]);
                        cs[j] = cs[j].replace(xSelector.id_rgx, '');
                    }
				
                    if (xSelector.class_rgx.test(cs[j])) {
                        te=xSelector.class_rgx.exec(cs[j]);
                        attr.push([ '.',te[1]]);
                        cs[j] = cs[j].replace(te[0], '');
                    }
				
                    if (xSelector.pseu_rgx.test(cs[j])) {
                        te=xSelector.pseu_rgx.exec(cs[j])
                        attr.push([':',te]);
                        cs[j] = cs[j].replace(te[0], '');
                    }
				
                    while (xSelector.attr_rgx.test(cs[j])) {
                        te=xSelector.attr_rgx.exec(cs[j]);
                        attr.push([te[2],te[1],te[3]]);
                        cs[j] = cs[j].replace(te[0], '');
                    }
				
                }
                
                temp = [];
                    MATCHS:for ( var x = 0; x < matchs.length; x++) {
                        put = true;
                            VER: for ( var v=0;v < attr.length;v++) {
                                switch (attr[v][0]) {
                                    case '#':
                                        if (matchs[x].getAttribute('id') !== attr[v][1]) {
                                            put = false;
                                            break VER;
                                        }
                                        break;
                                    case '.':
                                        te=String(matchs[x].className).split(' ');
                                        for(var vi=0; vi < te.length;vi++){
                                            if(te[vi]===attr[v][1])continue VER;
                                        }
                                        put = false;
                                        break VER;
                                    case ':':
                                        if (typeof this.plugins[attr[v][1][1]]!=='function') {
                                            put = false;
                                            break VER;
                                        }
                                        if(!this.plugins[attr[v][1][1]].call(matchs[x],x,attr[v][1][2])){
                                            put = false;
                                            break VER;
                                        }
                                        break;
                                    case '!==':
                                        if (String(matchs[x].getAttribute(attr[v][1])).toLowerCase()===String(attr[v][2]).toLowerCase()) {
                                            put = false;
                                            break VER;
                                        }
                                        break;
                                    case '==':
                                        if (String(matchs[x].getAttribute(attr[v][1])).toLowerCase()!==String(attr[v][2]).toLowerCase()) {
                                            put = false;
                                            break VER;
                                        }
                                        break;
                                    case '$=':
                                        if (String(matchs[x].getAttribute(attr[v][1])).endsWith(attr[v][2])===false) {
                                            put = false;
                                            break VER;
                                        }
                                        break;
                                    case '^=':
                                        if (String(matchs[x].getAttribute(attr[v][1])).startsWith(attr[v][2])===false) {
                                            put = false;
                                            break VER;
                                        }
                                        break;
                                    case '!=':
                                        if (matchs[x].getAttribute(attr[v][1])===attr[v][2]) {
                                            put = false;
                                            break VER;
                                        }
                                        break;
                                    case '=':
                                        if (matchs[x].getAttribute(attr[v][1])!==attr[v][2]) {
                                            put = false;
                                            break VER;
                                        }
                                        break;
                                    case '<':
                                        if (xSelector.toNumber(matchs[x].getAttribute(attr[v][1])) >= xSelector.toNumber(attr[v][3])) {
                                            put = false;
                                            break VER;
                                        }
                                        break;
                                    case '>':
                                        if (xSelector.toNumber(matchs[x].getAttribute(attr[v][1])) <= xSelector.toNumber(attr[v][3])) {
                                            put = false;
                                            break VER;
                                        }
                                        break;
                                    case '<=':
                                        if (xSelector.toNumber(matchs[x].getAttribute(attr[v][1])) > xSelector.toNumber(attr[v][3])) {
                                            put = false;
                                            break VER;
                                        }
                                        break;
                                    case '>=':
                                        if (xSelector.toNumber(matchs[x].getAttribute(attr[v][1])) < xSelector.toNumber(attr[v][3])) {
                                            put = false;
                                            break VER;
                                        }
                                        break;
                                    case '*=':
                                        if (String(matchs[x].getAttribute(attr[v][1])).indexOf(attr[v][2]) === -1) {
                                            put = false;
                                            break VER;
                                        }
                                        break;
                                    case '?':
                                        if (String(matchs[x].getAttribute(attr[v][1])).toLowerCase().indexOf(String(attr[v][2]).toLowerCase())===-1) {
                                            put = false;
                                            break VER;
                                        }
                                        break;
                                    case '!':
                                        if(matchs[x].getAttribute(attr[v][1])){
                                            put=false;
                                            break VER;
                                        }
                                        break;
                                    default:
                                        if(!matchs[x].getAttribute(attr[v][1])){
                                            put=false;
                                            break VER;
                                        }
                                }
                            }
                        if (put==true)
                            temp.push(matchs[x]);
                    }
                matchs = temp;
            }
            o = matchs.length > 0 ? o.concat(matchs) : o;
            matchs = null;
        }
        for ( var iv = 0; iv < o.length; iv++) {
            if (typeof o[iv] === 'undefined') {
                o.splice(iv, 1);
                iv--;
            }
        }
        return o;
    }
};

xSelector =iextend(XSelector,{
    _querySelectors:(function(){
        if(document.querySelectorAll){
            return function(s,p){
                try{
                    return p.querySelectorAll(s);
                }catch(e){
                    return this.querySelectors(s,p);
                }
            };
        }
        return xSelector.querySelectors;
    })()
    ,
    query : function(s, p) {
        if(typeof p==='undefined'){
            p=document;
        }
        if (this.tag_only_rgx.test(s)) {
            return p.getElementsByTagName(s);
        }
        if(this.id_only_rgx.test(s)){
            return [p.getElementById(s)];
        }
        return this._querySelectors(s,p);
    }
});

function xLib() {
    //  if ( arguments.callee._singletonInstance )
    //  return arguments.callee._singletonInstance;
    //  arguments.callee._singletonInstance = this;
  
    if(arguments[0].constructor === String){
        this.length = 0;
        this.Selector=arguments[0];
        var rs = typeof arguments[1] === 'undefined' ? xSelector
        .query(arguments[0]) : xSelector.query(arguments[0],
            arguments[1]);
        this.length = rs.length;
        if (rs.length === 0)
            return;
        if (rs.length > 1) {
            this.e = [];
            for ( var i = 0; i < rs.length; i++)
                this.e.push(new X(rs[i]));
            return;
        } 
        this.e = rs[0];
        return;
    }
    
    this.e=arguments[0];
    this.length=1;
    
}
xLib.plugins = {};

xLib.extend = function() {
    var v;
    if (typeof arguments[0] !== 'undefined') {
        if (typeof arguments[1] !== 'undefined'){
                
            for (v in arguments[0])
                xLib.prototype[v] = arguments[0][v];
            return;
            
        }
        for (v in arguments[0]) {
            xLib.plugins[v] = arguments[0][v];
            xLib.prototype[v] = new Function('return this._cc("' + v
                + '",arguments);');
        }
        
    }
};
xLib.prototype = {
    eq:function(i,l){
        if(this.e.constructor===Array){
            if(typeof l==='undefined'){
                return this.e[i];
            }
            return this.e.slice(i,l);
        }
        if(i===0)return this;
        return null;
    },
    _cc : function(f, a) {
        if(typeof this.e === 'undefined') return null;
        var r = null;
        if (this.e.constructor === Array) {
            for ( var j = 0; j < this.e.length; j++) {
                r = xLib.plugins[f].apply(this.e[j], a);
            }
            return r;
        } 
        return xLib.plugins[f].apply(this, a);
    },
    hasAttr : browser.msie===false ? function(a) {
        return this.e.hasAttribute(a);
    } : function(a) {
        return typeof this.e[a] !== 'undefined';
    },
    isChild : function(c) {
        for ( var i = 0; i < this.e.childNodes.length; i++) {
            if (this.e.childNodes[i] === c)
                return true;
        }
        return false;
    },
    each : function() {
        var args = [];
        args.push.apply(args, arguments);

        var fn = args.shift();
        if (this.e.constructor === Array) {
            for ( var i = 0; i < this.e.length; i++) {
                fn.apply(this.e[i], args);
            }
            return;
        } 
        fn.apply(this, args);
    },
    f : function(s) {
        var r = [];
        var R = this.e;
        if (R.constructor !== Array) {
            r.push(R);
        } else{   
            for ( var i = 0; i < R.length; i++) {
                r.push(R[i].e);
            }
        }
        R.childNodes = r;
        return new X(xSelector.query(s, R));
    },
    $ : function(s, c) {
        if (this.e.constructor === Array) {
            var arr = [];
            for ( var i = 0; i < this.e.length; i++) {
                arr.concat(xSelector.query(s, this.e[i].e, c));
            }
            return new X(arr);
        }
        return new X(xSelector.query(s, this.e, c));
    },
    pos : function() {
        var q = this.e;
        var w = 0;
        var e = 0;
        var d = document;
        while (q) {
            w += q.offsetLeft;
            e += q.offsetTop;
            q = q.offsetParent;
        }
        if (browser.safari && typeof d.body.leftMargin !== "undefined") {
            w += d.body.leftMargin;
            e += d.body.topMargin;
        }
        return {
            x : w,
            y : e
        };

    },
    icss : function(k, v) {
        if (typeof v !== 'undefined')
            return k = this.css(k, v);
        k = this.css(k);
        return xSelector.toNumber(k);
    },
    appendChild : function(c) {
        if(c.constructor===xLib){
            if (c.e.constructor === Array) {
                for ( var s = 0; s < c.e.length; s++) {
                    this.e.appendChild(c.e[s].e);
                }
                return;
            }
            this.e.appendChild(c.e);
            return;
        }
        this.e.appendChild(c);
    },
    count : function() {
        return this.e.constructor === Array ? this.e.length : 1;
    },
    getIndexFromParent : function() {
        var a = this.e.parentNode.childNodes;
        for ( var i = 0; i < a.length; i++) {
            if (this.e === a[i])
                return i;
        }
        return -1;
    },
    isClass : function(c) {
        var ls = this.e.className.split(' ');
        return ls.indexOf(c) >= 0;
    },
    classList : function(c) {
        return this.e.className.split(' ');
    },
    before : function(o) {
        if (typeof o !== 'undefined') {
            if (o.e.constructor === Array) {
                for ( var i = 0; i < o.e.length; i++) {
                    this.e.parentNode.insertBefore(o.e[i].e, this.e);
                }
                return null;
            }
            this.e.parentNode.insertBefore(o.e, this.e);
            return null;
        } 
        if (this.getIndexFromParent() > 0) {
            var d = this.getIndexFromParent();
            var obj = this;
            this.parent().c('*').each(function(d) {
                if ((d - 1) === this.getIndexFromParent()) {
                    obj = this;
                }
            }, [ d, obj ]);
            return obj;
        }
        return null;
        
    },
    after : function(o) {
        if (typeof o !== 'undefined') {
            if (o.e.constructor == Array) {
                for ( var j = 0; j < o.e.length; j++) {
                    if (this.e === this.e.parentNode.lastChild) {
                        this.e.parentNode.appendChild(o.e[j].e);
                    } else {
                        this.e.parentNode.insertBefore(o.e[j].e,
                            this.e.parentNode.childNodes[(this
                                .getIndexFromParent() + 1)]);
                    }
                }
            }
            if (this.e === this.e.parentNode.lastChild) {
                this.e.parentNode.appendChild(o.e);
            }
            this.e.parentNode.insertBefore(o.e, this.e.parentNode.childNodes[(this.getIndexFromParent() + 1)]);
            return null;
        } 
        var d = this.getIndexFromParent()+1;
        if (d < this.parent().getChildsLenght()) {
            var O = this;
            this.parent().childs().each(function(d) {
                if (d === this.getIndexFromParent()) {
                    O = this;
                }
            });
            return O;
        } 
        return null;
    },
    clone : function() {
        if (this.e.constructor === Array) {
            var arr = [];
            for ( var i = 0; i < this.e.length; i++) {
                arr.push(this.e[i].elem.cloneNode(true));
            }
            return new X(arr);
        }
        return new X(this.e.cloneNode(true));
    },
    callback : function() {
        var args = [];
        args.push.apply(args, arguments);
        var f = args.length > 0 ? args.shift() : null;
        return f == null ? f : f.apply(this, args);
    },
    onclick : function(f) {
        this._cc('addEvent', [ 'click', f ]);
    },
    onover : function(f) {
        this._cc('addEvent', [ 'mouseover', f ]);
    },
    onout : function(f) {
        this._cc('addEvent', [ 'mouseout', f ]);
    },
    onmove : function(f) {
        this._cc('addEvent', [ 'mousemove', f ]);
    },
    onup : function(f) {
        this._cc('addEvent', [ 'mouseup', f ]);
    },
    ondown : function(f) {
        this._cc('addEvent', [ 'mousedown', f ]);
    },
    onchange : function(f) {
        this._cc('addEvent', [ 'change', f ]);
    },
    onfocus : function(f) {
        this._cc('addEvent', [ 'focus', f ]);
    },
    onblur : function(f) {
        this._cc('addEvent', [ 'blur', f ]);
    },
    onsubmit : function(f) {
        this._cc('addEvent', [ 'submit', f ]);
    },
    onkup : function(f) {
        this._cc('addEvent', [ 'keyup', f ]);
    },
    onkp : function(f) {
        this._cc('addEvent', [ 'keypress', f ]);
    },
    onkdown : function(f) {
        this._cc('addEvent', [ 'keydown', f ]);
    },
    onselect : function(f) {
        this._cc('addEvent', [ 'select', f ]);
    },
    parent : function() {
        if (this.e.constructor === Array) {
            var a = [];
            for ( var i = 0; i < this.e.length; i++) {
                a.push(this.e[i].elem.parentNode);
            }
            return new X(a);
        }
        return new X(this.e.parentNode);
    },
    reverse : function() {
        this.e.reverse();
    },
    isTag : function(t) {
        try {
            return t.toUpperCase()===this.e.tagName;
        } catch (e) {
            return false;
        }
    },
    isTweening : function() {
        return this.attr('istweening');
    }
};

xLib.extend({
    appendHtml : function(h) {
        this.e.innerHTML += h;
    },
    html : function(h) {
        this.e.innerHTML = h;
        return this.e.innerHTML;
    },
    cwidth : function(c) {
        if (typeof c === 'number')
            this.css('width', c + 'px');
        return this.e.clientWidth - this.icss('padding-left')
        - this.icss('padding-right');
    },
    cheight : function(c) {
        if (typeof c === 'number')
            this.css('height', c + 'px');
        return this.e.clientHeight - this.icss('padding-top')
        - this.icss('padding-bottom');
    },
    xcss : function(a) {
        this.e.style.removeProperty(a);
    },
    xattr : function(a) {
        this.e.removeAttribute(a);
    },
    css : document.defaultView && document.defaultView.getComputedStyle ? function(
        o, v) {
        if (typeof o === 'object') {
            for ( var j in o) {
                this.e.style.setProperty(j, o[j], null);
            }
            return null;
        } 
        if (typeof v !== 'undefined'){
            this.e.style.setProperty(o, v, null);
            return null;
        }
        return document.defaultView.getComputedStyle(this.e, "").getPropertyValue(o);
    }
    : function(o, v) {
        var s = this.e.currentStyle ? 'currentStyle' : 'style';
        if (typeof o === 'object') {

            for ( var j in o) {
                j = j.replace(/\-(\w)/g,
                    function(strMatch, p1) {
                        return p1.toUpperCase();
                    });
                this.e.style[j] = o[j];
            }
            return null;
        } 
        if (typeof v !== 'undefined') {
            o = o.replace(/\-(\w)/g, function(strMatch, p1) {
                return p1.toUpperCase();
            });
            this.e.style[o] = v;
            return null;
        } 
        o = o.replace(/\-(\w)/g, function(strMatch, p1) {
            return p1.toUpperCase();
        });
        return this.e[s][o];
    },
    attr : function(a, v) {
        if (typeof a === 'object'){
            for ( var j in a)
                this.e.setAttribute(j, a[j]);
            return null;
        }
        if (typeof v !== 'undefined'){
            this.e.setAttribute(a, v);
            return null;
        }
        return this.e.getAttribute(a);
    },
    alpha : browser.msie ? function(a) {
        if (this.e.filters)
            this.e.style.filter = 'alpha(opacity=' + a + ')';
        return (!this.e.filters.alpha.opacity) ? 100
        : this.e.filters.alpha.opacity;
    } : function(a) {
        if (typeof a !== 'undefined') {
            this.css({
                "opacity" : a / 100
            });
            return null;
        } 
        var t2 = this.css("opacity");
        return t2 ? Number(parseFloat(t2) * 100) : 100;
    },
    remove : function() {
        this.e.parentNode.removeChild(this.e);
    },
    addClass : function(c) {
        if (this.isClass(c)===false)
            this.e.className += typeof c !== 'undefined' ? (this.e.className === '' ? '': ' ')+ c: '';
    },
    removeClass : function(c) {
        if (typeof c === 'undefined')
            return;
        var ls = this.e.className.split(" ");
        var i;
        if ((i = ls.indexOf(c)) >= 0) {
            ls.splice(i, 1);
            this.e.className = ls.join(' ');
        }
    },
    classReplace : function(c, n) {
        c = new RegExp('^' + c + '$|' + c + '\\s', 'gi');
        this.e.className = this.e.className.replace(c, n);
    },
    show : function(transition) {
        if (!transition) {
            this.css({
                "display" : "",
                "visibility" : "visible"
            });
        } else {
            this.fadeIn(.2, function() {
                this.o.css({
                    "display" : "",
                    "visibility" : "visible"
                });
            }, transition, true);
        }
    },
    hide : function(transition) {
        if (!transition) {
            this.css({
                "display" : "none",
                "visibility" : "hidden"
            });
        } else {
            this.fadeOut(.2, function() {
                this.o.css({
                    "display" : "none",
                    "visibility" : "hidden"
                });
            }, transition, true);
        }
    },
    addEvent : function(evType, f) {
        addEvent(evType, this.e, f);
    },
    Tween : function(options, over) {
        xFx.addTween(this, options, over);
    },
    fadeIn : function(time, callback, transition, over) {
        var op = {
            alpha : 100,
            transition : transition,
            time : time,
            onComplete : callback
        };
        xFx.addTween(this, op, over);
    },
    fadeOut : function(time, callback, transition, over) {
        var op = {
            alpha : 0,
            transition : transition,
            time : time,
            onComplete : callback
        };
        xFx.addTween(this, op, over);
    },
    fadeTo : function(alpha, time, callback, transition, over) {
        var op = {
            alpha : alpha + 0,
            transition : transition,
            time : time,
            onComplete : callback
        };
        xFx.addTween(this, op, over);
    },
    removeEvent : function(eType, func) {
        if (document.removeEventListener) {
            this.e.removeEventListener(eType, func, false);
        } else if (document.detachEvent) {
            this.e.detachEvent('on' + eType, func);
        }
    }
});
xLib.ready = (function() {

    var readyList, DOMContentLoaded;

    var ReadyObj = {
        isReady : false,
        readyWait : 1,
        holdReady : function(hold) {
            if (hold) {
                ReadyObj.readyWait++;
            } else {
                ReadyObj.ready(true);
            }
        },
        ready : function(wait) {
            if ((wait === true && !--ReadyObj.readyWait)
                || (wait !== true && !ReadyObj.isReady)) {
                if (!document.body) {
                    return setTimeout(ReadyObj.ready, 1);
                }

                ReadyObj.isReady = true;
                if (wait !== true && --ReadyObj.readyWait > 0) {
                    return;
                }
                readyList.resolveWith(document, [ ReadyObj ]);
            }
        },
        bindReady : function() {
            if (readyList) {
                return;
            }
            readyList = ReadyObj._Deferred();
            if (document.readyState === "complete") {
                return setTimeout(ReadyObj.ready, 1);
            }
            if (document.addEventListener) {
                document.addEventListener("DOMContentLoaded", DOMContentLoaded,
                    false);
                window.addEventListener("load", ReadyObj.ready, false);
            } else if (document.attachEvent) {
                document.attachEvent("onreadystatechange", DOMContentLoaded);
                window.attachEvent("onload", ReadyObj.ready);
                var toplevel = false;
                try {
                    toplevel = window.frameElement == null;
                } catch (e) {
                }
                if (document.documentElement.doScroll && toplevel) {
                    doScrollCheck();
                }
            }
        },
        _Deferred : function() {
            var callbacks = new Array, fired, firing, cancelled, deferred = {
                done : function() {
                    if (!cancelled) {
                        var args = arguments, i, length, elem, _fired;
                        if (fired) {
                            _fired = fired;
                            fired = 0;
                        }
                        for (i = 0, length = args.length; i < length; i++) {
                            elem = args[i];
                            if (typeof elem === "function") {
                                callbacks.push(elem);
                            }
                        }
                        if (_fired) {
                            deferred.resolveWith(_fired[0], _fired[1]);
                        }
                    }
                    return this;
                },
                resolveWith : function(context, args) {
                    if (!cancelled && !fired && !firing) {
                        args = args || [];
                        firing = 1;
                        try {
                            while (callbacks[0]) {
                                callbacks.shift().apply(context, args);
                            }
                        } finally {
                            fired = [ context, args ];
                            firing = 0;
                        }
                    }
                    return this;
                },
                resolve : function() {
                    deferred.resolveWith(this, arguments);
                    return this;
                },
                isResolved : function() {
                    return !!(firing || fired);
                },
                cancel : function() {
                    cancelled = 1;
                    callbacks = [];
                    return this;
                }
            };
            return deferred;
        }
    };
    function doScrollCheck() {
        if (ReadyObj.isReady) {
            return;
        }
        try {
            document.documentElement.doScroll("left");
        } catch (e) {
            setTimeout(doScrollCheck, 1);
            return;
        }

        ReadyObj.ready();
    }
    if (document.addEventListener) {
        DOMContentLoaded = function() {
            document.removeEventListener("DOMContentLoaded", DOMContentLoaded,
                false);
            ReadyObj.ready();
        };

    } else if (document.attachEvent) {
        DOMContentLoaded = function() {
            if (document.readyState === "complete") {
                document.detachEvent("onreadystatechange", DOMContentLoaded);
                ReadyObj.ready();
            }
        };
    }
    function ready(fn) {
        ReadyObj.bindReady();
        readyList.done(fn);
    }
    return ready;
})();
xLib.viewport = function() {
    var w = 0;
    var h = 0;
    if (!window.innerWidth) {
        var d = document;
        if (!(d.documentElement.clientWidth == 0)) {
            w = d.documentElement.clientWidth;
            h = d.documentElement.clientHeight;
        } else {
            if (d.body.clientWidth) {
                w = d.body.clientWidth;
                h = d.body.clientHeight;
            } else {
                w = document.body.offsetWidth;
                h = document.body.offsetHeight;
            }
        }
    } else {
        var wd = window;
        w = wd.innerWidth;
        h = wd.innerHeight;
    }
    return {
        width : w,
        height : h
    };
};
function Ajax(p) {
    this.o = typeof p === 'undefined' ? Ajax._default : p;
    if (this.o !== Ajax._default) {
        for ( var v in Ajax._default) {
            this.o[v] = typeof this.o[v] === 'undefined' ? Ajax._default[v]
            : this.o[v];
        }
    }
    this.o.header = {};
    try {
        this._rq = new XMLHttpRequest();
    } catch (e) {
        try {
            this._rq = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            this._rq = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
}
Ajax._default = {
    page : './',
    method : 'post'
};
Ajax.prototype = {
    load : function(p) {
        if (typeof p !== 'undefined')
            if (this.o != p) {
                for ( var v in this.o) {
                    this.o[v] = typeof p[v] === 'undefined' ? this.o[v] : p[v];
                }
            }

        if (typeof this.o.error === 'function')
            this._rq.onerror = function() {
                if (typeof this.o.error === 'function')
                    this.o.error.apply(this._rq);
            };
        if (typeof this.o.abort === 'function')
            this._rq.onabort = function() {
                if (typeof this.o.abort === 'function')
                    this.o.abort.apply(this._rq);
            };
        var d = '';
        var isP =String(this.o.method).toLowerCase()==='post';
        var m = isP ? 'POST' : 'GET';
        var k = null;
        if (typeof this.o.data === 'object') {
            for (k in this.o.data) {
                d += k + "=" + this.o.data[k] + "&";
            }
            if (isP) {
                this.o.header["Content-Type"] = "application/x-www-form-urlencoded";
            }
        }
        k = null;
        this._rq.open(m, (isP ? this.o.page : this.o.page + '?' + d), true,
            this.o.user, this.o.pass);
        for (k in this.o.header) {
            this._rq.setRequestHeader(k, this.o.header[k]);
        }
        this._rq.send(d);
        this._rq.o = this;
        this._rq.onreadystatechange = function() {
            if (this.o._rq.readyState === 4) {
                if (typeof this.o.o.complete === 'function')
                    this.o.o.complete.apply(this);
                if (this.o._rq.status === 200) {
                    if (typeof this.o.o.sucess === 'function')
                        this.o.o.sucess.apply(this);
                } else {
                    if (typeof this.o.o.failure === 'function')
                        this.o.o.failure.apply(this);
                }
            }
        };
    },
    getXML : function() {
        return this._rq.responseXML;
    },
    getText : function() {
        return this._rq.responseText;
    },
    cancel : function() {
        this._rq.abort();
        return false;
    },
    getState : function() {
        return this._rq.status;
    }
};

var F = {
    number_only : function(e) {
        var k = (e.which) ? e.which : e.keyCode;
        if (k !== 8 && (k < 48 || k > 57) && (k < 96 || k > 105))
            return stopDef(e);
        return true;
    },
    phone : function(e) {
        var k = (e.which) ? e.which : e.keyCode;
        if (k != 8 && (k < 48 || k > 57) && (k < 96 || k > 105))
            return stopDef(e);
        var vl = this.value;
        if ((vl.length == 3 || vl.length == 7) && k != 8) {
            this.value = vl + " ";
        }
        if (vl.length >= 11 && k != 8)
            return stopDef(e);
        return true;
    }
};
var XTweener = {
    looping : false,
    frameRate : 60,
    objects : [],
    defaultOptions : {
        time : 1,
        transition : 'linear',
        onStart : undefined,
        onStartParams : undefined,
        onUpdate : undefined,
        onUpdateParams : undefined,
        onComplete : undefined,
        onCompleteParams : undefined,
        prefix : 'px'
    },
    inited : false,
    easingFunctionsLowerCase : {},
    init : function() {
        if (this.inited)
            return;
        this.inited = true;
        for ( var key in xFx.easingFunctions) {
            this.easingFunctionsLowerCase[key.toLowerCase()] = xFx.easingFunctions[key];
        }
    },
    stopTween : function() {
        if (arguments.length < 1)
            return null;
        if (arguments[0].constructor == xLib) {
            for ( var i = 0; i < this.objects.length; i++) {
                if (this.objects[i].target.e === arguments[0].e)
                    return this.objects.splice(i, 1);
            }
        } 
        return this.objects.splice(arguments[0], 1);
    },
    continueTween : function() {
        return (typeof arguments[0] !== 'undefined') ? this.object
        .push(arguments[0]) : false;
    },
    addTween : function(obj, options, override) {
        override = typeof override === 'undefined' ? true : override;
        if (obj.constructor == xLib) {
            if (obj.e.constructor == Array)
                return;
            if (override)
                this.stopTween(obj);
        }
        var self = this;
        if (!this.inited)
            this.init();
        var o = {};

        o.target = obj;
        o.targetPropeties = {};
        for ( var key in this.defaultOptions) {
            if (typeof options[key] !== 'undefined' && options[key] != null) {
                o[key] = options[key];
                delete options[key];
            } else {
                o[key] = this.defaultOptions[key];
            }
        }

        if (typeof o.transition === 'function') {
            o.easing = o.transition;
        } else {
            o.easing = this.easingFunctionsLowerCase[o.transition.toLowerCase()];
        }

        for (key in options) {
            var sB = typeof obj[key] !== 'function' ? obj.icss(key) : obj[key]
            ();
            o.targetPropeties[key] = {
                b : sB,
                c : options[key] - sB
            };
        }

        o.i = self.objects.push(o) - 1;
        o.target.attr('istweening', '' + o.i);
        o.startTime = (new Date() - 0);
        o.endTime = o.time * 1000 + o.startTime;
        if (typeof o.onStart === 'function') {
            if (o.onStartParams) {
                o.onStart.apply(o, o.onStartParams);
            } else {
                o.onStart();
            }
        }
        if (!self.looping) {
            self.looping = true;
            self.eventLoop.call(self);
        }
    },
    eventLoop : function() {
        var now = (new Date() - 0);
        var tP;
        var property;
        for ( var i = 0; i < this.objects.length; i++) {
            var o = this.objects[i];
            var t = now - o.startTime;
            var d = o.endTime - o.startTime;
            if (t >= d) {
                for (property in o.targetPropeties) {
                    tP = o.targetPropeties[property];
                    if (typeof o.target[property] === 'function') {
                        o.target[property](tP.b + tP.c);
                    } else
                        o.target.css(property, tP.b + tP.c + o.prefix);
                }
                this.objects.splice(i, 1);

                if (typeof o.onUpdate === 'function') {
                    if (o.onUpdateParams) {
                        o.onUpdate.apply(o, o.onUpdateParams);
                    } else {
                        o.onUpdate();
                    }
                }

                if (typeof o.onComplete === 'function') {
                    if (o.onCompleteParams) {
                        o.onComplete.apply(o, o.onCompleteParams);
                    } else {
                        o.onComplete();
                    }
                }
                o.target.xattr('istweening');
            } else {
                for ( property in o.targetPropeties) {
                    tP = o.targetPropeties[property];
                    var val = o.easing(t, tP.b, tP.c, d);
                    if (typeof o.target[property] === 'function') {
                        o.target[property](val);
                    } else
                        o.target.css(property, val + o.prefix);
                }

                if (typeof o.onUpdate === 'function') {
                    if (o.onUpdateParams) {
                        o.onUpdate.apply(o, o.onUpdateParams);
                    } else {
                        o.onUpdate();
                    }
                }
            }
        }

        if (this.objects.length > 0) {
            var self = this;
            setTimeout(function() {
                self.eventLoop();
            }, 1000 / self.frameRate);
        } else {
            this.looping = false;
        }
    }
};

xFx.Utils = {
    bezier2 : function(t, p0, p1, p2) {
        return (1 - t) * (1 - t) * p0 + 2 * t * (1 - t) * p1 + t * t * p2;
    },
    bezier3 : function(t, p0, p1, p2, p3) {
        return Math.pow(1 - t, 3) * p0 + 3 * t * Math.pow(1 - t, 2) * p1 + 3
        * t * t * (1 - t) * p2 + t * t * t * p3;
    }
};

xFx.easingFunctions = {
    easeNone : function(t, b, c, d) {
        return c * t / d + b;
    },
    easeInQuad : function(t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    easeOutQuad : function(t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b;
    },
    easeInOutQuad : function(t, b, c, d) {
        if ((t /= d / 2) < 1)
            return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    },
    easeInCubic : function(t, b, c, d) {
        return c * (t /= d) * t * t + b;
    },
    easeOutCubic : function(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    easeInOutCubic : function(t, b, c, d) {
        if ((t /= d / 2) < 1)
            return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    },
    easeOutInCubic : function(t, b, c, d) {
        if (t < d / 2)
            return xFx.easingFunctions.easeOutCubic(t * 2, b, c / 2, d);
        return xFx.easingFunctions.easeInCubic((t * 2) - d, b + c / 2,
            c / 2, d);
    },
    easeInQuart : function(t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    },
    easeOutQuart : function(t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    easeInOutQuart : function(t, b, c, d) {
        if ((t /= d / 2) < 1)
            return c / 2 * t * t * t * t + b;
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    easeOutInQuart : function(t, b, c, d) {
        if (t < d / 2)
            return xFx.easingFunctions.easeOutQuart(t * 2, b, c / 2, d);
        return xFx.easingFunctions.easeInQuart((t * 2) - d, b + c / 2,
            c / 2, d);
    },
    easeInQuint : function(t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b;
    },
    easeOutQuint : function(t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    easeInOutQuint : function(t, b, c, d) {
        if ((t /= d / 2) < 1)
            return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },
    easeOutInQuint : function(t, b, c, d) {
        if (t < d / 2)
            return xFx.easingFunctions.easeOutQuint(t * 2, b, c / 2, d);
        return xFx.easingFunctions.easeInQuint((t * 2) - d, b + c / 2,
            c / 2, d);
    },
    easeInSine : function(t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    easeOutSine : function(t, b, c, d) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    easeInOutSine : function(t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    easeOutInSine : function(t, b, c, d) {
        if (t < d / 2)
            return xFx.easingFunctions.easeOutSine(t * 2, b, c / 2, d);
        return xFx.easingFunctions.easeInSine((t * 2) - d, b + c / 2,
            c / 2, d);
    },
    easeInExpo : function(t, b, c, d) {
        return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b - c * 0.001;
    },
    easeOutExpo : function(t, b, c, d) {
        return (t == d) ? b + c : c * 1.001 * (-Math.pow(2, -10 * t / d) + 1)
        + b;
    },
    easeInOutExpo : function(t, b, c, d) {
        if (t == 0)
            return b;
        if (t == d)
            return b + c;
        if ((t /= d / 2) < 1)
            return c / 2 * Math.pow(2, 10 * (t - 1)) + b - c * 0.0005;
        return c / 2 * 1.0005 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    easeOutInExpo : function(t, b, c, d) {
        if (t < d / 2)
            return xFx.easingFunctions.easeOutExpo(t * 2, b, c / 2, d);
        return xFx.easingFunctions.easeInExpo((t * 2) - d, b + c / 2,
            c / 2, d);
    },
    easeInCirc : function(t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    easeOutCirc : function(t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    easeInOutCirc : function(t, b, c, d) {
        if ((t /= d / 2) < 1)
            return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
    easeOutInCirc : function(t, b, c, d) {
        if (t < d / 2)
            return xFx.easingFunctions.easeOutCirc(t * 2, b, c / 2, d);
        return xFx.easingFunctions.easeInCirc((t * 2) - d, b + c / 2,
            c / 2, d);
    },
    easeInElastic : function(t, b, c, d, a, p) {
        var s;
        if (t == 0)
            return b;
        if ((t /= d) == 1)
            return b + c;
        if (!p)
            p = d * .3;
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else
            s = p / (2 * Math.PI) * Math.asin(c / a);
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s)
            * (2 * Math.PI) / p))
        + b;
    },
    easeOutElastic : function(t, b, c, d, a, p) {
        var s;
        if (t == 0)
            return b;
        if ((t /= d) == 1)
            return b + c;
        if (!p)
            p = d * .3;
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else
            s = p / (2 * Math.PI) * Math.asin(c / a);
        return (a * Math.pow(2, -10 * t)
            * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
    },
    easeInOutElastic : function(t, b, c, d, a, p) {
        var s;
        if (t == 0)
            return b;
        if ((t /= d / 2) == 2)
            return b + c;
        if (!p)
            p = d * (.3 * 1.5);
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else
            s = p / (2 * Math.PI) * Math.asin(c / a);
        if (t < 1)
            return -.5
            * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s)
                * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1))
        * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
    },
    easeOutInElastic : function(t, b, c, d, a, p) {
        if (t < d / 2)
            return xFx.easingFunctions.easeOutElastic(t * 2, b, c / 2, d,
                a, p);
        return xFx.easingFunctions.easeInElastic((t * 2) - d, b + c / 2,
            c / 2, d, a, p);
    },
    easeInBack : function(t, b, c, d, s) {
        if (s == undefined)
            s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    easeOutBack : function(t, b, c, d, s) {
        if (s == undefined)
            s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    easeInOutBack : function(t, b, c, d, s) {
        if (s == undefined)
            s = 1.70158;
        if ((t /= d / 2) < 1)
            return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },
    easeOutInBack : function(t, b, c, d, s) {
        if (t < d / 2)
            return xFx.easingFunctions.easeOutBack(t * 2, b, c / 2, d, s);
        return xFx.easingFunctions.easeInBack((t * 2) - d, b + c / 2,
            c / 2, d, s);
    },
    easeInBounce : function(t, b, c, d) {
        return c - xFx.easingFunctions.easeOutBounce(d - t, 0, c, d) + b;
    },
    easeOutBounce : function(t, b, c, d) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        } else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        }
    },
    easeInOutBounce : function(t, b, c, d) {
        if (t < d / 2)
            return xFx.easingFunctions.easeInBounce(t * 2, 0, c, d) * .5
            + b;
        else
            return xFx.easingFunctions.easeOutBounce(t * 2 - d, 0, c, d)
            * .5 + c * .5 + b;
    },
    easeOutInBounce : function(t, b, c, d) {
        if (t < d / 2)
            return xFx.easingFunctions.easeOutBounce(t * 2, b, c / 2, d);
        return xFx.easingFunctions.easeInBounce((t * 2) - d, b + c / 2,
            c / 2, d);
    }
};
xFx.easingFunctions.linear = xFx.easingFunctions.easeNone;
function $(c, p) {
    return new X(c, p);
}
function $$(c, p) {
    return new X(c, p);
}
xLib.ajax = function(o) {
    return new Ajax(o);
};
xLib.Mouse = function(e) {
    var c = {};
    if (e.pageX || e.pageY) {
        c.x = e.pageX;
        c.y = e.pageY;
    } else {
        var d = document;
        c.x = e.clientX + (d.documentElement.scrollLeft || d.body.scrollLeft)
        - d.documentElement.clientLeft;
        c.y = e.clientY + (d.documentElement.scrollTop || d.body.scrollTop)
        - d.documentElement.clientTop;
    }
    return c;
};
xLib.isInBox = function() {
    if (arguments.length < 8)
        return false;
    if (arguments[4] < arguments[0])
        return false;
    if (arguments[5] < arguments[1])
        return false;
    if (arguments[4] + arguments[6] > arguments[0] + arguments[2])
        return false;
    if (arguments[5] + arguments[7] > arguments[1] + arguments[3])
        return false;
    return true;
};
xLib.include = function(url, callback) {
    var d = document;
    var script = d.createElement("script");
    script.type = "text/javascript";
    if (script.readyState) {
        script.onreadystatechange = function() {
            if (script.readyState == "loaded"
                || script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {
        script.onload = function() {
            callback();
        };
    }
    script.src = url;
    d.getElementsByTagName("head")[0].appendChild(script);
};
function stopProp(e) {
    if (e && e.stopPropogation)
        e.stopPropogation();
    else if (window.event && window.event.cancelBubble)
        window.event.cancelBubble = true;
}
function stopDef(e) {
    if (e && e.preventDefault)
        e.preventDefault();
    else if (window.event && window.event.returnValue)
        window.event.ReturnValue = false;
    return false;
}
