(function() {
    var u = navigator.userAgent.toLowerCase();
    browser = {
        version : (u.match(/.+(?:rv|it|ra|ie)[\/:]([\d.]+)/) || [])[1],
        safari : /webkit/.test(u),
        opera : /opera/.test(u),
        msie : /msie/.test(u) && !/opera/.test(u),
        mozilla : /mozilla/.test(u) && !/(compatible|webkit)/.test(u),
        refresh :
        function() {
            window.location.reload(true);
        },
        variables:
        (function(){   
            var GET ={},h,l,i;
            l = window.location.href.split('?',2);
            
            if(l.length===1)return {};
            
            l = l[1].split('#',2)[0];
            
            l = l.split('&');
            for (i = 0; i < l.length; i++) {
                h = window.unescape(l[i]).split('=');
                GET[h[0]] = typeof h[1] === 'undefined' ? '' : h[1];
            }
            return GET;
        })(),
        cookie:
        {
            set : function(n, v, h) {
                var e='';
                if (h) {
                    var d = new Date();
                    d.setTime(d.getTime() + (h * 60 * 60 * 1000));
                    e = "; expires=" + d.toGMTString();
                }
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
            },
            toString:
            function(){
                return document.cookie;
            }
        }
    };
})();
