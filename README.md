# XmpJS
A JavaScript library for extracting [XMP metadata](http://www.adobe.com/products/xmp.html) from files within the browser. This is a port of the [.NET XmpParser library](https://github.com/SunBrandingSolutions/XmpParser).

# Getting the code
We're still in the early days, so bear with us whilst we set up NPM/Bower packages and so on! For now, you can grab the code directly from this site.

# Usage
Assuming an HTML page with a single file input:

```
<!doctype html>
<html>
    <body>
        <!-- this allows the user to select the file to read -->
        <input type="file" accept="application/pdf" />
        
        <!-- we'll put whatever output we generate in this box -->
        <div id="output"></div>
        
        <!-- reference the XMP script library; no other dependencies required -->
        <script src="xmp.js"></script>
    </body>
</html>
```

The following code will load an `XmpDocument` object from the file input when it's selected:

```
var fileInput = document.querySelector("input[type=file]");

// use this to display any output
var output = document.getElementById("output");

// handle the file after the user selects it
fileInput.addEventListener("change", function (e) {
    var file = e.target.files[0];
    if (!file) return;
    
    // this callback will be executed when the XMP has been loaded from
    // the selected file
    var callback = function (xmp) {
        // display the XMP as XML in a <pre> tag
        var pre = document.createElement("pre");
        pre.innerText = xmp.getString();
        output.appendChild(pre);
    };

    // XmpJS is the namespace of all XMP-related functions; this method
    // will parse a File object, and load any XMP metadata from it if
    // possible; it will return an instance of XmpDocument, and takes
    // a callback to execute when it has completed
    XmpJS.loadXmpFromFile(file, callback);
});
```

Once the `XmpDocument` has been extracted, we can use it to find out information about the file. Let's see what we can do with it...

## Get the thumbnail(s)
XMP data can store a thumbnail of the file as a base64-encoded string. To retrieve and display this, modify the callback to:

```
var callback = function (xmp) {
    // XMP can include multiple thumbnails, although typically there
    // will only be one; the thumbnail information includes the width,
    // height, and format
    var thumbnails = XmpJS.Thumbs.get(xmp);
    
    // this is a syntactic-sugar method that will return an array of
    // HTMLImageElement objects from the thumbnail data
    var imageTags = XmpJS.Thumbs.toHtml(thumbnails);
    
    // now we can display them by appending the image tags to our
    // output div
    imageTags.forEach(function (img) {
        output.appendChild(img);
    });
}
```

The image data extracted from XMP looks like this:

```
{ width: 100, height: 100, format: "JPEG", image: "..." }
```

## List the fonts
We can display all the fonts known to have been used in this file:

```
var callback = function (xmp) {
    var fonts = XmpJS.Fonts.get(xmp);
    
    let list = document.createElement("ul");
    
    fonts.forEach(function (font) {
    
    });
}
```