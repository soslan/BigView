"use strict";

function BigView( args ) {
  var self = this;
  args = args || {};
  this.container = e({
    class: "bv-container"
  });
  this.container.style.display = "none";
  this.container.setAttribute( "tabindex", -1 );

  this.container.addEventListener( "keydown", function( e ) {
    var nextKeys = [ 76, 68, 74, 83, 9, 13, 32, 39, 40 ];
    var prevKeys = [ 65, 72, 75, 87, 37, 38 ];
    var exitCodes = [ 27, 8 ];
    if ( e.keyCode === 9 && e.shiftKey ) {
      self.prev();
    } else if ( nextKeys.indexOf( e.keyCode ) !== -1 ) {
      self.next();
    } else if ( prevKeys.indexOf( e.keyCode ) !== -1 ) {
      self.prev();
    } else if ( exitCodes.indexOf( e.keyCode ) !== -1 ) {
      self.hide();
    } else {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
  });

  this.toolbar = e({
    class: "bv-toolbar",
    parent: this.container
  });

  this.body = e({
    class: "bv-body",
    parent: this.container,
    action: function( e ) {
      if ( e.target.tagName.toLowerCase() === "img" ) {
        self.next();
        e.stopPropagation();
        e.preventDefault();
      }
    }
  });

  this.navigation = e({
    class: "bv-navigation",
    parent: this.container
  });

  this.navigationRight = e({
    class: "bv-nav-r",
    parent: this.navigation
  });

  this.navigationLeft = e({
    class: "bv-nav-l",
    parent: this.navigation
  });

  this.prevButton = e({
    class:"bv-button",
    tag:"button",
    parent:this.navigation,
    content: icon( "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 " +
        "13H20v-2z" ),
    action: function( e ) {
      self.prev();
    }
  });

  if ( args.enableSlideshow == true ) {
    this.slideshowButton = e({
      class:"bv-button",
      tag:"button",
      parent:this.navigation,
      content: icon( "M8 5v14l11-7z" ),
      action: function( e ) {
        self.toggleInterval();
      }
    });

    this.setSlideDuration( args.slideDuration );
  }

  this.nextButton = e({
    class:"bv-button",
    tag:"button",
    parent:this.navigation,
    content: icon( "M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" ),
    action: function( e ) {
      self.next();
    }
  });

  if ( args.enableCounter === undefined || args.enableCounter == true ) {
    this.counter = e({
      tag: "span",
      class: "bv-counter",
      parent: this.navigationLeft
    });

    this.counterCurrent = e({
      tag: "span",
      class: "bv-counter-current",
      parent: this.counter
    });

    this.counterAll = e({
      tag: "span",
      class: "bv-counter-all",
      parent: this.counter
    });
  }

  this.closeButton = e({
    class:"bv-button bv-close",
    tag:"button",
    parent:this.toolbar,
    content: icon( "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 " +
        "6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" ),
    action: function( e ) {
      self.hide();
    }
  });

  this.gallery = e({
    tag:"div",
    class:"bv-gallery",
    parent: this.container,
    action: function( e ) {
      self.setImage( e.target );
    }
  });

  if ( args.enableGallery === undefined || args.enableGallery == true ) {
    this.galleryButton = e({
      class:"bv-button bv-gallery-button bv-toggle-button bv-on",
      tag:"button",
      parent:this.navigationRight,
      content: icon( "M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-" +
          "4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-" +
          "4v4zm0 6h4v-4h-4v4z" ),
      action: function( e ) {
        self.toggleGallery();
      }
    });
  } else {
    this.container.classList.add( "bv-no-gallery" );
  }

  if ( args.showGallery === undefined || args.showGallery == true ) {
    this.showGallery();
  } else {
    this.hideGallery();
  }

  if ( args.enableDescription === undefined ||
       args.enableDescription == true ) {
    this.descButton = e({
      class:"bv-button bv-desc-button bv-toggle-button",
      tag:"button",
      parent:this.navigationRight,
      content: icon( "M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 " +
          "10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 " +
          "3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z" ),
      action: function( e ) {
        self.toggleDescription();
      }
    });
  }

  if ( args.showDescription === undefined || args.showDescription == true ) {
    this.showDescription();
  } else {
    this.hideDescription();
  }

  // Centering active thumbnail on resize.
  var resizeRunning = false;
  window.addEventListener( "resize", function() {
    if ( resizeRunning || !self.displayed ) {
      return;
    }

    resizeRunning = true;

    window.requestAnimationFrame(function() {
      self.fixGalleryPosition();
      resizeRunning = false;
    });
  });

  // Properties
  this.displayed = false;
  this.images = [];
  this.imageKeys = [];
  this.current;
  // Current image object
  this.currentKeyIndex;

  if ( args.appendTo instanceof Node ) {
    this.parent = args.appendTo;
  } else if ( args.appendTo.jquery ) {
    this.parent = args.appendTo[ 0 ];
  } else if ( typeof args.appendTo === "string" ) {
    this.parent = document.querySelector( args.appendTo );
  } else {
    this.parent = document.body;
  }

  if ( this.parent instanceof Node ) {
    this.parent.appendChild( this.container );
  }
  this.parent.style.position = "relative";

  if ( typeof BigView.numberOfBigViews !== "number" ) {
    BigView.numberOfBigViews = 0;
  }
  this.id = BigView.numberOfBigViews;
  BigView.numberOfBigViews++;
};

BigView.prototype.show = function( target ) {
  this.displayed = true;
  document.body.style.overflow = "hidden";
  this.container.style.zIndex = 100;
  this.container.style.opacity = 0;
  this.container.style.display = "block";
  this.container.focus();
  this.container.style.opacity = 1;
  if ( target instanceof HTMLElement ) {
    this.setImage( target );
  } else if ( this.current == null ) {
    this.setImage( 0 );
  }
};

BigView.prototype.hide = function() {
  this.displayed = false;
  document.body.style.overflow = null;
  this.container.style.opacity = 0;
  this.container.style.zIndex = -100;
  this.stopSlideshow();
};

BigView.prototype.fixGalleryPosition = function() {
  if ( this.current == null || this.gallery == null ) {
    return;
  }
  var contWidth = window.innerWidth;
  var imgWidth = this.current.thumbnail.clientWidth;
  var elemPos = this.current.thumbnail.offsetLeft;
  var galleryPos = this.gallery.offsetLeft;
  var elemAbsPos = elemPos + galleryPos;
  var desiredPos = ( contWidth / 2 ) - ( imgWidth / 2 );
  var shift = elemAbsPos - desiredPos;
  this.gallery.style.transform = "translateX( " + ( galleryPos - shift ) + "px )";
};

BigView.prototype.getImageObject = function( arg ) {
  if ( this.images.length === 0 ) {
    return null;
  } else if ( typeof arg === "number" ) {
    if ( arg >= this.images.length ) {
      return this.getImageObject( arg - this.images.length );
    } else if ( arg < 0 ) {
      return this.getImageObject( arg + this.images.length );
    } else {
      return this.images[ arg ];
    }
  } else if ( arg instanceof BigViewImage ) {
    if ( this.images.indexOf( arg ) !== -1 ) {
      return arg;
    }
  } else if ( arg instanceof Node ) {
    if ( arg.bigViews != null ) {
      return this.getImageObject( arg.bigViews[ this.id ] );
    } else if ( arg.bigViewObject instanceof BigViewImage ) {
      return arg.bigViewObject;
    }
  } else {
    return null;
  }
};

BigView.prototype.setImage = function( img ) {
  var self = this;
  img = self.getImageObject( img );
  if ( img instanceof BigViewImage ) {
    var old = this.current;
    this.current = img;
    if ( this.counterCurrent instanceof Node ) {
      this.counterCurrent.innerHTML = img.i + 1;
    }
    this.fixGalleryPosition();
    img.activate();
    if ( old != null && old != img ) {
      old.deactivate();
    }
  }
};

BigView.prototype.next = function() {
  this.setImage( this.current.i + 1 );
};

BigView.prototype.prev = function() {
  this.setImage( this.current.i - 1 );
};

BigView.prototype.addBigViewImage = function( img ) {
  if ( img instanceof BigViewImage ) {
    this.images.push( img );
    if ( this.counterAll instanceof Node ) {
      this.counterAll.innerHTML = this.images.length;
    }
    this.body.appendChild( img.container );
  }
};

BigView.prototype.addImgElement = function( elem ) {
  var self = this;
  if ( elem.tagName.toLowerCase() === "img" ) {
    var img = new BigViewImage({
      bigView: self,
      src: elem.src,
      description: elem.alt
    });
    self.addBigViewImage( img );
    elem.addEventListener( "click", function( e ) {
      self.show( e.target );
    });
    if ( typeof elem.bigViews !== "object" ) {
      elem.bigViews = {};
    }
    elem.bigView = self;
    elem.bigViews[ self.id ] = img;
  }
};

BigView.prototype.addImageSource = function( src ) {
  var self = this;
  if ( typeof src === "string" ) {
    var img = new BigViewImage({
      src: src,
      bigView: self
    });
    self.addBigViewImage( img );
  }
};

BigView.prototype.addSelector = function( selector ) {
  if ( typeof selector === "string" ) {
    this.add( document.querySelectorAll( selector ) );
  }
};

BigView.prototype.add = function( arg ) {
  var self = this;
  if ( arg.jquery ) {
    arg.each(function( i, elem ) {
      if ( elem.tagName.toLowerCase() === "img" ) {
        self.addImgElement( elem );
      }
    });
  } else if ( arg instanceof NodeList ) {
    for ( var i = 0; i < arg.length; i++ ) {
      self.addImgElement( arg[ i ] );
    }
  } else if ( arg instanceof Node ) {
    self.addImgElement( arg );
  } else if ( typeof arg === "string" ) {
    self.addSelector( arg );
  } else if ( typeof arg === "object" ) {
    self.addBigViewImage( new BigViewImage({
      bigView: self,
      src: arg.src,
      description: arg.description
    }) );
  }
};

BigView.prototype.addImages = BigView.prototype.add;

BigView.prototype.toggleGallery = function() {
  if ( this.galleryDisplayed ) {
    this.hideGallery();
  } else {
    this.showGallery();
  }
};

BigView.prototype.showGallery = function() {
  this.galleryDisplayed = true;
  if ( this.galleryButton instanceof Node ) {
    this.galleryButton.classList.add( "bv-on" );
  }
  this.container.classList.remove( "bv-no-gallery" );
  this.fixGalleryPosition();
};

BigView.prototype.hideGallery = function() {
  this.galleryDisplayed = false;
  if ( this.galleryButton instanceof Node ) {
    this.galleryButton.classList.remove( "bv-on" );
  }
  this.container.classList.add( "bv-no-gallery" );
};

BigView.prototype.toggleDescription = function() {
  if ( this.descriptionEnabled ) {
    this.hideDescription();
  } else {
    this.showDescription();
  }
};

BigView.prototype.showDescription = function() {
  this.descriptionEnabled = true;
  if ( this.descButton instanceof Node ) {
    this.descButton.classList.add( "bv-on" );
  }
  this.body.classList.remove("bv-no-desc");
};

BigView.prototype.hideDescription = function() {
  this.descriptionEnabled = false;
  if ( this.descButton instanceof Node ) {
    this.descButton.classList.remove( "bv-on" );
  }
  this.body.classList.add("bv-no-desc");
};

BigView.prototype.setSlideDuration = function( duration ) {
  if ( typeof duration === "number" && duration > 0 ) {
    this.slideDuration = duration;
  } else {
    this.slideDuration = BigView.slideDuration;
  }
};

BigView.slideDuration = 2000;

BigView.prototype.startSlideshow = function() {
  var self = this;
  if ( this.slideshowInterval != null ) {
    clearInterval( this.slideshowInterval );
  }
  this.slideshowButton.querySelector( "path" )
    .setAttribute( "d", "M6 19h4V5H6v14zm8-14v14h4V5h-4z" );
  this.slideshowInterval = window.setInterval(function() {
    self.next();
  }, this.slideDuration );
};

BigView.prototype.stopSlideshow = function() {
  if ( this.slideshowInterval != null ) {
    var self = this;
    this.slideshowButton.querySelector( "path" ).setAttribute( "d", "M8 5v14l11-7z" );
    clearInterval( this.slideshowInterval );
    this.slideshowInterval = null;
  }
};

BigView.prototype.toggleInterval = function() {
  if ( this.slideshowInterval == null ) {
    this.startSlideshow();
  } else {
    this.stopSlideshow();
  }
};

function BigViewImage( args ) {
  args  = args || {};
  this.bigView = args.bigView;

  this.container = e({
    class: "bv-img-cont"
  });

  this.img = e({
    tag: "img",
    class: "bv-img",
    parent: this.container,
    attributes: {
      src: args.src
    }
  });

  this.img.bigViewObject = this;

  this.description = e({
    class: "bv-desc",
    parent: this.container
  });

  this.thumbnail = e({
    tag: "img",
    attributes: {
      src: args.src
    },
    parent: this.bigView.gallery
  });

  this.setDescription( args.description );

  this.thumbnail.bigViewObject = this;
};

BigViewImage.prototype.activate = function() {
  this.container.classList.add( "bv-active" );
  this.thumbnail.classList.add( "bv-active" );
};

BigViewImage.prototype.deactivate = function() {
  this.container.classList.remove( "bv-active" );
  this.thumbnail.classList.remove( "bv-active" );
};

BigViewImage.prototype.setDescription = function( desc ) {
  desc = desc || "";
  this.description.innerHTML = desc;
};

BigViewImage.prototype.next = function() {
  return this.bigView.getImageObject( this.i + 1 );
};

BigViewImage.prototype.prev = function() {
  return this.bigView.getImageObject( this.i - 1 );
};

Object.defineProperty( BigViewImage.prototype, "i", {
  get: function() {
    return this.bigView.images.indexOf( this );
  }
});

function icon( arg ) {
  var element = document.createElementNS( "http://www.w3.org/2000/svg", "svg" );
  var path = document.createElementNS( "http://www.w3.org/2000/svg", "path" );
  element.classList.add( "bv-icon" );
  element.setAttribute( "viewBox", "0 0 24 24" );
  element.appendChild( path );
  path.setAttribute( "d", arg );
  return element;
};

icon.paths = {
  "play": "M8 5v14l11-7z"
};

function e( args ) {
  args = args || {};

  var element = document.createElement( args.tag || "div" );
  if ( typeof args.class === "string" ) {
    args.class.split( " " ).forEach(function( className ) {
      element.classList.add( className );
    });
  }

  if ( typeof args.content === "string" || typeof args.content === "number" ) {
    element.innerHTML = args.content;
  } else if ( args.content instanceof Node ) {
    element.appendChild( args.content );
  }

  if ( args.parent instanceof HTMLElement ) {
    args.parent.appendChild( element );
  }

  if ( typeof args.attributes === "object" ) {
    for ( var key in args.attributes ) {
      element.setAttribute( key, args.attributes[ key ] );
    }
  }

  if ( typeof args.style === "object" ) {
    for ( var i in args.style ) {
      element.style[ i ] = args.style[ i ];
    }
  }

  if ( typeof args.action === "function" ) {
    // TODO: Touch events
    element.addEventListener( "click", args.action );
  }

  return element;
};
