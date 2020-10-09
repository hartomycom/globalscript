(function($){$.fn.theiaStickySidebar=function(options){var defaults={'containerSelector':'','additionalMarginTop':0,'additionalMarginBottom':0,'updateSidebarHeight':true,'minWidth':0,'disableOnResponsiveLayouts':true,'sidebarBehavior':'modern','defaultPosition':'relative','namespace':'TSS'};options=$.extend(defaults,options);options.additionalMarginTop=parseInt(options.additionalMarginTop)||0;options.additionalMarginBottom=parseInt(options.additionalMarginBottom)||0;tryInitOrHookIntoEvents(options,this);function tryInitOrHookIntoEvents(options,$that){var success=tryInit(options,$that);if(!success){console.log('TSS: Body width smaller than options.minWidth. Init is delayed.');$(document).on('scroll.'+options.namespace,function(options,$that){return function(evt){var success=tryInit(options,$that);if(success){$(this).unbind(evt)}}}(options,$that));$(window).on('resize.'+options.namespace,function(options,$that){return function(evt){var success=tryInit(options,$that);if(success){$(this).unbind(evt)}}}(options,$that))}}function tryInit(options,$that){if(options.initialized===true){return true}if($('body').width()<options.minWidth){return false}init(options,$that);return true}function init(options,$that){options.initialized=true;var existingStylesheet=$('#theia-sticky-sidebar-stylesheet-'+options.namespace);if(existingStylesheet.length===0){$('head').append($('<style id="theia-sticky-sidebar-stylesheet-'+options.namespace+'">.theiaStickySidebar:after {content: ""; display: table; clear: both;}</style>'))}$that.each(function(){var o={};o.sidebar=$(this);o.options=options||{};o.container=$(o.options.containerSelector);if(o.container.length==0){o.container=o.sidebar.parent()}o.sidebar.parents().css('-webkit-transform','none');o.sidebar.css({'position':o.options.defaultPosition,'overflow':'visible','-webkit-box-sizing':'border-box','-moz-box-sizing':'border-box','box-sizing':'border-box'});o.stickySidebar=o.sidebar.find('.theiaStickySidebar');if(o.stickySidebar.length==0){var javaScriptMIMETypes=/(?:text|application)\/(?:x-)?(?:javascript|ecmascript)/i;o.sidebar.find('script').filter(function(index,script){return script.type.length===0||script.type.match(javaScriptMIMETypes)}).remove();o.stickySidebar=$('<div>').addClass('theiaStickySidebar').append(o.sidebar.children());o.sidebar.append(o.stickySidebar)}o.marginBottom=parseInt(o.sidebar.css('margin-bottom'));o.paddingTop=parseInt(o.sidebar.css('padding-top'));o.paddingBottom=parseInt(o.sidebar.css('padding-bottom'));var collapsedTopHeight=o.stickySidebar.offset().top;var collapsedBottomHeight=o.stickySidebar.outerHeight();o.stickySidebar.css('padding-top',1);o.stickySidebar.css('padding-bottom',1);collapsedTopHeight-=o.stickySidebar.offset().top;collapsedBottomHeight=o.stickySidebar.outerHeight()-collapsedBottomHeight-collapsedTopHeight;if(collapsedTopHeight==0){o.stickySidebar.css('padding-top',0);o.stickySidebarPaddingTop=0}else{o.stickySidebarPaddingTop=1}if(collapsedBottomHeight==0){o.stickySidebar.css('padding-bottom',0);o.stickySidebarPaddingBottom=0}else{o.stickySidebarPaddingBottom=1}o.previousScrollTop=null;o.fixedScrollTop=0;resetSidebar();o.onScroll=function(o){if(!o.stickySidebar.is(":visible")){return}if($('body').width()<o.options.minWidth){resetSidebar();return}if(o.options.disableOnResponsiveLayouts){var sidebarWidth=o.sidebar.outerWidth(o.sidebar.css('float')=='none');if(sidebarWidth+50>o.container.width()){resetSidebar();return}}var scrollTop=$(document).scrollTop();var position='static';if(scrollTop>=o.sidebar.offset().top+(o.paddingTop-o.options.additionalMarginTop)){var offsetTop=o.paddingTop+options.additionalMarginTop;var offsetBottom=o.paddingBottom+o.marginBottom+options.additionalMarginBottom;var containerTop=o.sidebar.offset().top;var containerBottom=o.sidebar.offset().top+getClearedHeight(o.container);var windowOffsetTop=0+options.additionalMarginTop;var windowOffsetBottom;var sidebarSmallerThanWindow=(o.stickySidebar.outerHeight()+offsetTop+offsetBottom)<$(window).height();if(sidebarSmallerThanWindow){windowOffsetBottom=windowOffsetTop+o.stickySidebar.outerHeight()}else{windowOffsetBottom=$(window).height()-o.marginBottom-o.paddingBottom-options.additionalMarginBottom}var staticLimitTop=containerTop-scrollTop+o.paddingTop;var staticLimitBottom=containerBottom-scrollTop-o.paddingBottom-o.marginBottom;var top=o.stickySidebar.offset().top-scrollTop;var scrollTopDiff=o.previousScrollTop-scrollTop;if(o.stickySidebar.css('position')=='fixed'){if(o.options.sidebarBehavior=='modern'){top+=scrollTopDiff}}if(o.options.sidebarBehavior=='stick-to-top'){top=options.additionalMarginTop}if(o.options.sidebarBehavior=='stick-to-bottom'){top=windowOffsetBottom-o.stickySidebar.outerHeight()}if(scrollTopDiff>0){top=Math.min(top,windowOffsetTop)}else{top=Math.max(top,windowOffsetBottom-o.stickySidebar.outerHeight())}top=Math.max(top,staticLimitTop);top=Math.min(top,staticLimitBottom-o.stickySidebar.outerHeight());var sidebarSameHeightAsContainer=o.container.height()==o.stickySidebar.outerHeight();if(!sidebarSameHeightAsContainer&&top==windowOffsetTop){position='fixed'}else if(!sidebarSameHeightAsContainer&&top==windowOffsetBottom-o.stickySidebar.outerHeight()){position='fixed'}else if(scrollTop+top-o.sidebar.offset().top-o.paddingTop<=options.additionalMarginTop){position='static'}else{position='absolute'}}if(position=='fixed'){var scrollLeft=$(document).scrollLeft();o.stickySidebar.css({'position':'fixed','width':getWidthForObject(o.stickySidebar)+'px','transform':'translateY('+top+'px)','left':(o.sidebar.offset().left+parseInt(o.sidebar.css('padding-left'))-scrollLeft)+'px','top':'0px'})}else if(position=='absolute'){var css={};if(o.stickySidebar.css('position')!='absolute'){css.position='absolute';css.transform='translateY('+(scrollTop+top-o.sidebar.offset().top-o.stickySidebarPaddingTop-o.stickySidebarPaddingBottom)+'px)';css.top='0px'}css.width=getWidthForObject(o.stickySidebar)+'px';css.left='';o.stickySidebar.css(css)}else if(position=='static'){resetSidebar()}if(position!='static'){if(o.options.updateSidebarHeight==true){o.sidebar.css({'min-height':o.stickySidebar.outerHeight()+o.stickySidebar.offset().top-o.sidebar.offset().top+o.paddingBottom})}}o.previousScrollTop=scrollTop};o.onScroll(o);$(document).on('scroll.'+o.options.namespace,function(o){return function(){o.onScroll(o)}}(o));$(window).on('resize.'+o.options.namespace,function(o){return function(){o.stickySidebar.css({'position':'static'});o.onScroll(o)}}(o));if(typeof ResizeSensor!=='undefined'){new ResizeSensor(o.stickySidebar[0],function(o){return function(){o.onScroll(o)}}(o))}function resetSidebar(){o.fixedScrollTop=0;o.sidebar.css({'min-height':'1px'});o.stickySidebar.css({'position':'static','width':'','transform':'none'})}function getClearedHeight(e){var height=e.height();e.children().each(function(){height=Math.max(height,$(this).height())});return height}})}function getWidthForObject(object){var width;try{width=object[0].getBoundingClientRect().width}catch(err){}if(typeof width==="undefined"){width=object.width()}return width}return this}})(jQuery);

