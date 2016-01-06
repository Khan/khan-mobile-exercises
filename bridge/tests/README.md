
# Here are the jsExerciseAPI methods:

## from mobileExerciseWebViewAPI
```
loadNewExercise
validateInputs
showNextProblem
showNextHint
hitTestAtPoint
setMinimumPageSize
scrollToWithAnimation
skipCurrentProblem
```

## from frameworkAPI
```
setCurrentExercise
focusNextInput
focusPrevInput
numberOfInputs
setTextInputValue
scrollInputFieldOnscreen
showDrawingIndicator
hideDrawingIndicator
blurFocusedInput
```

## And the subset used by the iOS app
```
# Lifecycle (mobileExerciseWebViewAPI)
loadNewExercise (exercise, taskId, userMissionId, item)
showNextProblem (item) # evt
skipCurrentProblem # click

# Text input (frameworkAPI)
focusPrevInput
focusNextInput
blurFocusedInput
numberOfInputs
showDrawingIndicator
hideDrawingIndicator
setTextInputValue
scrollInputFieldOnscreen

# Scratchpad (mobileExerciseWebViewAPI)
scrollToWithAnimation
setMinimumPageSize
hitTestAtPoint

# Hints (mobileExerciseWebViewAPI)
showNextHint # click

# Etc (mobileExerciseWebViewAPI)
validateInputs # click
```

# The States we can be in

- nothing loaded
- problem loaded
  - not completely filled out
  - filled out wrong
  - filled out right
  *
  - no hints shown
  - [n of m] hints shown

# Learnings & Bugs

## The JavaScript side doesn't maintain invariants at the moment
You can say "go to next problem" even w/o skipping or getting it right.

## Other bugs

- "skip problem" triggers preconditions check?


