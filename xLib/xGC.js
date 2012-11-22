(function(){
    var clbs=[],it,cleanup=function(){
        for(var i=0;i< clbs.length;i++){
            try{
                //Execute the callbacks
                clbs[i]();
            }catch(e){
            //nothing to do
            }
        }
    };
    
    xGC=function(fn){
        if(arguments.length===0 && !it){
            it=window.setInterval(cleanup, 1000);
        }else{
            clbs.push(fn);
        } 
    };
    xCore.bind(xGC,{
        checkCLBS:function(fn){
            for(var i=0;i< clbs.length;i++){
                if(clbs[i]===fn)return true;
            }
            return false;
        },
        disable:function(fn){
            for(var i=0;i< clbs.length;i++){
                if(clbs[i]===fn){
                    return clbs.splice(i, 1);
                }
            }
            return false;
        }
    });
    xGC();
})();