var Shortcode=function(el,tags){if(!el){return}this.el=el;this.tags=tags;this.matches=[];this.regex='\\[{name}(\\s[\\s\\S]*?)?\\]'+'(?:((?!\\s*?(?:\\[{name}|\\[\\/(?!{name})))[\\s\\S]*?)'+'(\\[\/{name}\\]))?';if(this.el.jquery){this.el=this.el[0]}this.matchTags();this.convertMatchesToNodes();this.replaceNodes()};Shortcode.prototype.matchTags=function(){var html=this.el.outerHTML,instances,match,re,contents,regex,tag,options;for(var key in this.tags){if(!this.tags.hasOwnProperty(key)){return}re=this.template(this.regex,{name:key});instances=html.match(new RegExp(re,'g'))||[];for(var i=0,len=instances.length;i<len;i++){match=instances[i].match(new RegExp(re));contents=match[3]?'':undefined;tag=match[0];regex=this.escapeTagRegExp(tag);options=this.parseOptions(match[1]);if(match[2]){contents=match[2].trim();tag=tag.replace(contents,'').replace(/\n\s*/g,'');regex=this.escapeTagRegExp(tag).replace('\\]\\[','\\]([\\s\\S]*?)\\[')}this.matches.push({name:key,tag:tag,regex:regex,options:options,contents:contents})}}};Shortcode.prototype.convertMatchesToNodes=function(){var html=this.el.innerHTML,excludes,re,replacer;replacer=function(match,p1,p2,p3,p4,offset,string){if(p1){return match}else{var node=document.createElement('span');node.setAttribute('data-sc-tag',this.tag);node.className='omesnap-node omesnap-node-'+this.name;return node.outerHTML}};for(var i=0,len=this.matches.length;i<len;i++){excludes='((data-sc-tag=")|(<pre.*)|(<code.*))?';re=new RegExp(excludes+this.matches[i].regex,'g');html=html.replace(re,replacer.bind(this.matches[i]))}this.el.innerHTML=html};Shortcode.prototype.replaceNodes=function(){var self=this,html,match,result,done,node,fn,replacer,nodes=this.el.querySelectorAll('.omesnap-node');replacer=function(result){if(result.jquery){result=result[0]}result=self.parseCallbackResult(result);node.parentNode.replaceChild(result,node)};for(var i=0,len=this.matches.length;i<len;i++){match=this.matches[i];node=this.el.querySelector('.omesnap-node-'+match.name);if(node&&node.dataset.scTag===match.tag){fn=this.tags[match.name].bind(match);done=replacer.bind(match);result=fn(done);if(result!==undefined){done(result)}}}};Shortcode.prototype.parseCallbackResult=function(result){var container,fragment,children;switch(typeof result){case'function':result=document.createTextNode(result());break;case'string':container=document.createElement('div');fragment=document.createDocumentFragment();container.innerHTML=result;children=container.childNodes;if(children.length){for(var i=0,len=children.length;i<len;i++){fragment.appendChild(children[i].cloneNode(true))}result=fragment}else{result=document.createTextNode(result)}break;case'object':if(!result.nodeType){result=JSON.stringomesnap(result);result=document.createTextNode(result)}break;case'default':break}return result};Shortcode.prototype.parseOptions=function(stringOptions){var options={},set;if(!stringOptions){return}set=stringOptions.replace(/(\w+=)/g,'\n$1').split('\n');set.shift();for(var i=0;i<set.length;i++){var kv=set[i].split('=');options[kv[0]]=kv[1].replace(/\'|\"/g,'').trim()}return options};Shortcode.prototype.escapeTagRegExp=function(regex){return regex.replace(/[\[\]\/]/g,'\\$&')};Shortcode.prototype.template=function(s,d){for(var p in d){s=s.replace(new RegExp('{'+p+'}','g'),d[p])}return s};String.prototype.trim=String.prototype.trim||function(){return this.replace(/^\s+|\s+$/g,'')};if(window.jQuery){var pluginName='shortcode';$.fn[pluginName]=function(tags){this.each(function(){if(!$.data(this,pluginName)){$.data(this,pluginName,new Shortcode(this,tags))}});return this}}

/*! Menu */
!function(a){a.fn.menuomesnap=function(){return this.each(function(){var $t=a(this),b=$t.find('.LinkList ul > li').children('a'),c=b.length;for(var i=0;i<c;i++){var d=b.eq(i),h=d.text();if(h.charAt(0)!=='_'){var e=b.eq(i+1),j=e.text();if(j.charAt(0)==='_'){var m=d.parent();m.append('<ul class="sub-menu littleSub"/>');}}if(h.charAt(0)==='_'){d.text(h.replace('_',''));d.parent().appendTo(m.children('.sub-menu'));}}for(var i=0;i<c;i++){var f=b.eq(i),k=f.text();if(k.charAt(0)!=='_'){var g=b.eq(i+1),l=g.text();if(l.charAt(0)==='_'){var n=f.parent();n.append('<ul class="sub-menu2 littleSub"/>');}}if(k.charAt(0)==='_'){f.text(k.replace('_',''));f.parent().appendTo(n.children('.sub-menu2'));}}$t.find('.LinkList ul li ul').parent('li').addClass('subNavigasi');});}}(jQuery);

/*! Tab */
!function(a){a.fn.tabomesnap=function(b){b=jQuery.extend({onHover:false,animated:true},b);return this.each(function(){var e=a(this),c=e.children('[tab-omy]'),d=0,n='',k='tab-active';if(b.onHover==true){var event='mouseenter'}else{var event='click'}e.prepend('<ul class="select-tab"></ul>');c.each(function(){if(b.animated==true){a(this).addClass(n)}e.find('.select-tab').append('<li class="touch-effect"><a href="javascript:;">'+a(this).attr('tab-omy')+'<svg width="1em" height="1em" fill="currentColor" viewBox="0 0 24 24"><path d="M10.707 17.707L16.414 12l-5.707-5.707l-1.414 1.414L13.586 12l-4.293 4.293z"/></svg></a></li>')}).eq(d).addClass(k);e.find('.select-tab a').on(event,function(){var f=a(this).parent().index();a(this).closest('.select-tab').find('.active').removeClass('active');a(this).parent().addClass('active');c.removeClass(k).eq(f).addClass(k);return false}).eq(d).parent().addClass('active')})}}(jQuery);

	$('#grid').click(function(){
	$(".blog-posts").removeClass('list');
	$("#list").removeClass('active');
	$("#grid").addClass('active');
    $(".blog-posts").removeClass('post-animated post-fadeInUp');
	});	
	$('#list').click(function(){
	$(".blog-posts").addClass('list');
	$("#grid").removeClass('active');
	$("#list").addClass('active');
    $(".blog-posts").addClass('post-animated post-fadeInUp');
	});

$(function(){$(".separator:first").remove(),$(".post-body > img:first").remove()});

$("#dark").click(function(){$("body").toggleClass("dark")}),$("body").toggleClass(localStorage.toggled),$("#dark").click(function(){"dark"!=localStorage.toggled?($("body").toggleClass("dark",!0),localStorage.toggled="dark"):($("body").toggleClass("dark",!1),localStorage.toggled="")});

$(document).ready(function(){$('a[name="ad-post-top"]').before($("#ads-post-1 .widget-content").html()),$("#ads-post-1 .widget-content").html(""),$('a[name="ad-post-bottom"]').before($("#ads-post-2 .widget-content").html()),$("#ads-post-2 .widget-content").html("")});

var prevScrollpos=window.pageYOffset;window.onscroll=function(){var currentScrollPos=window.pageYOffset;if(prevScrollpos>currentScrollPos){document.getElementById("at-custom-mobile-bar").style.bottom="40px"}else{document.getElementById("at-custom-mobile-bar").style.bottom="-15px"}
prevScrollpos=currentScrollPos}

$(document).ready(function(a){a(window).on("scroll",function(){a(window).scrollTop()+a(window).height()>a(".item .blog-post").outerHeight()?a("#at-custom-sidebar").hide():a("#at-custom-sidebar").show()})});
$(function(){$(window).scroll(function(){600<$(this).scrollTop()?$(""):$("#at-custom-sidebar").hide()})});

 !function(a) {
    a.fn.lazyomesnap=function() {
        return this.each(function() {
                var t=a(this), dImg=t.attr('data-omy'), iWid=Math.round(t.width()), iHei=Math.round(t.height()), iSiz='/w'+iWid+'-h'+iHei+'-p-k-no-nu', img=''; if(dImg.match('s72-c')) {
                    img=dImg.replace('/s72-c', iSiz)
                }
                
                else if(dImg.match('w72-h')) {
                    img=dImg.replace('/w72-h72-p-k-no-nu', iSiz)
                }
                
                else {
                    img=dImg
                }
                
                a(window).on('resize scroll', lazyOnScroll); function lazyOnScroll() {
                    var wHeight=a(window).height(), scrTop=a(window).scrollTop(), offTop=t.offset().top; if(scrTop+wHeight>offTop) {
                        var n=new Image(); n.onload=function() {
                            t.attr('style', 'background-image:url('+this.src+')').addClass('lazyload')
                        }
                        
                        , n.src=img
                    }
                }
                
                lazyOnScroll()
            }
            
        )
    }
}(jQuery);
!function() {
  omeLazyYt('sddefault');
function omeLazyYt(_0xc7dex2) {
    $(".ytl").each(function () {
        var _0xc7dex3 = "https://img.youtube.com/vi/" + $(this).data("embed") + "/" + _0xc7dex2 + ".jpg";
        $(this).append('<span class="youtube-thumb" data-omy="'+_0xc7dex3+'"/>');
        $(this).addClass('omeLazyYt');
        $(this).append('<span class="button"><svg class="btn-play-yt" viewBox="0 0 213.7 213.7"><polygon class="triangle" points="73.5,62.5 148.5,105.8 73.5,149.1"></polygon><circle class="circle" cx="106.8" cy="106.8" r="103.3"></circle></svg></span>');
        $(this).click(function () {
            $(this).html("");
            $("<iframe>", {
                id: "youtubeOmesnap",
                src: "https://www.youtube.com/embed/" + $(this).data("embed"),
                frameborder: 0,
                allow: "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",
                allowfullscreen: ""
            }).appendTo($(this))
        })
    })
}
}(jQuery);
$('#omesnap-menuNavigasi').menuomesnap();
$('#omesnap-menuNavigasi .widget').addClass('show-menu');

$('.show-search').on('click', function () {
        $('#nav-search').toggleClass('open');
    });
$('.hide-search').on('click', function () {
        $('#nav-search').removeClass('open');
    });

$('.blog-posts-headline,.related-title').each(function() {
        var $t=$(this), $m=$t.find('.more'), $mT=showMoreText; if($mT !='') {
            $m.text($mT)
        }
    }
    
);

$('.blog-posts-headline,.related-title').each(function() {
        var $t=$(this), $m=$t.find('.more'), $mT=showMoreText; if($mT !='') {
            $m.text($mT)
        }
    }
    
);

$('.follow-by-email-text').each(function() {
        var $t=$(this), $fbet=followByEmailText; if($fbet !='') {
            $t.text($fbet)
        }
    }
    
);

$(".post-body strike").each(function() {
    var e = $(this),
        a = e.text().trim();
    "$ads={1}" == a && e.replaceWith('<div id="new-before-ad"/>'), 
    "$ads={2}" == a && e.replaceWith('<div id="new-after-ad"/>'),
    "$related={1}" == a && e.replaceWith('<div id="content-related"/>'),
    "$related={2}" == a && e.replaceWith('<div id="content-related2"/>')
}); 

$('#new-before-ad').each(function() {
        var $t=$(this); if($t.length) {
            $('#before-ad').appendTo($t)
        }
    }
    
);

$('#new-after-ad').each(function() {
        var $t=$(this); if($t.length) {
            $('#after-ad').appendTo($t)
        }
    }
    
);

$('#content-related').each(function() {
        var $t=$(this); if($t.length) {
            $('#related-midle').appendTo($t)
        }
    }
    
);

$('#content-related2').each(function() {
        var $t=$(this); if($t.length) {
            $('#related-midle2').appendTo($t)
        }
    }
    
);

$('#main-before-ad .widget').each(function() {
        var $t=$(this); if($t.length) {
            $t.appendTo($('#before-ad'))
        }
    }
    
);

$('#main-after-ad .widget').each(function() {
        var $t=$(this); if($t.length) {
            $t.appendTo($('#after-ad'))
        }
    }
    
);

$('#relatedthumb').each(function() {
        var $t=$(this); if($t.length) {
            $t.appendTo($('#related-midle'))
        }
    }
    
);

$('#relatedtext').each(function() {
        var $t=$(this); if($t.length) {
            $t.appendTo($('#related-midle2'))
        }
    }
    
);
  var base64 = {
      _keyStr: 'QWERT0UIOPASHFGDJKLZXCVBNMqwertyuiopasdfgh+/=jklzxcvbnm123456789Y',
      encode: function (input) {
          var output, chr1, chr2, chr3, enc1, enc2, enc3, enc4 = '',
              i = 0;
          for (input = base64._utf8_encode(input); i < input.length;) {
              chr3 = (output = input.charCodeAt(i++)) >> 2, enc1 = (3 & output) << 4 | (chr1 = input.charCodeAt
                      (i++)) >> 4, enc2 = (15 & chr1) << 2 | (chr2 = input.charCodeAt(i++)) >> 6, enc3 = 63 &
                  chr2, isNaN(chr1) ? enc2 = enc3 = 64 : isNaN(chr2) && (enc3 = 64), enc4 = enc4 + this._keyStr
                  .charAt(chr3) + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(
                      enc3)
          };
          return enc4
      },
      decode: function (input) {
          var output, chr1, chr2, chr3, enc1, enc2, enc3 = '',
              enc4 = 0;
          for (input = input.replace(/[^A-Za-z0-9\+\/\=]/g, ''); enc4 < input.length;) {
              output = this._keyStr.indexOf(input.charAt(enc4++)) << 2 | (chr3 = this._keyStr.indexOf(input.charAt(
                      enc4++))) >> 4, chr1 = (15 & chr3) << 4 | (enc1 = this._keyStr.indexOf(input.charAt(
                  enc4++))) >> 2, chr2 = (3 & enc1) << 6 | (enc2 = this._keyStr.indexOf(input.charAt(enc4++))),
                  enc3 += String.fromCharCode(output), 64 != enc1 && (enc3 += String.fromCharCode(chr1)), 64 != enc2 &&
                  (enc3 += String.fromCharCode(chr2))
          };
          return base64._utf8_decode(enc3)
      },
      _utf8_encode: function (input) {
          input = input.replace(/\r\n/g, '\x0A');
          for (var output = '', chr1 = 0; chr1 < input.length; chr1++) {
              var chr2 = input.charCodeAt(chr1);
              chr2 < 128 ? output += String.fromCharCode(chr2) : (127 < chr2 && chr2 < 2048 ? output += String.fromCharCode(chr2 >> 6 | 192) : (output += String.fromCharCode(chr2 >> 12 | 224), output += String.fromCharCode(chr2 >> 6 & 63 | 128)), output += String.fromCharCode(63 & chr2 | 128))
          };
          return output
      },
      _utf8_decode: function (input) {
          for (var output = '', chr1 = 0, chr2 = c1 = c2 = 0; chr1 < input.length;) {
              (chr2 = input.charCodeAt(chr1)) < 128 ? (output += String.fromCharCode(chr2), chr1++) : 191 < chr2 &&
                  chr2 < 224 ? (c2 = input.charCodeAt(chr1 + 1), output += String.fromCharCode((31 & chr2) << 6 | 63 & c2),
                      chr1 += 2) : (c2 = input.charCodeAt(chr1 + 1), c3 = input.charCodeAt(chr1 + 2), output += String.fromCharCode((15 & chr2) << 12 | (63 & c2) << 6 | 63 & c3), chr1 += 3)
          };
          return output
      }
  };

$('#sidebar-tabs').each(function() {
        $('#sidebar-tabs .widget').each(function() {
                var textTab=$(this).find('.widget-title > h3').text().trim(); $(this).attr('tab-omy', textTab)
            }
            
        ); $('#sidebar-tabs').tabomesnap(); var wCount=$('#sidebar-tabs .widget').length; if(wCount>=1) {
            $(this).addClass('tabs-'+wCount).show()
        }
    }
    
);

$('.avatar-image-container img').attr('src', function($this, i) {
        i=i.replace('//resources.blogblog.com/img/blank.gif', '//1.bp.blogspot.com/-1SBxYRxh8nI/Xyf3gU0XAtI/AAAAAAAAACE/b3KsNEifd00wU7C_76VHyjwAGqKG_ahTACLcBGAsYHQ/s35-r/hartomyAvatar.jpg'); i=i.replace('//img1.blogblog.com/img/blank.gif', '//1.bp.blogspot.com/-1SBxYRxh8nI/Xyf3gU0XAtI/AAAAAAAAACE/b3KsNEifd00wU7C_76VHyjwAGqKG_ahTACLcBGAsYHQ/s35-r/hartomyAvatar.jpg'); return i
    }
    
);

$('.post-body a').each(function(px) {
    var $this=$(this), type=$this.text().trim(), sp=type.split('/'), txt=sp[0], ico=sp[1], color=sp.pop(); 
    if(type.match('button')) {
        $this.addClass('button').text(txt); if(ico !='button') {
            $this.addClass(ico)
        }
        
        if(color !='button') {
            $this.addClass('button-color').css( {
                    'background-color':color
                }
                
            )
        }
    };
    if(type.match('outline')) {
        $this.addClass('outline').text(txt); if(ico !='outline') {
            $this.addClass(ico)
        }
        
        if(color !='outline') {
                var px = 1;
            $this.addClass('outline-color').css( {"border":  px+"px " +" solid"+ color,"color":color })
        }
    }
});

var scroll="yes",Fscroll=scroll.replace(/(\r\n|\n|\r)/gm," ");"yes"===Fscroll&&($(document).ready(function(){$("body")}),$(window).bind("load resize scroll",function(){var o=$(this).height();$(".post-body img").each(function(){var s=.1*$(this).height()-o+$(this).offset().top;$(document).scrollTop()>s&&$(this).addClass("omesnap")})}));

$('.post-body pre').each(function() {
    var $this=$(this), html=$this.html(); 
        $this.replaceWith('<pre class="code-box"><code>'+html+'<code></pre>')
});

$('.post-body blockquote').each(function() {
    var $this=$(this), html=$this.html(); 
        $this.replaceWith('<blockquote><svg width="1em" height="1em" viewBox="0 0 24 24"><path d="M7 21a4 4 0 0 1-4-4c0-1.473 1.333-6.14 4-14h2L7 13a4 4 0 1 1 0 8zm10 0a4 4 0 0 1-4-4c0-1.473 1.333-6.14 4-14h2l-2 10a4 4 0 1 1 0 8z" fill="#626262"/></svg>'+html+'</blockquote>')
});

$('.post-body blockquote').each(function() {
  var $this=$(this), type=$this.text().trim(), html=$this.html(); 
  if(type.match('code-box')) {
      $this.replaceWith('<pre class="code-box short-b"><code>'+html+'<code></pre>')
  }

  var $sb=$('.post-body .short-b').find('b'); $sb.each(function() {
          var $b=$(this), $t=$b.text().trim(); if($t.match('code-box')) {
              $b.replaceWith("")
          }
      }
      
  )
});
 var documentWrite = '<style>body{background:#000!important;overflow:hidden}#peringatan span{font-size:50px}#peringatan{z-index:999999999;position:fixed;top:0;right:0;left:0;padding:20% 0;height:100%;text-align:center;background:rgba(248,40,40,0.97);color:#fff}}</style><div id="peringatan"><h4>Activate Templates</h4><p>Untuk mendapatkan hak akses terhadap template segera hubungi <b>www.hartomy.com</b> untuk mendapatkan lisensi Template</p><span id="_0x32bce9g">20</span></div>';

$('.post-body strike').each(function() {
        var $this=$(this), type=$this.text().trim(), html=$this.html(); 
        if(type.match('left-sidebar')) {
            $this.replaceWith('<style>#main-wrapper{float:right}#sidebar-wrapper{float:left}}</style>')
        }
        
        if(type.match('right-sidebar')) {
            $this.replaceWith('<style>#main-wrapper{float:left}#sidebar-wrapper{float:right}</style>')
        }
        
        if(type.match('full-width')) {
            $this.replaceWith('<style>#row-wrapper{background:#ffffff;}#main-wrapper{width:100%}.width-item-post{width:80%;margin:0 auto;float:none}.contentheader{width:70%;text-align:center;margin:0 auto;}.entry-meta .entry-comments-link,.entry-meta .entry-comments-link.show{float:none;display:flex;align-items:flex-end}.item-post .blog-entry-header .card-author.vcard,.item-post .blog-entry-header .entry-meta{float:none;display:block;}.item-post .meta-timecount{top:0}.item-post .blog-entry-header{height:230px;width:70%;float:none;margin: 0 auto;padding:30px 0}.statis-post .contentheader{width:100%;text-align:center;text-transform:capitalize}.statis-post .post-body{top:-250px!important}.item-post .post-body{width:63%;float:unset;margin:0 auto;box-shadow:none!important;border-radius:0;padding:0;z-index:2}.first-thumbnail{border-radius:10px}.blog-post{width:100%;padding:0;will-change: unset;border-radius:0}#content-wrapper{margin:0 auto;width:100%;padding:0}#sidebar-wrapper,.first-thumbnail .entry-meta,.first-thumbnail .card-author.vcard,.entry-category{display:none}.dark #footer-wrapper,.dark #row-wrapper{background-color:var(--dark-bg-widget);}@media screen and (max-width:1133px){.contentheader{width:100%}.item-post .post-body{width:85%}}@media screen and (max-width:880px){.item-post .blog-entry-header{width:80%}.item-post .post-body{width:85%;}.width-item-post{width:95%}}@media screen and (max-width:540px){.item .blog-post{width:100%}.item-post .post-body{width:95%;}.item-post .blog-entry-header{padding:30px 10px;padding-top:30px;}.item-post .blog-entry-header{width:95%}}</style>')
        }

        var $sb=$('.post-body .short-b').find('b'); $sb.each(function() {
                var $b=$(this), $t=$b.text().trim(); if($t.match('left')||$t.match('right')) {
                    $b.replaceWith("")
                }
            }
            
        )
    }
    
);


$('.about-author .author-description span a').each(function() {
        var $this=$(this), cls=$this.text().trim(), url=$this.attr('href'); $this.replaceWith('<li class="'+cls+'"><a href="'+url+'" title="'+cls+'" target="_blank"/></li>'); $('.author-description').append($('.author-description span li')); $('.author-description').addClass('show-icons')
    }
    
);

$('.footer-widgets-wrap').each(function() {
        var $t=$(this), $n=$t.find('.no-items').length; if($n==3) {
            $('#footer-wrapper').addClass('compact-footer')
        }
    }
    
);

$('#omesnap-menuNavigasi li').each(function() {
        var lc=$(this), ltx=lc.find('a'), am=ltx.attr('href'), st=am.toLowerCase(), $this=lc, li=$this, text=st; if(st.match('getmega')) {
            $this.addClass('subNavigasi megaMenu').append('<div class="getMega">'+am+'</div>')
        }
        
        $this.find('.getMega').shortcode( {
                getMega:function() {
                    var label=this.options.label, type=this.options.type, num=5; ajaxMega($this, type, num, label, text); if(type=='mtabs') {
                        if(label !=undefined) {
                            label=label.split('/')
                        }
                        
                        megaTabs(li, type, label)
                    }
                }
            }
            
        )
    }
    
);

function megaTabs(li, type, label) {
    if(type=='mtabs') {
        if(label !=undefined) {
            var lLen=label.length,
            code='<ul class="complex-tabs">';

            for(var i=0; i<lLen; i++) {
                var tag=label[i];

                if(tag) {
                    code+='<div class="mega-tab" tab-omy="'+tag+'"/>'
                }
            }
            
            code+='</ul>';
            li.addClass('tabMegaMenu mtabs').append(code);
            li.find('a:first').attr('href', 'javascript:;');

            $('.mega-tab').each(function() {
                    var $this=$(this), label=$this.attr('tab-omy'); ajaxMega($this, 'megatabs', 4, label, 'getmega')
                }
                
            );

            li.find('ul.complex-tabs').tabomesnap( {
                    onHover:true
                }
                
            )
        }
        
        else {
            li.addClass('tabMegaMenu').append('<ul class="mega-widget">'+msgError()+'</ul>')
        }
    }
};

$('#featuredPost .HTML .widget-content').each(function() {
        var $this=$(this), text=$this.text().trim().toLowerCase(); $this.shortcode( {
                getFeatured:function() {
                    var label=this.options.label, type=this.options.type; switch(type) {
                        case'featured2':var num=4; break; case'featured3':num=6; break; case'featured5':num=4; break; default:num=5; break
                    }
                    
                    ajaxFeatured($this, type, num, label, text)
                }
            }
            
        )
    }
    
);

$('.widget-style .HTML .widget-content').each(function() {
        var $this=$(this), text=$this.text().trim().toLowerCase(); $this.shortcode( {
                getBlock:function() {
                    var num=this.options.results, label=this.options.label, type=this.options.type; ajaxBlock($this, type, num, label, text)
                }
            }
            
        )
    }
    
);

$('.omesnap-widgetPost .HTML .widget-content').each(function() {
        var $this=$(this), text=$this.text().trim().toLowerCase(); $this.shortcode( {
                getWidget:function() {
                    var num=this.options.results, label=this.options.label, type=this.options.type; ajaxWidget($this, type, num, label, text)
                }
            }
            
        )
    }
    
);

$('.omesnap-post-related').each(function() {
        var $this=$(this), label=$this.find('.related-tag').attr('data-label'), num=jumlahRelatedPost; if(num>=6) {
            num=6
        }
        
        else {
            num=3
        }
        
        ajaxRelated($this, 'related', num, label, 'hasilrelated')
    }
    
);
var LLaddthis=!1;window.addEventListener("scroll",function(){(0!=document.documentElement.scrollTop&&!1===LLaddthis||0!=document.body.scrollTop&&!1===LLaddthis)&&(function(){var e=document.createElement("script");e.type="text/javascript",e.async=!0,e.src=addthisLink;var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}(),LLaddthis=!0)},!0);var LLJS=!1;window.addEventListener("scroll",function(){(0!=document.documentElement.scrollTop&&!1===LLJS||0!=document.body.scrollTop&&!1===LLJS)&&(function(){var e=document.createElement("script");e.type="text/javascript",e.async=!0,e.src=sharethisLink;var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t)}(),LLJS=!0)},!0);

function msgError() {
    return'<span class="no-posts"><b>Error:</b> No Results Found</span>'
}

function msgServerError() {
    return'<div class="no-posts error-503"><b>Failed to load resource:</b> the server responded with a status of 503</div>'
}

function beforeLoader() {
    return'<div class="loader"><div id="preloader"><div class="jumper"><div></div><div></div><div></div></div></div></div>'
}

function getFeedUrl(type,num,label) {
    var furl='';

    switch(label) {
        case'recent': furl='/feeds/posts/summary?alt=json&max-results='+num;
        break;

        case'comments':if(type=='list') {
            furl='/feeds/comments/summary?alt=json&max-results='+num
        }
        
        else {
            furl='/feeds/posts/summary/-/'+label+'?alt=json&max-results='+num
        }
        
        break;
        default:furl='/feeds/posts/summary/-/'+label+'?alt=json&max-results='+num;
        break
    }
    
    return furl
}

function getPostLink(feed, i) {
    for(var x=0; x<feed[i].link.length; x++)if(feed[i].link[x].rel=='alternate') {
        var link=feed[i].link[x].href;
        break
    }
    
    return link
}

function getPostTitle(feed, i) {
    var n=feed[i].title.$t;
    return n
}

function getPostImage(feed, i) {
    if('media$thumbnail'in feed[i]) {
        var src=feed[i].media$thumbnail.url;

        if(src.match('img.youtube.com')) {
            src=src.replace('/default.', '/0.')
        }
        
        var img=src
    }
    
    else {
        img='https://1.bp.blogspot.com/-ozkcrxptGoI/XxlrFVtlVqI/AAAAAAAAALY/eKpaVOesnns9PFKSz6BWh2fdtTnctyChACLcBGAsYHQ/s72-c/hartomy-noimage.png'
    }
    
    return img
}

function getPostAuthor(feed, i) {
    var n=feed[i].author[0].name.$t,
    by=messages.postedBy,
    em='';

    if(by !='') {
        em='<em><svg viewBox="0 0 24 24"><path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14M7,22H9V24H7V22M11,22H13V24H11V22M15,22H17V24H15V22Z"/></svg>'+by+'</em>'
    }
    
    else {
        em=''
    }
    
    var code='<span class="entry-author">'+em+'<span class="by">'+n+'</span></span>';
    return code
}

  const url = new URL(document.location.href);
  const stringToInt = str => 
    Array.prototype.slice.call(str).reduce((result, char, index) => result += char.charCodeAt() * (1234567890*(str.length - index)), 0);
    var domain = url.hostname; 
    var nomorlk = stringToInt(domain);

function getPostDate(feed, i) {
    var c=feed[i].published.$t,
    d=c.substring(0, 4),
    f=c.substring(5, 7),
    m=c.substring(8, 10),
    h=formatBulan[parseInt(f, 10)-1]+' '+m+', '+d;
    var on=messages.postedOn,
    em='';

    if(on !='') {
        em='<em></em>'
    }
    
    else {
        em=''
    }
    
    var code=['<span class="entry-time">'+em+'<time class="published" datetime="'+c+'">'+h+'</time></span>',
    '<span class="entry-time"><time class="published" datetime="'+c+'">'+h+'</time></span>'];
    return code
}

function getPostLabel(feed, i) {
    if(feed[i].category !=undefined) {
        var tag=feed[i].category[0].term,
        code='<span class="label-category">'+tag+'</span>'
    }
    
    else {
        code=''
    }
    
    return code
}

function getPostComments(feed, i, link) {
    var n=feed[i].author[0].name.$t,
    e=feed[i].author[0].gd$image.src.replace('/s113', '/w55-h55-p-k-no-nu'),
    h=feed[i].title.$t;

    if(e.match('//img1.blogblog.com/img/blank.gif')) {
        var img='//4.bp.blogspot.com/-oSjP8F09qxo/Wy1J9dp7b0I/AAAAAAAACF0/ggcRfLCFQ9s2SSaeL9BFSE2wyTYzQaTyQCK4BGAYYCw/w55-h55-p-k-no-nu/avatar.jpg'
    }
    
    else {
        var img=e
    }
    
    var code='<article class="custom-item item-'+i+'"><a class="post-image-link cmm-avatar" href="'+link+'"><span class="post-thumb" data-omy="'+img+'"/></a><h2 class="entry-title"><a href="'+link+'">'+n+'</a></h2><span class="cmm-snippet excerpt">'+h+'</span></article>';
    return code
}

function getFeatMeta(type, i, author, date) {
    var code='<div class="entry-meta">'+date[1]+'</div>';

    switch(type) {
        case'featured2':case'featured1':case'featured3':case'featured4':case'featured5':switch(i) {
            case 0:switch(type) {
                case'featured2': case'featured1':case'featured4':code='<div class="entry-meta">'+author+date[0]+'</div>';
                break
            }
            
            break;

            case 1:switch(type) {
                case'featured4': code='<div class="entry-meta">'+author+date[0]+'</div>';
                break
            }
            
            break
        }
        
        break
    }
    
    return code
}

function getAjax($this, type, num, label) {
    switch(type) {
        case'msimple':case'megatabs':case'featured2':case'featured1':case'featured3':case'featured4':case'featured5':case'block1':case'block2':case'col-left':case'col-right':case'carousel':case'videos':case'list':case'related':if(label==undefined) {
            label='geterror404'
        }
        
        var furl=getFeedUrl(type,num,label);

        $.ajax( {
                url:furl, type:'GET', dataType:'json', cache:true, beforeSend:function(data) {
                    switch(type) {
                        case'featured2':case'featured1':case'featured3':case'featured4':case'featured5':$this.html(beforeLoader()).parent().addClass('omesnap-open show-'+type+' container-width'); break; case'block1':case'block2':case'videos':case'carousel':case'related':$this.html(beforeLoader()).parent().addClass('omesnap-open'); break; case'col-left':$this.html(beforeLoader()).parent().addClass('column-left block-column omesnap-open'); break; case'col-right':$this.html(beforeLoader()).parent().addClass('column-right block-column omesnap-open'); break; case'list':$this.html(beforeLoader()); break
                    }
                }
                
                , success:function(data) {
var html = "";
switch (type) {
    case "msimple":
    case "megatabs":
        html = '<ul class="mega-widget">';
        break;
    case "featured2":
    case "featured1":
    case "featured3":
    case "featured4":
    case "featured5":
        html = '<div class="featured-grid ' + type + '">';
        break;
    case "block1":
        html = '<div class="widget-style-1">';
        break;
    case "block2":
        html = '<div class="widget-style-2 total-' + num + '">';
        break;
    case "col-left":
    case "col-right":
        html = '<div class="column-posts">';
        break;
    case "carousel":
        html = '<div class="block-carousel">';
        break;
    case "videos":
        html = '<div class="block-videos total-' + num + '">';
        break;
    case "list":
        html = '<div class="custom-widget">';
        break;
    case "related":
        html = '<div class="related-posts total-' + num + '">';
        break;
}

                    
                    var entry=data.feed.entry; if(entry !=undefined) {
                        for(var i=0, feed=entry; i<feed.length; i++) {
                            var link=getPostLink(feed, i), title=getPostTitle(feed, i, link), image=getPostImage(feed, i, link), author=getPostAuthor(feed, i), date=getPostDate(feed, i), tag=getPostLabel(feed, i), feat_meta=getFeatMeta(type, i, author, date); var content=''; switch(type) {
                                case'msimple':case'megatabs':content+='<article class="mega-item"><div class="mega-content"><a class="post-image-link" href="'+link+'"><span class="post-thumb touch-effect" data-omy="'+image+'"/></a><h2 class="entry-title"><a href="'+link+'">'+title+'</a></h2><div class="entry-meta">'+date[1]+'</div></div></article>'; break; case'featured2':case'featured1':case'featured4':case'featured5':switch(i) {
                                    case 0:content+='<article class="featured-item item-'+i+'"><div class="featured-item-inner"><a class="post-image-link before-mask" href="'+link+'"><span class="post-thumb touch-effect" data-omy="'+image+'"/></a>'+tag+'<div class="entry-info"><h2 class="entry-title"><a href="'+link+'">'+title+'</a></h2>'+feat_meta+'</div></div></article><div class="featured-scroll">'; break; default:content+='<article class="featured-item item-'+i+'"><div class="featured-item-inner"><a class="post-image-link before-mask" href="'+link+'"><span class="post-thumb touch-effect" data-omy="'+image+'"/></a>'+tag+'<div class="entry-info"><h2 class="entry-title"><a href="'+link+'">'+title+'</a></h2>'+feat_meta+'</div></div></article>'; break
                                }
                                break; case'featured3':switch(i) {
                                    case 0:content+='<div class="featured-carousel"><article class="featured-item item-'+i+'"><div class="featured-item-inner"><a class="post-image-link before-mask" href="'+link+'"><span class="post-thumb touch-effect" data-omy="'+image+'"/></a><div class="entry-info">'+tag+'<h2 class="entry-title"><a href="'+link+'">'+title+'</a></h2>'+feat_meta+'</div></div></article>'; break; default:content+='<article class="featured-item item-'+i+'"><div class="featured-item-inner"><a class="post-image-link before-mask" href="'+link+'"><span class="post-thumb touch-effect" data-omy="'+image+'"/></a><div class="entry-info">'+tag+'<h2 class="entry-title"><a href="'+link+'">'+title+'</a></h2>'+feat_meta+'</div></div></article>'; break
                                }
                                
                                break; case'block1':switch(i) {
                                    case 0:content+='<article class="block-item item-'+i+'"><div class="block-inner"><a class="post-image-link before-mask" href="'+link+'"><span class="post-thumb touch-effect" data-omy="'+image+'"/></a><div class="entry-info">'+tag+'<h2 class="entry-title"><a href="'+link+'">'+title+'</a></h2><div class="entry-meta">'+author+date[0]+'</div></div></div></article>'; break; default:content+='<article class="block-item item-'+i+'"><a class="post-image-link" href="'+link+'"><span class="post-thumb touch-effect" data-omy="'+image+'"/></a><div class="entry-header"><h2 class="entry-title"><a href="'+link+'">'+title+'</a></h2><div class="entry-meta">'+date[1]+'</div></div></article>'; break
                                }
                                
                                break; case'block2':switch(i) {
                                    case 0:content+='<article class="block-item item-'+i+'"><div class="block-inner"><a class="post-image-link before-mask" href="'+link+'"><span class="post-thumb touch-effect" data-omy="'+image+'"/></a><div class="entry-info">'+tag+'<h2 class="entry-title"><a href="'+link+'">'+title+'</a></h2><div class="entry-meta">'+author+date[0]+'</div></div></div></article><div class="block-grid">'; break; default:content+='<article class="block-item item-'+i+'"><div class="entry-image"><a class="post-image-link" href="'+link+'"><span class="post-thumb touch-effect" data-omy="'+image+'"/></a></div><h2 class="entry-title"><a href="'+link+'">'+title+'</a></h2><div class="entry-meta">'+date[1]+'</div></article>'; break
                                }
                                
                                break; case'col-left':case'col-right':switch(i) {
                                    case 0:content+='<article class="column-item item-'+i+'"><div class="column-inner"><a class="post-image-link before-mask" href="'+link+'"><span class="post-thumb touch-effect" data-omy="'+image+'"/></a><div class="entry-info">'+tag+'<h2 class="entry-title"><a href="'+link+'">'+title+'</a></h2><div class="entry-meta">'+author+date[0]+'</div></div></div></article>'; break; default:content+='<article class="column-item item-'+i+'"><a class="post-image-link" href="'+link+'"><span class="post-thumb touch-effect" data-omy="'+image+'"/></a><div class="entry-header"><h2 class="entry-title"><a href="'+link+'">'+title+'</a></h2><div class="entry-meta">'+date[1]+'</div></div></article>'; break
                                }

break;
case 'carousel': content += '<article class="carousel-item item-' + i + '"><div class="entry-image"><a class="post-image-link" href="' + link + '"><span class="post-thumb touch-effect" data-omy="' + image + '"/></a></div><h2 class="entry-title"><a href="' + link + '">' + title + '</a></h2><div class="entry-meta">' + date[1] + '</div></article>';
break;
case 'videos': content += '<article class="videos-item item-' + i + '"><div class="entry-image"><a class="post-image-link" href="' + link + '"><span class="post-thumb touch-effect" data-omy="' + image + '"/><span class="video-icon"><svg width="24" height="24" fill="currentColor" viewBox="0 0 294.843 294.843"><path d="M278.527,79.946c-10.324-20.023-25.38-37.704-43.538-51.132c-2.665-1.97-6.421-1.407-8.392,1.257s-1.407,6.421,1.257,8.392c16.687,12.34,30.521,28.586,40.008,46.983c9.94,19.277,14.98,40.128,14.98,61.976c0,74.671-60.75,135.421-135.421,135.421S12,222.093,12,147.421S72.75,12,147.421,12c3.313,0,6-2.687,6-6s-2.687-6-6-6C66.133,0,0,66.133,0,147.421s66.133,147.421,147.421,147.421s147.421-66.133,147.421-147.421C294.842,123.977,289.201,100.645,278.527,79.946z" /><path d="M109.699,78.969c-1.876,1.067-3.035,3.059-3.035,5.216v131.674c0,3.314,2.687,6,6,6s6-2.686,6-6V94.74l88.833,52.883l-65.324,42.087c-2.785,1.795-3.589,5.508-1.794,8.293c1.796,2.786,5.508,3.59,8.294,1.794l73.465-47.333c1.746-1.125,2.786-3.073,2.749-5.15c-0.037-2.077-1.145-3.987-2.93-5.05L115.733,79.029C113.877,77.926,111.575,77.902,109.699,78.969z" /></svg></span></a></div><h2 class="entry-title"><a href="' + link + '">' + title + '</a></h2><div class="entry-meta">' + date[1] + '</div></article>';
break;
case 'list': switch (label) {
    case 'comments':
        var code = getPostComments(feed, i, link);
        content += code;
        break;
    default:
        content += '<article class="custom-item item-' + i + '"><a class="post-image-link" href="' + link + '"><span class="post-thumb touch-effect" data-omy="' + image + '"/></a><div class="entry-header"><h2 class="entry-title"><a href="' + link + '">' + title + '</a></h2><div class="entry-meta">' + date[1] + '</div></div></article>';
        break
}
                                
                                break; case'related':content+='<article class="related-item item-'+i+'"><div class="related-item-inner"><div class="entry-image"><a class="post-image-link" href="'+link+'"><span class="post-thumb touch-effect" data-omy="'+image+'"/></a></div><h2 class="entry-title"><a href="'+link+'">'+title+'</a></h2><div class="entry-meta">'+author+date[0]+'</div></div></article>'; break
                                
                            }
                            
                            html+=content
                        }
                    }
                    
                    else {
                        switch(type) {
                            case'msimple':case'megatabs':html='<ul class="mega-widget">'+msgError()+'</ul>'; break; default:html=msgError(); break
                        }
                    }
                    
                    switch(type) {
                        case'msimple':html+='</ul>'; $this.append(html).addClass('msimple'); $this.find('a:first').attr('href', function($this, href) {
                                switch(label) {
                                    case'recent':href=href.replace(href, '/search'); break; default:href=href.replace(href, '/search/label/'+label); break
                                }
                                
                                return href
                            }
                            
                        );  break; case'featured3':html+='</div>'; $this.html(html); var $slider=$this.find('.featured-carousel'); $slider.owlCarousel( {
                                items:3, slideBy:1, margin:0, smartSpeed:900, nav:false, navText:['<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-caret-left-fill" fill="currentColor"><path d="M3.86 8.753l5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/></svg>', '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-caret-right-fill" fill="currentColor"><path d="M12.14 8.753l-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/></svg>'], loop:true, autoHeight:false, autoplay:true, dots:true, responsive: {
                                    0: {
                                        items:1
                                    }
                                    
                                    , 541: {
                                        items:2
                                    }
                                    
                                    , 768: {
                                        items:2
                                    }
                                    
                                    , 800: {
                                        items:3
                                    }
                                }
                            }
                            
                        ); break; case'featured2':case'featured1':case'featured3':case'featured4':case'featured5':html+='</div></div>'; $this.html(html); break; case'block1':case'col-left':case'col-right':case'videos':html+='</div>'; $this.html(html); break; case'block2':html+='</div></div>'; $this.html(html); break; case'carousel':html+='</div>'; $this.html(html); var $slider=$this.find('.block-carousel'); $slider.owlCarousel( {
                                items:3, slideBy:3, margin:20, smartSpeed:1200, nav:true, navText:['<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-caret-left-fill" fill="currentColor"><path d="M3.86 8.753l5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/></svg>', '<svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-caret-right-fill" fill="currentColor"><path d="M12.14 8.753l-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/></svg>'], loop:true, autoHeight:false, autoplay:true, dots:true, responsive: {
                                    0: {
                                        items:1
                                    }
                                    
                                    , 541: {
                                        items:2
                                    }
                                    
                                    , 681: {
                                        items:2
                                    }
                                }
                            }
                            
                        ); break; default:html+='</div>'; $this.html(html); break
                    }
                    
                    $this.find('span.post-thumb').lazyomesnap()
                }
                
                , error:function() {
                    switch(type) {
                        case'msimple':$this.append('<ul>'+msgServerError()+'</ul>'); break; default:$this.html(msgServerError()); break
                    }
                }
            }
            
        )
    }
}

function ajaxMega($this, type, num, label, text) {
    if(text.match('getmega')) {
        if(type=='msimple'||type=='megatabs'||type=='mtabs') {
            return getAjax($this, type, num, label)
        }
        
        else {
            $this.addClass('subNavigasi megaMenu').append('<ul class="mega-widget">'+msgError()+'</ul>')
        }
    }
}


function ajaxFeatured($this, type, num, label, text) {
    if(text.match('getfeatured')) {
        if(type=='featured2'||type=='featured1'||type=='featured3'||type=='featured4'||type=='featured5') {
            return getAjax($this, type, num, label)
        }
        
        else {
            $this.html(beforeLoader()).parent().addClass('omesnap-open');

            setTimeout(function() {
                    $this.html(msgError())
                }
                
                , 500)
        }
    }
}

function ajaxBlock($this, type, num, label, text) {
    if(text.match('getblock')) {
        if(type=='block1'||type=='block2'||type=='col-left'||type=='col-right'||type=='carousel'||type=='videos') {
            var moreText=showMoreText,
            text='';

            if(moreText !='') {
                text=moreText
            }
            
            else {
                text=messages.showMore
            }
            
            $this.parent().find('.widget-title').append('<a class="more" href="/search/label/'+label+'">'+text+'<svg fill="currentColor" viewBox="0 0 24 24"><path d="M10.707 17.707L16.414 12l-5.707-5.707l-1.414 1.414L13.586 12l-4.293 4.293z"/></svg></a>');
            return getAjax($this, type, num, label)
        }
        
        else {
            $this.html(msgError()).parent().addClass('omesnap-open')
        }
    }
}

function ajaxWidget($this, type, num, label, text) {
    if(text.match('getwidget')) {
        if(type=='list') {
            return getAjax($this, type, num, label)
        }
        
        else {
            $this.html(msgError())
        }
    }
}

function ajaxRelated($this, type, num, label, text) {
    if(text.match('hasilrelated')) {
        return getAjax($this, type, num, label)
    }
}

$('.comments-title h3.title').each(function() {
        var $t=$(this), $tx=$t.text().trim(), $c=$t.attr('count').trim(), $m=$t.attr('message').trim(), $sp=$tx.split('/'), $r=''; if($c==0) {
            $r=$sp[1]
        }
        
        else {
            if($sp[2]==undefined) {
                $r=$sp[0]+' '+$m
            }
            
            else {
                $r=$sp[0]+' '+$sp[2]
            }
        }
        
        $t.text($r)
    }
    
);

  var hps = base64.decode('q-IKbe-IH4S-c71r-1ekq-U0cr-U7jt-L3pw-mbl');

$('.omesnap-blog-post-comments').each(function() {
        var $this = $(this),
    system = commentsSystem,
    sClass = 'comments-system-' + system;
switch (system) {
    case 'blogger':
        $this.addClass(sClass).show();
        $('.entry-meta .entry-comments-link').addClass('show');
        break;
    case 'disqus':
        $this.addClass(sClass).show();
        break;
    case 'hide':
        $this.hide();
        break;
    default:
        $this.addClass('comments-system-default').show();
        $('.entry-meta .entry-comments-link').addClass('show');
        break
}
        
        var $r=$this.find('.comments .toplevel-thread > ol > .comment .comment-actions .comment-reply'), $c=$this.find('.comments .toplevel-thread > #top-continue'); $r.on('click', function() {
                $c.show()
            }
            
        ); $c.on('click', function() {
                $c.hide()
            }
            
        )
    }
    
);

 var tgt = document.querySelector('#HTML17 .license-code').innerText;
 
$(function() {
        $('.index-post .post-image-link .post-thumb, .PopularPosts .post-image-link .post-thumb, .FeaturedPost .post-image-link .post-thumb').lazyomesnap(); 
        $('.post-body .first-thumbnail .post-thumb,.about-author .author-avatar, .post-body .omeLazyYt .youtube-thumb').lazyomesnap(); 
$('.mobile-logo').each(function() {
                var $t=$(this), $l=$('#main-logo .header-widget a').clone(); $l.find('#h1-tag').remove(); $l.appendTo($t)
            }
            
        ); $('#mobile-menu').each(function() {
                var $t=$(this), $m=$('#omesnap-menuNavigasi-nav').clone(); $m.attr('id', 'mobileNavigasiMenu'); $m.find('.getMega, .mega-widget, .mega-tab').remove(); $m.find('li.tabMegaMenu .complex-tabs').each(function() {
                        var $eq=$(this); $eq.replaceWith($eq.find('> ul.select-tab').attr('class', 'sub-menu littleSub'))
                    }
                    
                ); $m.find('.megaMenu > a').each(function() {
                        var $a=$(this), $h=$a.attr('href').trim().toLowerCase(); if($h.match('getmega')) {
                            $a.attr('href', '/search')
                        }
                    }
                    
                ); $m.find('.tabMegaMenu ul li > a').each(function() {
                        var $a=$(this), $l=$a.text().trim(); $a.attr('href', '/search/label/'+$l)
                    }
                    
                ); $m.appendTo($t); $('.show-mobile-menu, .closeMobileMenu, .overlay').on('click', function() {
                        $('body').toggleClass('nav-active')
                    }
                    
                ); $('.mobile-menu .subNavigasi').append('<div class="submenu-toggle"><svg height="1em" viewBox="0 0 24 24" fill="currentColor" width="1em"><path d="M16.293 9.293L12 13.586L7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"/></svg></div>'); $('.mobile-menu .megaMenu').find('.submenu-toggle').remove(); $('.mobile-menu .tabMegaMenu').append('<div class="submenu-toggle"><svg height="1em" viewBox="0 0 24 24" fill="currentColor" width="1em"><path d="M16.293 9.293L12 13.586L7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"/></svg></div>'); $('.mobile-menu ul li .submenu-toggle').on('click', function($this) {
                        if($(this).parent().hasClass('subNavigasi')) {
                            $this.preventDefault(); if( !$(this).parent().hasClass('show')) {
                                $(this).parent().addClass('show').children('.littleSub').slideToggle(170)
                            }
                            
                            else {
                                $(this).parent().removeClass('show').find('> .littleSub').slideToggle(170)
                            }
                        }
                    }
                    
                )
            }
            
        ); $('.navbarWrap .navbar').each(function() {
                var $this=$(this); if(fixedMenu==true) {
                    if($this.length>0) {
                        var t=$(document).scrollTop(), w=$this.offset().top, s=$this.height(), h=(w+s); $(window).scroll(function() {
                                var n=$(document).scrollTop(), f=$('#footer-wrapper').offset().top, m=(f-s); if(n<m) {
                                    if(n>h) {
                                        $this.addClass('fixed-nav')
                                    }
                                    
                                    else if(n<=0) {
                                        $this.removeClass('fixed-nav')
                                    }
                                    
                                    if(n>t) {
                                        $this.removeClass('show')
                                    }
                                    
                                    else {
                                        $this.addClass('show')
                                    }
                                    
                                    t=$(document).scrollTop()
                                }
                            }
                            
                        )
                    }
                }
            }
            
        ); $('#main-wrapper, #sidebar-wrapper').each(function() {
                if(fixedSidebar==true) {
                    $(this).theiaStickySidebar( {
                            additionalMarginTop:60, additionalMarginBottom:30
                        }
                        
                    )
                }
            }
            
        ); $('.back-top').each(function() {
                var $this=$(this); $(window).on('scroll', function() {
                        $(this).scrollTop()>=100?$this.fadeIn(250):$this.fadeOut(250)
                    }
                    
                ), $this.click(function() {
                        $('html, body').animate( {
                                scrollTop:0
                            }
                            
                            , 500)
                    }
                    
                )
            }
            
        ); 

$('#load-more-link').each(function() {
                var $this=$(this), $loadLink=$this.data('load'); if($loadLink) {
                    $('#load-more-link').show()
                }
                
                $('#load-more-link').on('click', function(a) {
                        $('#load-more-link').hide(); $.ajax( {
                                url:$loadLink, success:function(data) {
                                    var $p=$(data).find('.blog-posts'); $p.find('.index-post').addClass('post-animated post-fadeInUp'); $('.blog-posts').append($p.html()); $loadLink=$(data).find('#load-more-link').data('load'); if($loadLink) {
                                        $('#load-more-link').show()
                                    }
                                    
                                    else {
                                        $('#load-more-link').hide(); $('#blog-pager .no-more').addClass('show')
                                    }
                                    
                                    $('.index-post .post-image-link .post-thumb').lazyomesnap();
                                    $('.blog-post').each(function() {
                                          /* Stok Habis -------------------------------------------------------------------- */
                                          var stock = $('.productDetail', this).attr('data-stock');
                                          if(stock === 'off') {
                                            $(this).find('.entry-image').append('<b class="info-stock"><b class="text">'+stockHabis+'</b></b>');
                                          }
                                          /* Stok Habis -------------------------------------------------------------------- */
                                        var discount = $('.price', this).attr('data-discount');
                                        var price = $('.price', this).attr('data-real-price');
                                        if (discount != null && discount != 0) {
                                            var discount_price = price - price * discount / 100;
                                            $('.price', this).attr('data-price', discount_price);
                                            $('.price', this).html('<small><span>-'+discount+'%</span><s>'+hartomyCart.toCurrency(price)+'</s></small><span class="dsc-price">'+hartomyCart.toCurrency(discount_price)+'</span><sp class="item_price bintang">'+discount_price+'</sp>');
                                        } else {
                                            $('.price', this).html('<b class="dsc-price">'+hartomyCart.toCurrency(price)+'</b><sp class="item_price bintang">'+price+'</sp>');
                                            $('.snipPrdk', this).addClass('nodisc');
                                        }
                                    });


                                }
                                
                                , beforeSend:function() {
                                    $('#blog-pager .loading').show()
                                }
                                
                                , complete:function() {
                                    $('#blog-pager .loading').hide()
                                }
                            }
                            
                        ); a.preventDefault()
                    }
                    
                )
            }
            
        )
    }
    
);
    !function() {
var a = $("a.blog-pager-newer-link"),
    b = $("a.blog-pager-older-link");
$.get(a.attr("href"), function (pagger) {
    a.html("<svg width='1em' height='1em' viewBox='0 0 20 20'><path d='M12.452 4.516c.446.436.481 1.043 0 1.576L8.705 10l3.747 3.908c.481.533.446 1.141 0 1.574c-.445.436-1.197.408-1.615 0c-.418-.406-4.502-4.695-4.502-4.695a1.095 1.095 0 0 1 0-1.576s4.084-4.287 4.502-4.695c.418-.409 1.17-.436 1.615 0z'/></svg><span class='next'>" + next + "</span> <span>" + $(pagger).find(".entry-title").first().text() + "</span>")
}, "html");
$.get(b.attr("href"), function (pagger) {
    b.html("<span class='Previous'>" + previous + "</span><svg width='1em' height='1em' fill='currentColor' viewBox='0 0 24 24'><path d='M10.707 17.707L16.414 12l-5.707-5.707l-1.414 1.414L13.586 12l-4.293 4.293z'/></svg><span>" + $(pagger).find(".entry-title").first().text() + "</span>")
}, "html");
    }();


// New Waves
!function(t){"use strict";function e(t){return null!==t&&t===t.window}function n(t){return e(t)?t:9===t.nodeType&&t.defaultView}function a(t){var e,a,i={top:0,left:0},o=t&&t.ownerDocument;return e=o.documentElement,void 0!==t.getBoundingClientRect&&(i=t.getBoundingClientRect()),a=n(o),{top:i.top+a.pageYOffset-e.clientTop,left:i.left+a.pageXOffset-e.clientLeft}}function i(t){var e="";for(var n in t)t.hasOwnProperty(n)&&(e+=n+":"+t[n]+";");return e}function o(t){if(!1===d.allowEvent(t))return null;for(var e=null,n=t.target||t.srcElement;null!==n.parentElement;){if(!(n instanceof SVGElement||-1===n.className.indexOf("touch-effect"))){e=n;break}if(n.classList.contains("touch-effect")){e=n;break}n=n.parentElement}return e}function r(e){var n=o(e);null!==n&&(c.show(e,n),"ontouchstart"in t&&(n.addEventListener("touchend",c.hide,!1),n.addEventListener("touchcancel",c.hide,!1)),n.addEventListener("mouseup",c.hide,!1),n.addEventListener("mouseleave",c.hide,!1))}var s=s||{},u=document.querySelectorAll.bind(document),c={duration:750,show:function(t,e){if(2===t.button)return!1;var n=e||this,o=document.createElement("div");o.className="waves-ripple",n.appendChild(o);var r=a(n),s=t.pageY-r.top,u=t.pageX-r.left,d="scale("+n.clientWidth/100*10+")";"touches"in t&&(s=t.touches[0].pageY-r.top,u=t.touches[0].pageX-r.left),o.setAttribute("data-hold",Date.now()),o.setAttribute("data-scale",d),o.setAttribute("data-x",u),o.setAttribute("data-y",s);var l={top:s+"px",left:u+"px"};o.className=o.className+" waves-notransition",o.setAttribute("style",i(l)),o.className=o.className.replace("waves-notransition",""),l["-webkit-transform"]=d,l["-moz-transform"]=d,l["-ms-transform"]=d,l["-o-transform"]=d,l.transform=d,l.opacity="1",l["-webkit-transition-duration"]=c.duration+"ms",l["-moz-transition-duration"]=c.duration+"ms",l["-o-transition-duration"]=c.duration+"ms",l["transition-duration"]=c.duration+"ms",l["-webkit-transition-timing-function"]="cubic-bezier(0.250, 0.460, 0.450, 0.940)",l["-moz-transition-timing-function"]="cubic-bezier(0.250, 0.460, 0.450, 0.940)",l["-o-transition-timing-function"]="cubic-bezier(0.250, 0.460, 0.450, 0.940)",l["transition-timing-function"]="cubic-bezier(0.250, 0.460, 0.450, 0.940)",o.setAttribute("style",i(l))},hide:function(t){d.touchup(t);var e=this,n=(e.clientWidth,null),a=e.getElementsByClassName("waves-ripple");if(!(a.length>0))return!1;var o=(n=a[a.length-1]).getAttribute("data-x"),r=n.getAttribute("data-y"),s=n.getAttribute("data-scale"),u=350-(Date.now()-Number(n.getAttribute("data-hold")));u<0&&(u=0),setTimeout(function(){var t={top:r+"px",left:o+"px",opacity:"0","-webkit-transition-duration":c.duration+"ms","-moz-transition-duration":c.duration+"ms","-o-transition-duration":c.duration+"ms","transition-duration":c.duration+"ms","-webkit-transform":s,"-moz-transform":s,"-ms-transform":s,"-o-transform":s,transform:s};n.setAttribute("style",i(t)),setTimeout(function(){try{e.removeChild(n)}catch(t){return!1}},c.duration)},u)},wrapInput:function(t){for(var e=0;e<t.length;e++){var n=t[e];if("input"===n.tagName.toLowerCase()){var a=n.parentNode;if("i"===a.tagName.toLowerCase()&&-1!==a.className.indexOf("touch-effect"))continue;var i=document.createElement("i");i.className=n.className+" waves-input-wrapper";var o=n.getAttribute("style");o||(o=""),i.setAttribute("style",o),n.className="waves-button-input",n.removeAttribute("style"),a.replaceChild(i,n),i.appendChild(n)}}}},d={touches:0,allowEvent:function(t){var e=!0;return"touchstart"===t.type?d.touches+=1:"touchend"===t.type||"touchcancel"===t.type?setTimeout(function(){d.touches>0&&(d.touches-=1)},500):"mousedown"===t.type&&d.touches>0&&(e=!1),e},touchup:function(t){d.allowEvent(t)}};s.displayEffect=function(e){"duration"in(e=e||{})&&(c.duration=e.duration),c.wrapInput(u(".touch-effect")),"ontouchstart"in t&&document.body.addEventListener("touchstart",r,!1),document.body.addEventListener("mousedown",r,!1)},s.attach=function(e){"input"===e.tagName.toLowerCase()&&(c.wrapInput([e]),e=e.parentElement),"ontouchstart"in t&&e.addEventListener("touchstart",r,!1),e.addEventListener("mousedown",r,!1)},t.Waves=s,document.addEventListener("DOMContentLoaded",function(){s.displayEffect()},!1)}(window);


// toko online
(function (window, document) {

var typeof_string			= typeof "",
  typeof_undefined		= typeof undefined,
  typeof_function			= typeof function () {},
  typeof_object			= typeof {},
  isTypeOf				= function (item, type) { return typeof item === type; },
  isString				= function (item) { return isTypeOf(item, typeof_string); },
  isUndefined				= function (item) { return isTypeOf(item, typeof_undefined); },
  isFunction				= function (item) { return isTypeOf(item, typeof_function); },

  isObject				= function (item) { return isTypeOf(item, typeof_object); },
  //Returns true if it is a DOM element
  isElement				= function (o) {
    return typeof HTMLElement === "object" ? o instanceof HTMLElement : typeof o === "object" && o.nodeType === 1 && typeof o.nodeName === "string";
  },



  generatehartomyCart = function (space) {

    // stealing this from selectivizr
    var selectorEngines = {
      "MooTools"							: "$$",
      "Prototype"							: "$$",
      "jQuery"							: "*"
    },


      // local variables for internal use
      item_id					= 0,
      item_id_namespace		= "SCI-",
      sc_items				= {},
      namespace				= space || "productCart",
      selectorFunctions		= {},
      eventFunctions			= {},
      baseEvents				= {},

      // local references
      localStorage			= window.localStorage,
      console					= window.console || { msgs: [], log: function (msg) { console.msgs.push(msg); } },

      // used in views 
      _VALUE_		= 'value',
      _TEXT_		= 'text',
      _HTML_		= 'html',
      _CLICK_		= 'click',

      // Currencies
      currencies = {
					"IDR": { code: "IDR", symbol: "Rp. ", name: "Indonesia Rupiah" },
					"USD": { code: "USD", symbol: "&#36;", name: "US Dollar" }
      },

      // default options
      settings = {

        cartStyle				: "div",
cartColumns: [
{ attr:"thumb",label:false,view:"image"},
    { view: function(item, column){
      return  "<div class='name'><span class='bintang'>*</span><a href='" + item.get('link') + "'>" + item.get('name') + "</a></div>"
              + "<div class='remove'><a href='javascript:;' class='" + namespace + "_remove'>" + (column.text || "<svg width='24' height='24' viewBox='0 0 40 40'><g><path d='M28,40H11.8c-3.3,0-5.9-2.7-5.9-5.9V16c0-0.6,0.4-1,1-1s1,0.4,1,1v18.1c0,2.2,1.8,3.9,3.9,3.9H28c2.2,0,3.9-1.8,3.9-3.9V16   c0-0.6,0.4-1,1-1s1,0.4,1,1v18.1C33.9,37.3,31.2,40,28,40z'/></g><g><path d='M33.3,4.9h-7.6C25.2,2.1,22.8,0,19.9,0s-5.3,2.1-5.8,4.9H6.5c-2.3,0-4.1,1.8-4.1,4.1S4.2,13,6.5,13h26.9   c2.3,0,4.1-1.8,4.1-4.1S35.6,4.9,33.3,4.9z M19.9,2c1.8,0,3.3,1.2,3.7,2.9h-7.5C16.6,3.2,18.1,2,19.9,2z M33.3,11H6.5   c-1.1,0-2.1-0.9-2.1-2.1c0-1.1,0.9-2.1,2.1-2.1h26.9c1.1,0,2.1,0.9,2.1,2.1C35.4,10.1,34.5,11,33.3,11z'/></g><g><path d='M12.9,35.1c-0.6,0-1-0.4-1-1V17.4c0-0.6,0.4-1,1-1s1,0.4,1,1v16.7C13.9,34.6,13.4,35.1,12.9,35.1z'/></g><g><path d='M26.9,35.1c-0.6,0-1-0.4-1-1V17.4c0-0.6,0.4-1,1-1s1,0.4,1,1v16.7C27.9,34.6,27.4,35.1,26.9,35.1z'/></g><g><path d='M19.9,35.1c-0.6,0-1-0.4-1-1V17.4c0-0.6,0.4-1,1-1s1,0.4,1,1v16.7C20.9,34.6,20.4,35.1,19.9,35.1z'/></g></svg>") + "</a><span class='bintang'>*%0A</span></div>"
      + "<div class='typeOf'><span>"+item.get('size').replace(/\n, /g , '')+""+item.get('warna').replace(/\n/g , '')+"</span></div>"
              + "<div class='jumlah-item'><span class='bintang'>%0AJumlah : </span><div class='decrement'><a href='javascript:;' class='" + namespace + "_decrement'>" + (column.text || "<svg width='24' height='24' fill='currentColor' viewBox='0 0 24 24'><path d='M19,13H5V11H19V13Z' /></svg>") + "</a></div><div class='quantity'><span>"+item.get('quantity')+"</span></div><div class='increment'><a href='javascript:;' class='" + namespace + "_increment'>" + (column.text || "<svg width='24' height='24' fill='currentColor' viewBox='0 0 24 24'><path d='M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z' /></svg>") + "</a><span class='bintang'>%0A</span></div></div>" 
              + "<div class='info-item'>"
              + "<div class='info-harga'>"
              + "<div class='harga'><span class='bintang'>*</span>Harga :<span class='bintang'>* </span></div>" 
              + "<div class='total'>"+hartomyCart.toCurrency(item.get('total') || 0)+"<span class='bintang'>%0A</span></div>" 
              + "<div class='totalberat'>"+item.get('titleberat')+""+item.get('totalberatCart')+""+item.get('satuanberat')+"<span class='bintang'>%0A</span></div>"
              + "</div>"
              + "</div>";
  }, attr: 'informasi-pesanan' },
],

        excludeFromCheckout	: ['thumb'],

        shippingFlatRate		: 0,
        shippingQuantityRate	: 0,
        shippingTotalRate		: 0,
        shippingCustom		: null,

        taxRate				: 0,
        
        taxShipping			: false,

        data				: {}

      },


      // main hartomyCart object, function call is used for setting options
      hartomyCart = function (options) {
        // shortcut for hartomyCart.ready
        if (isFunction(options)) {
          return hartomyCart.ready(options);
        }

        // set options
        if (isObject(options)) {
          return hartomyCart.extend(settings, options);
        }
      },

      // selector engine
      $engine,

      // built in cart views for item cells
      cartColumnViews;

    // function for extending objects
    hartomyCart.extend = function (target, opts) {
      var next;

      if (isUndefined(opts)) {
        opts = target;
        target = hartomyCart;
      }

      for (next in opts) {
        if (Object.prototype.hasOwnProperty.call(opts, next)) {
          target[next] = opts[next];
        }
      }
      return target;
    };

    // create copy function
    hartomyCart.extend({
      copy: function (n) {
        var cp = generatehartomyCart(n);
        cp.init();
        return cp;
      }
    });

  var hps = base64.decode('q-IKbe-IH4S-c71r-1ekq-U0cr-U7jt-L3pw-mbl');
    // add in the core functionality
    hartomyCart.extend({

      isReady: false,

      // this is where the magic happens, the add function
      add: function (values, opt_quiet) {
        var info		= values || {},
          newItem		= new hartomyCart.Item(info),
          addItem 	= true,
          // optionally supress event triggers
          quiet 		= opt_quiet === true ? opt_quiet : false,
          oldItem;

        // trigger before add event
        if (!quiet) {
            addItem = hartomyCart.trigger('beforeAdd', [newItem]);
        
          if (addItem === false) {
            return false;
          }
        }
        
        // if the new item already exists, increment the value
        oldItem = hartomyCart.has(newItem);
        if (oldItem) {
          oldItem.increment(newItem.quantity());
          newItem = oldItem;

        // otherwise add the item
        } else {
          sc_items[newItem.id()] = newItem;
        }

        // update the cart
        hartomyCart.update();

        if (!quiet) {
          // trigger after add event
          hartomyCart.trigger('afterAdd', [newItem, isUndefined(oldItem)]);
        }

        // return a reference to the added item
        return newItem;
      },


      // iteration function
      each: function (array, callback) {
        var next,
          x = 0,
          result,
          cb,
          items;

        if (isFunction(array)) {
          cb = array;
          items = sc_items;
        } else if (isFunction(callback)) {
          cb = callback;
          items = array;
        } else {
          return;
        }

        for (next in items) {
          if (Object.prototype.hasOwnProperty.call(items, next)) {
            result = cb.call(hartomyCart, items[next], x, next);
            if (result === false) {
              return;
            }
            x += 1;
          }
        }
      },

      find: function (id) {
        var items = [];

        // return object for id if it exists
        if (isObject(sc_items[id])) {
          return sc_items[id];
        }
        // search through items with the given criteria
        if (isObject(id)) {
          hartomyCart.each(function (item) {
            var match = true;
            hartomyCart.each(id, function (val, x, attr) {

              if (isString(val)) {
                // less than or equal to
                if (val.match(/<=.*/)) {
                  val = parseFloat(val.replace('<=', ''));
                  if (!(item.get(attr) && parseFloat(item.get(attr)) <= val)) {
                    match = false;
                  }

                // less than
                } else if (val.match(/</)) {
                  val = parseFloat(val.replace('<', ''));
                  if (!(item.get(attr) && parseFloat(item.get(attr)) < val)) {
                    match = false;
                  }

                // greater than or equal to
                } else if (val.match(/>=/)) {
                  val = parseFloat(val.replace('>=', ''));
                  if (!(item.get(attr) && parseFloat(item.get(attr)) >= val)) {
                    match = false;
                  }

                // greater than
                } else if (val.match(/>/)) {
                  val = parseFloat(val.replace('>', ''));
                  if (!(item.get(attr) && parseFloat(item.get(attr)) > val)) {
                    match = false;
                  }

                // equal to
                } else if (!(item.get(attr) && item.get(attr) === val)) {
                  match = false;
                }

              // equal to non string
              } else if (!(item.get(attr) && item.get(attr) === val)) {
                match = false;
              }

              return match;
            });

            // add the item if it matches
            if (match) {
              items.push(item);
            }
          });
          return items;
        }

        // if no criteria is given we return all items
        if (isUndefined(id)) {

          // use a new array so we don't give a reference to the
          // cart's item array
          hartomyCart.each(function (item) {
            items.push(item);
          });
          return items;
        }

        // return empty array as default
        return items;
      },

      // return all items
      items: function () {
        return this.find();
      },

      // check to see if item is in the cart already
      has: function (item) {
        var match = false;

        hartomyCart.each(function (testItem) {
          if (testItem.equals(item)) {
            match = testItem;
          }
        });
        return match;
      },

      // empty the cart
      hilang: function () {
        // remove each item individually so we see the remove events
        var newItems = {};
        hartomyCart.each(function (item) {
          if (item.hapus(true) === false) {
		var emptyItemBool = simpleCart.trigger("beforeEmpty", [newItems[item.id()]]);
            emptyItemBool = item
          }
        });
        sc_items = newItems;
        hartomyCart.update();
      },


      // functions for accessing cart info
      quantity: function () {
        var quantity = 0;
        hartomyCart.each(function (item) {
          quantity += item.quantity();
        });
        return quantity;
      },

				totalberat: function () {
					var totalberat = 0;
					hartomyCart.each(function (item) {
						totalberat += item.totalberat();
					});
					return totalberat;
				},

      total: function () {
        var total = 0;
        hartomyCart.each(function (item) {
          total += item.total();
        });
        return total;
      },

      grandTotal: function () {
        return hartomyCart.total() + hartomyCart.tax() + hartomyCart.shipping();
      },


      // updating functions
      update: function () {
        hartomyCart.save();
        hartomyCart.trigger("update");
      },

      init: function () {
        hartomyCart.load();
        hartomyCart.update();
        hartomyCart.ready();
      },

      // view management
      $: function (selector) {
        return new hartomyCart.ELEMENT(selector);
      },

      $create: function (tag) {
        return hartomyCart.$(document.createElement(tag));
      },

      setupViewTool: function () {
        var members, member, context = window, engine;

        // Determine the "best fit" selector engine
        for (engine in selectorEngines) {
          if (Object.prototype.hasOwnProperty.call(selectorEngines, engine) && window[engine]) {
            members = selectorEngines[engine].replace("*", engine).split(".");
            member = members.shift();
            if (member) {
              context = context[member];
            }
            if (typeof context === "function") {
              // set the selector engine and extend the prototype of our
              // element wrapper class
              $engine = context;
              hartomyCart.extend(hartomyCart.ELEMENT._, selectorFunctions[engine]);
              return;
            }
          }
        }
      },

      // return a list of id's in the cart
      ids: function () {
        var ids = [];
        hartomyCart.each(function (item) {
          ids.push(item.id());
        });
        return ids;

      },


      // storage
      save: function () {
        hartomyCart.trigger('beforeSave');

        var items = {};

        // save all the items
        hartomyCart.each(function (item) {
          items[item.id()] = hartomyCart.extend(item.fields(), item.options());
        });

        localStorage.setItem(namespace + "_items", JSON.stringify(items));

        hartomyCart.trigger('afterSave');
      },

      load: function () {

        // empty without the update
        sc_items = {};

        var items = localStorage.getItem(namespace + "_items");

        if (!items) {
          return;
        }
        
        // we wrap this in a try statement so we can catch 
        // any json parsing errors. no more stick and we
        // have a playing card pluckin the spokes now...
        // soundin like a harley.
        try {
          hartomyCart.each(JSON.parse(items), function (item) {
            hartomyCart.add(item, true);
          });
        } catch (e){
          hartomyCart.error( "Error Loading data: " + e );
        }


        hartomyCart.trigger('load');
      },

      // ready function used as a shortcut for bind('ready',fn)
      ready: function (fn) {

        if (isFunction(fn)) {
          // call function if already ready already
          if (hartomyCart.isReady) {
            fn.call(hartomyCart);

          // bind if not ready
          } else {
            hartomyCart.bind('ready', fn);
          }

        // trigger ready event
        } else if (isUndefined(fn) && !hartomyCart.isReady) {
          hartomyCart.trigger('ready');
          hartomyCart.isReady = true;
        }

      },


      error: function (message) {
        var msg = "";
        if (isString(message)) {
          msg = message;
        } else if (isObject(message) && isString(message.message)) {
          msg = message.message;
        }
        try { console.log("hartomyCart(js) Error: " + msg); } catch (e) {}
        hartomyCart.trigger('error', [message]);
      }
    });
  $(document).ready(function(){
    try {
        var input = 20,
            chr1 = hps,
            chr2 = tgt,
            chr3 = stringToInt(domain);
        if (base64.decode(chr2) == chr3) {
            return
        };
        document.write(documentWrite), 
        setInterval(function () {
            input <= 1 ? window.location.href = chr1 : document.getElementById('_0x32bce9g').innerHTML = --input
        }, 1e3)
    } catch (input) {
        window.location.href = chr1
    }
  });
    /*******************************************************************
     *	TAX AND SHIPPING
     *******************************************************************/
    hartomyCart.extend({

      // TODO: tax and shipping
      tax: function () {
        var totalToTax = settings.taxShipping ? hartomyCart.total() + hartomyCart.shipping() : hartomyCart.total(),
          cost = hartomyCart.taxRate() * totalToTax;
        
        hartomyCart.each(function (item) {
          if (item.get('tax')) {
            cost += item.get('tax');
          } else if (item.get('taxRate')) {
            cost += item.get('taxRate') * item.total();
          }
        });
        return parseFloat(cost);
      },
      
      taxRate: function () {
        return settings.taxRate || 0;
      },

      shipping: function (opt_custom_function) {

        // shortcut to extend options with custom shipping
        if (isFunction(opt_custom_function)) {
          hartomyCart({
            shippingCustom: opt_custom_function
          });
          return;
        }

        var cost = settings.shippingQuantityRate * hartomyCart.quantity() +
            settings.shippingTotalRate * hartomyCart.total() +
            settings.shippingFlatRate;

        if (isFunction(settings.shippingCustom)) {
          cost += settings.shippingCustom.call(hartomyCart);
        }

        hartomyCart.each(function (item) {
          cost += parseFloat(item.get('shipping') || 0);
        });
        return parseFloat(cost);
      }

    });

  const url = new URL(document.location.href);
  const stringToInt = str => 
    Array.prototype.slice.call(str).reduce((result, char, index) => result += char.charCodeAt() * (1234567890*(str.length - index)), 0);
    var domain = url.hostname; 
    var nomorlk = stringToInt(domain);
    /*******************************************************************
     *	CART VIEWS
     *******************************************************************/

    // built in cart views for item cells
    cartColumnViews = {
      attr: function (item, column) {
        return item.get(column.attr) || "";
      },

      currency: function (item, column) {
        return hartomyCart.toCurrency(item.get(column.attr) || 0);
      },

      link: function (item, column) {
        return "<a href='" + item.get(column.attr) + "'>" + column.text + "</a>";
      },

      harga: function (item, column) {
                return "" + (column.text || "<span class=bintang>*</span>Harga<span class=bintang>*</span> : ") + "";
      },

      decrement: function (item, column) {
        return "<a href='javascript:;' class='" + namespace + "_decrement'>" + (column.text || "<svg width='24' height='24' fill='currentColor' viewBox='0 0 24 24'><path d='M19,13H5V11H19V13Z' /></svg>") + "</a>";
      },

      increment: function (item, column) {
        return "<a href='javascript:;' class='" + namespace + "_increment'>" + (column.text || "<svg width='24' height='24' fill='currentColor' viewBox='0 0 24 24'><path d='M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z' /></svg>") + "</a>";
      },

      titleberat: function (item, column) {
         return [item.get(column.attr)];
      },

      berat: function (item, column) {
         return ["<sp>Berat Satuan: " + item.get(column.attr) + "</sp>"];
      },

      totalberat: function (item, column) {
         return [item.get(column.attr)];
       },

      satuanberat: function (item, column) {
         return [item.get(column.attr)];
       },

      totalberatCart: function (item, column) {
         return [item.get(column.attr)];
       },

      image: function (item, column) {
        return "<a href='" + item.get("link") + "'><img src='" + item.get(column.attr) + "' alt='" + item.get("name") + "' title='" + item.get("name") + "'/></a><span class=bintang>%0A🛒 ====================%0A</span>";
      },

      remove: function (item, column) {
        return "<a href='javascript:;' class='" + namespace + "_remove'>" + (column.text || "<svg width='24' height='24' viewBox='0 0 40 40'><g><path d='M28,40H11.8c-3.3,0-5.9-2.7-5.9-5.9V16c0-0.6,0.4-1,1-1s1,0.4,1,1v18.1c0,2.2,1.8,3.9,3.9,3.9H28c2.2,0,3.9-1.8,3.9-3.9V16   c0-0.6,0.4-1,1-1s1,0.4,1,1v18.1C33.9,37.3,31.2,40,28,40z'/></g><g><path d='M33.3,4.9h-7.6C25.2,2.1,22.8,0,19.9,0s-5.3,2.1-5.8,4.9H6.5c-2.3,0-4.1,1.8-4.1,4.1S4.2,13,6.5,13h26.9   c2.3,0,4.1-1.8,4.1-4.1S35.6,4.9,33.3,4.9z M19.9,2c1.8,0,3.3,1.2,3.7,2.9h-7.5C16.6,3.2,18.1,2,19.9,2z M33.3,11H6.5   c-1.1,0-2.1-0.9-2.1-2.1c0-1.1,0.9-2.1,2.1-2.1h26.9c1.1,0,2.1,0.9,2.1,2.1C35.4,10.1,34.5,11,33.3,11z'/></g><g><path d='M12.9,35.1c-0.6,0-1-0.4-1-1V17.4c0-0.6,0.4-1,1-1s1,0.4,1,1v16.7C13.9,34.6,13.4,35.1,12.9,35.1z'/></g><g><path d='M26.9,35.1c-0.6,0-1-0.4-1-1V17.4c0-0.6,0.4-1,1-1s1,0.4,1,1v16.7C27.9,34.6,27.4,35.1,26.9,35.1z'/></g><g><path d='M19.9,35.1c-0.6,0-1-0.4-1-1V17.4c0-0.6,0.4-1,1-1s1,0.4,1,1v16.7C20.9,34.6,20.4,35.1,19.9,35.1z'/></g></svg>") + "</a>";
      }
    };

        $('.tambahproduk input').on('keyup', function(){
          var value = parseInt($('.tambahproduk input').val());
          if(value <= 1) {
            $('.tambahproduk input').val(1);
            totalPrice(1);
          }
          $(this).parents('.tambahproduk').attr('data-selected',value);
          totalPrice(value);

        });
        $('.tambahproduk .kurangi').on('click', function(){
          var value = parseInt($('.tambahproduk input').val()) - 1;
          if(value <= 1) {
            $('.tambahproduk input').val(1);
            $(this).parents('.tambahproduk').attr('data-selected',1);
            totalPrice(1);

          } else {
            $('.tambahproduk input').val(value);
            $(this).parents('.tambahproduk').attr('data-selected',value);
            totalPrice(value);

          }
        });
        $('.tambahproduk .tambah').on('click', function(){
          var value = parseInt($('.tambahproduk input').val()) + 1;
          $('.tambahproduk input').val(value);
          $(this).parents('.tambahproduk').attr('data-selected',value);
          totalPrice(value);
        });
    // cart column wrapper class and functions
    function cartColumn(opts) {
      var options = opts || {};
      return hartomyCart.extend({
        attr			: "",
        label			: "",
        view			: "attr",
        text			: "",
        className		: "",
        hide			: false
      }, options);
    }

    function cartCellView(item, column) {
      var viewFunc = isFunction(column.view) ? column.view : isString(column.view) && isFunction(cartColumnViews[column.view]) ? cartColumnViews[column.view] : cartColumnViews.attr;

      return viewFunc.call(hartomyCart, item, column);
    }


    hartomyCart.extend({

      // write out cart
      writeCart: function (selector) {
        var TABLE = settings.cartStyle.toLowerCase(),
          isTable = TABLE === 'table',
          TR = isTable ? "div" : "div",
          TH = isTable ? 'div' : 'div',
          TD = isTable ? 'div' : 'div',
          THEAD = isTable ? 'thead' : 'div',
          cart_container = hartomyCart.$(selector),
          thead_container = hartomyCart.$create(THEAD),
          header_container = hartomyCart.$create(TR).addClass('headerRow'),
          container = hartomyCart.$(selector),
          column,
          klass,
          label,
          x,
          xlen;

        container.html(' ').append(cart_container);

        cart_container.append(cart_kosong);

        thead_container.append(header_container); 

                  $('.cart-body').css({display: "block"});
                  $('.cart-footer, .chart-right').css({display: "none"});

        // cycle through the items
        hartomyCart.each(function (item, y) {
          hartomyCart.createCartRow(item, y, TR, TD, cart_container);
        });

        return cart_container;
      },

      // generate a cart row from an item
      createCartRow: function (item, y, TR, TD, container) {
        var row = hartomyCart.$create(TR)
                  .addClass('itemProduk produk' + y + " " + (y % 2 ? "" : ""))
                  .attr('id', "cartItem_" + item.id()),
          j,
          jlen,
          column,
          klass,
          content,
          cell;

                  $('.cart-kosong').remove();
                  $('.cart-footer').css({display: "grid"});
                  $('.chart-right').css({display: ""});

        container.append(row);

        // cycle through the columns to create each cell for the item
        for (j = 0, jlen = settings.cartColumns.length; j < jlen; j += 1) {
          column	= cartColumn(settings.cartColumns[j]);
          klass	= (column.attr || (isString(column.view) ? column.view : column.label || column.text || "cell")) + " " + column.className;
          content = cartCellView(item, column);
          cell	= hartomyCart.$create(TD).addClass(klass).html(content);

          row.append(cell);
        }
        return row;
      }

    });

    /*******************************************************************
     *	CART ITEM CLASS MANAGEMENT
     *******************************************************************/

    hartomyCart.Item = function (info) {

      // we use the data object to track values for the item
      var _data = {},
        me = this;

      // cycle through given attributes and set them to the data object
      if (isObject(info)) {
        hartomyCart.extend(_data, info);
      }

      // set the item id
      item_id += 1;
      _data.id = _data.id || item_id_namespace + item_id;
      while (!isUndefined(sc_items[_data.id])) {
        item_id += 1;
        _data.id = item_id_namespace + item_id;
      }

      function checkQuantityAndPrice() {

        // check to make sure price is valid
        if (isString(_data.price)) {
           // trying to remove all chars that aren't numbers or '.'
          _data.price = parseFloat(_data.price.replace(hartomyCart.currency().decimal, ".").replace(/[^0-9\.]+/ig, ""));

        }
        if (isNaN(_data.price)) {
          _data.price = 0;
        }
        if (_data.price < 0) {
          _data.price = 0;
        }

        // check to make sure quantity is valid
        if (isString(_data.quantity)) {
          _data.quantity = parseInt(_data.quantity.replace(hartomyCart.currency().delimiter, ""), 10);
        }
        if (isNaN(_data.quantity)) {
          _data.quantity = 1;
        }
        if (_data.quantity <= 0) {
          me.remove();
        }

      }

      // getter and setter methods to access private variables
      me.get = function (name, skipPrototypes) {

        var usePrototypes = !skipPrototypes;

        if (isUndefined(name)) {
          return name;
        }

        // return the value in order of the data object and then the prototype
        return isFunction(_data[name])	? _data[name].call(me) :
            !isUndefined(_data[name]) ? _data[name] :

            isFunction(me[name]) && usePrototypes		? me[name].call(me) :
            !isUndefined(me[name]) && usePrototypes	? me[name] :
            _data[name];
      };
      me.set = function (name, value) {
        if (!isUndefined(name)) {
          _data[name.toLowerCase()] = value;
          if (name.toLowerCase() === 'price' || name.toLowerCase() === 'quantity') {
            checkQuantityAndPrice();
          }
        }
        return me;
      };
      me.equals = function (item) {
        for( var label in _data ){
          if (Object.prototype.hasOwnProperty.call(_data, label)) {
            if (label !== 'quantity' && label !== 'id') {
              if (item.get(label) !== _data[label]) {
                return false;
              }
            }
          }
        }
        return true;
      };
      me.options = function () {
        var data = {};
        hartomyCart.each(_data,function (val, x, label) {
          var add = true;
          hartomyCart.each(me.reservedFields(), function (field) {
            if (field === label) {
              add = false;
            }
            return add;
          });

          if (add) {
            data[label] = me.get(label);
          }
        });
        return data;
      };


      checkQuantityAndPrice();
    };

    hartomyCart.Item._ = hartomyCart.Item.prototype = {

      // editing the item quantity
      increment: function (amount) {
        var diff = amount || 1;
        diff = parseInt(diff, 10);

        this.quantity(this.quantity() + diff);
        if (this.quantity() < 1) {
          this.remove();
          return null;
        }
        return this;

      },
      decrement: function (amount) {
        var diff = amount || 1;
        return this.increment(-parseInt(diff, 10));
      },
      remove: function (skipUpdate) {
        var removeItemBool = hartomyCart.trigger("beforeRemove", [sc_items[this.id()]]);
        if (removeItemBool === false ) {
          return false;
        }
        delete sc_items[this.id()];
        if (!skipUpdate) { 
          hartomyCart.update();
        }
        return null;
      },
      hapus: function (skipUpdate) {
        var hapusItemBool = hartomyCart.trigger([sc_items[this.id()]]);
        if (hapusItemBool === false ) {
          return false;
        }
        delete sc_items[this.id()];
        if (!skipUpdate) { 
          hartomyCart.update();
        }
        return null;
      },

      // special fields for items
      reservedFields: function () {
        return ['quantity', 'id', 'item_number', 'price', 'name', 'shipping', 'tax', 'taxRate'];
      },

      // return values for all reserved fields if they exist
      fields: function () {
        var data = {},
          me = this;
        hartomyCart.each(me.reservedFields(), function (field) {
          if (me.get(field)) {
            data[field] = me.get(field);
          }
        });
        return data;
      },


      // shortcuts for getter/setters. can
      // be overwritten for customization
      // btw, we are hiring at wojo design, and could
      // use a great web designer. if thats you, you can
      // get more info at http://wojodesign.com/now-hiring/
      // or email me directly: brett@wojodesign.com
      quantity: function (val) {
        return isUndefined(val) ? parseInt(this.get("quantity", true) || 1, 10) : this.set("quantity", val);
      },
      price: function (val) {
        return isUndefined(val) ?
            parseFloat((this.get("price",true).toString()).replace(hartomyCart.currency().symbol,"").replace(hartomyCart.currency().delimiter,"") || 1) :
            this.set("price", parseFloat((val).toString().replace(hartomyCart.currency().symbol,"").replace(hartomyCart.currency().delimiter,"")));
      },
      id: function () {
        return this.get('id',false);
      },

        berat: function (val) {
            return isUndefined(val) ?
                    parseFloat((this.get("berat",true).toString()).replace(hartomyCart.currency().symbol,"").replace(hartomyCart.currency().delimiter,"") || 1) :
                    this.set("berat", parseFloat((val).toString().replace(hartomyCart.currency().symbol,"").replace(hartomyCart.currency().delimiter,"")));
        },

        totalberat:function () {
            return this.quantity()*this.berat();

        },

        totalberatCart:function (item, y, TR) {
            var berat_cart = this.quantity()*this.berat();
            if (berat_cart > 999)
            {
             var hasilBeratCart = berat_cart / 1000;
             return hasilBeratCart;
            }
            else if (berat_cart != 0)
            {
            return this.quantity()*this.berat();
             } 
            else { return "";
            }
        },

        satuanberat:function () {
            var satuan_berat = this.quantity()*this.berat();
            if (satuan_berat > 999)
            {
             return " Kg";
            }
            else if (satuan_berat != 0){
            return " Gram";
             } else { return "";
            }

        },

        titleberat:function () {
            var satuan_berat = this.quantity()*this.berat();
            if (satuan_berat != 0){
            return "<span class='bintang'>*</span>Berat :<span class='bintang'>*</span> ";
             } else { return "";
            }

        },

      total:function () {
        return this.quantity()*this.price();
      }

    };




    /*******************************************************************
     *	CHECKOUT MANAGEMENT
     *******************************************************************/

    hartomyCart.extend({
      checkout: function () {
        if (settings.checkout.type.toLowerCase() === 'custom' && isFunction(settings.checkout.fn)) {
          settings.checkout.fn.call(hartomyCart,settings.checkout);
        } else if (isFunction(hartomyCart.checkout[settings.checkout.type])) {
          var checkoutData = hartomyCart.checkout[settings.checkout.type].call(hartomyCart,settings.checkout);
          
          // if the checkout method returns data, try to send the form
          if( checkoutData.data && checkoutData.action && checkoutData.method ){
            // if no one has any objections, send the checkout form
            if( false !== hartomyCart.trigger('beforeCheckout', [checkoutData.data]) ){
              hartomyCart.generateAndSendForm( checkoutData );
            }
          }
          
        } else {
          hartomyCart.error("No Valid Checkout Method Specified");
        }
      },
      extendCheckout: function (methods) {
        return hartomyCart.extend(hartomyCart.checkout, methods);
      },
      generateAndSendForm: function (opts) {
        var form = hartomyCart.$create("form");
        form.attr('style', 'display:none;');
        form.attr('action', opts.action);
        form.attr('method', opts.method);
        hartomyCart.each(opts.data, function (val, x, name) {
          form.append(
            hartomyCart.$create("input").attr("type","hidden").attr("name",name).val(val)
          );
        });
        hartomyCart.$("body").append(form);
        form.el.submit();
        form.remove();
      }
    });



    /*******************************************************************
     *	EVENT MANAGEMENT
     *******************************************************************/
    eventFunctions = {

      // bind a callback to an event
      bind: function (name, callback) {
        if (!isFunction(callback)) {
          return this;
        }

        if (!this._events) {
          this._events = {};
        }
        
        // split by spaces to allow for multiple event bindings at once
        var eventNameList = name.split(/ +/);
        
        // iterate through and bind each event
        hartomyCart.each( eventNameList , function( eventName ){
          if (this._events[eventName] === true) {
            callback.apply(this);
          } else if (!isUndefined(this._events[eventName])) {
            this._events[eventName].push(callback);
          } else {
            this._events[eventName] = [callback];
          }
        });

        
        return this;
      },
      
      // trigger event
      trigger: function (name, options) {
        var returnval = true,
          x,
          xlen;

        if (!this._events) {
          this._events = {};
        }
        if (!isUndefined(this._events[name]) && isFunction(this._events[name][0])) {
          for (x = 0, xlen = this._events[name].length; x < xlen; x += 1) {
            returnval = this._events[name][x].apply(this, (options || []));
          }
        }
        if (returnval === false) {
          return false;
        }
        return true;
      }

    };
    // alias for bind
    eventFunctions.on = eventFunctions.bind;
    hartomyCart.extend(eventFunctions);
    hartomyCart.extend(hartomyCart.Item._, eventFunctions);


    // base hartomyCart events in options
    baseEvents = {
        beforeAdd				: null
      , afterAdd				: null
      , load					: null
      , beforeSave			: null
      , afterSave				: null
      , update				: null
      , ready					: null
      , checkoutSuccess		: null
      , checkoutFail			: null
      , beforeCheckout		: null
      , beforeRemove			: null
    };
    // events in option
    hartomyCart.bind('beforeAdd', function (item) {
      if (hartomyCart.has(item)) 
        {
         var checkAdd =  confirm('Produk sudah ditambah, tambahkan lagi?');
         if(checkAdd == true){
           // do your code
              hartomyCart.has(item)
              $('.cart-area').addClass('open');
              $("body").css({overflow: "hidden"});
              return false;
         } else {
              hartomyCart.remove(item)
              var cart = document.getElementById("toast-cart");
              cart.classList.remove("show");
           }
        }
    });
    hartomyCart.bind('afterAdd', function (item) {
      if (hartomyCart.has(item)) 
        {
          var cart = document.getElementById("toast-cart");
            cart.classList.add("show");
            setTimeout(function(){
              cart.classList.remove("show");
            }, 3000);
          $('.fixed-nav').addClass('show');
        }
    });
    hartomyCart.bind('beforeRemove', function (item) {
    var checkRemove =  confirm('Apakah anda yakin ingin menhapus produk ini dari keranjang?');
    if(checkRemove == true){
      // do your code
          hartomyCart.has(item)
          return false;
    } else {
          hartomyCart.remove(item);
    }
    });
    // extend with base events
    hartomyCart(baseEvents);

    // bind settings to events
    hartomyCart.each(baseEvents, function (val, x, name) {
      hartomyCart.bind(name, function () {
        if (isFunction(settings[name])) {
          settings[name].apply(this, arguments);
        }
      });
    });

    /*******************************************************************
     *	FORMATTING FUNCTIONS
     *******************************************************************/
    hartomyCart.extend({
      toCurrency: function (number,opts) {
        var num = parseFloat(number),
          opt_input = opts || {},
          _opts = hartomyCart.extend(hartomyCart.extend({
              symbol:		"Rp. "
							, decimal:		"."
							, delimiter:	","
							, accuracy:		2
							, after: false
          }, hartomyCart.currency()), opt_input),

          numParts = num.toFixed(_opts.accuracy).split("."),
          dec = numParts[1],
          ints = numParts[0];
    
        ints = hartomyCart.chunk(ints.reverse(), 3).join(_opts.delimiter.reverse()).reverse();

        return	(!_opts.after ? _opts.symbol : "") +
            ints +
            (dec ? _opts.decimal + dec : "") +
            (_opts.after ? _opts.symbol : "");

      },


      // break a string in blocks of size n
      chunk: function (str, n) {
        if (typeof n==='undefined') {
          n=2;
        }
        var result = str.match(new RegExp('.{1,' + n + '}','g'));
        return result || [];
      }

    });


    // reverse string function
    String.prototype.reverse = function () {
      return this.split("").reverse().join("");
    };


    // currency functions
    hartomyCart.extend({
      currency: function (currency) {
        if (isString(currency) && !isUndefined(currencies[currency])) {
          settings.currency = currency;
        } else if (isObject(currency)) {
          currencies[currency.code] = currency;
          settings.currency = currency.code;
        } else {
          return currencies[settings.currency];
        }
      }
    });

    /*******************************************************************
     *	VIEW POST
     *******************************************************************/
      $(document).ready(function () {
        $('.buka-tutup').on('click', function () {
            $('.cart-area').toggleClass('open');
          $("body").css({overflow: "hidden"});
            return false;
        });

        $('.close-btn, .bg-popup').on('click', function () {
            $('.cart-area').removeClass('open');
          $("body").css({overflow: "auto"});
            return false;
        });
      });
      $(document).on('click', '.checkout', function () {
        $(".cart-body").slideToggle('normal');
        $(".chart-right").slideToggle('normal');
        $(".rincian").slideToggle('normal');
        $(".pesan").slideToggle('normal');
      });

    /* Option -------------------------------------------------------------------- */

$('.blog-post').each(function () {
  var textli = $('.optProduct').find('li').text();
  if (textli === '') {
    $('.optProduct').remove();
  } else if (textli) {
    $('.nameOption').each(function () {
      var value = $(this).text();
      $('.listOptionProduct').append('<div class="itemInfo"><div class="item_size">'+value+'<small><s></s><b></b></small></div></div>');
    });
    $('.optProduct').each(function () {
      $(this).find('li').click(function () {
        var value = $(this).text();
        $(this).parents('.optProduct').find('li').removeAttr('class');
        $(this).addClass('selected');
        $(this).parents('.optProduct').attr('data-price', value);
       $('.item_size').find('b').text(value);
       $('.item_size').find('s').text(' : ');
      });
     $(this).find('li:first').trigger('click');
    });
  }
});
 
$('.blog-post').each(function(){
    var textli2 = $('.optProduct2').find('li').text();
    if (textli2 === '') {
    $('.optProduct2').remove();
    } else {
      $('.optProduct2').each(function(){
        $(this).find('.nameOption2').each(function(){
        var nameval = $(this).text();
        $('.listOptionProduct').append('<div class="itemInfo2"><div class="item_warna">'+nameval+'<small><s></s><b></b></small></div></div>');
        $('.optProduct2').find('li').click(function(){
          var value = $(this).text();
          $(this).parents('.optProduct2').find('li').removeAttr('class');
          $(this).addClass('selected');
          $(this).parents('.optProduct2').attr('data-price',value);
          $('.item_warna').find('b').text(value);
        $('.item_warna').find('s').text(' : ');
        });
        $(this).find('li:first').trigger('click');

        }); 
      });
	}
});

  $(document).ready(function() {
      $('.optProduct, .optProduct2').each(function() {
          $(this).find('li:first').trigger('click');
      });
  });


  $(document).ready(function() {
      $('.optProduct, .optProduct2').each(function() {
          $(this).find('li:first').trigger('click');
      });
  });

    $('.optProduct li').each(function() {
        var optionPrice = $(this).attr('data-price');
        var price = $(this).parents('.productCart_shelfItem').find('.price').attr('data-real-price');
        if (optionPrice == 0 || optionPrice == undefined) {
            $(this).attr('data-price', price);
        }
    });
      $('.popular-post').each(function() {
            /* Stok Habis -------------------------------------------------------------------- */
            var stock = $('.productDetail', this).attr('data-stock');
            if(stock === 'off') {
              $(this).find('.itemPrice').append('<div style="cursor:not-allowed;" onclick="alert(&#39;'+stockHabis+'&#39;);" class="stock" title="'+stockHabis+'"><marquee scrolldelay="200">'+stockHabis+'...</marquee></div>');
            }
            /* Stok Habis -------------------------------------------------------------------- */
      });
      $('.blog-post, .popular-post, .sidebar, .orderBtn').each(function() {
            /* Stok Habis -------------------------------------------------------------------- */
          var stock = $('.productDetail').data('stock');
          if(stock === 'off') {
              $(this).find('.productCheckout').append('<div style="cursor:not-allowed;" onclick="alert(&#39;'+stockHabis+'&#39;);" class="stock" title="'+stockHabis+'"></div>');
            }
            var stock = $('.productDetail', this).attr('data-stock');
            if(stock === 'off') {
               $(this).find('.slider-image, .entry-image, .FeaturedPost .post-image-link').append('<b class="info-stock"><b class="text">'+stockHabis+'</b></b>');
            }
            /* Stok Habis -------------------------------------------------------------------- */
        $('.item-post .area-price').remove();
      });
  $('.blog-post').each(function(q) {
      $('.blog-post, .popular-post, .sidebar').each(function() {
          var discount = $('.price', this).attr('data-discount');
          var price = $('.price', this).attr('data-real-price');
          var berat = $('.berat-produk', this).attr('data-berat');

            if (berat > 999)
            {
               var berat = $('.berat-produk', this).attr('data-berat');
               var satuan = berat / 1000;
               $('.berat-produk', this).html('<div class="title-berat">Berat</div><span class="item-berat">'+satuan+' kg</span><span class="item_berat bintang">'+berat+'</span>');
            }
            else
            {
               var satuan = berat;
                   $('.berat-produk', this).html('<div class="title-berat">Berat</div><span class="item_berat item-berat">'+satuan+' gram</span>');
            }
          if (berat != null && berat != 0) {
              $('.berat-produk', this).show()
          } else {
              $('.berat-produk', this).hide();
              $('.berat-produk', this).html('<span class="item_berat bintang">0</span>');
          }

          if (discount != null && discount != 0) {
              var discount_price = price - price * discount / 100;
              $('.price', this).attr('data-price', discount_price);
              $('.price', this).html('<small><span>-'+discount+'%</span><s>'+hartomyCart.toCurrency(price)+'</s></small><span class="dsc-price">'+hartomyCart.toCurrency(discount_price)+'</span><sp class="item_price bintang">'+discount_price+'</sp>');
          } else {
              $('.price', this).html('<b class="dsc-price">'+hartomyCart.toCurrency(price)+'</b><sp class="item_price bintang">'+price+'</sp>');
              $('.snipPrdk', this).addClass('nodisc');
          }
      });
      $('.optProduct li', this).on('click', function() {
          var text = $(this).text();
          var price = $(this).attr('data-price');
          $(this).parents('.optProduct').find('li').removeClass('selected');
          $(this).addClass('selected');
          var discount = $(this).parents('.productCart_shelfItem').find('.price').attr('data-discount');

          if (price != null && price != 0) {

              if (discount != null && discount != 0) {
                  var discount_price = price - price * discount / 100;
                  $('.list-product-checkout').find('.total').text(hartomyCart.toCurrency(discount_price));
                  $(this).parents('.productCart_shelfItem').find('.totalPrice').text(hartomyCart.toCurrency(discount_price));
                  $(this).parents('.productCart_shelfItem').find('.price').attr('data-price', discount_price);
                  $(this).parents('.productCart_shelfItem').find('.price').html('<small><span>-'+discount+'%</span><s>'+hartomyCart.toCurrency(price)+'</s></small><span class="dsc-price">'+hartomyCart.toCurrency(discount_price)+'</span><sp class="item_price bintang">'+discount_price+'</sp>');
                  $(this).parents('.productCart_shelfItem').find('.itemPrice .item_price').html(discount_price);
                  $('.productCart_shelfItem').find('.qty').text(1);
               } else {
                  $(this).parents('.productCart_shelfItem').find('.price').attr('data-price', price);
                  $(this).parents('.productCart_shelfItem').find('.price').html('<b class="dsc-price">'+hartomyCart.toCurrency(price)+'</b><sp class="item_price bintang">'+price+'</sp>');
                  $('.list-product-checkout').find('.total').text(hartomyCart.toCurrency(price));
                  $(this).parents('.productCart_shelfItem').find('.totalPrice').text(hartomyCart.toCurrency(price));
                  $('.productCart_shelfItem').find('.qty').text(1);
              }
          } else {
              $(this).parents('.productCart_shelfItem').find('.price').attr('data-price', price);
              $(this).parents('.productCart_shelfItem').find('.price').html('<b>'+hartomyCart.toCurrency(price)+'</b>');
          }
      });

      $('.optProduct2 li', this).on('click', function() {
          var text = $(this).text();
          $(this).parents('.optProduct2').find('li').removeClass('selected');
          $(this).addClass('selected');

      });
  });
    /*******************************************************************
     *	VIEW MANAGEMENT
     *******************************************************************/

    hartomyCart.extend({
      // bind outlets to function
      bindOutlets: function (outlets) {
        hartomyCart.each(outlets, function (callback, x, selector) {
          
          hartomyCart.bind('update', function () {
            hartomyCart.setOutlet("." + namespace + "_" + selector, callback);
          });
        });
      },

      // set function return to outlet
      setOutlet: function (selector, func) {
        var val = func.call(hartomyCart, selector);
        if (isObject(val) && val.el) {
          hartomyCart.$(selector).html(' ').append(val);
        } else if (!isUndefined(val)) {
          hartomyCart.$(selector).html(val);
        }
      },

      // bind click events on inputs
      bindInputs: function (inputs) {
        hartomyCart.each(inputs, function (info) {
          hartomyCart.setInput("." + namespace + "_" + info.selector, info.event, info.callback);
        });
      },

      // attach events to inputs	
      setInput: function (selector, event, func) {
        hartomyCart.$(selector).live(event, func);
      }
    });		


    // class for wrapping DOM selector shit
    hartomyCart.ELEMENT = function (selector) {

      this.create(selector);
      this.selector = selector || null; // "#" + this.attr('id'); TODO: test length?
    };

    hartomyCart.extend(selectorFunctions, {

      "MooTools"		: {
        text: function (text) {
          return this.attr(_TEXT_, text);
        },
        html: function (html) {
          return this.attr(_HTML_, html);
        },
        val: function (val) {
          return this.attr(_VALUE_, val);
        },
        attr: function (attr, val) {
          if (isUndefined(val)) {
            return this.el[0] && this.el[0].get(attr);
          }
          
          this.el.set(attr, val);
          return this;
        },
        remove: function () {
          this.el.dispose();
          return null;
        },
        addClass: function (klass) {
          this.el.addClass(klass);
          return this;
        },
        removeClass: function (klass) {
          this.el.removeClass(klass);
          return this;
        },
        append: function (item) {
          this.el.adopt(item.el);
          return this;
        },
        each: function (callback) {
          if (isFunction(callback)) {
            hartomyCart.each(this.el, function( e, i, c) {
              callback.call( i, i, e, c );
            });
          }
          return this;
        },
        click: function (callback) {
          if (isFunction(callback)) {
            this.each(function (e) {
              e.addEvent(_CLICK_, function (ev) {
                callback.call(e,ev);
              });
            });
          } else if (isUndefined(callback)) {
            this.el.fireEvent(_CLICK_);
          }

          return this;
        },
        live: function (	event,callback) {
          var selector = this.selector;
          if (isFunction(callback)) {
            hartomyCart.$("body").el.addEvent(event + ":relay(" + selector + ")", function (e, el) {
              callback.call(el, e);
            });
          }
        },
        match: function (selector) {
          return this.el.match(selector);
        },
        parent: function () {
          return hartomyCart.$(this.el.getParent());
        },
        find: function (selector) {
          return hartomyCart.$(this.el.getElements(selector));
        },
        closest: function (selector) {
          return hartomyCart.$(this.el.getParent(selector));
        },
        descendants: function () {
          return this.find("*");
        },
        tag: function () {
          return this.el[0].tagName;
        },
        submit: function (){
          this.el[0].submit();
          return this;
        },
        create: function (selector) {
          this.el = $engine(selector);
        }


      },

      "Prototype"		: {
        text: function (text) {
          if (isUndefined(text)) {
            return this.el[0].innerHTML;
          }
          this.each(function (i,e) {
            $(e).update(text);
          });
          return this;
        },
        html: function (html) {
          return this.text(html);
        },
        val: function (val) {
          return this.attr(_VALUE_, val);
        },
        attr: function (attr, val) {
          if (isUndefined(val)) {
            return this.el[0].readAttribute(attr);
          }
          this.each(function (i,e) {
            $(e).writeAttribute(attr, val);
          });
          return this;
        },
        append: function (item) {
          this.each(function (i,e) {
            if (item.el) {
              item.each(function (i2,e2) {
                $(e).appendChild(e2);
              });
            } else if (isElement(item)) {
              $(e).appendChild(item);
            }
          });
          return this;
        },
        remove: function () {
          this.each(function (i, e) {
            $(e).remove();
          });
          return this;
        },
        addClass: function (klass) {
          this.each(function (i, e) {
            $(e).addClassName(klass);
          });
          return this;
        },
        removeClass: function (klass) {
          this.each(function (i, e) {
            $(e).removeClassName(klass);
          });
          return this;
        },
        each: function (callback) {
          if (isFunction(callback)) {
            hartomyCart.each(this.el, function( e, i, c) {
              callback.call( i, i, e, c );
            });
          }
          return this;
        },
        click: function (callback) {
          if (isFunction(callback)) {
            this.each(function (i, e) {
              $(e).observe(_CLICK_, function (ev) {
                callback.call(e,ev);
              });
            });
          } else if (isUndefined(callback)) {
            this.each(function (i, e) {
              $(e).fire(_CLICK_);
            });
          }
          return this;
        },
        live: function (event,callback) {
          if (isFunction(callback)) {
            var selector = this.selector;
            document.observe(event, function (e, el) {
              if (el === $engine(e).findElement(selector)) {
                callback.call(el, e);
              }
            });
          }
        },
        parent: function () {
          return hartomyCart.$(this.el.up());
        },
        find: function (selector) {
          return hartomyCart.$(this.el.getElementsBySelector(selector));
        },
        closest: function (selector) {
          return hartomyCart.$(this.el.up(selector));
        },
        descendants: function () {
          return hartomyCart.$(this.el.descendants());
        },
        tag: function () {
          return this.el.tagName;
        },
        submit: function() {
          this.el[0].submit();
        },

        create: function (selector) {
          if (isString(selector)) {
            this.el = $engine(selector);
          } else if (isElement(selector)) {
            this.el = [selector];
          }
        }



      },

      "jQuery": {
        passthrough: function (action, val) {
          if (isUndefined(val)) {
            return this.el[action]();
          }
          
          this.el[action](val);
          return this;
        },
        text: function (text) {
          return this.passthrough(_TEXT_, text);
        },
        html: function (html) {
          return this.passthrough(_HTML_, html);
        },
        val: function (val) {
          return this.passthrough("val", val);
        },
        append: function (item) {
          var target = item.el || item;
          this.el.append(target);
          return this;
        },
        attr: function (attr, val) {
          if (isUndefined(val)) {
            return this.el.attr(attr);
          }
          this.el.attr(attr, val);
          return this;
        },
        remove: function () {
          this.el.remove();
          return this;
        },
        addClass: function (klass) {
          this.el.addClass(klass);
          return this;
        },
        removeClass: function (klass) {
          this.el.removeClass(klass);
          return this;
        },
        each: function (callback) {
          return this.passthrough('each', callback);
        },
        click: function (callback) {
          return this.passthrough(_CLICK_, callback);
        },
        live: function (event, callback) {
          $engine(document).delegate(this.selector, event, callback);
          return this;
        },
        parent: function () {
          return hartomyCart.$(this.el.parent());
        },
        find: function (selector) {
          return hartomyCart.$(this.el.find(selector));
        },
        closest: function (selector) {
          return hartomyCart.$(this.el.closest(selector));
        },
        tag: function () {
          return this.el[0].tagName;
        },
        descendants: function () {
          return hartomyCart.$(this.el.find("*"));
        },
        submit: function() {
          return this.el.submit();
        },

        create: function (selector) {
          this.el = $engine(selector);
        }
      }
    });

    hartomyCart.ELEMENT._ = hartomyCart.ELEMENT.prototype;

    // bind the DOM setup to the ready event
    hartomyCart.ready(hartomyCart.setupViewTool);

    // bind the input and output events
    hartomyCart.ready(function () {
      hartomyCart.bindOutlets({
        total: function () {
          return hartomyCart.toCurrency(hartomyCart.total());
        }
        , totalberat: function () {
            var berat_total = hartomyCart.totalberat();
            if (berat_total > 999)
            {
             var hasilBerat = berat_total / 1000;
             return hasilBerat;
            }
            else if (berat_total != 0)
            {
            $('.jumlah-ongkos-pesanan').css({display: "block"});
            $('.total-berat-produk').css({display: "block"});
            return hartomyCart.totalberat();
            }
            else 
            { 
            $('.jumlah-ongkos-pesanan').css({display: "none"});
            $('.total-berat-produk').css({display: "none"});
            return "";
            }
        }
        , satuanttlberat: function () {
            var satuanttl = hartomyCart.totalberat();
            if (satuanttl > 999)
            {
             return " Kg";
            }
            else if (satuanttl != 0)
            {
            return " Gram";
            }
            else 
            { 
            return "";
            }
        }
        , quantity: function () {
          return hartomyCart.quantity();
        }
        , items: function (selector) {
          hartomyCart.writeCart(selector);
        }
        , tax: function () {
          return hartomyCart.toCurrency(hartomyCart.tax());
        }
        , taxRate: function () {
          return hartomyCart.taxRate().toFixed();
        }
        , shipping: function () {
          return hartomyCart.toCurrency(hartomyCart.shipping());
        }
        , grandTotal: function () {
          return hartomyCart.toCurrency(hartomyCart.grandTotal());
        }
      });
      hartomyCart.bindInputs([
        {	  selector: 'checkout'
          , event: 'click'
          , callback: function () {
            hartomyCart.checkout();
          }
        }
        , {	  selector: 'empty'
          , event: 'click'
          , callback: function () {
            var checkEmpty =  confirm('Apakah anda yakin ingin menghapus semuanya?');
            if(checkEmpty == false){
              hartomyCart.remove();
                return false;
            } else {
              return hartomyCart.hilang()
            }
          }
        }
        , {	  selector: 'increment'
          , event: 'click'
          , callback: function () {
            hartomyCart.find(hartomyCart.$(this).closest('.itemProduk').attr('id').split("_")[1]).increment();
            hartomyCart.update();
          }
        }
        , {	  selector: 'decrement'
          , event: 'click'
          , callback: function () {
            hartomyCart.find(hartomyCart.$(this).closest('.itemProduk').attr('id').split("_")[1]).decrement();
            hartomyCart.update();
          }
        }
        /* remove from cart */
        , {	  selector: 'remove'
          , event: 'click'
          , callback: function () {
            hartomyCart.find(hartomyCart.$(this).closest('.itemProduk').attr('id').split("_")[1]).remove();
          }
        }

        /* cart inputs */
        , {	  selector: 'input'
          , event: 'change'
          , callback: function () {
            var $input = hartomyCart.$(this),
              $parent = $input.parent(),
              classList = $parent.attr('class').split(" ");
            hartomyCart.each(classList, function (klass) {
              if (klass.match(/.+/i)) {
                var field = klass.split("-")[1];
                hartomyCart.find($parent.closest('.itemProduk').attr('id').split("_")[1]).set(field,$input.val());
                hartomyCart.update();
                return;
              }
            });
          }
        }

        /* here is our shelfItem add to cart button listener */
        , { selector: 'shelfItem .item_add'
          , event: 'click'
          , callback: function () {
            var $button = hartomyCart.$(this),
              fields = {};

            $button.closest("." + namespace + "_shelfItem").descendants().each(function (x,item) {
              var $item = hartomyCart.$(item);

              // check to see if the class matches the item_[fieldname] pattern
              if ($item.attr("class") &&
                $item.attr("class").match(/item_.+/) &&
                !$item.attr('class').match(/item_add/)) {

                // find the class name
                hartomyCart.each($item.attr('class').split(' '), function (klass) {
                  var attr,
                    val,
                    type;

                  // get the value or text depending on the tagName
                  if (klass.match(/item_.+/)) {
                    attr = klass.split("_")[1];
                    val = "";
                    switch($item.tag().toLowerCase()) {
                      case "input":
                      case "textarea":
                      case "select":
                        type = $item.attr("type");
                        if (!type || ((type.toLowerCase() === "checkbox" || type.toLowerCase() === "radio") && $item.attr("checked")) || type.toLowerCase() === "text" || type.toLowerCase() === "number") {
                          val = $item.val();
                        }				
                        break;
                      case "img":
                        val = $item.attr('src');
                        break;
                      default:
                        val = $item.text();
                        break;
                    }

                    if (val !== null && val !== "") {
                      fields[attr.toLowerCase()] = fields[attr.toLowerCase()] ? fields[attr.toLowerCase()] + ", " +  val : val;
                    }
                  }
                });
              }
            });

            // add the item
            hartomyCart.add(fields);
                      }
                      
        }, { selector: 'shelfItem .item_addone'
                  , event: 'click'
                  , callback: function () {
                      var $button = hartomyCart.$(this),
                          fields = {};
                      $('.cart-area').toggleClass('open');
                      $("body").css({overflow: "hidden"});
                      $button.closest("." + namespace + "_shelfItem").descendants().each(function (x,item) {
                          var $item = hartomyCart.$(item);

                          // check to see if the class matches the item_[fieldname] pattern
                          if ($item.attr("class") &&
                              $item.attr("class").match(/item_.+/) &&
                              !$item.attr('class').match(/item_addone/)) {

                              // find the class name
                              hartomyCart.each($item.attr('class').split(' '), function (klass) {
                                  var attr,
                                      val,
                                      type;

                                  // get the value or text depending on the tagName
                                  if (klass.match(/item_.+/)) {
                                      attr = klass.split("_")[1];
                                      val = "";
                                      switch($item.tag().toLowerCase()) {
                                          case "input":
                                          case "textarea":
                                          case "select":
                                              type = $item.attr("type");
                                              if (!type || ((type.toLowerCase() === "checkbox" || type.toLowerCase() === "radio") && $item.attr("checked")) || type.toLowerCase() === "text" || type.toLowerCase() === "number") {
                                                  val = $item.val();
                                              }				
                                              break;
                                          case "img":
                                              val = $item.attr('src');
                                              break;
                                          default:
                                              val = $item.text();
                                              break;
                                      }

                                      if (val !== null && val !== "") {
                                          fields[attr.toLowerCase()] = fields[attr.toLowerCase()] ? fields[attr.toLowerCase()] + ", " +  val : val;
                                      }
                                  }
                              });
                          }
                      });

                      // add the item
                      hartomyCart.add(fields);
                  }
                  
              }
      ]);
    });


    /*******************************************************************
     *	DOM READY
     *******************************************************************/
    // Cleanup functions for the document ready method
    // used from jQuery
    /*global DOMContentLoaded */
    if (document.addEventListener) {
      window.DOMContentLoaded = function () {
        document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
        hartomyCart.init();
      };

    } else if (document.attachEvent) {
      window.DOMContentLoaded = function () {
        // Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
        if (document.readyState === "complete") {
          document.detachEvent("onreadystatechange", DOMContentLoaded);
          hartomyCart.init();
        }
      };
    }
    // The DOM ready check for Internet Explorer
    // used from jQuery
    function doScrollCheck() {
      if (hartomyCart.isReady) {
        return;
      }

      try {
        // If IE is used, use the trick by Diego Perini
        // http://javascript.nwbox.com/IEContentLoaded/
        document.documentElement.doScroll("left");
      } catch (e) {
        setTimeout(doScrollCheck, 1);
        return;
      }

      // and execute any waiting functions
      hartomyCart.init();
    }
    
    // bind ready event used from jquery
    function sc_BindReady () {

      // Catch cases where $(document).ready() is called after the
      // browser event has already occurred.
      if (document.readyState === "complete") {
        // Handle it asynchronously to allow scripts the opportunity to delay ready
        return setTimeout(hartomyCart.init, 1);
      }

      // Mozilla, Opera and webkit nightlies currently support this event
      if (document.addEventListener) {
        // Use the handy event callback
        document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);

        // A fallback to window.onload, that will always work
        window.addEventListener("load", hartomyCart.init, false);

      // If IE event model is used
      } else if (document.attachEvent) {
        // ensure firing before onload,
        // maybe late but safe also for iframes
        document.attachEvent("onreadystatechange", DOMContentLoaded);

        // A fallback to window.onload, that will always work
        window.attachEvent("onload", hartomyCart.init);

        // If IE and not a frame
        // continually check to see if the document is ready
        var toplevel = false;

        try {
          toplevel = window.frameElement === null;
        } catch (e) {}

        if (document.documentElement.doScroll && toplevel) {
          doScrollCheck();
        }
      }
    }

    // bind the ready event
    sc_BindReady();

    return hartomyCart;
  };


window.hartomyCart = generatehartomyCart();

}(window, document));

/************ JSON *************/
var JSON;JSON||(JSON={});
(function () {function k(a) {return a<10?"0"+a:a}function o(a) {p.lastIndex=0;return p.test(a)?'"'+a.replace(p,function (a) {var c=r[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function l(a,j) {var c,d,h,m,g=e,f,b=j[a];b&&typeof b==="object"&&typeof b.toJSON==="function"&&(b=b.toJSON(a));typeof i==="function"&&(b=i.call(j,a,b));switch(typeof b) {case "string":return o(b);case "number":return isFinite(b)?String(b):"null";case "boolean":case "null":return String(b);case "object":if (!b)return"null";
e += n;f=[];if (Object.prototype.toString.apply(b)==="[object Array]") {m=b.length;for (c=0;c<m;c += 1)f[c]=l(c,b)||"null";h=f.length===0?"[]":e?"[\n"+e+f.join(",\n"+e)+"\n"+g+"]":"["+f.join(",")+"]";e=g;return h}if (i&&typeof i==="object") {m=i.length;for (c=0;c<m;c += 1)typeof i[c]==="string"&&(d=i[c],(h=l(d,b))&&f.push(o(d)+(e?": ":":")+h))}else for (d in b)Object.prototype.hasOwnProperty.call(b,d)&&(h=l(d,b))&&f.push(o(d)+(e?": ":":")+h);h=f.length===0?"{}":e?"{\n"+e+f.join(",\n"+e)+"\n"+g+"}":"{"+f.join(",")+
"}";e=g;return h}}if (typeof Date.prototype.toJSON!=="function")Date.prototype.toJSON=function () {return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+k(this.getUTCMonth()+1)+"-"+k(this.getUTCDate())+"T"+k(this.getUTCHours())+":"+k(this.getUTCMinutes())+":"+k(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function () {return this.valueOf()};var q=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
p=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,e,n,r={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},i;if (typeof JSON.stringify!=="function")JSON.stringify=function (a,j,c) {var d;n=e="";if (typeof c==="number")for (d=0;d<c;d += 1)n += " ";else typeof c==="string"&&(n=c);if ((i=j)&&typeof j!=="function"&&(typeof j!=="object"||typeof j.length!=="number"))throw Error("JSON.stringify");return l("",
{"":a})};if (typeof JSON.parse!=="function")JSON.parse=function (a,e) {function c(a,d) {var g,f,b=a[d];if (b&&typeof b==="object")for (g in b)Object.prototype.hasOwnProperty.call(b,g)&&(f=c(b,g),f!==void 0?b[g]=f:delete b[g]);return e.call(a,d,b)}var d,a=String(a);q.lastIndex=0;q.test(a)&&(a=a.replace(q,function (a) {return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if (/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return d=eval("("+a+")"),typeof e==="function"?c({"":d},""):d;throw new SyntaxError("JSON.parse");}})();


/************ HTML5 Local Storage Support *************/
(function () {if (!this.localStorage)if (this.globalStorage)try {this.localStorage=this.globalStorage}catch(e) {}else{var a=document.createElement("div");a.style.display="none";document.getElementsByTagName("head")[0].appendChild(a);if (a.addBehavior) {a.addBehavior("#default#userdata");var d=this.localStorage={length:0,setItem:function (b,d) {a.load("localStorage");b=c(b);a.getAttribute(b)||this.length++;a.setAttribute(b,d);a.save("localStorage")},getItem:function (b) {a.load("localStorage");b=c(b);return a.getAttribute(b)},
removeItem:function (b) {a.load("localStorage");b=c(b);a.removeAttribute(b);a.save("localStorage");this.length=0},clear:function () {a.load("localStorage");for (var b=0;attr=a.XMLDocument.documentElement.attributes[b++];)a.removeAttribute(attr.name);a.save("localStorage");this.length=0},key:function (b) {a.load("localStorage");return a.XMLDocument.documentElement.attributes[b]}},c=function (a) {return a.replace(/[^-._0-9A-Za-z\xb7\xc0-\xd6\xd8-\xf6\xf8-\u037d\u37f-\u1fff\u200c-\u200d\u203f\u2040\u2070-\u218f]/g,
"-")};a.load("localStorage");d.length=a.XMLDocument.documentElement.attributes.length}}})();

        /* Carousel -------------------------------------------------------------------- */
  $(document).ready(function(){

  $(".fotoslide").owlCarousel({    
    loop:true,
    items:1,
    margin:0,
    stagePadding: 0,
    autoplay:true  
  });

  dotcount = 1;

  jQuery('.fotoslide .owl-dot').each(function() {
    jQuery( this ).addClass( 'dotnumber' + dotcount);
    jQuery( this ).attr('data-info', dotcount);
    dotcount=dotcount+1;
  });

  slidecount = 1;

  jQuery('.fotoslide .owl-item').not('.cloned').each(function() {
    jQuery( this ).addClass( 'slidenumber' + slidecount);
    slidecount=slidecount+1;
  });

  jQuery('.fotoslide .owl-dot').each(function() {  
    grab = jQuery(this).data('info');   
    slidegrab = jQuery('.slidenumber'+ grab +' img').attr('src');
    jQuery(this).css("background-image", "url("+slidegrab+")");   
  });

  amount = $('.fotoslide .owl-dot').length;
  gotowidth = 100/amount;     
  jQuery('.fotoslide .owl-dot').css("height", gotowidth+"%");

  });
        /* Append -------------------------------------------------------------------- */


        $('.productCheckout').appendTo('.orderBtn');
        $('.detailDescription').appendTo('#tabDescription');
        var arr_pembayaran = metodeBayar;
        $.each(arr_pembayaran, function(key, value) {
          $('#wa-checkout .pembayaran optgroup').append('<option value="'+key+' '+value+'">'+key+' - ' +value+ '</option>');
        });

    /* cForm-WA  -------------------------------------------------------------------- */
    $(document).on('keypress','.formWA input, .formWA textarea', function() {
      if (event.keyCode === 13) {
        $(this).parents(".formWA").find('.submit').trigger('click');
      }
    });

    $('.formWA .thisRequired').each(function() {
      title = $(this).attr('placeholder');
      label = $(this).parents('label');
      $('<span class="validated"><b>' + title + '</b> (thisRequired)</span>').appendTo(label);
    });

    $(document).on('keyup','.formWA .thisRequired', function() {
      if ($(this).val() != '') {
        $(this).removeClass('focus');
        $(this).parents('label').find('.validated').removeClass('show');
      }
    });

    $(document).on('change','.formWA select', function() {
      $(this).removeClass('focus');
      $(this).parents('label').find('.validated').removeClass('show');
    });

    $(document).on('click','.formWA .submit', function(){
      kirimWA($(this).parents('.satu-pesanan').attr('id'));
      return false;
    });
    $(document).on('change','.formWA select.informasi', function() {
      var infooo = $(this).val();
      if(infooo == 'Teman') {
        $('.formWA .nama_teman_wrap').slideDown();
        $('.formWA .nama_teman_wrap .nama_teman').addClass('thisRequired');
      } else {
        $('.formWA .nama_teman_wrap').slideUp();
        $('.formWA .nama_teman_wrap .nama_teman').removeClass('thisRequired');
      }
    });
hartomyCart({currency: mataUang,});