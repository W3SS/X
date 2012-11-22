/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

xDate = {
    now:
    (typeof Date.prototype.now === 'undefined' ? function () {
        return +(new Date)
    }:Date.now)
};
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
        "use strict";
        if (this == null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    }
}
function xArray(d) {
    if (d.constructor === Array)
        return xCore.bind(d,arguments.callee);
    return xCore.bind(Array.apply(undefined, arguments), arguments.callee);
}
xCore.bind(xArray,{
    constructor:xArray,
    each:
    function (/*callback,arg1,arg2...*/) {
        var args = Array.apply(undefined, arguments), callback = args.shift(), k = 0, len = this.length;
        if(typeof callback==='function'){
            for (k = 0; k < len; k++) {
                if (typeof this[k] !== 'undefined') {
                    callback.apply(this[k], args);
                }
            }
        }
        return this;
    },
    search:function(str){
        var d=new RegExp('^'+str+'$', 'i');
        for(var i=0;i<this.length;i++){
            if(d.test(this[i])===true)return i;
        }
        return -1;
    }
});
if (typeof Array.prototype.forEach === 'undefined') {
    xArray.forEach = function (callback, thisArg) {
        var T, k = 0;
        var len = this.length;
        if (typeof thisArg !== 'undefined') {
            T = thisArg;
        }
        while (k < len) {
            var kValue;
            if (typeof this[k] !== 'undefined') {
                kValue = this[k];
                callback.call(T, kValue, k, this);
            }
            k++;
        }
    };
}

function xString(s) {
    return xCore.bind(new String(s), arguments.callee);
}
xCore.bind(xString,{
    replaceAll:
    function (findstr, replacestr, lireral, size) {
        var i, k, rep, r = '', len = this.length, len2 = findstr.length, c = 0;
        for (i = 0; i < len; i++) {
            rep = true;
            for (k = 0; k < len2; k++) {
                if (this[i + k] !== findstr[k]) {
                    rep = false;
                }
            }
            if (rep === true) {
                if (typeof replacestr !== 'undefined') r += replacestr;
                i += len2;
                c++;
                continue;
            }
            r += this[i];
        }
        if (size === true) return lireral === true ? [r, c] : [xString(r), c];
        return lireral === true ? r : xString(r);

    },
    toNumber:
    function () {
        return parseInt(this);
    }
});