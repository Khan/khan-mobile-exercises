/**
 * Run the tests, and report the results.
 *
 * TODO(jared): stream results back to the main electron process so that the
 * console will also have them, and we can be jenkins friendly
 */

import fs from "fs";
import path from "path";
import ipc from "ipc";
import setup from "./setup";
import * as consts from "./consts";

const runTest = async fn => {
    const {
        iframe,
        jsExerciseAPI,
        setNextWebappHandler,
    } = await setup("container");

    try {
        await fn(jsExerciseAPI, iframe, setNextWebappHandler);
    } catch (e) {
        return e;
    }
};

const getAllTests = () => {
    const base = path.join(__dirname, "../tests");
    const names = fs.readdirSync(base);
    const tests = {};
    names.forEach(name => {
        if (!name.match(/\.js$/)) {
            return;
        }
        tests[name] = require(path.join(base, name));
    });
    return tests;
};

// This mocks out the console, so that tests can `console.log|warn|error` and
// it will be mirrored in the terminal output of the main process, for CI
// integration. `console.debug` is *not* mirrored, and can be used to report
// things that would just clutter up the terminal, but are useful for manual
// debugging.
//
// This returns a function that reverts the console back to the native object.
const interceptConsole = () => {
    const originalConsole = window.console;
    window.console = {
        log: (...args) => {
            ipc.send("log", args);
            originalConsole.log(...args);
        },
        warn: (...args) => {
            ipc.send("log:warn", args);
            originalConsole.warn(...args);
        },
        error: (...args) => {
            ipc.send("log:error", args);
            originalConsole.error(...args);
        },
        debug: (...args) => {
            originalConsole.debug(...args);
        },
    };

    return () => {
        window.console = originalConsole;
    };
};

export default async () => {
    const restoreConsole = interceptConsole();
    ipc.on(consts.ipcKhanProtocolEvent, data => {
        console.debug("khan://", data);
    });
    const failures = [];
    const tests = getAllTests();
    for (const name in tests) {
        console.log("Running", name);
        const error = await runTest(tests[name]);
        if (error) {
            console.error(error);
            console.error(error.stack);
            const jsonError = { message: error.message, stack: error.stack };
            failures.push({
                name,
                error: jsonError,
            });
        }
    }
    const totalCount = Object.keys(tests).length;
    const numPassed = totalCount - failures.length;
    console.log(`Finished: ${numPassed}/${totalCount} passed`);
    if (failures.length) {
        console.log(failures);
    }
    restoreConsole();
    ipc.send("done", failures, totalCount);
};

