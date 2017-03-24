/// <reference path="dist/xmp.js" />

// grab the important UI elements
var fileInput = document.querySelector("input[type=file]"),
    inputSection = document.getElementById("input"),
    outputSection = document.getElementById("output"),
    xmlDisplay = document.getElementById("xml"),
    tabThumbs = document.getElementById("tabtns");

// set up a change handler so that when the user selects
// a file, we can process it and display the result
fileInput.addEventListener("change", function (e) {
    var file = e.target.files[0];
    if (file) {
        var fileLoaded = function (xmp) {
            loadXmp(xmp);
            $(outputSection).show();
        };

        XmpJS.loadXmpFromFile(file, fileLoaded);
    }
});

function loadXmp(xmp) {
    $(xml).text(xmp.getDocumentText());
    $(tabThumbs).html("");
    XmpJS.getThumbnailImages(xmp).forEach(function (image) {
        $(tabThumbs).append(image);
    })
}

$(outputSection).hide();