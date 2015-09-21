'use strict';
var tinyLrNotifier = require('../lib');
// the class
var TinyLrNotifier = tinyLrNotifier.TinyLrNotifier;
// the convenience function
var notify = tinyLrNotifier.notify;

// communicating with a tiny-lr server with default options
var notifier = new TinyLrNotifier('localhost', 35729);
var equivalentNotifier = new TinyLrNotifier();

// trigger reload of one file
notifier.notify('index.html');
equivalentNotifier.notify('index.html');

// each of these are functionally equivalent (default parameters)
notify('localhost', 35729, 'index.html');

notify(35729, 'index.html');

notify('index.html');

notifier.notify('index.html').
    then(function(response) {
        console.log(response.response);
        console.log(response.body);
    }).catch(function(err) {
        // most likely because LiveReload isn't running!
        console.log(err);
    });

// trigger reload of multiple files
notifier.notify(['app.js', 'vendor.js']);

// trigger reload of css
notifier.notify('app.css');

// trigger reload of entire page (equivalent to sending 'index.html')
notifier.reload();