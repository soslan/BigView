'use strict';

function BigView(args){
  var self = this;
  args = args || {};
  this.container = e({
    class: 'bv-container',
  });
  this.container.style.display = "none";
  this.container.setAttribute('tabindex', -1);

  this.container.addEventListener('keydown', function(e){
    var nextKeys = [76, 68, 74, 83, 9, 13, 32, 39, 40];
    var prevKeys = [65, 72, 75, 87, 37, 38];
    var exitCodes = [27, 8];
    if(e.keyCode === 9 && e.shiftKey){
      self.prev();
    }
    else if(nextKeys.indexOf(e.keyCode) !== -1){
      self.next();
    }
    else if(prevKeys.indexOf(e.keyCode) !== -1){
      self.prev();
    }
    else if(exitCodes.indexOf(e.keyCode) !== -1){
      self.hide();
    }
    else{
      return;
    }
    e.preventDefault();
    e.stopPropagation();
  });

  this.toolbar = e({
    class: 'bv-toolbar',
    parent: this.container,
  });

  this.body = e({
    class: 'bv-body',
    parent: this.container,
    action: function(e){
      if(e.target.tagName.toLowerCase() === "img"){  
        self.next();
        e.stopPropagation();
        e.preventDefault();
      }
    }
  });

  this.navigation = e({
    class: 'bv-navigation',
    parent: this.container,
  });

  this.navigationRight = e({
    class: 'bv-nav-r',
    parent: this.navigation,
  });

  this.navigationLeft = e({
    class: 'bv-nav-l',
    parent: this.navigation,
  });

  this.prevButton = e({
    class:'bv-button',
    tag:'button',
    parent:this.navigation,
    content:'<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 24 24" width="32"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>',
    action: function(e){
      self.prev();
    }
  });

  this.slideshowButton = e({
    class:'bv-button',
    tag:'button',
    parent:this.navigation,
    content:'<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 24 24" width="32"><path d="M8 5v14l11-7z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
    action: function(e){
      self.toggleInterval();
    }
  });

  this.nextButton = e({
    class:'bv-button',
    tag:'button',
    parent:this.navigation,
    content:'<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 24 24" width="32"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>',
    action: function(e){
      self.next();
    }
  });

  this.descButton = e({
    class:'bv-button bv-desc-button bv-toggle-button',
    tag:'button',
    parent:this.navigationRight,
    content:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z"/></svg>',
    action: function(e){
      self.toggleDescription();
    }
  });

  this.galleryButton = e({
    class:'bv-button bv-gallery-button bv-toggle-button bv-on',
    tag:'button',
    parent:this.navigationRight,
    content:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M4 8h4V4H4v4zm6 12h4v-4h-4v4zm-6 0h4v-4H4v4zm0-6h4v-4H4v4zm6 0h4v-4h-4v4zm6-10v4h4V4h-4zm-6 4h4V4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/></svg>',
    action: function(e){
      self.toggleGallery();
    }
  });

  this.gallery = e({
    tag:'div',
    class:'bv-gallery',
    parent: this.container,
    action: function(e){
      self.setImage(e.target);
    }
  });

  this.closeButton = e({
    class:'bv-button bv-close',
    tag:'button',
    parent:this.toolbar,
    content:'<svg xmlns="http://www.w3.org/2000/svg" fill="white" height="32" viewBox="0 0 24 24" width="32"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
    action: function(e){
      self.hide();
    }
  });

  if(args.showGallery === undefined || args.showGallery == true){
    this.showGallery();
  }
  else{
    this.hideGallery();
  }

  // Centering active thumbnail on resize.
  var resizeRunning = false;
  window.addEventListener('resize', function(){
    if(resizeRunning || !self.displayed){
      return;
    }

    resizeRunning = true;

    window.requestAnimationFrame(function(){
      self.fixGalleryPosition();
      resizeRunning = false;
    });
  });

  // Properties
  this.displayed = false;
  this.images = [];
  this.imageKeys = [];
  this.currentKeyIndex;
  this.current; // Current image object


  document.body.appendChild(this.container);

  if(typeof BigView.numberOfBigViews !== "number"){
    BigView.numberOfBigViews = 0;
  }
  this.id = BigView.numberOfBigViews;
  BigView.numberOfBigViews++;

}

BigView.prototype.show = function(target){
  if(target instanceof HTMLElement){
    this.displayed = true;
    document.body.style.overflow = 'hidden';
    this.container.style.zIndex = 100;
    this.container.style.opacity = 0;
    this.container.style.display = 'block';
    this.setImage(target);
    this.container.focus();
    this.container.style.opacity = 1;
  }
}

