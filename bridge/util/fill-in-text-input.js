/**
 * Fill text into an input
 */

import getNextRequest from "./get-next-request";

export default async (jsExerciseAPI, value) => {
    const request = await getNextRequest("/textInputFocusChanged");
    const inputID = request.params.inputID;
    jsExerciseAPI.setTextInputValue(inputID, value);
};

