
(function () {
    var options = {
        method: 'post',
        mode: 'text',
        header: {}
    };
    function ie6Ajax(){
        var ie={
            $:null,
            send:function(varBody)
            {
                return this.$.send(varBody);
            },
            setRequestHeader:function(bstrHeader,bstrValue)
            {
                return this.$.setRequestHeader(bstrHeader, bstrValue);
            },
            open:function(bstrMethod,bstrUrl,varAsync,varUser,varPassword)
            {
                this.withCredentials=(varUser != null && varPassword != null);
                return this.$.open(bstrMethod,bstrUrl,varAsync,varUser,varPassword);
            },
            getResponseHeader:function(bstrHeader)
            {
                return this.$.getResponseHeader(bstrHeader);
            },
            getAllResponseHeaders:function()
            {
                return this.$.getAllResponseHeaders();
            },
            abort:function()
            {
                return this.$.abort();
            },
            readyState:0,
            response:"",
            responseBody:null,
            responseText:"",
            responseType:"",
            responseXML:null,
            status:0,
            statusText:"",
            withCredentials:false            
        };
        try{
            ie.$=new ActiveXObject("Microsoft.XMLHTTP");
        }catch(e){
            try{
                ie.$=new ActiveXObject("Msxml2.XMLHTTP");
            }catch(e){
                xUtils.log('Ajax Not Supported By your browser');
                return null;
            }  
        }
        ie.$.onreadystatechange=function(e){
            ie.readyState=ie.$.readyState;
            if(ie.$.readyState===4){
                ie.status=ie.$.status;
                ie.statusText=ie.$.statusText;
                ie.response=ie.$.response;
                ie.responseBody=ie.$.responseBody;
                ie.responseText=ie.$.responseText;
                ie.responseXML=ie.$.responseXML;
            }
            return ie.onreadystatechange(e);
        };  

        return ie;
    }
    xJax = function (p) {
        //** super(); this(p);
        try {
            return xCore.bind(new XMLHttpRequest(),arguments.callee).construct(p);
        } catch (e) {
            return xCore.bind(ie6Ajax(), arguments.callee).construct(p);
        }
    }
    xCore.bind(xJax , {
        construct: function (o) {
            this.configure(o);
            if (typeof this.confs === 'object' && typeof this.confs.url === 'string' && (typeof this.confs.success === 'function' || typeof this.confs.complete === 'function'))
                this.request();
            return this;
        },
        mode:{
            html:function(_this){
                if (_this.responseBody) return xLib.$$(_this.responseBody);
                else if (_this.responseXML) return  xLib(_this.responseXML);
                else return xLib.$$(_this.responseText);
            },
            json:function(_this,d){
                return JSON.parse(_this.responseText);
            }
        },
        configure: function (o) {
            //options delegate
            
            
            if (typeof o === 'object'){
                var oo=typeof o.not==='function'?{
                    failure:o.not,
                    error:o.not,
                    abort:o.not
                }:{};
                this.confs = xCore.bind(oo, options, this.confs, o);
            } 
            return this;
        },
        onreadystatechange: function () {
            if (this.readyState === 4) {
                if (typeof this.confs.complete === 'function')
                    this.confs.complete.call(this, this.status);
                if (this.status === 200) {
                    if (typeof this.confs.success === 'function') {
                        if (typeof this.mode[String(this.confs.mode)]==='function') {
                            this.confs.success.call(this, this.mode[this.confs.mode](this));
                        }
                        else {
                            this.confs.success.call(this, this.responseText);
                        }
                    }
                } else {
                    if (typeof this.confs.failure === 'function')
                        this.confs.failure.call(this, this.status);
                }
                return;
            }
            if (this.readyState === 3)
                if (typeof this.confs.processing === 'function') this.confs.processing.call(this);
            if (this.readyState === 2)
                if (typeof this.confs.received === 'function') this.confs.received.call(this);
            if (this.readyState === 1)
                if (typeof this.confs.connected === 'function') this.confs.connected.call(this);

        },
        request: function (p) {
            var d = '', m, k;
            if (typeof p === 'object' && this.o != p) {
                this.configure(p);
            }
            if (typeof this.confs.error === 'function')
                this.onerror = this.confs.error;
            if (typeof this.confs.abort === 'function')
                this.onabort = this.confs.abort;
            
            m = this.confs.method.toLowerCase();
            if (typeof this.confs.data === 'object') {
                if (this.confs.data.constructor === String)
                    d = this.confs.data;
                else {
                    for (k in this.confs.data) {
                        d += k + "=" + this.confs.data[k] + "&";
                    }
                }
            } else if (typeof this.confs.data === 'string')
                d = this.confs.data;
            if (m === 'post') {
                this.confs.header["Content-Type"] = "application/x-www-form-urlencoded";
            }
            this.open(m, (m === 'post' ? this.confs.url : this.confs.url + '?' + d), true, this.confs.user, this.confs.pass);
            if (typeof this.confs.header === 'object')
                for (k in this.confs.header)
                    this.setRequestHeader(k, this.confs.header[k]);

            this.send(d);
        },
        headers: function (k) {
            if (typeof k !== 'undefined') return this.getResponseHeader(k);
            var res = this.getAllResponseHeaders().split("\n"), len = res.length, curr, o = {};
            for (var i = 0; i < len; i++) {
                curr = res[i].split(':', 2);
                o[curr[0]] = String(curr[1]).trim();
            }
            return o;
        },
        html: function (p) {
            this.configure(p);
            this.confs.mode = 'html';
            this.request();
        },
        json: function (p) {
            this.configure(p);
            this.confs.mode = 'json';
            this.request();
        },
        target: function (p, t) {
            this.configure(p);
            this.confs.mode = 'text';
            var fnSuccess = this.confs.success;
            if (typeof t === 'object')
                this.confs.target = t;
            this.confs.success = function (e) {
                if (typeof fnSuccess === 'function') {
                    fnSuccess.call(this, e);
                }
                var t = this.confs.target;
                if (typeof t.push === 'undefined')
                    t = xLib(t);
                t.html(e);
            };
            this.request();
        }
    });
})();

