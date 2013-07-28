/*
 * Slideshow page
 */

var pictures = [];

exports.index = function(req, res) {
  res.render('index', { title: "Losch's simple picture server",
                        pictures: pictures });
};

exports.setPictures = function(newPictures) { pictures = newPictures; };
