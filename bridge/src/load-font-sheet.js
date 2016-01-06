/**
 * Fonts are loaded by iOS automatically (via Resources/Info.plist), so
 * we have to add them ourselves here for things to look right.
 */

export default iframe => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/bridge/static/fonts.css";
    iframe.contentDocument.head.appendChild(link);
};

