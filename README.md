# heroku-deploy

A simple utility for deploying a .tar.gz to Heroku via the Heroku Platform API.

https://devcenter.heroku.com/articles/build-and-release-using-the-api

## Usage

``` javascript
var herokuDeploy = require('heroku-deploy');

herokuDeploy(herokuApiKey, herokuAppName, packageJson.version, releaseFilename).
    then(function(response) {
        console.log('Build request successfully submitted.');
        log(response);
    }).
    catch(function(err) {
        console.log(err);
        throw new Error('A heroku deployment error has occurred.');
    });
```

## Signature

``` javascript
// herokuApiKey    - your heroku api key
// herokuAppName   - the name of the heroku app you're deploying to
// appVersion      - a version tag for your application
// releaseFileName - the absolute path to the .tar.gz file
// 
// returns a bluebird promise
```