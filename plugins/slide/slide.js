/* 
 * xLib Slide Show Extension
 * 0.1v
 */

/* TO DO:
 * Callbacks
 * .onStart
 * .onEffectStart
 * .onEffectEnd
 * .onPause
 * .onResume
 */

(function($){
    var 
    Directions=['left','right','up','down'],
    Transitions=["easeNone",
    "easeInQuad",
    "easeOutQuad",
    "easeInOutQuad",
    "easeInCubic",
    "easeOutCubic",
    "easeInOutCubic",
    "easeOutInCubic",
    "easeInQuart",
    "easeOutQuart",
    "easeInOutQuart",
    "easeOutInQuart",
    "easeInQuint",
    "easeOutQuint",
    "easeInOutQuint",
    "easeOutInQuint",
    "easeInSine",
    "easeOutSine",
    "easeInOutSine",
    "easeOutInSine",
    "easeInExpo",
    "easeOutExpo",
    "easeInOutExpo",
    "easeOutInExpo",
    "easeInCirc",
    "easeOutCirc",
    "easeInOutCirc",
    "easeOutInCirc",
    "easeInElastic",
    "easeOutElastic",
    "easeInOutElastic",
    "easeOutInElastic",
    "easeInBack",
    "easeOutBack",
    "easeInOutBack",
    "easeOutInBack",
    "easeInBounce",
    "easeOutBounce",
    "easeInOutBounce",
    "easeOutInBounce",
    "linear"
    ],
    defDat=
    {
        effect:'auto',
        effectDir:'auto',
        effectTransition:'auto',
        effectDuration:1,
        waitTime:5,
        buttons:true,
        active:0,
        alowpause:false,
        viewPort:[850,400]
    },_loop=function(){
        //Here The Magic begins
        var pp=this.dataset('xlib:slideshow'),currentEffect,currentDir,currentTime,currentDuration,currentTransition,ac,acpp;
        if(pp == null)
            return;
        
        
        ac=this.children('ul > li').eq(++pp.active);
        
        if(ac.length===0){
            ac=this.children('ul > li:first-of-type');
            pp.active=0;
        }
        
        acpp=ac.dataset('xSlideShow');
        if(acpp == null)acpp={};
        //Check Properties
        currentEffect=typeof acpp.effect==='string'?acpp.effect:pp.effect;
        currentDir=typeof acpp.effectDir==='string'?acpp.effectDir:pp.effectDir;
        currentTransition=typeof acpp.effectTransition==='string'?acpp.effectTransition:pp.effectTransition;
        currentTime=typeof acpp.waitTime==='number'?acpp.waitTime:pp.waitTime;
        currentDuration=typeof acpp.effectDuration==='number'?acpp.effectDuration:pp.effectDuration;
       
        if(currentEffect==='auto'){
            currentEffect=$.xSlideShow.AvailEffects[$.xSlideShow.AvailEffects.indexOf(pp.lastEffect)+1];
            if(currentEffect==null)
                currentEffect=$.xSlideShow.AvailEffects[0];
            pp.lastEffect=currentEffect;
        }
        if(currentDir==='auto'){
            currentDir=Directions[Directions.indexOf(pp.lastEffectDir)+1];
            if(currentDir==null)
                currentDir=Directions[0];
            pp.lastEffectDir=currentDir;
        }
        if(currentTransition==='auto'){
            currentTransition=Transitions[Transitions.indexOf(pp.lastEffectTransition)+1];
            if(currentTransition==null)
                currentTransition=Transitions[0];
            pp.lastEffectTransition=currentTransition;
        }
        
        //       try{
        $.xSlideShow.effects[currentEffect](this,ac,currentDuration,currentTransition,currentDir,pp);
        //        }catch(e){}
        
        this.dataset('xlib:slideshow',pp);
        this.delay(currentTime*1000,_loop);
    }, methods={
        init:function(o){
            this.each(function(){
                var t=$(this),pp=t.dataset('xlib:slideshow');
                o=xCore.bind({},defDat,pp,o);
                t.dataset('xlib:slideshow',o);
                t.children('ul').css({
                    width:o.viewPort[0],
                    height:o.viewPort[1]
                });
            });
            this.xSlideShow('start');
            return this;
        },
        start:function(){
            return  this.each(function(){
                var t=$(this),pp=t.dataset('xlib:slideshow');
                if(!pp.timeOutId){
                    t.delay(pp.waitTime*1000,_loop);
                }
            });
        }
    };
    
    $.xSlideShow=function(){
        if(arguments.length===0 || (typeof arguments[0]==='object' && arguments[0].constructor===Object)){
            return methods.init.call(this,arguments[0]);
        }
        var args=xUtils.toArray(arguments);
        var m=args.shift();
        if(typeof methods[m]==='function'){
            return methods[m].apply(this,args);
        }
        throw 'Method not implemented!';
    };
    $.xSlideShow.AvailEffects=['fade'];
    $.xSlideShow.effects={
        fade:function(t,active,time,transition,dir,params){
            
            t.children('ul > li').removeCss('z-index').stop();
            
            with(active.previous('li')){
                shift();
                opacity(0);
                }
            
            active.next('li').opacity(0);
            
            active.opacity(0).fadeIn(time,function(){
                this.target.css('zIndex',10000);
            },transition).previous('li').eq(0).fadeOut(time,null,transition);
        }
    };
})(xLib);