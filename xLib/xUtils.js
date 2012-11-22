xUtils={
    logdata:[],
    log:function(e){
        this.logdata.unshift(e);
        if(typeof window.console==='object')console.log(e);
    },
    toArray:
    (function(){
        try{
            Array.apply(undefined, document.getElementsByName('*'));
            return function(srcList){
                return Array.apply(undefined,srcList);
            }
        }catch(e){
            return function(srcList){
                var len=srcList.length,res=[];
                for(var i=0;i<len;i++)
                    res.push(srcList[i]);
                return res;
            }
        }
    })(),
    extend :
    function() {
        var args = arguments;
        if (args.length === 1)
            args = [ this, args[0] ];
        for ( var prop in args[1])
            args[0][prop] = args[1][prop];
        return args[0];
    },
    domReady:
    (function() {
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
    })(),
    inBox:
    function() {
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
    },
    View:
    function(win) {
        var d,w = 0,h = 0;
        if(typeof win!=='object')
            win=window;
        if (!win.innerWidth) {
            d = win.document;
            if (!(d.documentElement.clientWidth == 0)) {
                w = d.documentElement.clientWidth;
                h = d.documentElement.clientHeight;
            } else {
                if (d.body.clientWidth) {
                    w = d.body.clientWidth;
                    h = d.body.clientHeight;
                } else {
                    w = d.body.offsetWidth;
                    h = d.body.offsetHeight;
                }
            }
        } else {
            w = win.innerWidth;
            h = win.innerHeight;
        }
        return {
            width : w,
            height : h
        }
    },
    script:
    function(url, callback) {
        var d = document;
        var script = d.createElement("script");
        script.type = "text/javascript";
        if(typeof callback==='function'){
            if (script.readyState) {
                script.onreadystatechange = function() {
                    if (script.readyState === "loaded"
                        || script.readyState === "complete") {
                        script.onreadystatechange = null;
                        callback(url);
                    }
                };
            } else {
                script.onload = function() {
                    callback(url);
                };
            }
        }
        script.src = url;
        d.getElementsByTagName("head")[0].appendChild(script);
    },
    scriptStack:[],
    scriptSyncRunning:false,
    scriptSync:
    function(url){
        var current;
        this.scriptStack.push(arguments);
        if(this.scriptSyncRunning===false){
            current=arguments;
            this.scriptSyncRunning=true;
            this.script(url,function(url){
                if(typeof current[2]==='object'){
                    for(var i=0;i < current[2].length;i++){
                        if(typeof window[current[2][i]]==='undefined'){
                            window.setTimeout(arguments.callee,1);
                            return;
                        }
                    }
                }
                if(typeof current[1]==='function'){
                    current[1](url);
                }
                if(xUtils.scriptStack.length===0){
                    xUtils.scriptSyncRunning=false;
                    return;
                }
                current=xUtils.scriptStack.shift();
                xUtils.script(current[0],arguments.callee);
            });
        }
    }        
}