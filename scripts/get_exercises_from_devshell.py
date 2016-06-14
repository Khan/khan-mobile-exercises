
# from content.exercise_models import FrozenExercise
import json
import time
# allExercises = FrozenExercise.get_all()

def assessment_item_json(item):
    data = item.to_dict()
    del data['edit_revision']
    del data['backup_timestamp']
    data['tags'] = [tag.id() for tag in data['tags']]
    return data

def clean_dict(dict):
    for key in dict.keys():
        try:
            json.dumps(dict[key])
        except Exception as e:
            del dict[key]
            continue
    return dict

def get_first_items(data):
    result = []
    for datum in data:
        print ".",
        ids = dict((item.id, item) for item in datum['items'])
        exercise = datum['exercise']
        for type in exercise.problem_types:
            if not len(type['items']):
                continue
            first_id = type['items'][0]['id']
            first_item = ids[first_id]
            first_json = assessment_item_json(first_item)
            perseus_content = json.loads(first_json['item_data'])
            ex_json =  vars(exercise)
            if 'creation_date' in ex_json:
                del ex_json['creation_date']
            if 'backup_timestamp' in ex_json:
                del ex_json['backup_timestamp']
            result.append({
                "assessment_item_id": first_id,
                "perseus_data": perseus_content,
                "assessment_item": clean_dict(first_json),
                "container": clean_dict(ex_json),
                "widgets": get_widgets_from_item_data(perseus_content),
            })

    return result

def convert_and_save(data, filename, few_filename):
    first_items = get_first_items(data)
    try:
        json.dump(first_items, open(filename, 'w'), indent=2)
        json.dump(first_items[:10], open(few_filename, 'w'), indent=2)
    except Exception as e:
        print e
    return first_items

def get_widgets_from_item_data(item_data):
    if "widgets" in item_data['question']:
        return parse_widgets(item_data['question']['widgets'])
    return []

def parse_widgets(widgets):
    widgetsUsed = set([])
    for widgetKey in widgets:
        # e.g. "radio 1" - let's trim the "1"
        spaceLocation = widgetKey.find(" ")
        widgetKind = widgetKey[:spaceLocation]

        # now we add the widgetKind to our set - meaning we wind up with only the unique ones!
        widgetsUsed.add(widgetKind)
    # ok ok - so now we've built up our set of unique widgets for this exercise - let's turn that into a list, and add it to our exercise summary.
    return list(widgetsUsed)

def get_widgets_from_article(perseus_content):
    all_widgets = []
    if type(perseus_content) not in (tuple, list):
        perseus_content = [perseus_content]
    for part in perseus_content:
        if not 'widgets' in part:
            continue
        all_widgets += parse_widgets(part['widgets'])
    return list(set(all_widgets))

def do_everything():
    """
    To Use:
    in this directory, do
    $ python ~/khan/webapp/tools/devshell.py (you need webapp running locally)
    >>> import sys
    >>> sys.path.append('.')
    >>> import get_exercises_from_devshell
    >>> get_exercises_from_devshell.do_everything()
    """
    import sys, os
    sys.path.append(os.path.expanduser('~/khan/webapp'))
    import cPickle
    all_exercise_data = cPickle.load(open(os.path.expanduser('~/khan/webapp/outpu.pcl')))
    print "loaded data"
    convert_and_save(all_exercise_data, "../data/first-items.json", "../data/few-items.json")

def clean_article(article):
    data = vars(article)
    perseus_content = json.loads(data['perseus_content'])

    return {
        "article_id": data['content_id'],
        "perseus_data": perseus_content,
        "container": clean_dict(data),
        "widgets": get_widgets_from_article(perseus_content),
    }

def get_articles():
    from content.article_models import FrozenArticle
    particles = [p for p in FrozenArticle.get_all() if p.is_particle]
    return [clean_article(article) for article in particles]

def convert_and_save_articles(all_filename, few_filename):
    articles = get_articles()
    json.dump(articles, open(all_filename, 'w'), indent=2)
    json.dump(articles[:10], open(few_filename, 'w'), indent=2)

def do_articles():
    import sys, os
    sys.path.append(os.path.expanduser('~/khan/webapp'))

    first_items = json.load(open('../data/first-items.json'))
    few_items = json.load(open('../data/few-items.json'))
    articles = get_articles()
    json.dump(articles + first_items, open("../data/articles-and-exercises.json", 'w'), indent=2)
    json.dump(articles[:10] + few_items, open("../data/few-articles-and-exercises.json", 'w'), indent=2)
