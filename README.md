X Framework
====

X is a cross browser javascript framework, inspired on jQuery, X was written first to
be used on xTinvent sites, at the beginning it was very heavy and less feature than other javascript frameworks, now it's much faster, very easy to extend, and very compatible with the many browsers, and now inspired o the jQuery code style very easy to manipulate and  interact with the DOM, very easy way to extend objects, we use the "bind later" method to create objects or cast to own types, so with that we, maintain the compatibility with the others javascript framework, currently the X is packed with the followings components.

xUtils
===
Is a tool set to help with the script load, the domReady events, simple object extend,
array cast,viewport, this components intends to work without the dependences, of other
components, basicly it's can be used like a loader.

xBrowser
===
this component has support to basic browser identification, cookies management,get variables also.

xCore
===
This component is the base of the framework, it's give the support to 'bind later' or 'delegate', and also implements some cross browser compatibilities prototypes, ex: String.trim().
extending Array example:
```js
//you Constructor
function myXArray(x)
{
if(typeof x==='object' && x.constructor===Array){
//cast
return xCore.bind(x,myXArray.methods);
}
return xCore.bind(xUtils.toArray(arguments),myXArray.methods);
}
myXArray.methods={
//if you want you can override the constructor
constructor:myXArray,
clear:function(){
while(this.length){
this.pop();
}
}
};
```
xTypes
===
This component implements some basic types, extending the native types, xString,xArray,xDate

xSelector
===
This component is a selector engine like jQuery Sizzle, xSelector.query will handle all queries,if the browser support the document.querySelectosAll the xSelector only will handle the queries that the browser can't satisfy. 

xJax
===
xJax offers a easy way to do ajax requests.
ex:
```js
xJax({url:'test.php',data:{task:'doTest'},success:function(){alert(this.responceText);}).send();
xJax({url:'test.php',data:{task:'doTest'},success:function(data){alert(data);}).text();
xJax({url:'test.php',data:{task:'doTest'},success:function(data){alert(data);}).xml();
xJax({url:'test.php',data:{task:'doTest'},success:function(data){alert(data);}).json();
```
xFx
===
xFx offers an easy and smooth way to do animations. 
ex:
```js
xFx.animate(document.getElementById('id').style,{width:1250,height:500});
xFx.animate(xLib('#id'),{width:1250,height:500});
xFx.animate($('div'),{width:1250,height:500});
$('div').animate({with:1250,height:500});
```
xLib
===
xLib gives you all you need to manipulate the dom, in all browsers,
it's X type extended from native Array, it is faster, xLib cast all
list to native array and then cast xLib object whos has all methods
to manipulate dom elements direct it's cutly simple, we like very much
of the jQuery code style, and we implements code style like the jQuery
and some methods name too.

xDrag
===
xLib extension drag and drop support