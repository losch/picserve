/**
 * Losch's simple picture server
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , fs = require('fs');

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

function isValidPicture(picture) {
    var validExtensions = ['bmp', 'jpg', 'gif', 'svg', 'png'];
    var ext = picture.slice(-3).toLowerCase();
    for (var i in validExtensions) {
        if (ext == validExtensions[i])
            return true;
    }
    return false;
}

function createPictureData(picture) {
    var filename = 'images/' + picture;
    return { thumbnail: filename, full: filename };
}

app.use('/images', express.static(picturePath));

var pictures = fullsizePics.filter(isValidPicture).map(createPictureData);
routes.setPictures(pictures);

// Start serving
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
