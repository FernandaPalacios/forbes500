//tealium universal tag - utag.448 ut4.0.201704181834, Copyright 2017 Tealium.com Inc. All Rights Reserved.
try{(function(id,loader){var u={};utag.o[loader].sender[id]=u;if(utag===undefined){utag={};}if(utag.ut===undefined){utag.ut={};}if(utag.ut.loader===undefined){u.loader=function(o){var a,b,c,l;a=document;if(o.type==="iframe"){b=a.createElement("iframe");b.setAttribute("height","1");b.setAttribute("width","1");b.setAttribute("style","display:none");b.setAttribute("src",o.src);}else if(o.type==="img"){utag.DB("Attach img: "+o.src);b=new Image();b.src=o.src;return;}else{b=a.createElement("script");b.language="javascript";b.type="text/javascript";b.async=1;b.charset="utf-8";b.src=o.src;}if(o.id){b.id=o.id;}if(typeof o.cb==="function"){if(b.addEventListener){b.addEventListener("load",function(){o.cb();},false);}else{b.onreadystatechange=function(){if(this.readyState==="complete"||this.readyState==="loaded"){this.onreadystatechange=null;o.cb();}};}}l=o.loc||"head";c=a.getElementsByTagName(l)[0];if(c){utag.DB("Attach to "+l+": "+o.src);if(l==="script"){c.parentNode.insertBefore(b,c);}else{c.appendChild(b);}}};}else{u.loader=utag.ut.loader;}
u.ev={'view':1};u.initialized=false;u.map={};u.extend=[];u.send=function(a,b){if(u.ev[a]||u.ev.all!==undefined){var c,d,e,f,i;u.data={};for(d in utag.loader.GV(u.map)){if(b[d]!==undefined&&b[d]!==""){e=u.map[d].split(",");for(f=0;f<e.length;f++){u.data[e[f]]=b[d];}}}
if(!u.initialized){window['_viantTMInit']={"tokenServer":"//uid.vindicosuite.com","expiryInDays":2*365,"tokenName":"uci","tokenSyncName":"uct","document":document,"syncIntervalInSec":60*60*24*7,"syncMethod":"e","linkFragmenBlackList":[],"linkFragmentWhiteList":["never.com"]}
var tmScript=document.createElement('script');tmScript.async=true;tmScript.type='text/javascript';var h=''
var r=''
try{h=encodeURIComponent(document.location.href)
r=encodeURIComponent(document.referrer)}catch(e){}
tmScript.src=_viantTMInit["tokenServer"]+'/js/tm.js?r='+r+'&u='+h;var node=document.querySelector('script')
node.parentNode.insertBefore(tmScript,node);u.initialized=true;}
}};utag.o[loader].loader.LOAD(id);})("448","timeinc.fortune.com");}catch(error){utag.DB(error);}
