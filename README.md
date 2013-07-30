Simple Picture Server
=====================

Simple web application built on [Node.js](http://nodejs.org/) and
[Ractive.js](http://www.ractivejs.org/) for serving an image gallery
easily from any directory.

When the application is started, it searches image files from a given
directory and generates thumbnail images of them into a temporary directory.
After this, a web server is started which shows a gallery with the found
images.
The temporary directory is deleted when the application exits.

### Dependencies

* Node.js
* ImageMagick

### Installation

    git clone https://github.com/losch/picserve.git
    cd picserve && npm install

### Usage

    node app.js [IMAGEDIR]

where `IMAGEDIR` is a directory containing image files. By default,
./public/images is used as the `IMAGEDIR`.

### Todo

* Better UI. The current one works, but it's not nice.
* Monitoring for file changes in `IMAGEDIR`. Currently image files are
  searched and thumbnails generated only when the server is started.
