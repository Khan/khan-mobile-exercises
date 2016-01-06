/**
 * Construct the URL for the iframe, which is the same one we load in the
 * webview.
 * TODO(jared): think about caching these?
 */

// TODO(benkomalo): This is duplicated in several places and needs to be
// consolidated. For now, updating this requires updating
// PerseusProblemRequestOperation.swift, and updating the contents in
// "Resources/webview/"
const perseusMajorVersion = 5;
const baseResourceUrl =
    "https://www.khanacademy.org/api/internal/ios/static_redirect";
export const perseusPackageUrl =
    `${baseResourceUrl}/perseus-mobile-${perseusMajorVersion}`;
export const perseusStylesheetUrl =
    `${baseResourceUrl}/mobile-exercise-content-${perseusMajorVersion}.css`;
const exercisesViewUrl = "templates/exercise-view.html";
const articlesViewUrl = "templates/article-view.html";

// NOTE(benkomalo): the "platform" and "lang" parameters are required
// by the webview resources; if they need changing here, they'll likely
// need changing in KAArticleViewController and ExerciseTaskWebViewController
// if you update here.
export const getExerciseURL = () => {
    return `/mobile-client-webview-resources/${exercisesViewUrl}?\
perseusPackageURL=${encodeURIComponent(perseusPackageUrl)}&\
perseusStylesheetURL=${encodeURIComponent(perseusStylesheetUrl)}&\
platform=ios&\
lang=en`;
};

export const getArticleUrl = () => {
  return `/mobile-client-webview-resources/${articlesViewUrl}`;
}
