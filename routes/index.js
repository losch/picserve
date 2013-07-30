/*
 * Slideshow page
 */

var images = [];

exports.index = function(req, res) {
  res.render('index', { title: "Simple picture server",
                        images: images });
};

exports.setImages = function(newImages) { images = newImages; };
