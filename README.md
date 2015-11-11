# BigView

BigView is an image viewer for the Web.

## Build

The building process requires that you have npm installed.

First install required npm modules by running `npm install` inside the BigView directory. This will install Gulp.

Next run `gulp`.

The BigView files should now be located in the 'dist/' directory.

## Usage

Include `bigview.css` and `bigview.js` from the `dist/` directory in your HTML file.

Create a BigView instance and add some images to it (for now it only supports JQuery objects).
```javascript
// Creating BigView instance
var myBigView = new BigView();

// Adding images
myBigView.addImages($('#my-gallery > img'));

// Making clicks on the images launch myBigView
$('#my-gallery > img').click(function(e){
  myBigView.show(e);
});
```

## License

See the [LICENSE](LICENSE) file for license rights and limitations (MIT).
