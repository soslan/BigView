# BigView

BigView is an image viewer for the Web.

## Build

The building process requires that you have npm installed.

First install required npm modules by running `npm install` inside the BigView directory. This will install Gulp.

Next run `gulp`.

The BigView files should now be located in the 'dist/' directory.

## Usage

Include `bigview.css` and `bigview.js` from the `dist/` directory in your HTML file.

Create a BigView instance and add some images to it. Below is a basic example.
```javascript
// Creating BigView instance
var myBigView = new BigView();

// Adding images by selector
myBigView.addImages( $( '#my-gallery > img' ) );
```
Click on one of the added images should now open the viewer.

## License

See the [LICENSE](LICENSE) file for license rights and limitations (MIT).
