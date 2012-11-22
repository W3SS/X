(function($){
    
    xEvent = function(ev){
        if(typeof ev==='undefined')ev=window.event;
        try{
            if(typeof ev.target==='undefined') ev.target = ev.srcElement;
            if(typeof ev.currentTarget==='undefined') ev.currentTarget = ev.toElement;
            if (typeof ev.pageX==='undefined') {
                if(typeof ev.touches==='undefined'){
                    var d = document;
                    ev.pageX = ev.clientX + (d.documentElement.scrollLeft || d.body.scrollLeft) - d.documentElement.clientLeft;
                    ev.pageY = ev.clientY + (d.documentElement.scrollTop || d.body.scrollTop) - d.documentElement.clientTop;
                } else{
                    ev.pageX=ev.touches[0].pageX;
                    ev.pageY=ev.touches[0].pageY;
                }
            }
            if(typeof ev.keyCode==='undefined')ev.keyCode= ev.which;
            else ev.which=ev.keyCode;
            if(typeof ev.keyIdentifier==='undefined')ev.keyIdentifier = ev.key;
        }catch(e){}
        if(typeof ev.preventDefault==='undefined')
            return xCore.bind(ev,arguments.callee);
        return ev;
    }
    xCore.bind(xEvent,{
        stopPropagation:function(){
            this.cancelBubble = true;
        },
        preventDefault:function(){
            return this.ReturnValue = false;
        },
        createEvent:function() {
            if (document.createEvent) {
                return function(evType) {
                    return document.createEvent(evType);
                };
            }else if (document.createEventObject) {
                return function() {
                    return document.createEventObject();
                };
            } 
            return function(){
                return {};
            };
        }()
    });
	
    var listeners={};
    
    xCore.bind($,{
        addEvent:
        function() {
            var addEv;
            if(typeof window.addEventListener!=='undefined'){
                addEv=function(e,f){
                    if(typeof listeners[e]!=='object')listeners[e]=[];
                    listeners[e].unshift([this,f]);
                    return this.addEventListener(e,f,true);
                };
            }
            else if(typeof document.attachEvent!=='undefined'){
                addEv=function(e, f) {
                    var _this=this;
                    if(typeof listeners[e]!=='object')listeners[e]=[];
                    listeners[e].unshift([this,f]);
                    this.attachEvent("on" + e, function(evt){
                        evt=evt||window.event;
                        return f.call(_this,evt);
                    });
                };
            }else{
                addEv=function(e, f) {
                    if(typeof listeners[e]!=='object')listeners[e]=[];
                    listeners[e].unshift([this,f]);
                    this["on" + e] = f;
                };
            } 

            return function(e,f,item){
                if(typeof item==='number')addEv.call(this[item],e,f);
                else this.each(addEv,e,f);
                return this;
            }
        }(),
        hasEvent:function(eType,fn,idx){
            var i,ls=listeners[eType],len;
            if(typeof idx!=='number')
                idx=0;
            if(typeof ls==='object'){
                len=listeners[eType].length
                for(i=0;i<len;i++){
                    if(ls[i][0]===this[idx] && ls[i]===fn)return true;
                }
            }
            return false;
        },
        detEvent:
        (function (){
            var detEnv;
            if(document.removeEventListerner){
                detEnv=function(eType, func) {
                    var i,ls=listeners[eType],len;
                    if(typeof ls==='object'){
                        len=listeners[eType].length
                        for(i=0;i<len;i++){
                            if(ls[i][0]===this && ls[i]===func)ls.splice(i, 1);
                        }
                    }
                    this.removeEventListener(eType, func, false);
                }
            }else if(document.detachEvent){
                detEnv=function(eType,func){
                    var i,ls=listeners[eType],len;
                    if(typeof ls==='object'){
                        len=listeners[eType].length
                        for(i=0;i<len;i++){
                            if(ls[i][0]===this && ls[i]===func)ls.splice(i, 1);
                        }
                    }
                    this.detachEvent('on' + eType, func);
                }
            }else{
                detEnv=function(eType,func){
                    var i,ls=listeners[eType],len;
                    if(typeof ls==='object'){
                        len=listeners[eType].length
                        for(i=0;i<len;i++){
                            if(ls[i][0]===this && ls[i]===func)ls.splice(i, 1);
                        }
                    }
                }
            }
            return function(evType,func,item){
                if(typeof item==='number')detEnv.call(this[item],evType,func);
                else this.each(detEnv,evType,func);
                return this;
            }
        })(),
        fireEvent:
        (function() {
            var fireEnv;
            if (document.createEvent) {
                fireEnv=function(ev, evType) {
                    try{
                        ev.initEvent(evType, true, true);            
                        return this.dispatchEvent(ev);
                    }catch(e){
                        var i,ls=listeners[evType],len;
                        if(typeof ls==='object'){
                            len=listeners[evType].length
                            for(i=0;i<len;i++){
                                if(ls[i][0]===this)ls[i][1].call(this,ev);
                                if(ev.cancelBubble==true){
                                    return ev.ReturnValue;
                                }
                            }
                            if(typeof this['on'+evType]==='function'){
                                return this['on'+evType](ev);
                            }
                            return ev.ReturnValue;
                        }
                        else if(typeof this['on'+evType]==='function'){
                            return this['on'+evType](ev);
                        }  
                        return null;
                    } 
                };
            }else
            if (document.createEventObject) {
                fireEnv=function(ev, evType) {
                    try{    
                        return this.fireEvent('on' + evType, ev);
                    }catch(e){
                        var i,ls=listeners[evType],len;
                        if(typeof ls==='object'){
                            len=listeners[evType].length
                            for(i=0;i<len;i++){
                                if(ls[i][0]===this)ls[i][1].call(this,ev);
                                if(ev.cancelBubble==true){
                                    return ev.ReturnValue;
                                }
                            }
                            if(typeof this['on'+evType]==='function'){
                                return this['on'+evType](ev);
                            }
                            return ev.ReturnValue;
                        }
                        else if(typeof this['on'+evType]==='function'){
                            return this['on'+evType](ev);
                        }
                        return null;
                    }
                };
            } else {
                
                fireEnv=function(ev,evType){
                    var i,ls=listeners[evType],len;
                    if(typeof ls==='object'){
                        len=listeners[evType].length
                        for(i=0;i<len;i++){
                            if(ls[i][0]===this)ls[i][1].call(this,ev);
                            if(ev.cancelBubble==true){
                                return ev.ReturnValue;
                            }
                        }
                        if(typeof this['on'+evType]==='function'){
                            return this['on'+evType](ev);
                        }
                        return ev.ReturnValue;
                    }
                    else if(typeof this['on'+evType]==='function'){
                        return this['on'+evType](ev);
                    }
                    return null;
                };
            }
            return function(evType,evObj,item,ret){
                if(typeof item==='number'){
                    if(ret){
                        if(typeof this[item][evType]==='function') return this[item][evType]();
                        return fireEnv.call(this[item],evObj,evType);
                    }
                    if(typeof this[item][evType]==='function')this[item][evType]();
                    else fireEnv.call(this[item],evObj,evType);
                    return this;
                }else{
                    for(item=0;item<this.length;item++){
                        if(typeof this[item][evType]==='function')this[item][evType]();
                        else fireEnv.call(this[item],evObj,evType);
                    }
                    return this;
                } 
            };
        })(),
        click : 
        function(f) {
            if(typeof f==='function')
                this.addEvent('click',f);
            else{
                this.fireEvent('click',xEvent.createEvent('MouseEvents'),f);
            } 
            return this;
        },
        mouseover :
        function(f,out) {
            if(typeof f==='function'){
                this.addEvent('mouseover',f);
                if(typeof out==='function')
                    this.mouseout(out);
            }
            else this.fireEvent('mouseover',xEvent.createEvent('MouseEvents'),f);
            return this;
        },
        mouseout : 
        function(f,over) {
            if(typeof f==='function'){
                this.addEvent('mouseout',f);
                if(typeof over==='function')
                    this.mouseover(over);
            }
            else this.fireEvent('mouseout',xEvent.createEvent('MouseEvents'),f);
            return this;
        },
        mousemove : 
        function(f) {
            if(typeof f==='function')
                this.addEvent('mousemove',f);
            else this.fireEvent('mousemove',xEvent.createEvent('MouseEvents'),f);
            return this;
        },
        mouseup :
        function(f,down) {
            if(typeof f==='function'){
                this.addEvent('mouseup',f);
                if(typeof down==='function')
                    this.mousedown(down);
            }
            else this.fireEvent('mouseup',xEvent.createEvent('MouseEvents'),f);
            return this;
        },
        mousedown :
        function(f,up) {
            if(typeof f==='function'){
                this.addEvent('mousedown',f);
                if(typeof up==='function')
                    this.mouseup(up);
            }
            else this.fireEvent('mousedown',xEvent.createEvent('MouseEvents'),f);
            return this;
        },
        change :
        function(f) {
            if(typeof f==='function')
                this.addEvent('change',f);
            return this;
        },
        focus :
        function(f) {
            if(typeof f==='function')
                this.addEvent('focus',f);
            else {
                this.fireEvent('focus',xEvent.createEvent('Event'),f);
            }
            return this;
        },
        blur :
        function(f) {
            if(typeof f==='function')
                this.addEvent('blur',f);
            else {
                this.fireEvent('blur',xEvent.createEvent('Event'),f);
            }
            return this;
        },
        submit :
        function(f) {
            if(typeof f==='function')
                this.addEvent('submit',f);
            else this.fireEvent('submit',xEvent.createEvent('Event'),f);
            return this;
        },
        keyup :
        function(f,down) {
            if(typeof f==='function'){
                this.addEvent('keyup',f);
                if(typeof down==='function')   
                    this.addEvent('keydown',down);
            }
            else this.fireEvent('keyup',xEvent.createEvent('KeyboardEvent'),f);
            return this;
        },
        keypress :
        function(f) {
            if(typeof f==='function')
                this.addEvent('keypress',f);
            else this.fireEvent('keypress',xEvent.createEvent('KeyboardEvent'),f);
            return this;
        },
        keydown :
        function(f,up) {
            if(typeof f==='function'){
                this.addEvent('keydown',f);
                if(typeof down==='function')   
                    this.addEvent('keyup',up);
            }
            else this.fireEvent('keydown',xEvent.createEvent('KeyboardEvent'),f);
            return this;
        },
        select : function(f) {
            if(typeof f==='function')
                this.addEvent('select',f);
            else this.fireEvent('select',xEvent.createEvent('UIEvent'),f);
            return this;
        },
        load : function(f) {
            if(typeof f==='function')
                this.addEvent('load',f);
            else this.fireEvent('load',xEvent.createEvent('Event'),f);
            return this;
        },
        resize : function(f) {
            if(typeof f==='function')
                this.addEvent('resize',f);
            else this.fireEvent('resize',xEvent.createEvent('Event'),f);
            return this;
        }
    })
    $.on=$.addEvent;
})(xLib);
