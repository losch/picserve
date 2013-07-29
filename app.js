/**
 * Losch's simple picture server
 */

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    http = require('http'),
    path = require('path'),
    querystring = require('querystring'),
    fs = require('fs'),
    im = require('imagemagick'),
    temp = require('temp');

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
app.get('/users', user.list);

// Find pictures
var args = process.argv.splice(2);
var picturePath = args[0] || './public/images';

try {
    var fullsizePics = fs.readdirSync(picturePath);
}
catch (err) {
    console.error(err);
    process.exit(1);
}

// Create temporary directory for thumbnails
var tempDirectory = temp.mkdirSync('picserve-');
console.log('Using temporary directory: ' + tempDirectory);

function isValidPicture(picture) {
    var validExtensions = ['bmp', 'jpg', 'gif', 'svg', 'png'];
    var ext = picture.slice(-3).toLowerCase();
    for (var i in validExtensions) {
        if (ext == validExtensions[i])
            return true;
    }
    return false;
}

function createThumbnail(source, destination) {
    console.log("Generating thumbnail: " + source + " -> " + destination);

    im.resize(
        { srcPath: source,
          dstPath: destination,
          width:   100 },
        function(err, stdout, stderr){
            if (err) throw err;
        });
}

function createPictureData(picture) {
    var full = path.join('images', querystring.escape(picture));
    var thumb = path.join('thumbnails', querystring.escape(picture));

    var source = path.join(picturePath, picture);
    var destinaton = path.join(tempDirectory, picture);
    createThumbnail(source, destinaton);

    return { thumbnail: thumb, full: full };
}

app.use('/images', express.static(picturePath));
app.use('/thumbnails', express.static(tempDirectory));

var pictures = fullsizePics.filter(isValidPicture).map(createPictureData);
routes.setPictures(pictures);

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
