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
Drupal.mediaGallerySort = {};
Drupal.behaviors.mediaGallerySort = {};

Drupal.behaviors.mediaGallerySort.attach = function (context, settings) {
  var $ = jQuery;
  // Create a drag-and-drop editor for gallery collections.
  var $collection = $('.media-gallery-collection', context).once('media-gallery-sortable');
  $('.media-collection-item-wrapper', $collection).once('media-gallery-draggable', Drupal.mediaGallerySort.addDraggableIcon);
  if ($collection.length && settings.mediaGallerySortCollectionUrl) {
    $collection.sortable();
    //Drupal.mediaGallerySort.setHeight($collection);
    var callback = settings.mediaGallerySortCollectionUrl;
    $collection.bind('sortupdate', {'callback': callback}, Drupal.mediaGallerySort.handle_update);
    $collection.bind('sortstart', Drupal.mediaGallerySort.setHeight);
    $collection.bind('sortstop', Drupal.mediaGallerySort.setHeight);
  }
  // Create a drag-and-drop editor for individual gallery grid pages.
  var $gallery = $('.media-gallery-view-full.media-gallery-media > .field-items').once('media-gallery-sortable');
  $('.media-gallery-item-wrapper', $gallery).once('media-gallery-draggable', Drupal.mediaGallerySort.addDraggableIcon);
  if ($gallery.length && settings.mediaGallerySortGalleryUrl) {
    $gallery.sortable();
    //Drupal.mediaGallerySort.setHeight($gallery);
    callback = settings.mediaGallerySortGalleryUrl;
    $gallery.bind('sortupdate', {'callback': callback, 'reorder': 'true'}, Drupal.mediaGallerySort.handle_update);
    $gallery.bind('sortstart', Drupal.mediaGallerySort.setHeight);
    $gallery.bind('sortstop', Drupal.mediaGallerySort.setHeight);
  }
};

/**
 * Set an equal explicit, rounded height for all the items in the gallery to
 * avoid float breaking.
 */
Drupal.mediaGallerySort.setHeight = function (event) {
  var $ = jQuery;
  var placeholder = $(this).children('.ui-sortable-placeholder');
  if (placeholder.length) {
    var height = placeholder.height();
    $(this).children().height(height);
  } else {
    $(this).children().attr('style', '');
  }
};

/**
 * Adds the draggable icon to to each image.
 */
Drupal.mediaGallerySort.addDraggableIcon = function () {
  var $ = jQuery;
  $(this).addClass('draggable');
  $(this).prepend($('<div class="draggable-wrapper"><a class="draggable-handle">Drag</a></div>'));
}

/**
 * Event handler for the 'sortupdate' event. Sends the new order to the server.
 *
 * TODO: Refactor inline closures using jQuery.proxy or, if that's not enough,
 * an equivalent to ThemeBuilder.bind().
 */
Drupal.mediaGallerySort.handle_update = function (event, ui) {
  var $ = jQuery;
  var sortable = $(this);
  var reorder = event.data.reorder;
  var post = {
    order: sortable.sortable('toArray'),
    page: $.deparam.querystring().page
  };

  /**
   * Change ID attributes of sorted items to reflect the new order.
   *
   * Individual media items in the media_gallery_media field don't have a primary
   * key, so we're sorting by their delta. When their delta changes on the server
   * side, we need to reflect it on the client side as well.
   */
  var success_callback = function (data) {
    if (reorder) {
      var $ = jQuery;
      var i, newId, $item;
      var $toReorder = $('.media-gallery-view-full [id^=' + data.idPrefix + ']').addClass('media-gallery-to-reorder');
      if ($toReorder.length !== data.order.length) {
        // We seem to have the wrong set of objects to reorder, so just
        // refresh the page; the server has the right order already.
        window.location.reload();
        return;
      }
      var newOrder = Drupal.mediaGallerySort._getNewOrder(data.order, data.idPrefix);
      // Replacing IDs is tricky; we don't want to end up with two elements
      // having the same ID. For a first pass, replace all elements in order
      // with their new ID plus a placeholder.
      for (i = 0; i < newOrder.length; i++) {
        newId = data.idPrefix + newOrder[i] + '---new';
        $toReorder.first().attr('id', newId);
        $toReorder = $toReorder.not('#' + newId);
      }
      // Now remove the placeholder from each item's ID.
      $toReorder = $('.media-gallery-to-reorder');
      for (i = 0; i < newOrder.length; i++) {
        $item = $($toReorder[i]);
        newId = $item.attr('id').replace(/---new/, '');
        $item.removeClass('media-gallery-to-reorder');
        $item.attr('id', newId);
      }
    }
    sortable.sortable('enable');
  }

  $.post(event.data.callback, post, success_callback);
  sortable.sortable('disable');
};

