function FullScreenImage(){
    var self = this;
    this.container = document.createElement('div');
    this.container.style.display = "none";
    document.body.appendChild(this.container);
    this.$c = $(this.container);
    this.$c.addClass("fs-container");
    this.$c.attr('tabindex', -1);

    this.$c.keydown(function(e){
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
        return false;
    });

    this.toolbar = document.createElement('div');
    this.body = document.createElement('div');
    this.$t = $(this.toolbar);
    this.$b = $(this.body);
    this.$nav = $(document.createElement('div'));

    this.$t.addClass('fs-toolbar');
    this.$b.addClass('fs-body');
    this.$nav.addClass('fs-navigation');

    this.$c.append(this.$t);
    this.$c.append(this.$b);
    this.$c.append(this.$nav);

    this.$nextButton = $(document.createElement('button')).addClass('fs-button')
        .html('<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 24 24" width="32">\
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>').click(function(){
                self.next();
            });
    this.$prevButton = $(document.createElement('button')).addClass('fs-button')
        .html('<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 24 24" width="32">\
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>').click(function(){
                self.prev();
            });;
    

    this.$nav.append(this.$prevButton);
    this.$nav.append(this.$nextButton);

    this.img = document.createElement('img');
    this.$img = $(this.img);

    this.$img.click(function(){
        self.next();
    });

    this.$img.addClass('fs-image');

    this.$b.append(this.$img);

    this.$gallery = $(document.createElement('div'));
    this.$gallery.addClass('fs-gallery');
    this.$c.append(this.$gallery);
    this.$gallery.click(function(e){
        self.setImage(e.target.src);
    });

    this.closeButton = document.createElement('button');
    this.$cb = $(this.closeButton);
    this.$cb.addClass('fs-close');
    this.$cb.html('<svg xmlns="http://www.w3.org/2000/svg" fill="white" height="32" viewBox="0 0 24 24" width="32">\
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>');
    this.$cb.click(function(){
        self.hide();
    });
    this.images = {};
    this.imageKeys = [];
    this.currentKeyIndex;
    this.$t.append(this.$cb);

}

FullScreenImage.prototype.show = function(target){
    document.body.style.overflow = 'hidden';
    if(target instanceof HTMLElement){
        this.container.style.opacity = 0;
        this.container.style.display = 'block';
        this.setImage(target.src);
        this.$c.focus();
        this.$c.animate({
            opacity:1,
        }, 'fast');
    }
    //this.$c.fadeIn('fast');
}

FullScreenImage.prototype.hide = function(){
    document.body.style.overflow = null;
    this.$c.fadeOut('fast');
}

FullScreenImage.prototype.setImage = function(img){
    if(typeof img === "string"){
        this.currentKeyIndex = this.images[img].i;
        var obj = this.images[img];
        var contWidth = window.innerWidth;
        var imgWidth = obj.elem.clientWidth;
        var elemPos = obj.elem.offsetLeft;
        var galleryPos = this.$gallery[0].offsetLeft;
        var elemAbsPos = elemPos + galleryPos;
        var desiredPos = ( contWidth / 2 ) - ( imgWidth / 2 );

        var shift = elemAbsPos - desiredPos;

        this.$gallery.animate({
            left:galleryPos - shift,
        }, 'fast');

        this.$img.attr('src', img);
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
    this.$gallery.html('');
    this.images = {};
    this.imageKeys = [];

    images.each(function(i,v){
        if( self.images[v.src] !== undefined){
            return;
        } 
        var dest = document.createElement('img');
        self.$gallery.append(dest);
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