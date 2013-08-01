//
// This file contains image handling related functions, thumbnail
// generation etc.
//

// Require file system and imagemagick
var fs = require('fs'),
    im = require('imagemagick');

//
// Tells whether a file is a valid image
//
function isValidImage(file) {
    var validExtensions = ['bmp', 'jpg', 'gif', 'svg', 'png'];
    var ext = file.slice(-3).toLowerCase();
    for (var i in validExtensions) {
        if (ext == validExtensions[i])
            return true;
    }
    return false;
}

//
// Searches for valid image files from a given directory
//
function searchImages(directory) {
    try {
        var files = fs.readdirSync(directory);
    }
    catch (err) {
        console.error(err);
        throw err;
    }

    imageFiles = files.filter(isValidImage);

    return imageFiles;
}

//
// Generates a thumbnail of given source image file to destination file
//
function generateThumbnail(source, destination, width, callback) {
    console.log("Generating thumbnail: " + source + " -> " + destination);

    im.resize(
        {
            srcPath: source,
            dstPath: destination,
            width:   width
        },
        function(err, stdout, stderr) {
            if (err) throw err;
            callback();
        });
}

exports.searchImages = searchImages;
exports.generateThumbnail = generateThumbnail;
