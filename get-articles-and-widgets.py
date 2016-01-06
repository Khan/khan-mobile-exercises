from urllib2 import urlopen
from urllib2 import HTTPError
import json
from pprint import pprint
from sets import Set
import time

# Let's load up our list of article ids
with open('prototype-core/data-cache/all-article-ids.json') as allArticleIDsJSON:
    allArticleIDs = json.load(allArticleIDsJSON)

# How many article IDs do we have?
print "There are %.0f article IDs in our list." % len(allArticleIDs)

# articleID = "xf40319c9" # this article has widgets - use it for testing!
# articleID = allArticleIDs[0]

startTime = time.time()

articleSummaries = []
i = 0
articlesFoundWithWidgets = 0
totalWidgetsFound = 0
totalMalformedArticles = 0

for articleID in allArticleIDs:
    print "Fetching article with ID: " + articleID

    # Fetch the article...
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

        # we need to hold onto perseusContent to render articles - so let's do that:
        articleSummary["perseus_content"] = ""

        widgetsUsed = set([])
        if "perseus_content" in article:
            perseusContent = article["perseus_content"]
            if perseusContent is not None:
                if len(perseusContent) > 0:
                    articleContent = json.loads(perseusContent)
                    articleSummary["perseus_content"] = perseusContent
                    for contentPart in articleContent:
                        if "widgets" in contentPart:
                            contentPartWidgets = []
                            try:
                                contentPartWidgets = contentPart["widgets"]
                            except:
                                print "Hoo, I'm not quite sure what to do with this article. It's got some funky formatting. We'll skip it."
                                totalMalformedArticles += 1

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

        articleSummaries.append(articleSummary)

    # should we write to disk?
    if (i+1) % 20 == 0 and i > 0:
        # so, how far along are we?
        fractionComplete = float(i) / float(len(allArticleIDs))
        percentageComplete = float(fractionComplete * 100)
        minutesElapsed = (time.time() - startTime) / 60
        minutesRemaining = minutesElapsed / fractionComplete

        print "\n\n\n\n\n"
        print "**************************************************** PROGRESS SAVED TO DISK!"
        print "We're %.2f percent through..." % percentageComplete
        print "...we've fetched %.0f items..." % len(articleSummaries)
        print "...and it's taken %.1f minutes..." % minutesElapsed
        print "...at that rate, it'll be another %.1f hours." % minutesRemaining
        print "We've found %.0f articles with widgets..." % articlesFoundWithWidgets
        print "...and %.0f widgets in total." % totalWidgetsFound
        print "There were %.0f articles that I wasn't sure how to parse." % totalMalformedArticles
        print "You can quit any time, and progress to this point will be saved. You'll be able to design-in-the-browser with everything we've fetched so far."
        print "Back to your regularly-scheduled mundane printouts..."

        # ok ok that was fun, let's write to disk:
        open("/data-cache/article-summaries.json", "w").write(json.dumps(articleSummaries))

    #increment our counter, so we get neat-o printouts
    i += 1