/**
 * Helper function that returns a sorted array of element IDs minus a prefix.
 *
 * @param {Array} ids
 *   The IDs to be reordered. Example: ['element-5', 'element-4', 'element-6']
 * @param {String} prefix
 *   The prefix to be removed from each ID. Example: 'element-'
 *
 * @return {Array}
 *   The IDs, minus their prefix, sorted numerically. Example: [4, 5, 6]
 */
Drupal.mediaGallerySort._getNewOrder = function (ids, prefix) {
  var i;
  var newOrder = [];
  for (i = 0; i < ids.length; i++) {
    var re = new RegExp(prefix);
    newOrder.push(parseInt(ids[i].replace(re, ''), 10));
  }
  newOrder.sort(Drupal.mediaGallerySort.numericAscending);
  return newOrder;
}

/**
 * Sort callback. Returns the lesser of two numeric inputs.
 */
Drupal.mediaGallerySort.numericAscending = function (a, b) {
  return a - b;
}
;

/**
 * @file: Popup dialog interfaces for the media project.
 *
 * Drupal.media.popups.mediaBrowser
 *   Launches the media browser which allows users to pick a piece of media.
 *
 * Drupal.media.popups.mediaStyleSelector
 *  Launches the style selection form where the user can choose
 *  what format / style they want their media in.
 *
 */

