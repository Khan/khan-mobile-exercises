/**
 * Simple helper fn that returns a promise which resolves after the given
 * timeoutMs.
 *
 * Example usage:
 * await waitMs(500)
 */

export default timeoutMs => new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve();
    }, timeoutMs);
});

