'use strict';
var P = require('bluebird');
var request = require('request');
var fs = require('fs');

module.exports = deployToHeroku;

////////////////////

function deployToHeroku(herokuApiKey, herokuAppName, appVersion, tarFilePath) {
    var uploadUrl = null;
    var buildUrl = null;

    if (herokuApiKey == null || herokuAppName == null || appVersion == null || tarFilePath == null) {
        return P.reject('All parameters are required.');
    }

    return getHerokuUrls(herokuApiKey, herokuAppName).
            then(function(urls) {
                uploadUrl = urls.putUrl;
                buildUrl = urls.getUrl;
                return uploadDistributionFile(tarFilePath, uploadUrl);
            }).then(function() {
                return initiateHerokuBuild(appVersion, herokuApiKey, herokuAppName, buildUrl);
            });
}

// returns an Promise containing an object with two URLs:
// "putUrl": a URL to upload (PUT) the source tar.gz file to
// "getUrl": a URL to call to build the tar
function getHerokuUrls(herokuApiKey, herokuAppName) {
    return new P(function(resolve, reject) {
        var options = {
            'url': 'https://api.heroku.com/apps/' + herokuAppName + '/sources',
            'headers': {
                'Accept': 'application/vnd.heroku+json; version=3',
                'Authorization': 'Bearer ' + herokuApiKey
            }
        };

        request.post(options, function(err, response, body) {
                if (err) { reject(err); }

                var responseData = JSON.parse(body);

                var awsUrls = {
                    /* jshint camelcase: false */
                    getUrl: responseData.source_blob.get_url,
                    putUrl: responseData.source_blob.put_url
                    /* jshint camelcase: true */
                };

                resolve(awsUrls);
            });
    });
}

// Uploads (PUTs) the distribution file to the provided URL
function uploadDistributionFile(filename, url) {
    return new P(function(resolve, reject) {
        var data = fs.readFileSync(filename);

        var options = {
            url: url,
            body: data
        };

        request.put(options, function(err, response, body) {
            if (err) { reject(err); }

            resolve();
        });
    });

}

function initiateHerokuBuild(appVersion, herokuApiKey, herokuAppName, sourceUrl) {
    return new P(function(resolve, reject) {
        var options = {
            'url': 'https://api.heroku.com/apps/' + herokuAppName + '/builds',
            'headers': {
                'Accept': 'application/vnd.heroku+json; version=3',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + herokuApiKey
            },
            'body': JSON.stringify({
                'source_blob': {
                    'url': sourceUrl,
                    'version': appVersion
                }
            })
        };


        request.post(options, function(err, response, body) {
            if (err) {
                reject(err);
            }

            resolve(body);
        });
    });
}