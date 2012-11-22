xCore={
    version:"<?php echo $xVersion?>",
    date:"<?php echo $xDate?>",
    bind:function(/*...*/){
        var obj=arguments[0],i,k,l;
        if(typeof obj==='undefined')return null;
        l=arguments.length;
        for(i=1;i < l;i++){
            for(k in arguments[i])
            {
                obj[k]=arguments[i][k];
            }
        }
        return obj;
    }
};
function isTpOf(a,b,c){
    if(c && !a) return false;
    if(b && b.constructor===Array){   
        if(c && c.constructor===Array){ 
            return b.indexOf(typeof a)!==-1 && (c && a?c.indexOf(a.constructor)!==-1:true);
        }
        return b.indexOf(typeof a)!==-1 && (c && a?a.constructor===c:true);
    }
    if(c && c.constructor===Array){ 
        return typeof a===b && (c && a?c.indexOf(a.constructor)!==-1:true);
    }
    return typeof a===b && (c && a?a.constructor===c:true);
}

String.prototype.cmp=function(o){
    return new RegExp('^'+o+'$', 'i').test(this);
};

String.prototype.endsWith = function(o) {
    return this.substring(this.length - o.length,this.length) === o;
};
String.prototype.startsWith=function(o){
    return this.substring(0,o.length)===o;
};
if(typeof String.prototype.trim === 'undefined') {
    String.prototype.trim =function(){
        var rgx=/^\s+|\s+$/g;
        return function () {  
            return this.replace(rgx,'');  
        };  
    }();
}