# article-test.py
from urllib2 import urlopen
from urllib2 import HTTPError
import json
from pprint import pprint
from sets import Set
import time

# Got a troubling article ID? put 'er there, pal:
articleID = "x7eb64d9f"


articleURL = "http://www.khanacademy.org/api/internal/articles/" + articleID

articleRaw = ""
try:
    articleRaw = urlopen(articleURL).read()
except HTTPError, e:
    print "Failed to fetch article with ID: " + articleID
    print "Failed with error code - %s" % e.code

if len(articleRaw) > 0:
    article = json.loads(articleRaw)

    articleSummary = {}
    keysToKeep = ["id", "description", "content_kind", "node_slug"]
    for key in keysToKeep:
        articleSummary[key] = article[key]

    # Articles have "titles", not "display_name", so we need to map it over nicely so we match our exercise formatting:
    articleSummary["display_name"] = article["title"]

    widgetsUsed = set([])
    if "perseus_content" in article:
        perseusContent = article["perseus_content"]
        if perseusContent is not None:
            if len(perseusContent) > 0:
                articleContent = json.loads(article["perseus_content"])

                for contentPart in articleContent:
                    if "widgets" in contentPart:
                        contentPartWidgets = []
                        try:
                            contentPartWidgets = contentPart["widgets"]
                        except:
                            print "Hoo, I'm not quite sure what to do with this article. It's got some funky formatting. We'll skip it."

                        if len(contentPartWidgets) > 0:
                            for widgetKey in contentPartWidgets:
                                # e.g. "radio 1" - let's trim the "1"
                                spaceLocation = widgetKey.find(" ")
                                widgetKind = widgetKey[:spaceLocation]

                                # now we add the widgetKind to our set - meaning we wind up with only the unique ones!
                                widgetsUsed.add(widgetKind)

    listOfWidgets = list(widgetsUsed)
    articleSummary["widgets"] = listOfWidgets

    if len(listOfWidgets) > 0:
        articlesFoundWithWidgets += 1
        totalWidgetsFound += len(listOfWidgets)

    # just for printing's sake - let's make a summary of the widgets used:
    widgetSummary = ""
    for (idx, widgetTitle) in enumerate(listOfWidgets):
        if idx > 0:
            widgetSummary += ", "
        widgetSummary += widgetTitle

    # what does this article look like?
    # print "id:              " + articleSummary["id"]
    print "title:           " + articleSummary["display_name"]
    # print "desc:            " + articleSummary["description"]
    # print "type:            " + articleSummary["content_kind"]
    # print "slug:            " + articleSummary["node_slug"]
    print "widgets:         " + widgetSummary

    # now we add it to our cache!
    articleSummaries.append(articleSummary)