(function ($) {
namespace('Drupal.media.popups');

/**
 * Media browser popup. Creates a media browser dialog.
 *
 * @param {function}
 *          onSelect Callback for when dialog is closed, received (Array
 *          media, Object extra);
 * @param {Object}
 *          globalOptions Global options that will get passed upon initialization of the browser.
 *          @see Drupal.media.popups.mediaBrowser.getDefaults();
 *
 * @param {Object}
 *          pluginOptions Options for specific plugins. These are passed
 *          to the plugin upon initialization.  If a function is passed here as
 *          a callback, it is obviously not passed, but is accessible to the plugin
 *          in Drupal.settings.variables.
 *
 *          Example
 *          pluginOptions = {library: {url_include_patterns:'/foo/bar'}};
 *
 * @param {Object}
 *          widgetOptions Options controlling the appearance and behavior of the
 *          modal dialog.
 *          @see Drupal.media.popups.mediaBrowser.getDefaults();
 */
Drupal.media.popups.mediaBrowser = function (onSelect, globalOptions, pluginOptions, widgetOptions) {
  var options = Drupal.media.popups.mediaBrowser.getDefaults();
  options.global = $.extend({}, options.global, globalOptions);
  options.plugins = pluginOptions;
  options.widget = $.extend({}, options.widget, widgetOptions);

  // Create it as a modal window.
  var browserSrc = options.widget.src;
  if ($.isArray(browserSrc) && browserSrc.length) {
    browserSrc = browserSrc[browserSrc.length - 1];
  }
  // Params to send along to the iframe.  WIP.
  var params = {};
  $.extend(params, options.global);
  params.plugins = options.plugins;

  browserSrc += '&' + $.param(params);
  var mediaIframe = Drupal.media.popups.getPopupIframe(browserSrc, 'mediaBrowser');
  // Attach the onLoad event
  mediaIframe.bind('load', options, options.widget.onLoad);
  /**
   * Setting up the modal dialog
   */

  var ok = 'OK';
  var cancel = 'Cancel';
  var notSelected = 'You have not selected anything!';

  if (Drupal && Drupal.t) {
    ok = Drupal.t(ok);
    cancel = Drupal.t(cancel);
    notSelected = Drupal.t(notSelected);
  }

  // @todo: let some options come through here. Currently can't be changed.
  var dialogOptions = options.dialog;

  dialogOptions.buttons[ok] = function () {
    var selected = this.contentWindow.Drupal.media.browser.selectedMedia;
    if (selected.length < 1) {
      alert(notSelected);
      return;
    }
    onSelect(selected);
    $(this).dialog("destroy");
    $(this).remove();
  };

  dialogOptions.buttons[cancel] = function () {
    $(this).dialog("destroy");
    $(this).remove();
  };

  Drupal.media.popups.setDialogPadding(mediaIframe.dialog(dialogOptions));
  // Remove the title bar.
  mediaIframe.parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
  Drupal.media.popups.overlayDisplace(mediaIframe.parents(".ui-dialog"));
  return mediaIframe;
};

Drupal.media.popups.mediaBrowser.mediaBrowserOnLoad = function (e) {
  var options = e.data;
  if (this.contentWindow.Drupal.media.browser.selectedMedia.length > 0) {
    var ok = (Drupal && Drupal.t) ? Drupal.t('OK') : 'OK';
    var ok_func = $(this).dialog('option', 'buttons')[ok];
    ok_func.call(this);
    return;
  }
};

Drupal.media.popups.mediaBrowser.getDefaults = function () {
  return {
    global: {
      types: [], // Types to allow, defaults to all.
      activePlugins: [] // If provided, a list of plugins which should be enabled.
    },
    widget: { // Settings for the actual iFrame which is launched.
      src: Drupal.settings.media.browserUrl, // Src of the media browser (if you want to totally override it)
      onLoad: Drupal.media.popups.mediaBrowser.mediaBrowserOnLoad // Onload function when iFrame loads.
    },
    dialog: Drupal.media.popups.getDialogOptions()
  };
};

Drupal.media.popups.mediaBrowser.finalizeSelection = function () {
  var selected = this.contentWindow.Drupal.media.browser.selectedMedia;
  if (selected.length < 1) {
    alert(notSelected);
    return;
  }
  onSelect(selected);
  $(this).dialog("destroy");
  $(this).remove();
}

/**
 * Style chooser Popup. Creates a dialog for a user to choose a media style.
 *
 * @param mediaFile
 *          The mediaFile you are requesting this formatting form for.
 *          @todo: should this be fid?  That's actually all we need now.
 *
 * @param Function
 *          onSubmit Function to be called when the user chooses a media
 *          style. Takes one parameter (Object formattedMedia).
 *
 * @param Object
 *          options Options for the mediaStyleChooser dialog.
 */
Drupal.media.popups.mediaStyleSelector = function (mediaFile, onSelect, options) {
  var defaults = Drupal.media.popups.mediaStyleSelector.getDefaults();
  // @todo: remove this awful hack :(
  defaults.src = defaults.src.replace('-media_id-', mediaFile.fid);
  options = $.extend({}, defaults, options);
  // Create it as a modal window.
  var mediaIframe = Drupal.media.popups.getPopupIframe(options.src, 'mediaStyleSelector');
  // Attach the onLoad event
  mediaIframe.bind('load', options, options.onLoad);

  /**
   * Set up the button text
   */
  var ok = 'OK';
  var cancel = 'Cancel';
  var notSelected = 'Very sorry, there was an unknown error embedding media.';

  if (Drupal && Drupal.t) {
    ok = Drupal.t(ok);
    cancel = Drupal.t(cancel);
    notSelected = Drupal.t(notSelected);
  }

  // @todo: let some options come through here. Currently can't be changed.
  var dialogOptions = Drupal.media.popups.getDialogOptions();

  dialogOptions.buttons[ok] = function () {

    var formattedMedia = this.contentWindow.Drupal.media.formatForm.getFormattedMedia();
    if (!formattedMedia) {
      alert(notSelected);
      return;
    }
    onSelect(formattedMedia);
    $(this).dialog("destroy");
    $(this).remove();
  };

  dialogOptions.buttons[cancel] = function () {
    $(this).dialog("destroy");
    $(this).remove();
  };

  Drupal.media.popups.setDialogPadding(mediaIframe.dialog(dialogOptions));
  // Remove the title bar.
  mediaIframe.parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
  Drupal.media.popups.overlayDisplace(mediaIframe.parents(".ui-dialog"));
  return mediaIframe;
};

Drupal.media.popups.mediaStyleSelector.mediaBrowserOnLoad = function (e) {
};

Drupal.media.popups.mediaStyleSelector.getDefaults = function () {
  return {
    src: Drupal.settings.media.styleSelectorUrl,
    onLoad: Drupal.media.popups.mediaStyleSelector.mediaBrowserOnLoad
  };
};


/**
 * Style chooser Popup. Creates a dialog for a user to choose a media style.
 *
 * @param mediaFile
 *          The mediaFile you are requesting this formatting form for.
 *          @todo: should this be fid?  That's actually all we need now.
 *
 * @param Function
 *          onSubmit Function to be called when the user chooses a media
 *          style. Takes one parameter (Object formattedMedia).
 *
 * @param Object
 *          options Options for the mediaStyleChooser dialog.
 */
Drupal.media.popups.mediaFieldEditor = function (fid, onSelect, options) {
  var defaults = Drupal.media.popups.mediaFieldEditor.getDefaults();
  // @todo: remove this awful hack :(
  defaults.src = defaults.src.replace('-media_id-', fid);
  options = $.extend({}, defaults, options);
  // Create it as a modal window.
  var mediaIframe = Drupal.media.popups.getPopupIframe(options.src, 'mediaFieldEditor');
  // Attach the onLoad event
  // @TODO - This event is firing too early in IE on Windows 7,
  // - so the height being calculated is too short for the content.
  mediaIframe.bind('load', options, options.onLoad);

  /**
   * Set up the button text
   */
  var ok = 'OK';
  var cancel = 'Cancel';
  var notSelected = 'Very sorry, there was an unknown error embedding media.';

  if (Drupal && Drupal.t) {
    ok = Drupal.t(ok);
    cancel = Drupal.t(cancel);
    notSelected = Drupal.t(notSelected);
  }

  // @todo: let some options come through here. Currently can't be changed.
  var dialogOptions = Drupal.media.popups.getDialogOptions();

  dialogOptions.buttons[ok] = function () {
    alert('hell yeah');
    return "poo";

    var formattedMedia = this.contentWindow.Drupal.media.formatForm.getFormattedMedia();
    if (!formattedMedia) {
      alert(notSelected);
      return;
    }
    onSelect(formattedMedia);
    $(this).dialog("destroy");
    $(this).remove();
  };

  dialogOptions.buttons[cancel] = function () {
    $(this).dialog("destroy");
    $(this).remove();
  };

  Drupal.media.popups.setDialogPadding(mediaIframe.dialog(dialogOptions));
  // Remove the title bar.
  mediaIframe.parents(".ui-dialog").find(".ui-dialog-titlebar").remove();
  Drupal.media.popups.overlayDisplace(mediaIframe.parents(".ui-dialog"));
  return mediaIframe;
};

Drupal.media.popups.mediaFieldEditor.mediaBrowserOnLoad = function (e) {

};

Drupal.media.popups.mediaFieldEditor.getDefaults = function () {
  return {
    // @todo: do this for real
    src: '/media/-media_id-/edit?render=media-popup',
    onLoad: Drupal.media.popups.mediaFieldEditor.mediaBrowserOnLoad
  };
};


/**
 * Generic functions to both the media-browser and style selector
 */

/**
 * Returns the commonly used options for the dialog.
 */
Drupal.media.popups.getDialogOptions = function () {
  return {
    buttons: {},
    dialogClass: 'media-wrapper',
    modal: true,
    draggable: false,
    resizable: false,
    minWidth: 600,
    width: 800,
    height: 550,
    position: 'center',
    overlay: {
      backgroundColor: '#000000',
      opacity: 0.4
    }
  };
};

/**
 * Created padding on a dialog
 *
 * @param jQuery dialogElement
 *  The element which has .dialog() attached to it.
 */
Drupal.media.popups.setDialogPadding = function (dialogElement) {
  // @TODO: Perhaps remove this hardcoded reference to height.
  // - It's included to make IE on Windows 7 display the dialog without
  //   collapsing. 550 is the height that displays all of the tab panes
  //   within the Add Media overlay. This is either a bug in the jQuery
  //   UI library, a bug in IE on Windows 7 or a bug in the way the
  //   dialog is instantiated. Or a combo of the three.
  //   All browsers except IE on Win7 ignore these defaults and adjust
  //   the height of the iframe correctly to match the content in the panes
  dialogElement.height(dialogElement.dialog('option', 'height'));
  dialogElement.width(dialogElement.dialog('option', 'width'));
};

/**
 * Get an iframe to serve as the dialog's contents. Common to both plugins.
 */
Drupal.media.popups.getPopupIframe = function (src, id, options) {
  var defaults = {width: '800px', scrolling: 'auto'};
  var options = $.extend({}, defaults, options);

  return $('<iframe class="media-modal-frame"/>')
  .attr('src', src)
  .attr('width', options.width)
  .attr('id', id)
  .attr('scrolling', options.scrolling);
};

Drupal.media.popups.overlayDisplace = function (dialog) {
  if (parent.window.Drupal.overlay) {
    var overlayDisplace = parent.window.Drupal.overlay.getDisplacement('top');
    if (dialog.offset().top < overlayDisplace) {
      dialog.css('top', overlayDisplace);
    }
  }
}

})(jQuery);
;
(function ($) {

Drupal.behaviors.media_gallery = {};
Drupal.behaviors.media_gallery.attach = function (context, settings) {
  // Bind a click handler to the 'add media' link.
  $('a.media-gallery-add.launcher').once('media-gallery-add-processed').bind('click', Drupal.media_gallery.open_browser);
};

Drupal.media_gallery = {};

Drupal.media_gallery.open_browser = function (event) {
  event.preventDefault();
  var pluginOptions = { 'id': 'media_gallery', 'multiselect' : true , 'types': Drupal.settings.mediaGalleryAllowedMediaTypes};
  Drupal.media.popups.mediaBrowser(Drupal.media_gallery.add_media, pluginOptions);
};

Drupal.media_gallery.add_media = function (mediaFiles) {
  // TODO AN-17966: Add the images to the node's media multifield on the client
  // side instead of reloading the page.
  var mediaAdded = function (returnedData, textStatus, XMLHttpRequest) {
    parent.window.location.reload();
  };

  var errorCallback = function () {
    //console.warn('Error: Media not added.');
  };

  var src = Drupal.settings.mediaGalleryAddImagesUrl;

  var media = [];

  for(var i = 0; i < mediaFiles.length; i++) {
    media[i] = mediaFiles[i].fid;
  }

  $.ajax({
    url: src,
    type: 'POST',
    dataType: 'json',
    data: {files: media},
    error: errorCallback,
    success: mediaAdded
  });
  
  return false;
}

})(jQuery);
;
Drupal.behaviors.mediaGalleryColorbox = {};