var JSON;
if (!JSON) {
    JSON = {};
}
(function () {
    'use strict';
    function f(n) {
        return n < 10 ? '0' + n : n;
    }
    if (typeof Date.prototype.toJSON !== 'function') {
        Date.prototype.toJSON = function (key) {
            return isFinite(this.valueOf())
            ? this.getUTCFullYear() + '-' +
            f(this.getUTCMonth() + 1) + '-' +
            f(this.getUTCDate()) + 'T' +
            f(this.getUTCHours()) + ':' +
            f(this.getUTCMinutes()) + ':' +
            f(this.getUTCSeconds()) + 'Z'
            : null;
        };
        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    gap,
    indent,
    meta = {
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\'
    },
    rep;
    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
            ? c
            : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }
    function str(key, holder) {
        var i,
        k,
        v,
        length,
        mind = gap,
        partial,
        value = holder[key];
        if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }
        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }
        switch (typeof value) {
            case 'string':
                return quote(value);
            case 'number':
                return isFinite(value) ? String(value) : 'null';
            case 'boolean':
            case 'null':
                return String(value);
            case 'object':
                if (!value) {
                    return 'null';
                }
                gap += indent;
                partial = [];
                if (Object.prototype.toString.apply(value) === '[object Array]') {
                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }
                    v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }
                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === 'string') {
                            k = rep[i];
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }
                v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }
    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {
            var i;
            gap = '';
            indent = '';
            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }
            } else if (typeof space === 'string') {
                indent = space;
            }
            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }
            return str('', {
                '': value
            });
        };
    }
    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {
            var j;
            function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }
            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                    ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }
            if (/^[\],:{}\s]*$/
                .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
                j = eval('(' + text + ')');
                return typeof reviver === 'function'
                ? walk({
                    '': j
                }, '')
                : j;
            }
            throw new SyntaxError('JSON.parse');
        };
    }
}());