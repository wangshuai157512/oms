(function(t){function e(e){for(var c,a,r=e[0],s=e[1],l=e[2],g=0,p=[];g<r.length;g++)a=r[g],Object.prototype.hasOwnProperty.call(i,a)&&i[a]&&p.push(i[a][0]),i[a]=0;for(c in s)Object.prototype.hasOwnProperty.call(s,c)&&(t[c]=s[c]);d&&d(e);while(p.length)p.shift()();return o.push.apply(o,l||[]),n()}function n(){for(var t,e=0;e<o.length;e++){for(var n=o[e],c=!0,r=1;r<n.length;r++){var s=n[r];0!==i[s]&&(c=!1)}c&&(o.splice(e--,1),t=a(a.s=n[0]))}return t}var c={},i={app:0},o=[];function a(e){if(c[e])return c[e].exports;var n=c[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,a),n.l=!0,n.exports}a.m=t,a.c=c,a.d=function(t,e,n){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},a.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var c in t)a.d(n,c,function(e){return t[e]}.bind(null,c));return n},a.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="/";var r=window["webpackJsonp"]=window["webpackJsonp"]||[],s=r.push.bind(r);r.push=e,r=r.slice();for(var l=0;l<r.length;l++)e(r[l]);var d=s;o.push([0,"chunk-vendors"]),n()})({0:function(t,e,n){t.exports=n("56d7")},"1c0b0":function(t,e,n){"use strict";(function(t){var c;n("7db0"),n("498a");e["a"]={name:"Login",components:{},mounted:function(){c=this,c.init()},methods:{switchCode:function(){t("#imgcode").attr("src","/Service/api/Login/GetAuthCode?time="+Math.random())},init:function(){t(".wrapper").height(t(window).height()),t(".form").css("margin-top",(t(window).height()-80-400)/2-15),t(window).width()>1366?t(".container .pic").css({"margin-right":"200px"}):t(".container .pic").css({"margin-right":"100px"}),t(window).resize((function(e){t(".wrapper").height(t(window).height()),t(".form").css("margin-top",(t(window).height()-80-400)/2-15),t(window).width()>1366?t(".container .pic").css({"margin-right":"200px"}):t(".container .pic").css({"margin-right":"100px"})})),document.onkeydown=function(t){t||(t=window.event),13==(t.keyCode||t.which)&&(document.getElementById("login_button").focus(),document.getElementById("login_button").click())}},loginClick:function(){var e=t("#txt_account"),n=t("#txt_password"),i=t("#txt_code");return""==e.val()?(e.focus(),this.formMessage("请输入用户名。"),!1):""==n.val()?(n.focus(),this.formMessage("请输入登录密码。"),!1):""==i.val()?(i.focus(),this.formMessage("请输入验证码。"),!1):(t("#login_button").attr("disabled","disabled").find("span").html("loading..."),void this.$axios.post("/service/api/Login/CheckLogin",{username:t.trim(e.val()),password:t.trim(n.val()),code:t.trim(i.val())}).then((function(e){var n=e.data;n.status?(window.localStorage["loginToke"]=n.data,t("#login_button").find("span").html("登录成功，正在跳转..."),window.setTimeout((function(){c.$router.push("Home")}),500)):(t("#login_button").removeAttr("disabled").find("span").html("登录"),t("#switchCode").trigger("click"),i.val(""),c.formMessage(n.message))})))},formMessage:function(e){t(".login_tips").find(".tips_msg").remove(),t(".login_tips").append('<div class="tips_msg"><i class="fa fa-question-circle" style="margin-top:10px;"></i>'+e+"</div>")}}}}).call(this,n("a336"))},2428:function(t,e,n){"use strict";n("8d97")},"56d7":function(t,e,n){"use strict";n.r(e);n("e260"),n("e6cf"),n("cca6"),n("a79d");var c=n("7a23");function i(t,e){var n=Object(c["v"])("router-view");return Object(c["p"])(),Object(c["d"])(n)}n("2428");const o={};o.render=i;var a=o,r=n("6c02"),s=Object(c["z"])("data-v-0c969316");Object(c["s"])("data-v-0c969316");var l={class:"wrapper"},d=Object(c["g"])("div",{class:"topTitle"},[Object(c["g"])("span",null,"OMS"),Object(c["f"])(" 在线阅卷系统 ")],-1),g={class:"container"},p=Object(c["g"])("div",{class:"pic"},[Object(c["g"])("img",{src:"/img/pic.png",alt:"Alternate Text"})],-1),u={class:"form"},b=Object(c["e"])('<div class="schoolLoge" style="text-align:center;margin-bottom:28px;height:32px;" data-v-0c969316><img src="/img/schoolLogo/hc.png" alt="Alternate Text" data-v-0c969316></div><div class="row" data-v-0c969316><input id="txt_account" type="text" placeholder="用户名" data-v-0c969316><i class="fa fa-user" data-v-0c969316></i></div><div class="row" data-v-0c969316><input id="txt_password" type="password" placeholder="登录密码" data-v-0c969316><i class="fa fa-key" data-v-0c969316></i></div>',3),f={class:"row"},h=Object(c["g"])("input",{id:"txt_code",maxlength:"4",type:"text",placeholder:"验证码",style:{width:"190px",float:"left"}},null,-1),v={style:{width:"90px",float:"right","padding-top":"4px","padding-left":"20px"}},m=Object(c["f"])(" 看不清？"),O=Object(c["g"])("br",null,null,-1),j=Object(c["g"])("img",{id:"imgcode",class:"authcode",src:"/Service/api/Login/GetAuthCode",width:"80",height:"25"},null,-1),w=Object(c["g"])("div",{class:"login_tips"},null,-1),x={class:"row"},y=Object(c["g"])("span",null,"登录",-1),_=Object(c["g"])("div",{class:"row"},null,-1),k=Object(c["g"])("div",{class:"copyright"}," ©2015-2019 弘成科技发展有限公司版权所有 京ICP证041171号 京公网安备110101002605 ",-1);Object(c["q"])();var C=s((function(t,e,n,i,o,a){return Object(c["p"])(),Object(c["d"])(c["a"],null,[Object(c["g"])("div",l,[d,Object(c["g"])("div",g,[p,Object(c["g"])("form",u,[b,Object(c["g"])("div",f,[h,Object(c["g"])("div",v,[m,O,Object(c["g"])("a",{id:"switchCode",href:"",style:{"text-decoration":"none"},onClick:e[1]||(e[1]=function(){return a.switchCode&&a.switchCode.apply(a,arguments)})},"换一张"),j])]),w,Object(c["g"])("div",x,[Object(c["g"])("button",{id:"login_button",type:"button",onClick:e[2]||(e[2]=function(){return a.loginClick&&a.loginClick.apply(a,arguments)})},[y])]),_])])]),k],64)})),L=n("1c0b0");n("b8cd");L["a"].render=C,L["a"].__scopeId="data-v-0c969316";var M=L["a"],S=Object(c["z"])("data-v-1e0be0c3");Object(c["s"])("data-v-1e0be0c3");var P={class:"wrapper"},T=Object(c["g"])("div",{class:"navbar"},[Object(c["g"])("div",{class:"container"},[Object(c["g"])("div",{class:"clearfix"},[Object(c["g"])("div",{class:"schoolLogo"},[Object(c["g"])("img",{src:"/img/schoolLogo/hc.png",alt:""})]),Object(c["g"])("a",{href:"javascript:void(0)",id:"logo",class:"navbar-brand pull-left"},[Object(c["g"])("img",{style:{height:"20px"},src:"/img/OMSlogo.png",alt:"Alternate Text"})]),Object(c["g"])("div",{class:"head-nav"},[Object(c["g"])("ul",{class:"navbar-nav"},[Object(c["g"])("li",{class:"dropdown profile-dropdown"},[Object(c["g"])("a",{href:"#",class:"dropdown","data-toggle":"dropdown"},[Object(c["g"])("img",{src:"/img/3.png",alt:""}),Object(c["g"])("span",{class:"hidden-xs"},"userName")]),Object(c["g"])("ul",{class:"dropdown-menu pull-right"},[Object(c["g"])("li",null,[Object(c["g"])("a",{onclick:"btn_edit()"},[Object(c["g"])("i",{class:"ace-icon fa fa-key"}),Object(c["f"])("修改密码")])]),Object(c["g"])("li",{id:"exit"},[Object(c["g"])("a",{href:"~/Login/OutLogin"},[Object(c["g"])("i",{class:"ace-icon fa fa-power-off"}),Object(c["f"])("安全退出")])])])])])])])])],-1);Object(c["q"])();var A=S((function(t,e,n,i,o,a){return Object(c["p"])(),Object(c["d"])("div",P,[T])})),I={name:"Home",components:{}};n("b575e");I.render=A,I.__scopeId="data-v-1e0be0c3";var q=I,z=[{path:"/",name:"Login",component:M},{path:"/home",name:"Home",component:q}],H=Object(r["a"])({history:Object(r["b"])("/"),routes:z}),$=H,B=(n("a336"),n("73ef")),E=n.n(B),G=Object(c["c"])(a);G.use($),G.mount("#app"),G.config.globalProperties.$axios=E.a},"7f44":function(t,e,n){},"8d97":function(t,e,n){},a0f6:function(t,e,n){},b575e:function(t,e,n){"use strict";n("a0f6")},b8cd:function(t,e,n){"use strict";n("7f44")}});
//# sourceMappingURL=app.e33f3dd7.js.map