Drupal.behaviors.mediaGalleryColorbox.attach = function (context, settings) {
  var $ = jQuery, $galleries, $gallery, href, $links, $link, $dummyLinksPre, $dummyLinksPost, i, j;
  if ($.fn.colorbox) {
    // Add a colorbox group for each media gallery field on the page.
    $galleries = $('.field-name-media-gallery-media');
    for (i = 0; i < $galleries.length; i++) {
      $gallery = $($galleries[i]);
      $links = $('a.cbEnabled', $gallery);
      $dummyLinksPre = $gallery.parent().find('ul:has(a.colorbox-supplemental-link.pre)');
      $dummyLinksPost = $gallery.parent().find('ul:has(a.colorbox-supplemental-link.post)');
      $dummyLinksPost.appendTo($gallery);
      $links = $links.add('a', $dummyLinksPre).add('a', $dummyLinksPost);
      $links.attr('rel', 'colorbox-' + i);
      for (j = 0; j < $links.length; j++) {
        // Change the link href to point to the lightbox version of the media.
        $link = $($links[j]);
        href = $link.attr('href');
        $link.attr('href', href.replace(/\/detail\/([0-9]+)\/([0-9]+)/, '/lightbox/$1/$2'));
      }
      $links.not('.meta-wrapper').colorbox({
        slideshow: true,
        slideshowAuto: false,
        slideshowStart: Drupal.t('Slideshow'),
        slideshowStop: '[' + Drupal.t('stop slideshow') + ']',
        slideshowSpeed: 4000,
        current: Drupal.t('Item !current of !total', {'!current':'{current}', '!total':'{total}'}),
        innerWidth: 'auto',
        // If 'title' evaluates to false, Colorbox will use the title from the
        // underlying <a> element, which we don't want. Using a space is the
        // officially approved workaround. See
        // http://groups.google.com/group/colorbox/msg/7671ae69708950bf
        title: ' ',
        transition: 'fade',
        preloading: true,
        fastIframe: false,
        onComplete: function () {
          $(this).colorbox.resize();
        }
      });
    }
    $('a.meta-wrapper').bind('click', Drupal.mediaGalleryColorbox.metaClick);
    // Subscribe to the media_youtube module's load event, so we can pause
    // the slideshow and play the video.
    $(window).bind('media_youtube_load', Drupal.mediaGalleryColorbox.handleMediaYoutubeLoad);
  }
};

