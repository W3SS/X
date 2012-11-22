
xSelector.plugins.animated=function(){
    var i;
    for(i=0;i<xFx.objects.length;i++){
        if(this===xFx.objects[i].target){
            return true;
        }
        if(this.style===xFx.objects[i].target){
            return true;
        }
    }
    return false;
};

xFx = {
    looping : false,
    frameRate : 60,
    objects : [],
    defaultOptions : {
        time : 1,
        transition : 'linear',
        suffix : 'px',
        complete:undefined,
        update:undefined,
        start:undefined,
        stop:undefined,
        resume:undefined
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
    animating:function(o){
        for ( var i = 0; i < this.objects.length; i++) {
            if (this.objects[i].target.constructor === xLib && this.objects[i].target[0]===o){
                return i;
            }else if (this.objects[i].target === o) {
                return i;
            }
        }
        return -1;
    },
    stop : function(o) {
        var tar=null,i;
        if(typeof o==='number'){
            tar=this.objects.splice(o, 1);
        }
        else{         
            i=this.animating(o);
            if(o===-1)return null;
            tar=this.objects.splice(i, 1);
        }
        if(tar!=null && typeof tar.stop==='function'){
            typeof tar.stopparams==='object'?tar.stop.apply(tar,tar.stopparams):tar.stop.call(tar);
        }
        return tar;
    },
    infinity:function(obj,options,override){
        var o=xCore.bind({},options);
        options['complete']=function(){
            if(typeof o.complete==='function'){
                if(arguments.length===0)o.call(this);
                else o.apply(this,arguments);
            }
            var n=xCore.bind({},o,this.startProperties);
            n.complete=arguments.callee;
            xFx.animate(this.target,n,override);
        }
        return this.animate(obj,options,override);
    },
    resume : function(target) {
        if(typeof target.resume==='function'){
            typeof target.resumeparams==='object'?target.resume.apply(target,target.resumeparams):target.resume.call(target);
        }
        return  this.object.push(target);
    },
    animate : function(obj, options, override) {
        if (this.inited===false)
            this.init();
        var o = {},sB,self=this,key;
        if(override)this.stop(obj);
        for(key in this.defaultOptions){
            o[key]=typeof options[key]==='undefined'?this.defaultOptions[key]:options[key];
            delete options[key];
        }
        o.target = obj;
        o.targetPropeties = {};
        o.startProperties={};
        if (typeof o.transition === 'function') {
            o.easing = o.transition;
        } else {
            o.easing = this.easingFunctionsLowerCase[o.transition.toLowerCase()];
        }

        if(typeof obj.push==='undefined'){   
            for (key in options) {
                sB = parseFloat('0'+obj[key]);
                o.startProperties[key]=sB;
                o.targetPropeties[key] = {
                    b : sB,
                    c : options[key] - sB
                };
            }
        }else{
            for (key in options) {
                sB = typeof obj[key]==='function'?parseFloat('0'+obj[key]()):parseFloat('0'+obj.css(key));
                o.startProperties[key]=sB;
                o.targetPropeties[key] = {
                    b : sB,
                    c : options[key] - sB
                };
            }
        }

        o.i = self.objects.push(o) - 1;
        o.startTime = (new Date() - 0);
        o.endTime = o.time * 1000 + o.startTime;
        if (typeof o.start === 'function') {
            if (typeof o.startparams!=='undefined') {
                o.start.apply(o, o.startparams);
            } else {
                o.start();
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
                    if (typeof o.target.push === 'function') {
                        if(typeof o.target[property]==='function')o.target[property](tP.b + tP.c);
                        else o.target.css(property,(tP.b + tP.c)+o.suffix);
                        continue;
                    }
                    o.target[property]=tP.b + tP.c + o.suffix;
                }
                this.objects.splice(i, 1);

                if (typeof o.update === 'function') {
                    if (typeof o.updateparams!=='undefined') {
                        o.update.apply(o, o.updateparams);
                    } else {
                        o.update();
                    }
                }

                if (typeof o.complete === 'function') {
                    if (typeof o.completeparams!=='undefined') {
                        o.complete.apply(o, o.completeparams);
                    } else {
                        o.complete();
                    }
                }
            } else {
                for ( property in o.targetPropeties) {
                    tP = o.targetPropeties[property];
                    var val = o.easing(t, tP.b, tP.c, d);                    
                    if (typeof o.target.push === 'function') {
                        if(typeof o.target[property]==='function')o.target[property](val);
                        else o.target.css(property,val+o.suffix);
                        continue;
                    }
                    o.target[property]=val + o.suffix;
                }

                if (typeof o.update === 'function') {
                    if (typeof o.updateparams!=='undefined') {
                        o.update.apply(o, o.updateparams);
                    } else {
                        o.update();
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