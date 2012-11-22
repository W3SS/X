xSelector={
    id_rgx : /^\#([\w\-]{1,})/i,
    next_rgx : /^([^\s]{1,})\s*\+\s*([\w\-]{1,})*/i,
    after_rgx : /^([^\s]{1,})\s*\~\s*([\w\-]{1,})*/i,
    parent_rgx : /^([^\s]{1,})\s*\<\s*([\w\-]{1,})*/i,
    id_only_rgx : /^\#([\w\-]{1,})\s*$/i,
    class_rgx : /^\.([\w\-]{1,})/i,
    tag_rgx : /^([\w\-]{1,})/i,
    tag_only_rgx : /^([a-z]{1}[\w\-]{1,})\s*$/i,
    attr_rgx : /^\[([\w\-]{1,})(\!\=|\!\=\=|\!\?|\!|\=\=|\<\=|\>\=|\*\=|\^\=|\$\=|\~\=|\|\=|\=|\>|\<|\?)[\"\']{0,1}([^\]\"\']*)[\"\']{0,1}\]/i,
    pseu_rgx : /^\:([\w\:]{1}[\w\-]{1,})/i,
    elementSinbling:typeof document.documentElement.nextElementSibling==='object',
    getChildsBytag : function(c, t) {
        var p=typeof c.children==='object'?c.children:(typeof c.childNodes==='object'?c.childNodes:c);
        if (t == null || t === '*')
            return p;
        var s = [],len=p.length;
        for ( var i = 0; i < len; i++) {
            if (p[i]!=null && p[i].tagName === t.toUpperCase())
                s.push(p[i]);
        }
        return s;
    },
    childIDX:function(_this){
        var len,pc;
        pc=_this.parentNode.children;
        len=pc.length;
        for(var i=0;i<len;i++)
            if(pc[i]===_this)return i;
        return -1;
    },
    plugins : {
        name:function(_this,i,p){
            return _this.name===p;  
        },
        'first-child':function(_this){
            if(_this.parentNode.children[0]===_this){
                return true;
            }
            return false;
        },
        ':hidden':function(_this,idx,p){
            if(_this.tagName==='INPUT' && String(_this.getAttribute('type')).toLowerCase()==='hidden')
                return true;
            return false;
        },
        ':checkbox':function(_this,idx,p){
            if(_this.tagName==='INPUT' && _this.type.toLowerCase()==='checkbox')
                return p?_this.name===p:true;
            return false;
        },
        ':radio':function(_this,idx,p){
            if(_this.tagName==='INPUT' && _this.type.toLowerCase()==='radio')
                return p?_this.name===p:true;
            return false;
        },
        checked:function(_this,idx,p){
            return _this.checked;
        },
        prop:function(_this,idx,p){
            p=p.split(',');
            if(p.length===1){
                return _this[p[0]]==true;
            }
            return _this[p[0]]===p[1];
        },
        val:function(_this,idx,p){
            return _this.value===p;  
        },
        selected:function(_this,idx,p){
            return _this.selected;
        },
        enabled:function(_this,idx,p){
            return _this.disabled===false;
        },
        disabled:function(_this,idx,p){
            return _this.disabled;
        },
        empty:function(_this,idx,p){
            return _this.childNodes.length===0;
        },
        contains:function(_this,idx,p){
            return String(_this.innerText).toLowerCase().indexOf(String(p).toLowerCase())!==-1;
        },
        containshtml:function(_this,idx,p){
            return String(_this.innerHTML).toLowerCase().indexOf(String(p).toLowerCase())!==-1;
        },
        ':after':function(_this,idx,p){
            return _this.previousSibling.tagName===String(p).trim().toUpperCase();
        },
        ':before':function(_this,idx,p){
            return _this.nextSibling.tagName===String(p).trim().toUpperCase();
        },
        next:function(_this,idx,p){
            return _this.previousSibling===xSelector.querySelectors(p, _this.previousSibling);
        },
        before:function(_this,idx,p){
            return _this.nextSibling.tagName===String(p).trim().toUpperCase();
        },
        parent:function(_this,idx,p){
            return _this.parentNode.tagName===String(p).trim().toUpperCase();
        },
        eq:function(_this,idx,p){
            if(idx===parseInt('0'+p,10))return true;
            return false;
        },
        not:function(_this,idx,p){
            return xSelector.querySelectors(p,[_this])[0]!==_this;
        },
        odd:function(_this){
            return xSelector.childIDX(_this)%2==true;
        },
        even:function(_this){
            return xSelector.childIDX(_this)%2==false;
        },
        lang:function(_this,idx,p){
            return String(_this.lang).toLowerCase()===String(p).toLowerCase();
        },
        'nth-child':function(_this,idx,p){
            idx=Number(p);
            if(isNaN(idx)){
                idx=String(p).split('+', 2);
                if(idx.length===1){
                    return xSelector.childIDX(_this)%2==(idx[0]==='even');
                }
            }
            idx--;
            if(_this.parentNode.children[idx]===_this)
                return true;
            return false;
        },
        'nth-of-type':function(_this,idx,p,t){
            var _ch=xSelector.getChildsBytag(_this.parentNode.children,t);
            idx=Number(p);
            if(isNaN(idx)){
                idx=String(p).split('+', 2);
                if(idx.length===1){
                    return _ch.indexOf(_this)%2==(idx[0]==='even');
                }
            }
            idx--;
            if(_ch[idx]===_this)
                return true;
            return false;
        },
        'last-child':function(_this){
            if(_this.parentNode.children[_this.parentNode.children.length-1]===_this){
                return true;
            }
            return false;
        },
        'first-of-type':function(_this,idx,p,t){
            return xSelector.getChildsBytag(_this.parentNode.children, t).shift()===_this;
        },
        'last-of-type':function(_this,idx,p,t){
            return xSelector.getChildsBytag(_this.parentNode.children, t).pop()===_this;
        },
        'only-of-type':function(_this,idx,p,t){
            return xSelector.getChildsBytag(_this.parentNode.children, t).length===1;
        },
        'only-child':function(){
            return _this.parentNode.children.length===1 && _this.parentNode.children[0]===_this;
        },
        'nth-last-child':function(_this,idx,p,t){
            var _ch=xUtils.toArray(_this.parentNode.children).reverse();
            idx=Number(p);
            if(isNaN(idx)){
                idx=String(p).split('+', 2);
                if(idx.length===1){
                    return _ch.indexOf(_this)%2==(idx[0]==='even');
                }
            }
            idx--;
            if(_ch[idx]===_this)
                return true;
            return false;
        },
        'nth-last-of-type':function(_this,idx,p,t){
            var _ch=xSelector.getChildsBytag(_this.parentNode.children,t).reverse();
            idx=Number(p);
            if(isNaN(idx)){
                idx=String(p).split('+', 2);
                if(idx.length===1){
                    return _ch.indexOf(_this)%2==(idx[0]==='even');
                }
            }
            idx--;
            if(_ch[idx]===_this)
                return true;
            return false;
        }
    },
    querySelectors: function(s,p) {
        
        var cs,o = [],matchs = null,temp,t,x,n,i,put,attr,te,tt,len,len3,len4;
        if (p == null)
            p = document;
        s=String(s);
        if(typeof p.getElementsByTagName==='undefined'){
            s=s.trim();
            if(s.charAt(0)!=='>')s='>'+s;
            if(p.length===0)return o;
            matchs=[p];
        }else{
            matchs=[p];
        }
        s = s.split(',');
        len=s.length;
        for (i = 0; i < len; i++) {
            cs = s[i];
            while(cs!==''){
                attr = [];
                s[i]= cs = cs.trim();
                if(cs.charAt(0)==='?'){
                    cs=cs.substring(1).trim();
                }else if(cs.charAt(0)==='>'){
                    cs=cs.substring(1).trim();
                    if(this.after_rgx.test(cs)){
                        te=this.after_rgx.exec(cs);
                        t=te[2]?te[2]:'*';
                        attr.push([':',['',':after',te[1]]]);
                        cs=cs.replace(te[0],'');
                    }else if(this.next_rgx.test(cs)){
                        te=this.next_rgx.exec(cs);
                        t=te[2]?te[2]:'*';
                        attr.push([':',['','next',te[1]]]);
                        cs=cs.replace(te[0],'');    
                    }else if(this.parent_rgx.test(cs)){
                        te=this.parent_rgx.exec(cs);
                        t=te[2]?te[2]:'*';
                        attr.push([':',['','parent',te[1]]]);
                        cs=cs.replace(te[0],'');
                    }else if(this.tag_rgx.test(cs)){
                        t=this.tag_rgx.exec(cs)[1];
                        cs=cs.replace(this.tag_rgx, '');
                    }else{
                        t='*';
                    }
                    temp = [];
                    len3=matchs.length;
                    for ( n = 0; n < len3; n++) {
                        temp=temp.concat(xUtils.toArray(this.getChildsBytag(matchs[n], t)));
                    }
                    matchs = temp;
                    temp = null;
                
                }else{
                    if(this.after_rgx.test(cs)){
                        te=this.after_rgx.exec(cs);
                        t=te[2]?te[2]:'*';
                        attr.push([':',['',':after',te[1]]]);
                        cs=cs.replace(te[0],'');
                    }else if(this.next_rgx.test(cs)){
                        te=this.next_rgx.exec(cs);
                        t=te[2]?te[2]:'*';
                        attr.push([':',['','next',te[1]]]);
                        cs=cs.replace(te[0],'');    
                    }else if(this.parent_rgx.test(cs)){
                        te=this.parent_rgx.exec(cs);
                        t=te[2]?te[2]:'*';
                        attr.push([':',['','parent',te[1]]]);
                        cs=cs.replace(te[0],'');
                    }else if(this.tag_rgx.test(cs)){
                        t=this.tag_rgx.exec(cs)[1];
                        cs=cs.replace(this.tag_rgx, '');
                    }else{
                        t='*';
                    }
                    temp = [];
                    len3=matchs.length;
                    for ( n = 0; n < len3; n++) {
                        temp=temp.concat(xUtils.toArray(matchs[n].getElementsByTagName(t)));
                    }
                    matchs = temp;
                    temp = null;
                
                }
                
                
                while(true){
                    tt=cs;
                    if (this.id_rgx.test(cs)) {
                        attr.push([ '#', this.id_rgx.exec(cs)[1]]);
                        cs = cs.replace(this.id_rgx, '');
                    }
                    if (this.class_rgx.test(cs)) {
                        te=this.class_rgx.exec(cs);
                        attr.push([ '.',te[1]]);
                        cs = cs.replace(te[0], '');
                    }
                    
                    if (this.pseu_rgx.test(cs)) {
                        te=this.pseu_rgx.exec(cs);
                        cs = cs.replace(te[0], '');
                        if(cs.charAt(0)==='('){
                            len3=cs.length;
                            len4=1;
                            for(x=1;x<len3;x++){
                                if(cs.charAt(x)==='('){
                                    len4++;
                                }else if(cs.charAt(x)===')'){
                                    len4--;
                                    if(len4===0)
                                        break;
                                }
                            }
                            te[2]=cs.substring(1, x);
                            cs=cs.substring(x+1).trim();
                        }
                        attr.push([':',te]);
                    }
                    
                    if(this.attr_rgx.test(cs)) {
                        te=this.attr_rgx.exec(cs);
                        attr.push([te[2],te[1],te[3]]);
                        cs = cs.replace(te[0], '');
                    }
                    
                    if(tt===cs || cs==='')break;
                }
                
                temp = [];
               
                len3=matchs.length;
                    MATCHS:for (x = 0; x < len3; x++) {
                        put = true;
                        len4=attr.length;
                            VER: for ( var v=0;v < len4;v++) {
                                
                                tt=attr[v][0];       
                                if( tt==='#'){
                                    if (matchs[x].getAttribute('id') !== attr[v][1]) {
                                        put = false;
                                        break VER;
                                    }
                                }else if(tt==='.'){
                                    te=String(matchs[x].className).split(' ');
                                    for(var vi=0; vi < te.length;vi++){
                                        if(te[vi]===attr[v][1])continue VER;
                                    }
                                    put = false;
                                    break VER;
                                }       
                                else if(tt===':'){
                                    if (typeof this.plugins[attr[v][1][1]]!=='function') {
                                        put = false;
                                        break VER;
                                    }
                                    if(!this.plugins[attr[v][1][1]](matchs[x],x,attr[v][1][2],t)){
                                        put = false;
                                        break VER;
                                    }
                                }else if(tt==='!=='){
                                    if (String(matchs[x].getAttribute(attr[v][1])).toLowerCase()===String(attr[v][2]).toLowerCase()) {
                                        put = false;
                                        break VER;
                                    }
                                }else if(tt==='=='){
                                    if (String(matchs[x].getAttribute(attr[v][1])).toLowerCase()!==String(attr[v][2]).toLowerCase()) {
                                        put = false;
                                        break VER;
                                    }
                                }else if(tt==='$='){
                                    if (String(matchs[x].getAttribute(attr[v][1])).endsWith(attr[v][2])===false) {
                                        put = false;
                                        break VER;
                                    }
                                } else if(tt==='^='){
                                    if (String(matchs[x].getAttribute(attr[v][1])).startsWith(attr[v][2])===false) {
                                        put = false;
                                        break VER;
                                    }
                                }else if(tt==='!='){
                                    if (matchs[x].getAttribute(attr[v][1])===attr[v][2]) {
                                        put = false;
                                        break VER;
                                    }
                                }else if(tt==='='){
                                    if (matchs[x].getAttribute(attr[v][1])!==attr[v][2]) {
                                        put = false;
                                        break VER;
                                    }
                                }else if(tt==='<'){
                                    if (parseInt(matchs[x].getAttribute(attr[v][1])) >= parseInt(attr[v][3])) {
                                        put = false;
                                        break VER;
                                    }
                                }else if(tt==='>'){
                                    if (parseInt(matchs[x].getAttribute(attr[v][1])) <= parseInt(attr[v][3])) {
                                        put = false;
                                        break VER;
                                    }
                                }else if(tt==='<='){
                                    if (parseInt(matchs[x].getAttribute(attr[v][1])) > parseInt(attr[v][3])) {
                                        put = false;
                                        break VER;
                                    }
                                }
                                else if(tt==='>='){
                                    if (parseInt(matchs[x].getAttribute(attr[v][1])) < parseInt(attr[v][3])) {
                                        put = false;
                                        break VER;
                                    }
                                }else if(tt==='*='){
                                    if (String(matchs[x].getAttribute(attr[v][1])).indexOf(attr[v][2]) === -1) {
                                        put = false;
                                        break VER;
                                    }
                                }else if(tt==='?'){
                                    if (String(matchs[x].getAttribute(attr[v][1])).toLowerCase().indexOf(String(attr[v][2]).toLowerCase())===-1) {
                                        put = false;
                                        break VER;
                                    }
                                }else if(tt==='!'){
                                    if(matchs[x].getAttribute(attr[v][1])){
                                        put=false;
                                        break VER;
                                    }
                                }
                                else{
                                    if(!matchs[x].getAttribute(attr[v][1])){
                                        put=false;
                                        break VER;
                                    }
                                }
                            }
                        if (put===true)
                            temp.push(matchs[x]);
                    }
                matchs = temp;
                if(cs===s[i])cs='';
            }
            if(matchs.length!==0)o=o.concat(matchs);
            matchs = [p];
        }
        len3=o.length;
        for ( var iv = 0; iv < len3; iv++) {
            if (typeof o[iv] === 'undefined') {
                o.splice(iv, 1);
                iv--;
            }
        }
        return o;
    }
};

xUtils.extend(xSelector,{
    _querySelectors:(function(){
        if(document.querySelectorAll){
            return function(s,p){
                try{
                    if(s[0]==='>'){
                        if(p!==document){
                            var _p=p.parentNode,_pc=_p.children,len=_pc.length;
                            for(var i=0;i<len;i++){
                                if(_pc[i]===p){
                                    s=p.tagName+':nth-child('+i+') '+ s;
                                    return _p.querySelectorAll(s,_p);
                                }
                            }
                        }
                    }
                    return p.querySelectorAll(s);
                }catch(e){
                    return this.querySelectors(s,p);
                }
            };
        }
        return xSelector.querySelectors;
    })()
    ,
    query : function(s, p) {
        if(p==null)p=document;
        if(this.id_only_rgx.test(s)){
            var d=p.getElementById(s.substring(1));
            return d?[d]:[];
        }
        return this._querySelectors(s,p);
    }
});