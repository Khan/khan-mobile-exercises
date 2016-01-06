# Testing the exercises bridge

We've got this JavaScript that we use to connect the iPad up to the exercise
frameworks (perseus + khan-exercises), and until now it has been rather
difficult to test.

This suite loads up the web parts of iPad exercises in an
[Electron](http://electron.atom.io) wrapper, mocking out the netword requests
and providing test exercise data.

This will make it easier to test & debug exercise issues, especially
surrounding network requests, which have caused us lots of bugs so far.

## Usage
Run `npm install` to get the dependencies.

```
npm run bridge
```

This will fire up Electron & run the tests. It will log to the console and
exit with the proper exit code, so this can be run as part of a jenkins test
job.

## Test API
The JavaScript bridge communicates with webapp & native, using Ajax calls for
webapp and iframes for native. The bridge tests framework intercepts both of
these, allowing a test to completely isolate the JavaScript.

A test looks like

```
const someTest = async function (jsExerciseAPI, iframe, setNextWebappHandler) => {
  // test body
}
```

- `jsExerciseAPI` is the object returned by
  `Resources/webview/javascript/exercise-package/mobile-exercises.js`
- `iframe` is a reference to the iframe where the exercise framework has been
  loaded
- `setNextWebappHandler` takes a function of the form `requestData ->
  responseData`, where `requestData` looks like `{url: string, type:
  "POST"|"GET", data: Object, dataType: "json"}`. It is used in a shimmed-out
  `$.kaOauthAjax` that is called by
  `/Resources/ThirdParty/khan-exercises/interface.js`

## Test data
Test data was obtained via logging the actual communication from an iPad
simulator session :) In the future, it would be nice to instead get the data
from webapp's API.
