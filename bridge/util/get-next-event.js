/**
 * A way to promisify EventEmitters, so we can use them in async/await code.
 * This is mostly just used as a helper for ./getNextRequest.
 *
 * @param {EventEmitter} EventEmitter
 * @param {string} event
 * @param {(data) => bool} filterEvent
 * @param {number} timeoutMs (default 10000)
 *
 */

export default (
    eventEmitter,
    event,
    filterEvent,
    timeoutMs = 10000
) => new Promise((resolve, reject) => {
    const fn = data => {
        if (!filterEvent(data)) {
            return;
        }
        eventEmitter.removeListener(event, fn);
        resolve(data);
    };
    eventEmitter.on(event, fn);
    setTimeout(() => {
        eventEmitter.removeListener(event, fn);
        reject(new Error(`Timout after ${timeoutMs}ms`));
    }, timeoutMs);
});

