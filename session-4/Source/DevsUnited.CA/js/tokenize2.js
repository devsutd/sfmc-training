!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof module&&module.exports?module.exports=function(b,c){return void 0===c&&(c="undefined"!=typeof window?require("jquery"):require("jquery")(b)),a(c),c}:a(jQuery)}(function(a){function d(c){var d=[];return this.filter("select").each(function(){var e=a(this),f=e.data("tokenize2"),g="object"==typeof c&&c;f||e.data("tokenize2",new b(this,g)),d.push(e.data("tokenize2"))}),d.length>1?d:d[0]}var b=function(c,d){this.control=!1,this.element=a(c),this.options=a.extend({},b.DEFAULTS,d),this.options.tabIndex=-1===this.options.tabIndex?0:this.options.tabIndex,this.options.sortable=1!==this.options.tokensMaxItems&&this.options.sortable,this.bind(),this.trigger("tokenize:load")},c={BACKSPACE:8,TAB:9,ENTER:13,ESCAPE:27,ARROW_UP:38,ARROW_DOWN:40,CTRL:17,MAJ:16};b.VERSION="0.5-beta",b.DEBOUNCE=null,b.DEFAULTS={tokensMaxItems:0,tokensAllowCustom:!1,dropdownMaxItems:10,searchMinLength:0,searchFromStart:!0,searchHighlight:!0,displayNoResultsMessage:!1,noResultsMessageText:'No results mached "%s"',delimiter:",",dataSource:"select",debounce:0,placeholder:!1,sortable:!1,zIndexMargin:500,tabIndex:0},b.prototype.trigger=function(a,b,c,d){this.element.trigger(a,b,c,d)},b.prototype.bind=function(){this.element.on("tokenize:load",{},a.proxy(function(){this.init()},this)).on("tokenize:clear",{},a.proxy(function(){this.clear()},this)).on("tokenize:remap",{},a.proxy(function(){this.remap()},this)).on("tokenize:select",{},a.proxy(function(a,b){this.focus(b)},this)).on("tokenize:deselect",{},a.proxy(function(){this.blur()},this)).on("tokenize:search",{},a.proxy(function(a,b){this.find(b)},this)).on("tokenize:paste",{},a.proxy(function(){this.paste()},this)).on("tokenize:dropdown:up",{},a.proxy(function(){this.dropdownSelectionMove(-1)},this)).on("tokenize:dropdown:down",{},a.proxy(function(){this.dropdownSelectionMove(1)},this)).on("tokenize:dropdown:clear",{},a.proxy(function(){this.dropdownClear()},this)).on("tokenize:dropdown:show",{},a.proxy(function(){this.dropdownShow()},this)).on("tokenize:dropdown:hide",{},a.proxy(function(){this.dropdownHide()},this)).on("tokenize:dropdown:fill",{},a.proxy(function(a,b){this.dropdownFill(b)},this)).on("tokenize:dropdown:itemAdd",{},a.proxy(function(a,b){this.dropdownAddItem(b)},this)).on("tokenize:keypress",{},a.proxy(function(a,b){this.keypress(b)},this)).on("tokenize:keydown",{},a.proxy(function(a,b){this.keydown(b)},this)).on("tokenize:keyup",{},a.proxy(function(a,b){this.keyup(b)},this)).on("tokenize:tokens:reorder",{},a.proxy(function(){this.reorder()},this)).on("tokenize:tokens:add",{},a.proxy(function(a,b,c,d){this.tokenAdd(b,c,d)},this)).on("tokenize:tokens:remove",{},a.proxy(function(a,b){this.tokenRemove(b)},this))},b.prototype.init=function(){this.id=this.guid(),this.element.hide(),this.element.attr("multiple")||console.error("Attribute multiple is missing, tokenize2 can be buggy !"),this.dropdown=void 0,this.searchContainer=a('<li class="token-search" />'),this.input=a('<input autocomplete="off" />').on("keydown",{},a.proxy(function(a){this.trigger("tokenize:keydown",[a])},this)).on("keypress",{},a.proxy(function(a){this.trigger("tokenize:keypress",[a])},this)).on("keyup",{},a.proxy(function(a){this.trigger("tokenize:keyup",[a])},this)).on("focus",{},a.proxy(function(){this.input.val().length>0&&this.trigger("tokenize:search",[this.input.val()])},this)).on("paste",{},a.proxy(function(){this.options.tokensAllowCustom&&setTimeout(a.proxy(function(){this.trigger("tokenize:paste")},this),10)},this)),this.tokensContainer=a('<ul class="tokens-container form-control" />').addClass(this.element.attr("data-class")).attr("tabindex",this.options.tabIndex).append(this.searchContainer.append(this.input)),!1!==this.options.placeholder&&(this.placeholder=a('<li class="placeholder" />').html(this.options.placeholder),this.tokensContainer.prepend(this.placeholder),this.element.on("tokenize:tokens:add tokenize:remap tokenize:select tokenize:deselect tokenize:tokens:remove",a.proxy(function(){this.container.hasClass("focus")||a("li.token",this.tokensContainer).length>0||this.input.val().length>0?this.placeholder.hide():this.placeholder.show()},this))),this.container=a('<div class="tokenize" />').attr("id",this.id),this.container.append(this.tokensContainer).insertAfter(this.element),this.container.focusin(a.proxy(function(b){this.trigger("tokenize:select",[a(b.target)[0]===this.tokensContainer[0]])},this)).focusout(a.proxy(function(){this.trigger("tokenize:deselect")},this)),1===this.options.tokensMaxItems&&this.container.addClass("single"),this.options.sortable&&(void 0!==a.ui?(this.container.addClass("sortable"),this.tokensContainer.sortable({items:"li.token",cursor:"move",placeholder:"token shadow",forcePlaceholderSize:!0,update:a.proxy(function(){this.trigger("tokenize:tokens:reorder")},this),start:a.proxy(function(){this.searchContainer.hide()},this),stop:a.proxy(function(){this.searchContainer.show()},this)})):(this.options.sortable=!1,console.error("jQuery UI is not loaded, sortable option has been disabled"))),this.element.on("tokenize:tokens:add tokenize:tokens:remove",a.proxy(function(){this.options.tokensMaxItems>0&&a("li.token",this.tokensContainer).length>=this.options.tokensMaxItems?this.searchContainer.hide():this.searchContainer.show()},this)).on("tokenize:keydown tokenize:keyup tokenize:loaded",a.proxy(function(){this.scaleInput()},this)),this.trigger("tokenize:remap"),this.trigger("tokenize:tokens:reorder"),this.trigger("tokenize:loaded")},b.prototype.reorder=function(){if(this.options.sortable){var b,c;a.each(this.tokensContainer.sortable("toArray",{attribute:"data-value"}),a.proxy(function(d,e){c=a('option[value="'+e+'"]',this.element),void 0===b?c.prependTo(this.element):b.after(c),b=c},this))}},b.prototype.paste=function(){var b=new RegExp(this.escapeRegex(Array.isArray(this.options.delimiter)?this.options.delimiter.join("|"):this.options.delimiter),"ig");b.test(this.input.val())&&a.each(this.input.val().split(b),a.proxy(function(a,b){this.trigger("tokenize:tokens:add",[b,null,!0])},this))},b.prototype.tokenAdd=function(b,c,d){if(b=this.escape(b),c=c||b,d=d||!1,this.resetInput(),void 0===b||""===b)return this.trigger("tokenize:tokens:error:empty"),this;if(this.options.tokensMaxItems>0&&a("li.token",this.tokensContainer).length>=this.options.tokensMaxItems)return this.trigger("tokenize:tokens:error:max"),this;if(a('li.token[data-value="'+b+'"]',this.tokensContainer).length>0)return this.trigger("tokenize:tokens:error:duplicate",[b,c]),this;if(a('option[value="'+b+'"]',this.element).length)a('option[value="'+b+'"]',this.element).attr("selected","selected").prop("selected",!0);else if(d)this.element.append(a("<option selected />").val(b).html(c));else{if(!this.options.tokensAllowCustom)return this.trigger("tokenize:tokens:error:notokensAllowCustom"),this;this.element.append(a('<option selected data-type="custom" />').val(b).html(c))}return a('<li class="token" />').attr("data-value",b).append("<span>"+c+"</span>").prepend(a('<a class="dismiss" />').on("mousedown touchstart",{},a.proxy(function(a){a.preventDefault(),this.trigger("tokenize:tokens:remove",[b])},this))).insertBefore(this.searchContainer),this.trigger("tokenize:dropdown:hide"),this},b.prototype.tokenRemove=function(b){var c=a('option[value="'+b+'"]',this.element);return"custom"===c.attr("data-type")?c.remove():c.removeAttr("selected").prop("selected",!1),a('li.token[data-value="'+b+'"]',this.tokensContainer).remove(),this.trigger("tokenize:tokens:reorder"),this},b.prototype.remap=function(){return a("option:selected",this.element).each(a.proxy(function(b,c){this.trigger("tokenize:tokens:add",[a(c).val(),a(c).html(),!1])},this)),this},b.prototype.focus=function(a){a&&this.input.focus(),this.container.addClass("focus")},b.prototype.blur=function(){this.isDropdownOpen()&&this.trigger("tokenize:dropdown:hide"),this.container.removeClass("focus"),this.resetPending(),this.tokensContainer.attr("tabindex")||this.tokensContainer.attr("tabindex",this.options.tabIndex)},b.prototype.keydown=function(b){if("keydown"===b.type)switch(b.keyCode){case c.BACKSPACE:if(this.input.val().length<1){if(b.preventDefault(),a("li.token.pending-delete",this.tokensContainer).length>0)this.trigger("tokenize:tokens:remove",[a("li.token.pending-delete",this.tokensContainer).first().attr("data-value")]);else{var d=a("li.token:last",this.tokensContainer);d.length>0&&(this.trigger("tokenize:tokens:markForDelete",[d.attr("data-value")]),d.addClass("pending-delete"))}this.trigger("tokenize:dropdown:hide")}break;case c.TAB:b.shiftKey?this.tokensContainer.removeAttr("tabindex"):this.pressedDelimiter(b);break;case c.ENTER:this.pressedDelimiter(b);break;case c.ESCAPE:this.resetPending();break;case c.ARROW_UP:b.preventDefault(),this.trigger("tokenize:dropdown:up");break;case c.ARROW_DOWN:b.preventDefault(),this.trigger("tokenize:dropdown:down");break;case c.CTRL:this.control=!0;break;default:this.resetPending()}else b.preventDefault()},b.prototype.keyup=function(a){if("keyup"===a.type)switch(a.keyCode){case c.TAB:case c.ENTER:case c.ESCAPE:case c.ARROW_UP:case c.ARROW_DOWN:case c.MAJ:break;case c.CTRL:this.control=!1;break;case c.BACKSPACE:default:this.input.val().length>0?this.trigger("tokenize:search",[this.input.val()]):this.trigger("tokenize:dropdown:hide")}else a.preventDefault()},b.prototype.keypress=function(a){if("keypress"===a.type){var b=!1;Array.isArray(this.options.delimiter)?this.options.delimiter.indexOf(String.fromCharCode(a.which))>=0&&(b=!0):String.fromCharCode(a.which)===this.options.delimiter&&(b=!0),b&&this.pressedDelimiter(a)}else a.preventDefault()},b.prototype.pressedDelimiter=function(b){this.resetPending(),this.isDropdownOpen()&&a("li.active",this.dropdown).length>0&&!1===this.control?(b.preventDefault(),a("li.active a",this.dropdown).trigger("mousedown")):this.input.val().length>0&&(b.preventDefault(),this.trigger("tokenize:tokens:add",[this.input.val()]))},b.prototype.find=function(a){if(a.length<this.options.searchMinLength)return this.trigger("tokenize:dropdown:hide"),!1;this.lastSearchTerms=a,"select"===this.options.dataSource?this.dataSourceLocal(a):"function"==typeof this.options.dataSource?this.options.dataSource(a,this):this.dataSourceRemote(a)},b.prototype.dataSourceRemote=function(b){this.debounce(a.proxy(function(){void 0!==this.xhr&&this.xhr.abort(),this.xhr=a.ajax(this.options.dataSource,{data:{search:b},dataType:"json",success:a.proxy(function(b){var c=[];a.each(b,function(a,b){c.push(b)}),this.trigger("tokenize:dropdown:fill",[c])},this)})},this),this.options.debounce)},b.prototype.dataSourceLocal=function(b){var c=this.transliteration(b),d=[],e=(this.options.searchFromStart?"^":"")+this.escapeRegex(c),f=new RegExp(e,"i"),g=this;a("option",this.element).not(":selected, :disabled").each(function(){f.test(g.transliteration(a(this).html()))&&d.push({value:a(this).attr("value"),text:a(this).html()})}),this.trigger("tokenize:dropdown:fill",[d])},b.prototype.debounce=function(b,c){var d=arguments,e=a.proxy(function(){b.apply(this,d),this.debounceTimeout=void 0},this);void 0!==this.debounceTimeout&&clearTimeout(this.debounceTimeout),this.debounceTimeout=setTimeout(e,c||0)},b.prototype.dropdownShow=function(){this.isDropdownOpen()||(a(".tokenize-dropdown").remove(),this.dropdown=a('<div class="tokenize-dropdown dropdown"><ul class="dropdown-menu" /></div>').attr("data-related",this.id),a("body").append(this.dropdown),this.dropdown.show(),this.dropdown.css("z-index",this.calculatezindex()+this.options.zIndexMargin),a(window).on("resize scroll",{},a.proxy(function(){this.dropdownMove()},this)).trigger("resize"),this.trigger("tokenize:dropdown:shown"))},b.prototype.calculatezindex=function(){var a=this.container,b=0;if(!isNaN(parseInt(a.css("z-index")))&&parseInt(a.css("z-index"))>0&&(b=parseInt(a.css("z-index"))),b<1)for(;a.length;)if(a=a.parent(),a.length>0){if(!isNaN(parseInt(a.css("z-index")))&&parseInt(a.css("z-index"))>0)return parseInt(a.css("z-index"));if(a.is("html"))break}return b},b.prototype.dropdownHide=function(){this.isDropdownOpen()&&(a(window).off("resize scroll"),this.dropdown.remove(),this.dropdown=void 0,this.trigger("tokenize:dropdown:hidden"))},b.prototype.dropdownClear=function(){this.dropdown.find(".dropdown-menu li").remove()},b.prototype.dropdownFill=function(b){b&&b.length>0?(this.trigger("tokenize:dropdown:show"),this.trigger("tokenize:dropdown:clear"),a.each(b,a.proxy(function(b,c){a("li.dropdown-item",this.dropdown).length<=this.options.dropdownMaxItems&&this.trigger("tokenize:dropdown:itemAdd",[c])},this)),a("li.active",this.dropdown).length<1&&a("li:first",this.dropdown).addClass("active"),a("li.dropdown-item",this.dropdown).length<1?this.trigger("tokenize:dropdown:hide"):this.trigger("tokenize:dropdown:filled")):this.options.displayNoResultsMessage?(this.trigger("tokenize:dropdown:show"),this.trigger("tokenize:dropdown:clear"),this.dropdown.find(".dropdown-menu").append(a('<li class="dropdown-item locked" />').html(this.options.noResultsMessageText.replace("%s",this.input.val())))):this.trigger("tokenize:dropdown:hide"),a(window).trigger("resize")},b.prototype.dropdownSelectionMove=function(b){if(a("li.active",this.dropdown).length>0)if(a("li.active",this.dropdown).is("li:"+(b>0?"last-child":"first-child")))a("li.active",this.dropdown).removeClass("active"),a("li:"+(b>0?"first-child":"last-child"),this.dropdown).addClass("active");else{var c=a("li.active",this.dropdown);c.removeClass("active"),b>0?c.next().addClass("active"):c.prev().addClass("active")}else a("li:first",this.dropdown).addClass("active")},b.prototype.dropdownAddItem=function(b){if(this.isDropdownOpen()){var c=a('<li class="dropdown-item" />').html(this.dropdownItemFormat(b)).on("mouseover",a.proxy(function(b){b.preventDefault(),b.target=this.fixTarget(b.target),a("li",this.dropdown).removeClass("active"),a(b.target).parent().addClass("active")},this)).on("mouseout",a.proxy(function(){a("li",this.dropdown).removeClass("active")},this)).on("mousedown touchstart",a.proxy(function(b){b.preventDefault(),b.target=this.fixTarget(b.target),this.trigger("tokenize:tokens:add",[a(b.target).attr("data-value"),a(b.target).attr("data-text"),!0])},this));a('li.token[data-value="'+c.find("a").attr("data-value")+'"]',this.tokensContainer).length<1&&(this.dropdown.find(".dropdown-menu").append(c),this.trigger("tokenize:dropdown:itemAdded",[b]))}},b.prototype.fixTarget=function(b){var c=a(b);if(!c.data("value")){var d=c.find("a");if(d.length)return d.get(0);var e=c.parents("[data-value]");if(e.length)return e.get(0)}return c.get(0)},b.prototype.dropdownItemFormat=function(b){if(b.hasOwnProperty("text")){var c="";if(this.options.searchHighlight){var d=new RegExp((this.options.searchFromStart?"^":"")+"("+this.escapeRegex(this.transliteration(this.lastSearchTerms))+")","gi");c=b.text.replace(d,'<span class="tokenize-highlight">$1</span>')}else c=b.text;return a("<a />").html(c).attr({"data-value":b.value,"data-text":b.text})}},b.prototype.dropdownMove=function(){var a=this.tokensContainer.offset(),b=this.tokensContainer.outerHeight(),c=this.tokensContainer.outerWidth();a.top+=b,this.dropdown.css({width:c}).offset(a)},b.prototype.isDropdownOpen=function(){return void 0!==this.dropdown},b.prototype.clear=function(){return a.each(a("li.token",this.tokensContainer),a.proxy(function(b,c){this.trigger("tokenize:tokens:remove",[a(c).attr("data-value")])},this)),this.trigger("tokenize:dropdown:hide"),this},b.prototype.resetPending=function(){var b=a("li.pending-delete:last",this.tokensContainer);b.length>0&&(this.trigger("tokenize:tokens:cancelDelete",[b.attr("data-value")]),b.removeClass("pending-delete"))},b.prototype.scaleInput=function(){this.ctx||(this.ctx=document.createElement("canvas").getContext("2d"));var a,b;this.ctx.font=this.input.css("font-style")+" "+this.input.css("font-variant")+" "+this.input.css("font-weight")+" "+Math.ceil(parseFloat(this.input.css("font-size")))+"px "+this.input.css("font-family"),a=Math.round(this.ctx.measureText(this.input.val()+"M").width)+Math.ceil(parseFloat(this.searchContainer.css("margin-left")))+Math.ceil(parseFloat(this.searchContainer.css("margin-right"))),b=this.tokensContainer.width()-(Math.ceil(parseFloat(this.tokensContainer.css("border-left-width")))+Math.ceil(parseFloat(this.tokensContainer.css("border-right-width"))+Math.ceil(parseFloat(this.tokensContainer.css("padding-left")))+Math.ceil(parseFloat(this.tokensContainer.css("padding-right"))))),a>=b&&(a=b),this.searchContainer.width(a),this.ctx.restore()},b.prototype.resetInput=function(){this.input.val(""),this.scaleInput()},b.prototype.escape=function(a){var b=document.createElement("div");return b.innerHTML=a,a=b.textContent||b.innerText||"",String(a).replace(/["]/g,function(){return'"'})},b.prototype.escapeRegex=function(a){return a.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")},b.prototype.guid=function(){function a(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return a()+a()+"-"+a()+"-"+a()+"-"+a()+"-"+a()+a()+a()},b.prototype.toArray=function(){var b=[];return a("option:selected",this.element).each(function(){b.push(a(this).val())}),b},b.prototype.transliteration=function(a){var b={"Ⓐ":"A","Ａ":"A","À":"A","Á":"A","Â":"A","Ầ":"A","Ấ":"A","Ẫ":"A","Ẩ":"A","Ã":"A","Ā":"A","Ă":"A","Ằ":"A","Ắ":"A","Ẵ":"A","Ẳ":"A","Ȧ":"A","Ǡ":"A","Ä":"A","Ǟ":"A","Ả":"A","Å":"A","Ǻ":"A","Ǎ":"A","Ȁ":"A","Ȃ":"A","Ạ":"A","Ậ":"A","Ặ":"A","Ḁ":"A","Ą":"A","Ⱥ":"A","Ɐ":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ⓑ":"B","Ｂ":"B","Ḃ":"B","Ḅ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ɓ":"B","Ⓒ":"C","Ｃ":"C","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","Ç":"C","Ḉ":"C","Ƈ":"C","Ȼ":"C","Ꜿ":"C","Ⓓ":"D","Ｄ":"D","Ḋ":"D","Ď":"D","Ḍ":"D","Ḑ":"D","Ḓ":"D","Ḏ":"D","Đ":"D","Ƌ":"D","Ɗ":"D","Ɖ":"D","Ꝺ":"D","Ǳ":"DZ","Ǆ":"DZ","ǲ":"Dz","ǅ":"Dz","Ⓔ":"E","Ｅ":"E","È":"E","É":"E","Ê":"E","Ề":"E","Ế":"E","Ễ":"E","Ể":"E","Ẽ":"E","Ē":"E","Ḕ":"E","Ḗ":"E","Ĕ":"E","Ė":"E","Ë":"E","Ẻ":"E","Ě":"E","Ȅ":"E","Ȇ":"E","Ẹ":"E","Ệ":"E","Ȩ":"E","Ḝ":"E","Ę":"E","Ḙ":"E","Ḛ":"E","Ɛ":"E","Ǝ":"E","Ⓕ":"F","Ｆ":"F","Ḟ":"F","Ƒ":"F","Ꝼ":"F","Ⓖ":"G","Ｇ":"G","Ǵ":"G","Ĝ":"G","Ḡ":"G","Ğ":"G","Ġ":"G","Ǧ":"G","Ģ":"G","Ǥ":"G","Ɠ":"G","Ꞡ":"G","Ᵹ":"G","Ꝿ":"G","Ⓗ":"H","Ｈ":"H","Ĥ":"H","Ḣ":"H","Ḧ":"H","Ȟ":"H","Ḥ":"H","Ḩ":"H","Ḫ":"H","Ħ":"H","Ⱨ":"H","Ⱶ":"H","Ɥ":"H","Ⓘ":"I","Ｉ":"I","Ì":"I","Í":"I","Î":"I","Ĩ":"I","Ī":"I","Ĭ":"I","İ":"I","Ï":"I","Ḯ":"I","Ỉ":"I","Ǐ":"I","Ȉ":"I","Ȋ":"I","Ị":"I","Į":"I","Ḭ":"I","Ɨ":"I","Ⓙ":"J","Ｊ":"J","Ĵ":"J","Ɉ":"J","Ⓚ":"K","Ｋ":"K","Ḱ":"K","Ǩ":"K","Ḳ":"K","Ķ":"K","Ḵ":"K","Ƙ":"K","Ⱪ":"K","Ꝁ":"K","Ꝃ":"K","Ꝅ":"K","Ꞣ":"K","Ⓛ":"L","Ｌ":"L","Ŀ":"L","Ĺ":"L","Ľ":"L","Ḷ":"L","Ḹ":"L","Ļ":"L","Ḽ":"L","Ḻ":"L","Ł":"L","Ƚ":"L","Ɫ":"L","Ⱡ":"L","Ꝉ":"L","Ꝇ":"L","Ꞁ":"L","Ǉ":"LJ","ǈ":"Lj","Ⓜ":"M","Ｍ":"M","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ɯ":"M","Ⓝ":"N","Ｎ":"N","Ǹ":"N","Ń":"N","Ñ":"N","Ṅ":"N","Ň":"N","Ṇ":"N","Ņ":"N","Ṋ":"N","Ṉ":"N","Ƞ":"N","Ɲ":"N","Ꞑ":"N","Ꞥ":"N","Ǌ":"NJ","ǋ":"Nj","Ⓞ":"O","Ｏ":"O","Ò":"O","Ó":"O","Ô":"O","Ồ":"O","Ố":"O","Ỗ":"O","Ổ":"O","Õ":"O","Ṍ":"O","Ȭ":"O","Ṏ":"O","Ō":"O","Ṑ":"O","Ṓ":"O","Ŏ":"O","Ȯ":"O","Ȱ":"O","Ö":"O","Ȫ":"O","Ỏ":"O","Ő":"O","Ǒ":"O","Ȍ":"O","Ȏ":"O","Ơ":"O","Ờ":"O","Ớ":"O","Ỡ":"O","Ở":"O","Ợ":"O","Ọ":"O","Ộ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Ɔ":"O","Ɵ":"O","Ꝋ":"O","Ꝍ":"O","Ƣ":"OI","Ꝏ":"OO","Ȣ":"OU","Ⓟ":"P","Ｐ":"P","Ṕ":"P","Ṗ":"P","Ƥ":"P","Ᵽ":"P","Ꝑ":"P","Ꝓ":"P","Ꝕ":"P","Ⓠ":"Q","Ｑ":"Q","Ꝗ":"Q","Ꝙ":"Q","Ɋ":"Q","Ⓡ":"R","Ｒ":"R","Ŕ":"R","Ṙ":"R","Ř":"R","Ȑ":"R","Ȓ":"R","Ṛ":"R","Ṝ":"R","Ŗ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꝛ":"R","Ꞧ":"R","Ꞃ":"R","Ⓢ":"S","Ｓ":"S","ẞ":"S","Ś":"S","Ṥ":"S","Ŝ":"S","Ṡ":"S","Š":"S","Ṧ":"S","Ṣ":"S","Ṩ":"S","Ș":"S","Ş":"S","Ȿ":"S","Ꞩ":"S","Ꞅ":"S","Ⓣ":"T","Ｔ":"T","Ṫ":"T","Ť":"T","Ṭ":"T","Ț":"T","Ţ":"T","Ṱ":"T","Ṯ":"T","Ŧ":"T","Ƭ":"T","Ʈ":"T","Ⱦ":"T","Ꞇ":"T","Ꜩ":"TZ","Ⓤ":"U","Ｕ":"U","Ù":"U","Ú":"U","Û":"U","Ũ":"U","Ṹ":"U","Ū":"U","Ṻ":"U","Ŭ":"U","Ü":"U","Ǜ":"U","Ǘ":"U","Ǖ":"U","Ǚ":"U","Ủ":"U","Ů":"U","Ű":"U","Ǔ":"U","Ȕ":"U","Ȗ":"U","Ư":"U","Ừ":"U","Ứ":"U","Ữ":"U","Ử":"U","Ự":"U","Ụ":"U","Ṳ":"U","Ų":"U","Ṷ":"U","Ṵ":"U","Ʉ":"U","Ⓥ":"V","Ｖ":"V","Ṽ":"V","Ṿ":"V","Ʋ":"V","Ꝟ":"V","Ʌ":"V","Ꝡ":"VY","Ⓦ":"W","Ｗ":"W","Ẁ":"W","Ẃ":"W","Ŵ":"W","Ẇ":"W","Ẅ":"W","Ẉ":"W","Ⱳ":"W","Ⓧ":"X","Ｘ":"X","Ẋ":"X","Ẍ":"X","Ⓨ":"Y","Ｙ":"Y","Ỳ":"Y","Ý":"Y","Ŷ":"Y","Ỹ":"Y","Ȳ":"Y","Ẏ":"Y","Ÿ":"Y","Ỷ":"Y","Ỵ":"Y","Ƴ":"Y","Ɏ":"Y","Ỿ":"Y","Ⓩ":"Z","Ｚ":"Z","Ź":"Z","Ẑ":"Z","Ż":"Z","Ž":"Z","Ẓ":"Z","Ẕ":"Z","Ƶ":"Z","Ȥ":"Z","Ɀ":"Z","Ⱬ":"Z","Ꝣ":"Z","ⓐ":"a","ａ":"a","ẚ":"a","à":"a","á":"a","â":"a","ầ":"a","ấ":"a","ẫ":"a","ẩ":"a","ã":"a","ā":"a","ă":"a","ằ":"a","ắ":"a","ẵ":"a","ẳ":"a","ȧ":"a","ǡ":"a","ä":"a","ǟ":"a","ả":"a","å":"a","ǻ":"a","ǎ":"a","ȁ":"a","ȃ":"a","ạ":"a","ậ":"a","ặ":"a","ḁ":"a","ą":"a","ⱥ":"a","ɐ":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ⓑ":"b","ｂ":"b","ḃ":"b","ḅ":"b","ḇ":"b","ƀ":"b","ƃ":"b","ɓ":"b","ⓒ":"c","ｃ":"c","ć":"c","ĉ":"c","ċ":"c","č":"c","ç":"c","ḉ":"c","ƈ":"c","ȼ":"c","ꜿ":"c","ↄ":"c","ⓓ":"d","ｄ":"d","ḋ":"d","ď":"d","ḍ":"d","ḑ":"d","ḓ":"d","ḏ":"d","đ":"d","ƌ":"d","ɖ":"d","ɗ":"d","ꝺ":"d","ǳ":"dz","ǆ":"dz","ⓔ":"e","ｅ":"e","è":"e","é":"e","ê":"e","ề":"e","ế":"e","ễ":"e","ể":"e","ẽ":"e","ē":"e","ḕ":"e","ḗ":"e","ĕ":"e","ė":"e","ë":"e","ẻ":"e","ě":"e","ȅ":"e","ȇ":"e","ẹ":"e","ệ":"e","ȩ":"e","ḝ":"e","ę":"e","ḙ":"e","ḛ":"e","ɇ":"e","ɛ":"e","ǝ":"e","ⓕ":"f","ｆ":"f","ḟ":"f","ƒ":"f","ꝼ":"f","ⓖ":"g","ｇ":"g","ǵ":"g","ĝ":"g","ḡ":"g","ğ":"g","ġ":"g","ǧ":"g","ģ":"g","ǥ":"g","ɠ":"g","ꞡ":"g","ᵹ":"g","ꝿ":"g","ⓗ":"h","ｈ":"h","ĥ":"h","ḣ":"h","ḧ":"h","ȟ":"h","ḥ":"h","ḩ":"h","ḫ":"h","ẖ":"h","ħ":"h","ⱨ":"h","ⱶ":"h","ɥ":"h","ƕ":"hv","ⓘ":"i","ｉ":"i","ì":"i","í":"i","î":"i","ĩ":"i","ī":"i","ĭ":"i","ï":"i","ḯ":"i","ỉ":"i","ǐ":"i","ȉ":"i","ȋ":"i","ị":"i","į":"i","ḭ":"i","ɨ":"i","ı":"i","ⓙ":"j","ｊ":"j","ĵ":"j","ǰ":"j","ɉ":"j","ⓚ":"k","ｋ":"k","ḱ":"k","ǩ":"k","ḳ":"k","ķ":"k","ḵ":"k","ƙ":"k","ⱪ":"k","ꝁ":"k","ꝃ":"k","ꝅ":"k","ꞣ":"k","ⓛ":"l","ｌ":"l","ŀ":"l","ĺ":"l","ľ":"l","ḷ":"l","ḹ":"l","ļ":"l","ḽ":"l","ḻ":"l","ſ":"l","ł":"l","ƚ":"l","ɫ":"l","ⱡ":"l","ꝉ":"l","ꞁ":"l","ꝇ":"l","ǉ":"lj","ⓜ":"m","ｍ":"m","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ɯ":"m","ⓝ":"n","ｎ":"n","ǹ":"n","ń":"n","ñ":"n","ṅ":"n","ň":"n","ṇ":"n","ņ":"n","ṋ":"n","ṉ":"n","ƞ":"n","ɲ":"n","ŉ":"n","ꞑ":"n","ꞥ":"n","ǌ":"nj","ⓞ":"o","ｏ":"o","ò":"o","ó":"o","ô":"o","ồ":"o","ố":"o","ỗ":"o","ổ":"o","õ":"o","ṍ":"o","ȭ":"o","ṏ":"o","ō":"o","ṑ":"o","ṓ":"o","ŏ":"o","ȯ":"o","ȱ":"o","ö":"o","ȫ":"o","ỏ":"o","ő":"o","ǒ":"o","ȍ":"o","ȏ":"o","ơ":"o","ờ":"o","ớ":"o","ỡ":"o","ở":"o","ợ":"o","ọ":"o","ộ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","ɔ":"o","ꝋ":"o","ꝍ":"o","ɵ":"o","ƣ":"oi","ȣ":"ou","ꝏ":"oo","ⓟ":"p","ｐ":"p","ṕ":"p","ṗ":"p","ƥ":"p","ᵽ":"p","ꝑ":"p","ꝓ":"p","ꝕ":"p","ⓠ":"q","ｑ":"q","ɋ":"q","ꝗ":"q","ꝙ":"q","ⓡ":"r","ｒ":"r","ŕ":"r","ṙ":"r","ř":"r","ȑ":"r","ȓ":"r","ṛ":"r","ṝ":"r","ŗ":"r","ṟ":"r","ɍ":"r","ɽ":"r","ꝛ":"r","ꞧ":"r","ꞃ":"r","ⓢ":"s","ｓ":"s","ß":"s","ś":"s","ṥ":"s","ŝ":"s","ṡ":"s","š":"s","ṧ":"s","ṣ":"s","ṩ":"s","ș":"s","ş":"s","ȿ":"s","ꞩ":"s","ꞅ":"s","ẛ":"s","ⓣ":"t","ｔ":"t","ṫ":"t","ẗ":"t","ť":"t","ṭ":"t","ț":"t","ţ":"t","ṱ":"t","ṯ":"t","ŧ":"t","ƭ":"t","ʈ":"t","ⱦ":"t","ꞇ":"t","ꜩ":"tz","ⓤ":"u","ｕ":"u","ù":"u","ú":"u","û":"u","ũ":"u","ṹ":"u","ū":"u","ṻ":"u","ŭ":"u","ü":"u","ǜ":"u","ǘ":"u","ǖ":"u","ǚ":"u","ủ":"u","ů":"u","ű":"u","ǔ":"u","ȕ":"u","ȗ":"u","ư":"u","ừ":"u","ứ":"u","ữ":"u","ử":"u","ự":"u","ụ":"u","ṳ":"u","ų":"u","ṷ":"u","ṵ":"u","ʉ":"u","ⓥ":"v","ｖ":"v","ṽ":"v","ṿ":"v","ʋ":"v","ꝟ":"v","ʌ":"v","ꝡ":"vy","ⓦ":"w","ｗ":"w","ẁ":"w","ẃ":"w","ŵ":"w","ẇ":"w","ẅ":"w","ẘ":"w","ẉ":"w","ⱳ":"w","ⓧ":"x","ｘ":"x","ẋ":"x","ẍ":"x","ⓨ":"y","ｙ":"y","ỳ":"y","ý":"y","ŷ":"y","ỹ":"y","ȳ":"y","ẏ":"y","ÿ":"y","ỷ":"y","ẙ":"y","ỵ":"y","ƴ":"y","ɏ":"y","ỿ":"y","ⓩ":"z","ｚ":"z","ź":"z","ẑ":"z","ż":"z","ž":"z","ẓ":"z","ẕ":"z","ƶ":"z","ȥ":"z","ɀ":"z","ⱬ":"z","ꝣ":"z","Ά":"Α","Έ":"Ε","Ή":"Η","Ί":"Ι","Ϊ":"Ι","Ό":"Ο","Ύ":"Υ","Ϋ":"Υ","Ώ":"Ω","ά":"α","έ":"ε","ή":"η","ί":"ι","ϊ":"ι","ΐ":"ι","ό":"ο","ύ":"υ","ϋ":"υ","ΰ":"υ","ω":"ω","ς":"σ"},c=function(a){return b[a]||a};return a.replace(/[^\u0000-\u007E]/g,c)};var e=a.fn.tokenize2;a.fn.tokenize2=d,a.fn.tokenize2.Constructor=b,a.fn.tokenize2.noConflict=function(){return a.fn.tokenize2=e,this}});