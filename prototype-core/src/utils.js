
export const scaleHtml = (htmlStyle, dimensions, scale) => {
	//htmlStyle.width = dimensions.width + 'px';
	//htmlStyle.height = dimensions.height + 'px';
	htmlStyle.transformOrigin = '0 0 0';
	htmlStyle.transform = 'scale(' + scale + ')';
}

export const addOverrideCSS = (iframe, cssStyle) => {
	if (!iframe.contentWindow._css_override) {
		const style = document.createElement('style');
		iframe.contentDocument.head.appendChild(style);
		iframe.contentWindow._css_override = style;
	}
	iframe.contentWindow._css_override.textContent = cssStyle;
}

export const doesContentOverflowBounds = (iframe) => {
		return (iframe.contentDocument.body.scrollWidth > iframe.contentDocument.body.offsetWidth);
}

export const snakeToCamel = (name) => {
	return name.replace(/_[a-z]/g, match => match.slice(1).toUpperCase())
}

export const saintPatrickTheSnakes = (object) => {
	const newObject = {};
	for (const name in object) {
		newObject[snakeToCamel(name)] = object[name];
	}
	return newObject;
}

export const getUserExercise = (container) => {
	return {
		"maximumExerciseProgress": {
			"mastered": 0,
			"practiced": 0,
			"level": "unstarted"
		},
		"user": "http://id.khanacademy.org/6f2848c236f94b5ea65ca5aec35514b4",
		"exercise": "unit-sense",
		"contentKind": "UserExercise",
		"practicedDate": null,
		"streak": 0,
		"longestStreak": 0,
		"secondsPerFastProblem": 4,
		"maximumExerciseProgressDt": null,
		"clearStrugglingIndicators": null,
		"lastMasteryUpdate": null,
		"totalDone": 0,
		"masteryPoints": 0,
		"MASTERY_CARD_SUPERPROMOTE_THRESHOLD": 0.85,
		"totalCorrect": 0,
		"kind": "UserExercise",
		"exerciseProgress": {
			"mastered": 0,
			"practiced": 0,
			"level": "unstarted"
		},
		"backupTimestamp": "2015-11-17T00:21:53Z",
		"exerciseModel": saintPatrickTheSnakes(container),
		"practiced": 0,
		"lastCountHints": 0,
		"exerciseStates": {
			"struggling": 0,
			"practiced": 0,
			"mastered": 0,
			"proficient": 0
		},
		"lastDone": null,
		"isSkillCheck": 0,
		"kaid": "kaid_584360796195036235986268",
		"proficientDate": null,
		"snoozeTime": null,
		"mastered": 0,
		"lastAttemptNumber": 0
	}
}


