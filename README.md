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

A Boolean setting whether to display image description or not.

##### args.showGallery

A Boolean setting whether to display gallery or not.

#### .add(arg)

Adds images to the viewer.

Argument `arg` should be an `<img>` element, JQuery object, [NodeList](https://developer.mozilla.org/en/docs/Web/API/NodeList), Stirng representing a selector (as in [querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)) or Object representing image.

If `arg` is a **JQuery object** or **NodeList** then its `<img>` elements will be added. It is equivalent to adding the `<img>` elements in `arg` by one.

If `arg` is a **String** then the result is equivalent to adding `document.querySelectorAll( arg )`.

If `arg` is an **Object** then image defined by the object properties. The following properties are understood by the function:
* **src** - URI of the image
* **description** - description of the image

Below are the basic examples of adding image to viewer assuming its ```id``` is "my-img"
```javascript
var myViewer = new BigView(); // creating a viewer
var imgElement = document.getElementById( "my-img" );

// Adding <img> element
myViewer.add( imgElement );
// Adding JQuery object with <img> elements
myViewer.add( $("#my-img") );
// Adding NodeList
myViewer.add( document.querySelectorAll("#my-img") );
// Adding images by selector
myViewer.add( "#my-img" );
```

## License

See the [LICENSE](LICENSE) file for license rights and limitations (MIT).
