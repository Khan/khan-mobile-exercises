/**
 * Create & initialize an iframe for testing. Currently this mirrors iPad
 * behavior, in that perseus is fetched from the web.
 */

import getExerciseURL from "./get-exercise-url";
import loadFontSheet from "./load-font-sheet";

export default iframe => {
    return new Promise((resolve, reject) => {
      iframe.addEventListener("load", () => {
          loadFontSheet(iframe);
          const waiter = setInterval(() => {
            if (!iframe.contentWindow) {
              clearInterval(waiter);
              return reject(new Error("Iframe was deleted"));
            }
            if (!iframe.contentWindow.setupOAuth || !iframe.contentWindow.jsExerciseAPI) {
              return
            }
            clearInterval(waiter);

            iframe.contentWindow.setupOAuth("webapp://", {});
            iframe.contentWindow.jsExerciseAPI.scrollToWithAnimation(0, 0, 0.0);
            iframe.contentWindow.jsExerciseAPI.setMinimumPageSize(0.0, 0.0);
            resolve({
                jsExerciseAPI: iframe.contentWindow.jsExerciseAPI,
                iframe,
            });
          }, 100);
      });

      iframe.src = getExerciseURL();
    });
};
