# khan-mobile-exercises
Edit our CSS to make exercises and articles work great on mobile devices.

We're working to make our wonderful exercises and articles render nicely on mobile devices. This is a challenging task - we have thousands of assessment items, and the design has to work for all of them!

To aid in this effort, we've built a little tool that renders assessment items in mobile-sized iframes with CSS overrides to make 'em look better on mobile devices! It looks something like this:
![screenshot of tool](http://clrk.it/gUe1+)

With the tool, you can:
 - download and cache the first assessment item of each type of each exercise
 - download and cache all articles
 - edit a CSS file in your favorite text editor, and see live updates in the browser
 - adjust the preview size of the exercises
 - search for items that contain particular widgets or exercise slugs

The really neat part: live CSS updates! You can either (a) change which CSS file is loaded, like so:
![updates as you change CSS files](http://clrk.it/oz8y+)

... or (b) you get live-updates-as-you-save-in-a-text-editor, like so:
![updates as you save changes to CSS files](http://clrk.it/cEDD+)

## Setting it Up
There are two parts to using the tool: the **initial setup** (takes a few minutes) and then to **start it up**, you’ll need to run a couple of commands (only takes a few seconds).

0. **Initial Setup** _(you’ll only need to do this once)_: 
	1. **Grab a cache of exercises and articles** that the harness will then search, filter, and render. _(NOTE: If you already see `first-items.js` in the `data` directory of the project, no need to repeat this process!)_ You have two options here:
		* Option A: Grab an existing cache from Dropbox. You can find it in `/Projects/Exercises redesign/2 - Imagine/Bryan/Data for Prototyping Tool/first-items.js` (or ask Bryan). Put it in the root directory of this project. It's ~160MB.
		* Option B: Build a fresh cache from devshell. See instructions at the bottom of this README.
	2. **Install this project's dependencies:** run `git submodule update --init --recursive`
1. **Start it Up** _(you’ll need to do this each time you want to start using the harness - like, at the start of your day.)_
	2. In Terminal, navigate to the root directory of this project.
	3. Type in `npm start` to get the server up and running - this hosts the harness, and watches for CSS changes.
	4. **NOTE:** (If you get an error about "express"): type in `npm install`
	5. [for hacking on the tool] Open a new Terminal tab (it’ll remain in the directory) and type `npm run watch` to start watching for tweaks to the Javascript files that make up the harness
2. **Go Use It**: Visit `http://localhost:3050/` (preferably in Chrome, but Safari works, too!) and enjoy!

## How do I make CSS changes?
To modify the CSS overrides, create a `.css` file in `/prototype-core/public/css/css-overrides/` directory. You’ll then see it in the dropdown menu in the harness. Select it in the harness’ dropdown, and then any and all changes you make will be applied immediately! _(Tip: try doing `body { background-color: blue!important; }` to make sure it’s working.)_

## FOOTNOTE: Building a fresh first-items.js cache
**NOTE this is not actually working at the moment**

1. Start up webapp on your local machine (in `khan/webapp`, type `make serve` into a Terminal window, and leave it open.
2. In another Terminal window, go to the root directory of this project; type in this series of commands (Note: `>>>` is the Python prompt - don’t type that part in!):
		`python ~/khan/webapp/tools/devshell.py`
		`>>> import sys`
		`>>> sys.path.append('.')`
		`>>> import get_exercises_from_devshell`
		`>>> get_exercises_from_devshell.do_everything()`
	This will build a little cache of exercises and articles - confirm that `first-items.js` is in the root directory of this project.
