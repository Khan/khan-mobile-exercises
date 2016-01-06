/**
 * Returns a promise that resolves with the next request that matches the
 * specified `pathname` and an optional `isTheRightEvent`.
 *
 * @param {string} pathname
 * @param {(data) => bool} filterEvent (optional)
 * @param {number} timeoutMs (default 10000)
 */

import getNextEvent from "./get-next-event";
import ipc from "ipc";

export default (pathname, filterEvent = null, timeoutMs = 10000) => {
    return getNextEvent(ipc, "khan-protocol", data => {
        if (data.pathname !== pathname) {
            return false;
        }
        if (filterEvent) {
            return filterEvent(data);
        }
        return true;
    }, timeoutMs);
};

