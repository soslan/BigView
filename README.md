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

## API (Not completed)

### BigView(args)

The BigView class represents a viewer with its own images and settings. The following is a basic example of creating a new viewer.
```javascript
var myViewer = new BigView();
```
The `BigView()` constructor accepts one argument which should be an object with properties representing different settings. Some of the settings are listed below.

##### args.showDescription

Should be `true` or `false`. Sets whever image description will be displayed initially or not.

##### args.showGallery

Should be `true` or `false`. Sets whever gallery will be displayed initially or not.

#### .add(arg)

Argument `arg` can be JQuery object, NodeList, Stirng representing a selector or a Node.

## License

See the [LICENSE](LICENSE) file for license rights and limitations (MIT).
