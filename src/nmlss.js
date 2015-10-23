function FullScreenImage(){
  var self = this;
  this.container = document.createElement('div');
  this.container.style.display = "none";
  this.container.setAttribute('tabindex', -1);
  this.container.classList.add("fs-container");
  document.body.appendChild(this.container);

  this.container.addEventListener('keydown', function(e){
    var nextKeys = [76, 68, 74, 83, 9];
    var prevKeys = [65, 72, 75, 87];
    var exitCodes;
    if(e.keyCode === 39 ){
      self.next();
    }
    else if(e.keyCode === 37){
      self.prev();
    }
    else if(e.keyCode === 13){
      self.next();
    }
    else if(e.keyCode === 27){
      self.hide();
    }
    else if(e.keyCode === 32){
      self.next();
    }
    else if(e.keyCode === 8){
      self.prev();
    }
    else if(nextKeys.indexOf(e.keyCode) !== -1){
      self.next();
    }
    else if(prevKeys.indexOf(e.keyCode) !== -1){
      self.prev();
    }
    else{
      return;
    }
    e.preventDefault();
    e.stopPropagation();
  });

  this.toolbar = document.createElement('div');
  this.toolbar.classList.add("fs-toolbar");
  this.body = document.createElement('div');
  this.body.classList.add("fs-body");

  this.navigation = document.createElement('div');
  this.navigation.classList.add('fs-navigation');

  this.container.appendChild(this.toolbar);
  this.container.appendChild(this.body);
  this.container.appendChild(this.navigation);

  this.prevButton = e({
    class:'fs-button',
    tag:'button',
    parent:this.navigation,
    content:'<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 24 24" width="32">\
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>',
  });
  this.prevButton.addEventListener('click', function(e){
    self.prev();
  });

  this.nextButton = e({
    class:'fs-button',
    tag:'button',
    parent:this.navigation,
    content:'<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 24 24" width="32">\
      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>',
  });
  this.nextButton.addEventListener('click', function(e){
    self.next();
  });

  this.gallery = document.createElement('div');
  this.gallery = e({
    tag:'div',
    class:'fs-gallery',
    parent: this.container,
  });
  this.gallery.addEventListener('click', function(e){
    self.setImage(e.target.src);
  });

  this.closeButton = e({
    class:'fs-button fs-close',
    tag:'button',
    parent:this.toolbar,
    content:'<svg xmlns="http://www.w3.org/2000/svg" fill="white" height="32" viewBox="0 0 24 24" width="32">\
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>\
      </svg>',
  });
  this.closeButton.addEventListener('click', function(e){
    self.hide();
  });

  this.images = {};
  this.imageKeys = [];
  this.currentKeyIndex;

}

FullScreenImage.prototype.show = function(target){
  if(target instanceof HTMLElement){
    document.body.style.overflow = 'hidden';
    this.container.style.zIndex = 100;
    this.container.style.opacity = 0;
    this.container.style.display = 'block';
    this.setImage(target.src);
    this.container.focus();
    this.container.style.opacity = 1;
  }
}

FullScreenImage.prototype.hide = function(){
  document.body.style.overflow = null;
  this.container.style.opacity = 0;
  this.container.style.zIndex = -100;
}

FullScreenImage.prototype.getImageObj = function(arg){
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

FullScreenImage.prototype.prepareImage = function(obj){
  obj = this.getImageObj(obj);
  if (obj == null){
    return;
  }
  if(obj.big == null){
    obj.big = document.createElement('img');
    obj.big.classList.add('fs-image');
    obj.big.src = obj.src;
    obj.big.style.opacity = 0; // 0.01
    //obj.big.style.visibility = 'hidden';
    obj.big.style.zIndex = 0;
    this.body.appendChild(obj.big);
  }
}

FullScreenImage.prototype.setImage = function(img){
  var self = this;
  if(typeof img === "string"){
    var old = this.current;
    this.currentKeyIndex = this.images[img].i;
    var obj = this.images[img];
    this.current = obj;
    self.prepareImage(obj);
    var contWidth = window.innerWidth;
    var imgWidth = obj.elem.clientWidth;
    var elemPos = obj.elem.offsetLeft;
    var galleryPos = this.gallery.offsetLeft;
    var elemAbsPos = elemPos + galleryPos;
    var desiredPos = ( contWidth / 2 ) - ( imgWidth / 2 );

    var shift = elemAbsPos - desiredPos;

    this.gallery.style.transform = 'translateX('+ (galleryPos - shift) +'px)';

    self.prepareImage(obj.i + 1);
    self.prepareImage(obj.i - 1);

    if(old != null){
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

FullScreenImage.prototype.next = function(){
  this.setImage(this.currentKeyIndex + 1);
}

FullScreenImage.prototype.prev = function(){
  this.setImage(this.currentKeyIndex - 1);
}

FullScreenImage.prototype.setGallery = function(images){
  var self = this;
  this.gallery.innerHTML = '';
  this.images = {};
  this.imageKeys = [];

  images.each(function(i,v){
    if( self.images[v.src] !== undefined){
      return;
    } 
    var dest = document.createElement('img');
    self.gallery.appendChild(dest);
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

  return element;
}