BigView.prototype.hide = function(){
  this.displayed = false;
  document.body.style.overflow = null;
  this.container.style.opacity = 0;
  this.container.style.zIndex = -100;
}

BigView.prototype.getImageObj = function(arg){
  if(typeof arg === "string"){
    return this.images[arg];
  }
  else if(typeof arg === "number"){
    if(arg >= this.imageKeys.length){
      return this.getImageObj(arg - this.imageKeys.length);
    }
    else if(arg < 0){
      return this.getImageObj(arg + this.imageKeys.length);
    }
    else{
      return this.getImageObj(this.imageKeys[arg]);
    }   
  }
  else if(arg === this.images[arg.src]){
    return arg;
  }
}

BigView.prototype.prepareImage = function(obj){
  var self = this;
  obj = this.getImageObj(obj);
  if (obj == null){
    return;
  }
  if(obj.big == null){
    obj.big = e({
      tag: 'img',
      class: 'bv-image',
      action: function(e){
        self.next();
        e.preventDefault();
        e.stopPropagation();
      }
    });
    obj.big.src = obj.src;
    obj.big.style.opacity = 0; // 0.01
    //obj.big.style.visibility = 'hidden';
    obj.big.style.zIndex = 0;
    this.body.appendChild(obj.big);
  }
}

BigView.prototype.fixGalleryPosition = function(){
  if (this.current == null){
    return;
  }
  var contWidth = window.innerWidth;
  var imgWidth = this.current.thumbnail.clientWidth;
  var elemPos = this.current.thumbnail.offsetLeft;
  var galleryPos = this.gallery.offsetLeft;
  var elemAbsPos = elemPos + galleryPos;
  var desiredPos = ( contWidth / 2 ) - ( imgWidth / 2 );

  var shift = elemAbsPos - desiredPos;

  this.gallery.style.transform = 'translateX('+ (galleryPos - shift) +'px)';
}

BigView.prototype.getImageObject = function(arg){
  if(typeof arg === "number"){
    if(arg >= this.images.length){
      return this.getImageObject(arg - this.images.length);
    }
    else if(arg < 0){
      return this.getImageObject(arg + this.images.length);
    }
    else{
      return this.images[arg];
    }
  }
  else if(arg instanceof BigViewImage){
    if(this.images.indexOf(arg) !== -1){
      return arg;
    }
  }
  else if(arg instanceof Node){
    if(arg.bigViews != null){
      return this.getImageObject(arg.bigViews[this.id]);
    }
    else if(arg.bigViewObject instanceof BigViewImage){
      return arg.bigViewObject;
    }
  }
  else{
    return null;
  }
}


BigView.prototype.setImage = function(img){
  var self = this;
  img = self.getImageObject(img);
  if(img instanceof BigViewImage){
    var old = this.current;
    this.current = img;
    this.fixGalleryPosition();

    //img.container.classList.add('bv-active');
    img.prepare();
    img.activate();

    // self.prepareImage(obj.i + 1);
    // self.prepareImage(obj.i - 1);

    if(old != null && old != img){
      old.deactivate();
      //old.container.classList.remove('bv-active');
      // old.big.style.opacity = 0;
      // //old.big.style.visibility = 'hidden';
      // old.big.style.zIndex = 0;
    }
    // this.current.big.style.opacity = 1;
    // this.current.big.style.visibility = null;
    // this.current.big.style.zIndex = 1;
  }
}

BigView.prototype.next = function(){
  this.setImage(this.current.i + 1);
}

BigView.prototype.prev = function(){
  this.setImage(this.current.i - 1);
}

BigView.prototype.addImages = function(images){
  var self = this;
  if (images.jquery){
    images.each(function(i,elem){
      if(elem.tagName.toLowerCase() === "img"){
        var img = new BigViewImage({
          bigView: self,
          src: elem.src,
          description: elem.alt,
        });
        self.images.push(img);
        if(typeof elem.bigViews !== "object"){
          elem.bigViews = {};
        }
        elem.bigViews[self.id] = img;

        self.body.appendChild(img.container);
      }
    });
  }
}

BigView.prototype.setGallery = function(images){
  var self = this;
  this.gallery.innerHTML = '';
  this.images = {};
  this.imageKeys = [];

  images.each(function(i,v){
    if( self.images[v.src] !== undefined){
      return;
    } 
    var dest = e({
      tag: 'img',
      parent: self.gallery,
    });
    dest.src = v.src;
    self.imageKeys.push(dest.src);
    var obj = {
      src: dest.src,
      elem: dest,
      desc: v.alt,
      i: self.imageKeys.length - 1,
    };
    self.images[dest.src] = obj;
  });
}

BigView.prototype.toggleGallery = function(){
  if(this.galleryDisplayed){
    this.hideGallery();
  }
  else{
    this.showGallery();
  }
}

