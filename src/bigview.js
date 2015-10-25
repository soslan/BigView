'use strict';

function BigView(){
  var self = this;

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
    // action: function(e){
    //   // if(e.target.tagName.toLowerCase() === 'img'){
    //   //   self.next();
    //   // }

    //   self.next();
    //   e.stopPropagation();
    //   e.preventDefault();
    // }
  });

  this.navigation = e({
    class: 'bv-navigation',
    parent: this.container,
  });

  this.prevButton = e({
    class:'bv-button',
    tag:'button',
    parent:this.navigation,
    content:'<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 24 24" width="32">\
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>',
    action: function(e){
      self.prev();
    }
  });

  this.nextButton = e({
    class:'bv-button',
    tag:'button',
    parent:this.navigation,
    content:'<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 24 24" width="32">\
      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>',
    action: function(e){
      self.next();
    }
  });

  this.gallery = e({
    tag:'div',
    class:'bv-gallery',
    parent: this.container,
    action: function(e){
      self.setImage(e.target.src);
    }
  });

  this.closeButton = e({
    class:'bv-button bv-close',
    tag:'button',
    parent:this.toolbar,
    content:'<svg xmlns="http://www.w3.org/2000/svg" fill="white" height="32" viewBox="0 0 24 24" width="32">\
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>\
      </svg>',
    action: function(e){
      self.hide();
    }
  });

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
  this.images = {};
  this.imageKeys = [];
  this.currentKeyIndex;
  this.current; // Current image object


  document.body.appendChild(this.container);

}

BigView.prototype.show = function(target){
  if(target instanceof HTMLElement){
    this.displayed = true;
    document.body.style.overflow = 'hidden';
    this.container.style.zIndex = 100;
    this.container.style.opacity = 0;
    this.container.style.display = 'block';
    this.setImage(target.src);
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
  var contWidth = window.innerWidth;
  var imgWidth = this.current.elem.clientWidth;
  var elemPos = this.current.elem.offsetLeft;
  var galleryPos = this.gallery.offsetLeft;
  var elemAbsPos = elemPos + galleryPos;
  var desiredPos = ( contWidth / 2 ) - ( imgWidth / 2 );

  var shift = elemAbsPos - desiredPos;

  this.gallery.style.transform = 'translateX('+ (galleryPos - shift) +'px)';
}

BigView.prototype.setImage = function(img){
  var self = this;
  if(typeof img === "string"){
    var old = this.current;
    this.currentKeyIndex = this.images[img].i;
    var obj = this.images[img];
    this.current = obj;
    this.current.elem.classList.add('bv-active');
    self.prepareImage(obj);
    this.fixGalleryPosition();

    self.prepareImage(obj.i + 1);
    self.prepareImage(obj.i - 1);

    if(old != null && old != this.current){

      old.elem.classList.remove('bv-active');
      old.big.style.opacity = 0;
      //old.big.style.visibility = 'hidden';
      old.big.style.zIndex = 0;
    }
    this.current.big.style.opacity = 1;
    this.current.big.style.visibility = null;
    this.current.big.style.zIndex = 1;
  }
  else if(typeof img === "number"){
    if(img >= this.imageKeys.length){
      this.setImage(img - this.imageKeys.length);
    }
    else if(img < 0){
      this.setImage(img + this.imageKeys.length);
    }
    else{
      this.setImage(this.imageKeys[img]);
    }   
  }
  
}

BigView.prototype.next = function(){
  this.setImage(this.currentKeyIndex + 1);
}

BigView.prototype.prev = function(){
  this.setImage(this.currentKeyIndex - 1);
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

  if(typeof args.action === "function"){
    // TODO: Touch events
    element.addEventListener('click', args.action);
  }

  return element;
}
