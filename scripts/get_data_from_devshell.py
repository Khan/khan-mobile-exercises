# coding: utf-8

import time
import cPickle

exercises = FrozenExercise.get_all()
assessment_items = {}

for exercise in exercises:
    for problem_type in exercise.problem_types:
        for item in problem_type['items']:
            if item['id'] not in assessment_items:
                assessment_items[item['id']] = None

start = time.time()
for exercise in exercises:
    for problem_type in exercise.problem_types:
        for item in problem_type['items']:
            if not assessment_items[item['id']]:
                assessment_items[item['id']] = AssessmentItem.get_by_id(item['id'])
end = time.time()
print end - start, "getting assessment items"

cPickle.dump(assessment_items, open('/Users/jared/khan/khan-mobile-exercises/assessment_items.pcl', 'wb'))
cPickle.dump(exercises, open('/Users/jared/khan/khan-mobile-exercises/exercises.pcl', 'wb'))
