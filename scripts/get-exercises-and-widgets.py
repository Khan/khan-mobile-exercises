

from urllib2 import urlopen
import json
from pprint import pprint
from sets import Set
import time

## Jared's POC
# raw = urlopen("http://www.khanacademy.org/api/internal/exercises/counting-out-1-20-objects/assessment_items").read()
# data = json.loads(raw)
# open("outfile", "w").write(json.dumps(data))

## First, let's load up the JSON from our file.
with open('prototype-core/data-cache/exercises.json') as exercises_data_file:
    exercises = json.load(exercises_data_file)

# How many exercises do we have?
print "\n"
print "There are " + str(len(exercises)+1) + " exercises in exercises.json"
print "\n"
print "This... may take awhile. Just leave this thing running as long as you like."
print "Progress is saved every 20 items, so no worries if you bail out early."
print "If you bail out early, you won't have ALL exercises loaded - but you're probably Just Fine Without All Of The Exercises."
print "\n\n\n"
time.sleep(1)
print "OK, a REALLY IMPORTANT ANNOUNCEMENT:"
print "This will overwrite exercise-summaries.json - so be really sure you want to do this! I'll wait..."
time.sleep(1)
print "I'm assuming your silence means 'ok, computer, go do your thing'?"
time.sleep(1)
print "ok ok - here we go!"
time.sleep(1)
print "*steps on gas pedal, screams off into the computerhorizon*"
time.sleep(1)

startTime = time.time()

# We're going to make an "exercise summary" for each exercise, so we can quickly look up
exerciseSummaries = []
i = 0
for exercise in exercises:
    print ""
    print "Fetching item " + str(i+1) + " of " + str(len(exercises)+1) + "..."

    # Let's build a little exercise summary! This will help us lookup exercises that contain a given widget.
    exerciseSummary = {}
    # TODO: Re-add "all_assessment_items" to this list - we'll want it later on!
    keysToKeep = ["id", "description", "display_name", "content_kind", "node_slug"]
    for key in keysToKeep:
        exerciseSummary[key] = exercise[key]

    # Hanging off of an exercise is a list of "all_assessment_items" - when we fetch each from the API, we'll be able to tell which widgets they contain.
    # So: let's loop through each assessmentItem, fetch its widgets, and keep the unique ones!
    widgetsUsed = set([])
    exerciseSummary["fetched_assessment_items"] = []
    for assessmentItem in exercise["all_assessment_items"]:
        # URL path for fetching an assessment item: /api/internal/assessment_items/xbc27f71b?version=live
        assessmentItemURL = "http://www.khanacademy.org/api/internal/assessment_items/" + assessmentItem["id"] + "?version=live"
        assessmentItemRaw = urlopen(assessmentItemURL).read()
        assessmentItemData = json.loads(assessmentItemRaw)

        # we hold onto the raw assessment items for rendering, too:
        # TODO: We'll need to hold on to assessment items to render - uncomment this line once we've got basics working!
        # exerciseSummary["fetched_assessment_items"].append(assessmentItemRaw)

        question = json.loads(assessmentItemData["itemData"])["question"]

        if "widgets" in question:
            for widgetKey in question["widgets"]:
                # e.g. "radio 1" - let's trim the "1"
                spaceLocation = widgetKey.find(" ")
                widgetKind = widgetKey[:spaceLocation]

                # now we add the widgetKind to our set - meaning we wind up with only the unique ones!
                widgetsUsed.add(widgetKind)

    # ok ok - so now we've built up our set of unique widgets for this exercise - let's turn that into a list, and add it to our exercise summary.
    listOfWidgets = list(widgetsUsed)
    exerciseSummary["widgets"] = listOfWidgets

    # just for printing's sake - let's make a summary of the widgets used:
    widgetSummary = ""
    for (idx, widgetTitle) in enumerate(listOfWidgets):
        if idx > 0:
            widgetSummary += ", "
        widgetSummary += widgetTitle

    # what does this exercise look like?
    print "id:              " + exerciseSummary["id"]
    print "title:           " + exerciseSummary["display_name"]
    print "desc:            " + exerciseSummary["description"]
    print "type:            " + exerciseSummary["content_kind"]
    print "slug:            " + exerciseSummary["node_slug"]
    print "widgets:         " + widgetSummary

    # now we add it to our cache!
    exerciseSummaries.append(exerciseSummary)

    # should we write to disk?
    if (i+1) % 20 == 0 and i > 0:
    # if 1==1:
        # so, how far along are we?
        # fractionComplete = float(i) / float(len(exercises))
        # percentageComplete = float(fractionComplete * 100)
        # minutesElapsed = (time.time() - startTime) / 60
        # hoursRemaining = minutesElapsed / fractionComplete / 60

        print "\n\n\n\n\n"
        print "**************************************************** PROGRESS SAVED TO DISK!"
        # print "We're %.2f percent through..." % percentageComplete
        print "...we've fetched %.0f items..." % len(exerciseSummaries)
        # print "...and it's taken %.1f minutes..." % minutesElapsed
        # print "...at that rate, it'll be another %.1f hours." % hoursRemaining
        print "But! You can quit any time, and progress to this point will be saved. You'll be able to design-in-the-browser with everything we've fetched so far."
        print "Back to your regularly-scheduled mundane printouts..."

        # ok ok that was fun, let's write to disk:
        open("prototype-core/data-cache/exercise-summaries.json", "w").write(json.dumps(exerciseSummaries))

    #increment our counter, so we get neat-o printouts
    i += 1
