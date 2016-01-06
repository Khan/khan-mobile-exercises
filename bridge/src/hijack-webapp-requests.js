/**
 * All web requests by the app are made via `$.kaOauthAjax`. You can check
 * things out in `/Resources/webapp/ThirdParty/khan-exercises/interface.js`.
 *
 * The only requests that are made are `/attempt` and `/hint`, and the result
 * of `/hint` is discarded (and `/attempt` when not moving to the next
 * exercise).
 *
 * You can find the webapp endpoints in `/api/internal/user.py`.
 *
 * Here we take an iframe, and return a function that can be used to fake the
 * response of the next `$.kaOauthAjax` call by the iframe.
 *
 * Example usage:
 * ```
 * setNextWebappHandler(optionsFromIframe => {
 *  return theJsonReponseAsANornamObject
 * })
 * ```
 *
 * You can also return a promise.
 */

export default iframe => {
    let webappHandler;
    const setNextWebappHandler = fn => {
        webappHandler = fn;
    };

    // For manual debugging
    window.setNextWebappHandler = setNextWebappHandler;

    // Override to capture calls to webapp
    iframe.contentWindow.$.kaOauthAjax = (options) => {
        console.debug("Webapp request", options);
        const deferred = iframe.contentWindow.$.Deferred();
        if (webappHandler) {
            let value;
            let errored;
            try {
                value = webappHandler(options);
            } catch (e) {
                errored = true;
                deferred.reject(e);
            }
            if (!errored && value) {
                if (typeof value.then === "function") {
                    value.then(val => deferred.resolve(val),
                               err => deferred.reject(err));
                } else {
                    deferred.resolve(value);
                }
            }
        } else {
            deferred.reject(new Error("No webappHandler supplied"));
        }
        // If there's no webappHandler set for this web request, we just
        // return a never-fulfilled promise. Another possible default would be
        // to error out (simulating network failure), but currently our setup
        // is not at all robust to network failures.
        webappHandler = null;
        return deferred;
    };

    return setNextWebappHandler;
};

