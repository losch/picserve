Simple Picture Server
=====================

Simple web application built on Node.js for serving image files with
thumbnails easily from any directory.

Thumbnails are generated to temporary directory and are cleaned up when
the application is exit.

### Dependencies

* Node.js
* ImageMagick

### Installation

    git clone https://github.com/losch/picserve.git
    cd picserve && npm install

### Usage

    node app.js [IMAGEDIR]

    where IMAGEDIR is a directory containing image files. By default,
    ./public/images is used.
