// ColorBox v1.3.20.1 - jQuery lightbox plugin
// (c) 2012 Jack Moore - jacklmoore.com
// License: http://www.opensource.org/licenses/mit-license.php
(function(e,t,n){function G(n,r,i){var o=t.createElement(n);return r&&(o.id=s+r),i&&(o.style.cssText=i),e(o)}function Y(e){var t=T.length,n=(U+e)%t;return n<0?t+n:n}function Z(e,t){return Math.round((/%/.test(e)?(t==="x"?tt():nt())/100:1)*parseInt(e,10))}function et(e){return B.photo||/\.(gif|png|jp(e|g|eg)|bmp|ico)((#|\?).*)?$/i.test(e)}function tt(){return n.innerWidth||N.width()}function nt(){return n.innerHeight||N.height()}function rt(){var t,n=e.data(R,i);n==null?(B=e.extend({},r),console&&console.log&&console.log("Error: cboxElement missing settings object")):B=e.extend({},n);for(t in B)e.isFunction(B[t])&&t.slice(0,2)!=="on"&&(B[t]=B[t].call(R));B.rel=B.rel||R.rel||"nofollow",B.href=B.href||e(R).attr("href"),B.title=B.title||R.title,typeof B.href=="string"&&(B.href=e.trim(B.href))}function it(t,n){e.event.trigger(t),n&&n.call(R)}function st(){var e,t=s+"Slideshow_",n="click."+s,r,i,o;B.slideshow&&T[1]?(r=function(){M.text(B.slideshowStop).unbind(n).bind(f,function(){if(B.loop||T[U+1])e=setTimeout(J.next,B.slideshowSpeed)}).bind(a,function(){clearTimeout(e)}).one(n+" "+l,i),g.removeClass(t+"off").addClass(t+"on"),e=setTimeout(J.next,B.slideshowSpeed)},i=function(){clearTimeout(e),M.text(B.slideshowStart).unbind([f,a,l,n].join(" ")).one(n,function(){J.next(),r()}),g.removeClass(t+"on").addClass(t+"off")},B.slideshowAuto?r():i()):g.removeClass(t+"off "+t+"on")}function ot(t){V||(R=t,rt(),T=e(R),U=0,B.rel!=="nofollow"&&(T=e("."+o).filter(function(){var t=e.data(this,i),n;return t&&(n=t.rel||this.rel),n===B.rel}),U=T.index(R),U===-1&&(T=T.add(R),U=T.length-1)),W||(W=X=!0,g.show(),B.returnFocus&&e(R).blur().one(c,function(){e(this).focus()}),m.css({opacity:+B.opacity,cursor:B.overlayClose?"pointer":"auto"}).show(),B.w=Z(B.initialWidth,"x"),B.h=Z(B.initialHeight,"y"),J.position(),d&&N.bind("resize."+v+" scroll."+v,function(){m.css({width:tt(),height:nt(),top:N.scrollTop(),left:N.scrollLeft()})}).trigger("resize."+v),it(u,B.onOpen),H.add(A).hide(),P.html(B.close).show()),J.load(!0))}function ut(){!g&&t.body&&(Q=!1,N=e(n),g=G(K).attr({id:i,"class":p?s+(d?"IE6":"IE"):""}).hide(),m=G(K,"Overlay",d?"position:absolute":"").hide(),L=G(K,"LoadingOverlay").add(G(K,"LoadingGraphic")),y=G(K,"Wrapper"),b=G(K,"Content").append(C=G(K,"LoadedContent","width:0; height:0; overflow:hidden"),A=G(K,"Title"),O=G(K,"Current"),_=G(K,"Next"),D=G(K,"Previous"),M=G(K,"Slideshow").bind(u,st),P=G(K,"Close")),y.append(G(K).append(G(K,"TopLeft"),w=G(K,"TopCenter"),G(K,"TopRight")),G(K,!1,"clear:left").append(E=G(K,"MiddleLeft"),b,S=G(K,"MiddleRight")),G(K,!1,"clear:left").append(G(K,"BottomLeft"),x=G(K,"BottomCenter"),G(K,"BottomRight"))).find("div div").css({"float":"left"}),k=G(K,!1,"position:absolute; width:9999px; visibility:hidden; display:none"),H=_.add(D).add(O).add(M),e(t.body).append(m,g.append(y,k)))}function at(){return g?(Q||(Q=!0,j=w.height()+x.height()+b.outerHeight(!0)-b.height(),F=E.width()+S.width()+b.outerWidth(!0)-b.width(),I=C.outerHeight(!0),q=C.outerWidth(!0),g.css({"padding-bottom":j,"padding-right":F}),_.click(function(){J.next()}),D.click(function(){J.prev()}),P.click(function(){J.close()}),m.click(function(){B.overlayClose&&J.close()}),e(t).bind("keydown."+s,function(e){var t=e.keyCode;W&&B.escKey&&t===27&&(e.preventDefault(),J.close()),W&&B.arrowKey&&T[1]&&(t===37?(e.preventDefault(),D.click()):t===39&&(e.preventDefault(),_.click()))}),e("."+o,t).live("click",function(e){e.which>1||e.shiftKey||e.altKey||e.metaKey||(e.preventDefault(),ot(this))})),!0):!1}var r={transition:"elastic",speed:300,width:!1,initialWidth:"600",innerWidth:!1,maxWidth:!1,height:!1,initialHeight:"450",innerHeight:!1,maxHeight:!1,scalePhotos:!0,scrolling:!0,inline:!1,html:!1,iframe:!1,fastIframe:!0,photo:!1,href:!1,title:!1,rel:!1,opacity:.9,preloading:!0,current:"image {current} of {total}",previous:"previous",next:"next",close:"close",xhrError:"This content failed to load.",imgError:"This image failed to load.",open:!1,returnFocus:!0,reposition:!0,loop:!0,slideshow:!1,slideshowAuto:!0,slideshowSpeed:2500,slideshowStart:"start slideshow",slideshowStop:"stop slideshow",onOpen:!1,onLoad:!1,onComplete:!1,onCleanup:!1,onClosed:!1,overlayClose:!0,escKey:!0,arrowKey:!0,top:!1,bottom:!1,left:!1,right:!1,fixed:!1,data:undefined},i="colorbox",s="cbox",o=s+"Element",u=s+"_open",a=s+"_load",f=s+"_complete",l=s+"_cleanup",c=s+"_closed",h=s+"_purge",p=!e.support.opacity&&!e.support.style,d=p&&!n.XMLHttpRequest,v=s+"_IE6",m,g,y,b,w,E,S,x,T,N,C,k,L,A,O,M,_,D,P,H,B,j,F,I,q,R,U,z,W,X,V,$,J,K="div",Q;if(e.colorbox)return;e(ut),J=e.fn[i]=e[i]=function(t,n){var s=this;t=t||{},ut();if(at()){if(!s[0]){if(s.selector)return s;s=e("<a/>"),t.open=!0}n&&(t.onComplete=n),s.each(function(){e.data(this,i,e.extend({},e.data(this,i)||r,t))}).addClass(o),(e.isFunction(t.open)&&t.open.call(s)||t.open)&&ot(s[0])}return s},J.position=function(e,t){function f(e){w[0].style.width=x[0].style.width=b[0].style.width=e.style.width,b[0].style.height=E[0].style.height=S[0].style.height=e.style.height}var n,r=0,i=0,o=g.offset(),u,a;N.unbind("resize."+s),g.css({top:-9e4,left:-9e4}),u=N.scrollTop(),a=N.scrollLeft(),B.fixed&&!d?(o.top-=u,o.left-=a,g.css({position:"fixed"})):(r=u,i=a,g.css({position:"absolute"})),B.right!==!1?i+=Math.max(tt()-B.w-q-F-Z(B.right,"x"),0):B.left!==!1?i+=Z(B.left,"x"):i+=Math.round(Math.max(tt()-B.w-q-F,0)/2),B.bottom!==!1?r+=Math.max(nt()-B.h-I-j-Z(B.bottom,"y"),0):B.top!==!1?r+=Z(B.top,"y"):r+=Math.round(Math.max(nt()-B.h-I-j,0)/2),g.css({top:o.top,left:o.left}),e=g.width()===B.w+q&&g.height()===B.h+I?0:e||0,y[0].style.width=y[0].style.height="9999px",n={width:B.w+q,height:B.h+I,top:r,left:i},e===0&&g.css(n),g.dequeue().animate(n,{duration:e,complete:function(){f(this),X=!1,y[0].style.width=B.w+q+F+"px",y[0].style.height=B.h+I+j+"px",B.reposition&&setTimeout(function(){N.bind("resize."+s,J.position)},1),t&&t()},step:function(){f(this)}})},J.resize=function(e){W&&(e=e||{},e.width&&(B.w=Z(e.width,"x")-q-F),e.innerWidth&&(B.w=Z(e.innerWidth,"x")),C.css({width:B.w}),e.height&&(B.h=Z(e.height,"y")-I-j),e.innerHeight&&(B.h=Z(e.innerHeight,"y")),!e.innerHeight&&!e.height&&(C.css({height:"auto"}),B.h=C.height()),C.css({height:B.h}),J.position(B.transition==="none"?0:B.speed))},J.prep=function(t){function o(){return B.w=B.w||C.width(),B.w=B.mw&&B.mw<B.w?B.mw:B.w,B.w}function u(){return B.h=B.h||C.height(),B.h=B.mh&&B.mh<B.h?B.mh:B.h,B.h}if(!W)return;var n,r=B.transition==="none"?0:B.speed;C.remove(),C=G(K,"LoadedContent").append(t),C.hide().appendTo(k.show()).css({width:o(),overflow:B.scrolling?"auto":"hidden"}).css({height:u()}).prependTo(b),k.hide(),e(z).css({"float":"none"}),d&&e("select").not(g.find("select")).filter(function(){return this.style.visibility!=="hidden"}).css({visibility:"hidden"}).one(l,function(){this.style.visibility="inherit"}),n=function(){function y(){p&&g[0].style.removeAttribute("filter")}var t,n,o=T.length,u,a="frameBorder",l="allowTransparency",c,d,v,m;if(!W)return;c=function(){clearTimeout($),L.detach().hide(),it(f,B.onComplete)},p&&z&&C.fadeIn(100),A.html(B.title).add(C).show();if(o>1){typeof B.current=="string"&&O.html(B.current.replace("{current}",U+1).replace("{total}",o)).show(),_[B.loop||U<o-1?"show":"hide"]().html(B.next),D[B.loop||U?"show":"hide"]().html(B.previous),B.slideshow&&M.show();if(B.preloading){t=[Y(-1),Y(1)];while(n=T[t.pop()])m=e.data(n,i),m&&m.href?(d=m.href,e.isFunction(d)&&(d=d.call(n))):d=n.href,et(d)&&(v=new Image,v.src=d)}}else H.hide();B.iframe?(u=G("iframe")[0],a in u&&(u[a]=0),l in u&&(u[l]="true"),u.name=s+ +(new Date),B.fastIframe?c():e(u).one("load",c),u.src=B.href,B.scrolling||(u.scrolling="no"),e(u).addClass(s+"Iframe").appendTo(C).one(h,function(){u.src="//about:blank"})):c(),B.transition==="fade"?g.fadeTo(r,1,y):y()},B.transition==="fade"?g.fadeTo(r,0,function(){J.position(0,n)}):J.position(r,n)},J.load=function(t){var n,r,i=J.prep;X=!0,z=!1,R=T[U],t||rt(),it(h),it(a,B.onLoad),B.h=B.height?Z(B.height,"y")-I-j:B.innerHeight&&Z(B.innerHeight,"y"),B.w=B.width?Z(B.width,"x")-q-F:B.innerWidth&&Z(B.innerWidth,"x"),B.mw=B.w,B.mh=B.h,B.maxWidth&&(B.mw=Z(B.maxWidth,"x")-q-F,B.mw=B.w&&B.w<B.mw?B.w:B.mw),B.maxHeight&&(B.mh=Z(B.maxHeight,"y")-I-j,B.mh=B.h&&B.h<B.mh?B.h:B.mh),n=B.href,$=setTimeout(function(){L.show().appendTo(b)},100),B.inline?(G(K).hide().insertBefore(e(n)[0]).one(h,function(){e(this).replaceWith(C.children())}),i(e(n))):B.iframe?i(" "):B.html?i(B.html):et(n)?(e(z=new Image).addClass(s+"Photo").error(function(){B.title=!1,i(G(K,"Error").html(B.imgError))}).load(function(){var e;z.onload=null,B.scalePhotos&&(r=function(){z.height-=z.height*e,z.width-=z.width*e},B.mw&&z.width>B.mw&&(e=(z.width-B.mw)/z.width,r()),B.mh&&z.height>B.mh&&(e=(z.height-B.mh)/z.height,r())),B.h&&(z.style.marginTop=Math.max(B.h-z.height,0)/2+"px"),T[1]&&(B.loop||T[U+1])&&(z.style.cursor="pointer",z.onclick=function(){J.next()}),p&&(z.style.msInterpolationMode="bicubic"),setTimeout(function(){i(z)},1)}),setTimeout(function(){z.src=n},1)):n&&k.load(n,B.data,function(t,n,r){i(n==="error"?G(K,"Error").html(B.xhrError):e(this).contents())})},J.next=function(){!X&&T[1]&&(B.loop||T[U+1])&&(U=Y(1),J.load())},J.prev=function(){!X&&T[1]&&(B.loop||U)&&(U=Y(-1),J.load())},J.close=function(){W&&!V&&(V=!0,W=!1,it(l,B.onCleanup),N.unbind("."+s+" ."+v),m.fadeTo(200,0),g.stop().fadeTo(300,0,function(){g.add(m).css({opacity:1,cursor:"auto"}).hide(),it(h),C.remove(),setTimeout(function(){V=!1,it(c,B.onClosed)},1)}))},J.remove=function(){e([]).add(g).add(m).remove(),g=null,e("."+o).removeData(i).removeClass(o).die()},J.element=function(){return e(R)},J.settings=r})(jQuery,document,this);;
(function ($) {

Drupal.behaviors.initColorbox = {
  attach: function (context, settings) {
    if (!$.isFunction($.colorbox)) {
      return;
    }
    $('a, area, input', context)
      .filter('.colorbox')
      .once('init-colorbox')
      .colorbox(settings.colorbox);
  }
};

{
  $(document).bind('cbox_complete', function () {
    Drupal.attachBehaviors('#cboxLoadedContent');
  });
}

})(jQuery);
;
(function($) {

Drupal.plupload = Drupal.plupload || {};

/**
 * Attaches the Plupload behavior to each Plupload form element.
 */
Drupal.behaviors.plupload = {
  attach: function (context, settings) {
    $(".plupload-element", context).once('plupload-init', function () {
      var $this = $(this);

      // Merge the default settings and the element settings to get a full
      // settings object to pass to the Plupload library for this element.
      var id = $this.attr('id');
      var defaultSettings = settings.plupload['_default'] ? settings.plupload['_default'] : {};
      var elementSettings = (id && settings.plupload[id]) ? settings.plupload[id] : {};
      var pluploadSettings = $.extend({}, defaultSettings, elementSettings);

      // Do additional requirements testing to prevent a less than ideal runtime
      // from being used. For example, the Plupload library treats Firefox 3.5
      // as supporting HTML 5, but this is incorrect, because Firefox 3.5
      // doesn't support the 'multiple' attribute for file input controls. So,
      // if settings.plupload._requirements.html5.mozilla = '1.9.2', then we
      // remove 'html5' from pluploadSettings.runtimes if $.browser.mozilla is
      // true and if $.browser.version is less than '1.9.2'.
      if (settings.plupload['_requirements'] && pluploadSettings.runtimes) {
        var runtimes = pluploadSettings.runtimes.split(',');
        var filteredRuntimes = [];
        for (var i = 0; i < runtimes.length; i++) {
          var includeRuntime = true;
          if (settings.plupload['_requirements'][runtimes[i]]) {
            var requirements = settings.plupload['_requirements'][runtimes[i]];
            for (var browser in requirements) {
              if ($.browser[browser] && Drupal.plupload.compareVersions($.browser.version, requirements[browser]) < 0) {
                includeRuntime = false;
              }
            }
          }
          if (includeRuntime) {
            filteredRuntimes.push(runtimes[i]);
          }
        }
        pluploadSettings.runtimes = filteredRuntimes.join(',');
      }

      // Initialize Plupload for this element.
      $this.pluploadQueue(pluploadSettings);

    });
  }
};

 /**
  * Attaches the Plupload behavior to each Plupload form element.
  */
Drupal.behaviors.pluploadform = {
  attach: function(context, settings) {
    $('form', context).once('plupload-form', function() {
      if (0 < $(this).find('.plupload-element').length) {
        var $form = $(this);
        var originalFormAttributes = {
            'method': $form.attr('method'),
            'enctype': $form.attr('enctype'),
            'action': $form.attr('action'),
            'target': $form.attr('target')
        };      
  
        $(this).submit(function(e) {
          var completedPluploaders = 0;
          var totalPluploaders = $(this).find('.plupload-element').length;
          var errors = '';
  
          $(this).find('.plupload-element').each( function(index){
            var uploader = $(this).pluploadQueue();
  
            var id = $(this).attr('id');
            var defaultSettings = settings.plupload['_default'] ? settings.plupload['_default'] : {};
            var elementSettings = (id && settings.plupload[id]) ? settings.plupload[id] : {};
            var pluploadSettings = $.extend({}, defaultSettings, elementSettings);
  
            //Only allow the submit to proceed if there are files and they've all
            //completed uploading.
            //@todo Implement a setting for whether the field is required, rather
            //than assuming that all are.
            if (uploader.state == plupload.STARTED) {
              errors += Drupal.t("Please wait while your files are being uploaded.");              
            }
            else if (uploader.files.length == 0 && !pluploadSettings.required) {
              completedPluploaders++;
            }       
  
            else if (uploader.files.length == 0) { 
              errors += Drupal.t("@index: You must upload at least one file.\n",{'@index': (index + 1)});
            }       
  
            else if (uploader.files.length > 0 && uploader.total.uploaded == uploader.files.length) {
              completedPluploaders++;
            }       
  
            else {  
              var stateChangedHandler = function() {
                if (uploader.total.uploaded == uploader.files.length) {
                  uploader.unbind('StateChanged', stateChangedHandler);
                  completedPluploaders++;
                  if (completedPluploaders == totalPluploaders ) {
                    //Plupload's html4 runtime has a bug where it changes the
                    //attributes of the form to handle the file upload, but then
                    //fails to change them back after the upload is finished.
                    for (var attr in originalFormAttributes) {
                      $form.attr(attr, originalFormAttributes[attr]);
                    }
                    $form.submit();
                    return true;
                  }
                }
              };
              uploader.bind('StateChanged', stateChangedHandler);
              uploader.start();
            }

          });
          if (completedPluploaders == totalPluploaders) {
            //Plupload's html4 runtime has a bug where it changes the
            //attributes of the form to handle the file upload, but then
            //fails to change them back after the upload is finished.
            for (var attr in originalFormAttributes) {
              $form.attr(attr, originalFormAttributes[attr]);
            }
            return true;
          }
          else if (0 < errors.length){
            alert(errors);
          }
         
          return false;
        });
      }
    });
  }
};


/**
 * Helper function to compare version strings.
 *
 * Returns one of:
 *   - A negative integer if a < b.
 *   - A positive integer if a > b.
 *   - 0 if a == b.
 */
Drupal.plupload.compareVersions = function (a, b) {
  a = a.split('.');
  b = b.split('.');
  // Return the most significant difference, if there is one.
  for (var i=0; i < Math.min(a.length, b.length); i++) {
    var compare = parseInt(a[i]) - parseInt(b[i]);
    if (compare != 0) {
      return compare;
    }
  }
  // If the common parts of the two version strings are equal, the greater
  // version number is the one with the most sections.
  return a.length - b.length;
}

})(jQuery);
;
Drupal.behaviors.mediaUploadMultiple = {};

Drupal.behaviors.mediaUploadMultiple.attach = function (context, settings) {
  // When the plupload element initializes, it expands the size of the elements
  // it has created, so we need to resize the browser iframe after it's done.
  var uploader = jQuery('#edit-upload').pluploadQueue();
  if (uploader) {
    // Handle the case in which the uploader has already finished initializing.
    Drupal.media.browser.resizeIframe();
    // Handle the case in which the uploader has not yet initialized.
    uploader.bind("PostInit", Drupal.media.browser.resizeIframe);

    uploader.bind('StateChanged', Drupal.behaviors.mediaUploadMultiple.submit);
  }
};

Drupal.behaviors.mediaUploadMultiple.submit = function (uploader, file) {
  if (uploader.state == 2) {
    jQuery('#media-add-upload-multiple .form-submit').val(Drupal.t('Loading...'));
  }
};
;

(function ($) {
namespace('Drupal.media.browser');

Drupal.media.browser.selectedMedia = [];
Drupal.media.browser.mediaAdded = function () {};
Drupal.media.browser.selectionFinalized = function (selectedMedia) {
  // This is intended to be overridden if a callee wants to be triggered
  // when the media selection is finalized from inside the browser.
  // This is used for the file upload form for instance.
};

Drupal.behaviors.experimentalMediaBrowser = {
  attach: function (context) {
    if (Drupal.settings.media.selectedMedia) {
      Drupal.media.browser.selectMedia(Drupal.settings.media.selectedMedia);
      // Fire a confirmation of some sort.
      Drupal.media.browser.finalizeSelection();
    }
    $('#media-browser-tabset').tabs({
      show: Drupal.media.browser.resizeIframe
    });

    $('.media-browser-tab').each( Drupal.media.browser.validateButtons );

    Drupal.media.browser.selectErrorTab();

  }
  // Wait for additional params to be passed in.
};

Drupal.media.browser.launch = function () {

};

Drupal.media.browser.validateButtons = function() {
  // The media browser runs in an IFRAME. The Drupal.media.popups.mediaBrowser()
  // function sets up the IFRAME and "OK" and "Cancel" buttons that are outside
  // of the IFRAME, so that their click handlers can destroy the IFRAME while
  // retaining information about what media items were selected. However,
  // Drupal UI convention is to place all action buttons on the same "line"
  // at the bottom of the form, so if the form within the IFRAME contains a
  // "Submit" button or other action buttons, then the "OK" and "Cancel"
  // buttons below the IFRAME break this convention and confuse the user.
  // Therefore, we add "Submit" and "Cancel" buttons inside the IFRAME, and
  // have their click action trigger the click action of the corresonding
  // "OK" and "Cancel" buttons that are outside the IFRAME. media.css contains
  // CSS rules that hide the outside buttons.
  //
  // We don't add a "Submit" button if the form already has one, since in these
  // cases, another round-trip to the server is needed before the user's
  // selection is finalized. For these cases, when the form's real Submit
  // button is clicked, the server either returns another form for the user to
  // fill out, or else a completion page that contains or sets the
  // Drupal.media.browser.selectedMedia variable. If the latter, then
  // Drupal.media.popups.mediaBrowser.mediaBrowserOnLoad() auto-triggers the
  // "OK" button action to finalize the selection and remove the IFRAME.
  //
  // @todo An alternate, less hacky solution would be most welcome.
  if (!($('.form-submit', this).length > 0)) {
    $('<a class="button button-yes fake-ok">' + Drupal.t('Submit') + '</a>').appendTo(this).bind('click', Drupal.media.browser.submit);
    if (!($('.fake-cancel', this).length > 0)) {
      $('<a class="button button-no fake-cancel">' + Drupal.t('Cancel') + '</a>').appendTo(this).bind('click', Drupal.media.browser.submit);
    }
  } else if (!($('.fake-cancel', this).length > 0)) {
    var parent = $('.form-actions', this);
    if (!parent.length) {
      parent = $('form > div', this);
    }
    $('<a class="button button-no fake-cancel">' + Drupal.t('Cancel') + '</a>').appendTo(parent).bind('click', Drupal.media.browser.submit);
  }
};

Drupal.media.browser.submit = function () {
  // @see Drupal.media.browser.validateButtons().
  var buttons = $(parent.window.document.body).find('#mediaBrowser').parent('.ui-dialog').find('.ui-dialog-buttonpane button');
  if ($(this).hasClass('fake-cancel')) {
    buttons[1].click();
  } else {
    buttons[0].click();
  }
}

Drupal.media.browser.selectMedia = function (selectedMedia) {
  Drupal.media.browser.selectedMedia = selectedMedia;
};

Drupal.media.browser.finalizeSelection = function () {
  if (!Drupal.media.browser.selectedMedia) {
    throw new exception(Drupal.t('Cannot continue, nothing selected'));
  }
  else {
    Drupal.media.browser.selectionFinalized(Drupal.media.browser.selectedMedia);
  }
};

Drupal.media.browser.resizeIframe = function (event) {
  var h = $('body').height();
  $(parent.window.document).find('#mediaBrowser').height(h);
};

Drupal.media.browser.selectErrorTab = function() {
  //Find the ID of a tab with an error in it
  var errorTabID = $('#media-browser-tabset')
    .find('.error')
    .parents('.media-browser-tab')
    .attr('id');

  if (errorTabID !== undefined) {
    //Find the Tab Link with errorTabID
    var tab = $('a[href="#' + errorTabID + '"]');
    //Find the index of the tab
    var index = $('#media-browser-tabset a').index(tab);
    //Select the tab
    $('#media-browser-tabset').tabs('select', index)
  }
}

}(jQuery));
;
