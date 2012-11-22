(function($){
    var LPoint={
        x : 0,
        y : 0
    },
    defaultOptions = {
        //target : null,
        position : 'absolute',
        //create : null,
        //destroy : null,
        //draging : null,
        //drag : null,
        //drop : null,
        //dropTarget : null,
        targetBounds:{
            w:1,
            h:1
        },
        bounds : [0,0]
    },
    begins=null,
    selectedOption=null,
    isInited=false,
    widgets=[],m$,
    _move = function(e) {
        if (selected===null)
            return true;
        e=xEvent(e);
        m$.push(selected);
        var p = m$,x = e.pageX, y = e.pageY,tx,ty,ps,pr = false,ss;
        tx=p.css('margin-left');
        ty=p.css('margin-top');
        if(tx)x-=parseInt('0'+tx);
        if(ty)y-=parseInt('0'+ty);
        while (p !== null) {
            ps = p.css('position');
            p = p.parent();
            if (ps === 'relative' || pr) {
                x = p.e > 0 ? (x - p.e.offsetLeft) : (x + p.e.offsetLeft);
                y = p.e.offsetTop > 0 ? (y - p.e.offsetTop)
                : (y + p.e.offsetTop);
                pr = true;
            } else if (ps === 'absolute') {
                pr = false;  
                tx=p.css('left');
                ty =p.css('top');
                if(tx)x-=parseInt('0'+tx);
                if(ty)y-=parseInt('0'+ty);
                tx=p.css('margin-left');
                ty=p.css('margin-top');
                if(tx)x-=parseInt('0'+tx);
                if(ty)y-=parseInt('0'+ty);
             
            }
            if (p[0].tagName === 'BODY') {
                p=null;
            }
        }

        x = begins.x > 0 ? (x - begins.x)
        : (x + begins.x);
        y = begins.y > 0 ? (y - begins.y)
        : (y + begins.y);
        
        if(selectedOption.bounds){
            if(selectedOption.bounds.constructor!==Array){
                selectedOption.bounds=[[0,0]];
            }
            if(x<selectedOption.bounds[0][0])x=selectedOption.bounds[0][0];
            if(y<selectedOption.bounds[0][1])y=selectedOption.bounds[0][1];
            if(typeof selectedOption.bounds[1]==='object'){    
                if(x+selected.clientWidth>selectedOption.bounds[1][0])x=selectedOption.bounds[1][0]-selected.clientWidth;
                if(y+selected.clientHeight>selectedOption.bounds[1][1])y=selectedOption.bounds[1][1]-selected.clientHeight;
            } 
            ss={
                left:x+'px',
                top:y+'px'
            };
        }else{
            ss={
                left : x + 'px',
                top : y + 'px'
            };
        }
        if (typeof selectedOption.dragging === 'function'){
            try{
                ps = selectedOption.dragging.call(selected, x,y,LPoint.x,LPoint.y,e);
            }catch(ex){
                xUtils.log(ex)
            }
            if(typeof ps ==='object'){
                ss= {
                    left : (typeof ps.x==='number' ? ps.x : x) + 'px',
                    top : (typeof ps.y==='number' ? ps.y : y) + 'px'    
                }
            }
        }
        LPoint = {
            x:x,
            y:y
        };
        m$.css(ss);
        m$.pop();
        e.stopPropagation();
        return e.preventDefault();
    },
    _up = function(e) {
        if (selected!=null) {
            if (typeof selectedOption.target !== 'undefined' && typeof selectedOption.dropTarget === 'function') {
                e=xEvent(e);
                var target ;
                m$.push(selected);
                target=m$.isIn(selectedOption.target,selectedOption.targetBounds);
                if (target.length!==0) {
                    if (typeof selectedOption.dropTarget === 'function') {
                        try{
                            selectedOption.dropTarget.call(
                                selected,
                                target,
                                LPoint.x, LPoint.y,e);
                        }catch(ex){
                            xUtils.log(ex)
                        }
                    }
                }else if (typeof selectedOption.drop === 'function') {
                    try{
                        selectedOption.drop.call(selected,
                            LPoint.x, LPoint.y,e);
                    }catch(ex){
                        xUtils.log(ex)
                    }
                }
                m$.pop();
            }else if (typeof selectedOption.drop === 'function') {
                e=xEvent(e);
                try{
                    selectedOption.drop.call(selected,
                        LPoint.x, LPoint.y,e);
                }catch(ex){
                    xUtils.log(ex)
                }
            }
        }
       
        begins = null;
        selected = null;
        selectedOption = null;
        return true;
    },
    _down = function(e) {
        e=xEvent(e);
        m$.push(e.target);
        var op = m$.drag('draggable');
        if (op!==false) {
            op=widgets[op];
            var p = m$.position();
            begins = {
                x : e.pageX - p.x,
                y : e.pageY - p.y
            };
            if (typeof op.drag === 'function') {
                try{
                    op.drag.call(e.target, e.pageX, e.pageY);
                }catch(ex){
                    xUtils.log(ex)
                }    
            }
            selected = e.target;
            selectedOption = op;
            m$.css('position', op.position);
            if (e.isCopy!==true) {
                m$.pop();
                e.stopPropagation();
                return e.preventDefault();
            }
        }
        m$.pop();
        return true;
    },
    init = function() {
        if(typeof window.ontouchstart ==='undefined')
            $(document).mousemove(_move).mouseup(_up,_down);
        else{ 
            $(document).addEvent('touchmove',_move).addEvent('touchend',_up).addEvent('touchstart',_down);
        } 
        isInited=true;
    },
    selected = null;
    xCore.bind(xSelector.plugins,{
        draggable:function(_this){
            m$.push(_this);
            var m=m$.drag('draggable');
            m$.pop();
            return m!==false;
        },
        dragging:function(_this){
            m$.push(_this);
            var m=m$.drag('dragging');
            m$.pop();
            return m;
        }
    });
    var initDrag=function(options){
        m$.push(this);
        var ob = m$.drag('draggable'),v;
        if(typeof options !== 'object')  options = {};
        if (ob!==false) {
            for ( v in options) {
                widgets[ob][v] = options[v];
            }
            if (typeof options.update === 'function')
            {
                try{
                    options.update.call(this,options);
                }catch(ex){
                    xUtils.log(ex)
                }
            }
        } else {
            options.o=this;
            widgets.push(xCore.bind({},defaultOptions,options));
            if (typeof options.position !== 'undefined') {
                m$.css('position', options.position);
            }
            if (typeof options.create === 'function')
            {
                try{
                    options.create.call(this,options);
                }catch(ex){
                    xUtils.log(ex)
                }
            }
        }
        m$.pop(this);
        
    };
    var methods={
        init:function(options){
            if (isInited===false)
                init();
            this.each(initDrag,options);
            return this;
        },
        start:function(o){
            if(this.drag('draggable')===false){
                this.init(o);
            }
            _down({
                target:this[0],
                isCopy:true
            });
            return this;
        },
        stop:function(){
            var i=0;
            if(selected == null)return this;
            while(i<this.length){
                if(this[i].o===selected)selected=null;
                i++;
            }
            return this;
        },
        remove:function(){
            var i=this.drag('draggable');
            if(i!==false){
                if(typeof widgets[i].destroy==='function')
                    widgets[i].destroy.call(this[0]);
                widgets.splice(i, 1);
                if(selected===this[0])selected=null;
            }
            return this;
        },
        stopAll:function(){
            selected=null;
            $(document).detEvent('mousemove',_move).detEvent('mousedown',_down).detEvent('mouseup',_up);
            isInited=false;
            return this;
        },
        dragging:function(){
            return this[0]===selected;
        },
        options:function(){
            var i=this.drag('draggable');
            if(i!==false){
                return widgets[i];
            }
            return null;
        },
        draggable:function(){
            var i=0,len=widgets.length;
            for(;i<len;i++)
                if(widgets[i].o===this[0])return i;
            return false;
        }
    };
    $.drag=function(){
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
    m$=$();
})(xLib);