BigView.prototype.showGallery = function(){
  this.galleryDisplayed = true;
  this.galleryButton.classList.add('bv-on');
  this.container.classList.remove('bv-no-gallery');
  this.fixGalleryPosition();
}

BigView.prototype.hideGallery = function(){
  this.galleryDisplayed = false;
  this.galleryButton.classList.remove('bv-on');
  this.container.classList.add('bv-no-gallery');
}

BigView.prototype.toggleDescription = function(){
  if(this.descriptionEnabled){
    this.hideDescription();
  }
  else{
    this.showDescription();
  }
}

BigView.prototype.showDescription = function(){
  this.descriptionEnabled = true;
  this.descButton.classList.add('bv-on');
  this.current.showDescription();
}

BigView.prototype.hideDescription = function(){
  this.descriptionEnabled = false;
  this.descButton.classList.remove('bv-on');
  this.current.hideDescription();
}

BigView.prototype.startSlideshow = function(){
  var self = this;
  if(this.slideshowInterval != null){
    clearInterval( this.slideshowInterval );
  }
  this.slideshowButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 24 24" width="32"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
  this.slideshowInterval = window.setInterval(function(){
    self.next();
  }, 2000);
}

BigView.prototype.stopSlideshow = function(){
  var self = this;
  this.slideshowButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 24 24" width="32"><path d="M8 5v14l11-7z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
  clearInterval( this.slideshowInterval );
  this.slideshowInterval = null;
}

BigView.prototype.toggleInterval = function(){
  if(this.slideshowInterval == null){
    this.startSlideshow();
  }
  else{
    this.stopSlideshow();
  }
}

function BigViewImage(args){
  args  = args || {};
  this.bigView = args.bigView;

  this.container = e({
    class: "bv-img-cont",
  });

  this.img = e({
    tag: 'img',
    class: 'bv-img',
    parent: this.container,
    attributes: {
      src: args.src,
    },
  });

  this.img.bigViewObject = this;

  this.description = e({
    class: 'bv-desc',
    parent: this.container,
  });

  this.thumbnail = e({
    tag: 'img',
    attributes: {
      src: args.src,
    },
    parent: this.bigView.gallery,
  });

  this.setDescription(args.description);

  this.thumbnail.bigViewObject = this;
}

BigViewImage.prototype.activate = function(){
  this.container.classList.add('bv-active');
  this.thumbnail.classList.add('bv-active');
}

BigViewImage.prototype.deactivate = function(){
  this.container.classList.remove('bv-active');
  this.thumbnail.classList.remove('bv-active');
}

BigViewImage.prototype.prepare = function(){
  if (this.bigView.descriptionEnabled){
    this.showDescription();
  }
  else{
    this.hideDescription();
  }
}

BigViewImage.prototype.setDescription = function(desc){
  this.description.innerHTML = desc;
}

BigViewImage.prototype.hideDescription = function(){
  var height = this.description.clientHeight;
  this.descriptionDisplayed = false;
  this.description.style.transform = "translateY(" + height + "px)";
  this.description.style.display = "none";
}

BigViewImage.prototype.showDescription = function(){
  this.descriptionDisplayed = true;
  this.description.style.transform = "translateY(" + 0 + "px)";
  this.description.style.display = null;
}

BigViewImage.prototype.toggleDescription = function(){
  if(this.descriptionDisplayed || this.descriptionDisplayed == null){
    this.hideDescription();
  }
  else{
    this.showDescription();
  }
}

BigViewImage.prototype.next = function(){
  return this.bigView.getImageObject(this.i + 1);
}

BigViewImage.prototype.prev = function(){
  return this.bigView.getImageObject(this.i - 1);
}

Object.defineProperty(BigViewImage.prototype, 'i', {
  get: function(){
    return this.bigView.images.indexOf(this);
  }
});

function e(args){
  args = args || {};

  var element = document.createElement( args.tag || 'div' );
  if(typeof args.class === "string"){
    args.class.split(" ").forEach(function(className){
      element.classList.add(className);
    });
  }

  if(typeof args.content === "string" || typeof args.content === "number"){
    element.innerHTML = args.content;
  }

  if(args.parent instanceof HTMLElement){
    args.parent.appendChild(element);
  }

  if(typeof args.attributes === "object"){
    for (var key in args.attributes){
      element.setAttribute(key, args.attributes[key]);
    }
  }

  if(typeof args.style === "object"){
    for (var i in args.style){
      element.style[i] = args.style[i];
    }
  }

  if(typeof args.action === "function"){
    // TODO: Touch events
    element.addEventListener('click', args.action);
  }

  return element;
}
