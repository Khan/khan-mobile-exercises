
import url from "url";

export default request => {
    const parsedURL = url.parse(request.url);
    const data = JSON.parse(decodeURIComponent(parsedURL.query));
    data.pathname = parsedURL.pathname;
    return data;
};

