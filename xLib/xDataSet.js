xCore.bind(xLib,(function(){
    return typeof document.documentElement.dataset==='undefined'?{
        dataset:function(){
            var p,tp,v,o,t,tmp;
            if((tp=typeof arguments[0])==='number' || tp==='undefined'){
                p=tp==='number'?arguments[0]:0;
                o={};
                t=this[p].attributes;
                for(v=0;v<t.length;v++){
                    p=t[v];
                    if(p.name.startsWith('data-')===true){
                        tmp=p.name.toLowerCase().substring(5).split('-');
                        for(var i=1;i<tmp.length;i++){
                            tmp[i]=tmp[i].charAt(0).toUpperCase()+tmp[i].substring(1);
                        }
                        o[tmp.join('')]=p.value;
                    }
                }
                return o;   
            }
            p=arguments[0];
            if(tp==='object'){
                o={};
                for(v in p){
                    o['data-'+v]=JSON.stringify(p[v]);
                }
                return this.attr(o,arguments[1]);
            }
            if(typeof arguments[1]==='undefined'){
                try{
                    return JSON.parse(v=this.attr('data-'+p,undefined,arguments[2]));
                }catch(e){
                    return v;
                }
            }
            return this.attr('data-'+p,JSON.stringify(arguments[1]),arguments[2]); 
        }
    }
    :
    {
        dataset:function(){
            var p,tp,v,o;
            if((tp=typeof arguments[0])==='number' || tp==='undefined'){
                p=tp==='number'?arguments[0]:0;
                return this[p].dataset;   
            }
            p=arguments[0];
            if(tp==='object'){
                o={};
                for(v in p){
                    o['data-'+v]=JSON.stringify(p[v]);
                }
                return this.attr(o,arguments[1]);
            }
            if(typeof arguments[1]==='undefined'){
                v=parseInt('0'+argument[2], 10);
                try{
                    return JSON.parse(this[v].dataset[p]);
                }catch(e){
                    return this[v].dataset[p];
                }
            }
            return this.attr('data-'+p,JSON.stringify(arguments[1]),arguments[2]);
        }

    };
})());