Drupal.mediaGalleryColorbox = {};

/**
 * Handles the click event on the metadata.
 */
Drupal.mediaGalleryColorbox.metaClick = function (event) {
  event.preventDefault();
  jQuery(this).prev('.media-gallery-item').find('a.cbEnabled').click();
};

/**
 * Handles the media_youtube module's load event.
 *
 * If the colorbox slideshow is playing, and it gets to a video, the video
 * should play automatically, and the slideshow should pause until it's done.
 */
Drupal.mediaGalleryColorbox.handleMediaYoutubeLoad = function (event, videoSettings) {
  var $ = jQuery;
  var slideshowOn = $('#colorbox').hasClass('cboxSlideshow_on');
  // Set a width on a wrapper for the video so that the colorbox will size properly.
  $('#colorbox .media-gallery-item').width(videoSettings.width + 'px').height(videoSettings.height + 'px');
  if (slideshowOn) {
    videoSettings.options.autoplay = 1;
    $('#cboxSlideshow')
      // Turn off the slideshow while the video is playing.
      .click() // No, there is not a better way.
      .text('[' + Drupal.t('resume slideshow') + ']');
      // TODO: If YouTube makes its JavaScript API available for iframe videos,
      // set the slideshow to restart when the video is done playing.
  }
};
;
(function ($) {

Drupal.toolbar = Drupal.toolbar || {};

/**
 * Attach toggling behavior and notify the overlay of the toolbar.
 */
Drupal.behaviors.toolbar = {
  attach: function(context) {

    // Set the initial state of the toolbar.
    $('#toolbar', context).once('toolbar', Drupal.toolbar.init);

    // Toggling toolbar drawer.
    $('#toolbar a.toggle', context).once('toolbar-toggle').click(function(e) {
      Drupal.toolbar.toggle();
      // Allow resize event handlers to recalculate sizes/positions.
      $(window).triggerHandler('resize');
      return false;
    });
  }
};

/**
 * Retrieve last saved cookie settings and set up the initial toolbar state.
 */
Drupal.toolbar.init = function() {
  // Retrieve the collapsed status from a stored cookie.
  var collapsed = $.cookie('Drupal.toolbar.collapsed');

  // Expand or collapse the toolbar based on the cookie value.
  if (collapsed == 1) {
    Drupal.toolbar.collapse();
  }
  else {
    Drupal.toolbar.expand();
  }
};

/**
 * Collapse the toolbar.
 */
Drupal.toolbar.collapse = function() {
  var toggle_text = Drupal.t('Show shortcuts');
  $('#toolbar div.toolbar-drawer').addClass('collapsed');
  $('#toolbar a.toggle')
    .removeClass('toggle-active')
    .attr('title',  toggle_text)
    .html(toggle_text);
  $('body').removeClass('toolbar-drawer').css('paddingTop', Drupal.toolbar.height());
  $.cookie(
    'Drupal.toolbar.collapsed',
    1,
    {
      path: Drupal.settings.basePath,
      // The cookie should "never" expire.
      expires: 36500
    }
  );
};

/**
 * Expand the toolbar.
 */
Drupal.toolbar.expand = function() {
  var toggle_text = Drupal.t('Hide shortcuts');
  $('#toolbar div.toolbar-drawer').removeClass('collapsed');
  $('#toolbar a.toggle')
    .addClass('toggle-active')
    .attr('title',  toggle_text)
    .html(toggle_text);
  $('body').addClass('toolbar-drawer').css('paddingTop', Drupal.toolbar.height());
  $.cookie(
    'Drupal.toolbar.collapsed',
    0,
    {
      path: Drupal.settings.basePath,
      // The cookie should "never" expire.
      expires: 36500
    }
  );
};

/**
 * Toggle the toolbar.
 */
Drupal.toolbar.toggle = function() {
  if ($('#toolbar div.toolbar-drawer').hasClass('collapsed')) {
    Drupal.toolbar.expand();
  }
  else {
    Drupal.toolbar.collapse();
  }
};

Drupal.toolbar.height = function() {
  var $toolbar = $('#toolbar');
  var height = $toolbar.outerHeight();
  // In modern browsers (including IE9), when box-shadow is defined, use the
  // normal height.
  var cssBoxShadowValue = $toolbar.css('box-shadow');
  var boxShadow = (typeof cssBoxShadowValue !== 'undefined' && cssBoxShadowValue !== 'none');
  // In IE8 and below, we use the shadow filter to apply box-shadow styles to
  // the toolbar. It adds some extra height that we need to remove.
  if (!boxShadow && /DXImageTransform\.Microsoft\.Shadow/.test($toolbar.css('filter'))) {
    height -= $toolbar[0].filters.item("DXImageTransform.Microsoft.Shadow").strength;
  }
  return height;
};

})(jQuery);
;
