/**
 * Simple picture server
 */

"use strict";

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    querystring = require('querystring'),
    temp = require('temp'),
    async = require('async'),
    images = require('./images');

var app = express();

// All environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// Development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);

// Find image files
var args = process.argv.splice(2);
var imagePath = args[0] || './public/images';
console.log('Serving images from directory: ' + imagePath);
var imageFiles = images.searchImages(imagePath);

// Create temporary directory for thumbnails
var tempDirectory = temp.mkdirSync('picserve-');
console.log('Using temporary directory: ' + tempDirectory);

// Generates a thumbnail image
function generateThumbnail(imageFile, callback) {
    var source = path.join(imagePath, imageFile);
    var destinaton = path.join(tempDirectory, imageFile);
    images.generateThumbnail(source, destinaton, 100, callback);
}

// Returns URLs to thumbnail sized and full sized image files
function getURLs(imageFile) {
    var full = path.join('images', querystring.escape(imageFile));
    var thumb = path.join('thumbnails', querystring.escape(imageFile));
    return { thumbnail: thumb,
             fullsize: full };
}

// Generate thumbnails and URLs to image files. async is used to make
// this happen synchronously. Otherwise as many processes would be
// spawned than there's found image files.
async.mapSeries(imageFiles,
                generateThumbnail,
                function (err, results) {
                    if (err) throw err;
                });
var imageURLs = imageFiles.map(getURLs);

// Set up routes to image files
routes.setImages(imageURLs);
app.use('/images', express.static(imagePath));
app.use('/thumbnails', express.static(tempDirectory));

// Start serving
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

// Exit gracefully cleaning up temporary files
process.on('SIGINT', function() {
    console.log("\nSIGINT received, shutting down");
    process.exit(0);
});

process.once('SIGUSR2', function () {
    console.log("\nSIGUSR2 received, shutting down");
    temp.cleanup();
    process.kill(process.pid, 'SIGUSR2'); 
});
