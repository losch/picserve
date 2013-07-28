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

// all environments
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

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

// Find pictures
var fullsizePics = fs.readdirSync('./public/images');

function forEach(array, action) {
    for (var i = 0; i < array.length; i++)
        action(array[i]);
}

function map(func, array) {
    var result = [];
        forEach(array, function (element) {
        result.push(func(element));
    });
    return result;
}

function makePictureData(picture) {
    var filename = 'images/' + picture;
    return { thumbnail: filename, full: filename };
}

var pictures = map(makePictureData, fullsizePics);

routes.setPictures(pictures);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
