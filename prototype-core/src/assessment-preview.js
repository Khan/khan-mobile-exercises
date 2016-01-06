import React from 'react'
import ReactDOM from 'react-dom'

const ExercisePreview = React.createClass({
	propTypes: {
		deviceFilters: React.PropTypes.arrayOf(React.PropTypes.object), // TODO: use a proper shape
		currentCSSOverride: React.PropTypes.string,
		currentPreviewScale: React.PropTypes.number,
		assessmentItem: React.PropTypes.object,
	},

	renderDevices() {
		var devices = [];
		let leftOffset = 0;
		let width = 0;
		let maxHeight = 0;
		const padding = 8;
		this.props.deviceFilters.forEach(deviceFilter => {
			const active = deviceFilter.active;
			if (!active) {
				return;
			}
			let Component;
			let dimensions;
			switch (deviceFilter.id) {
				case "phone":
					Component = MobilePreview;
					dimensions = iPhoneDimensions;
					break;
				case "tablet":
					Component = MobilePreview;
					dimensions = iPadDimensions;
					break;
				case "laptop":
					Component = BrowserPreview;
					dimensions = LaptopDimensions;
					break;
				case "desktop":
					Component = BrowserPreview;
					dimensions = DesktopDimensions;
					break;
				default:
					break;
			}
			let deviceWidth = dimensions.width * this.props.currentPreviewScale;
			let deviceHeight = dimensions.height * this.props.currentPreviewScale;
			width += deviceWidth + padding;
			if (deviceHeight > maxHeight) {
				maxHeight = deviceHeight;
			}
			devices.push(
				<Component
					key={deviceFilter.id}
					left={leftOffset}
					deviceDimensions={dimensions}
					currentCSSOverride={this.props.currentCSSOverride}
					currentPreviewScale={this.props.currentPreviewScale}
					assessmentItem={this.props.assessmentItem}
				/>
			)
			leftOffset += deviceWidth + padding;
		});
		let height;
		if (!devices.length) {
			width = 120;
			height = 80;
		} else {
			height = maxHeight + padding;
		}
		return {devices, width: width, height: height};
	},

	render() {
		// Go through the device filters and enable or disable them as needed.

		const {devices, width, height} = this.renderDevices();
		return <div className="exercise-preview" style={{
				width: width,
			}}>
				<div className="device-preview-container" style={{
						width: width,
						height: height,
						position: 'relative',
					}}>
					{devices}
					{!devices.length && <ErrorPreview />}
				</div>
			<ExercisePreviewDescription
				name={this.props.assessmentItem.container.name}
				id={this.props.assessmentItem.container.key_id}
				/>
			</div>

	}
})

import setupIframe from "../../bridge/src/setup"

const iPadDimensions = {
	width: 600,
	height: 960
};

const iPhoneDimensions = {
	width: 320,
	height: 480
}

function scaleHtml(htmlStyle, dimensions, scale) {
	//htmlStyle.width = dimensions.width + 'px';
	//htmlStyle.height = dimensions.height + 'px';
	htmlStyle.transformOrigin = '0 0 0';
	htmlStyle.transform = 'scale(' + scale + ')';
}

function addOverrideCSS(iframe, cssStyle) {
	if (!iframe.contentWindow._css_override) {
		const style = document.createElement('style');
		iframe.contentDocument.head.appendChild(style);
		iframe.contentWindow._css_override = style;
	}
	iframe.contentWindow._css_override.textContent = cssStyle;
}

function doesContentOverflowBounds(iframe) {
		return (iframe.contentDocument.body.scrollWidth > iframe.contentDocument.body.offsetWidth);
}

function snakeToCamel(name) {
	return name.replace(/_[a-z]/g, match => match.slice(1).toUpperCase())
}

function saintPatrickTheSnakes(object) {
	const newObject = {};
	for (const name in object) {
		newObject[snakeToCamel(name)] = object[name];
	}
	return newObject;
}

function getUserExercise(container) {
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

const MobilePreview = React.createClass({
	propTypes: {
		left: React.PropTypes.number,
		deviceDimensions: React.PropTypes.object,
		currentCSSFile: React.PropTypes.string,
		currentPreviewScale: React.PropTypes.number,
		assessmentItem: React.PropTypes.object,
	},

	getInitialState(){
		return {doesContentOverflowBounds: false,}
	},

  componentDidMount() {
		const iframe = ReactDOM.findDOMNode(this);
		scaleHtml(iframe.style, this.props.deviceDimensions, this.props.currentPreviewScale);
    this._renderIframe();
  },
  componentDidUpdate() {
		const iframe = ReactDOM.findDOMNode(this);
		scaleHtml(iframe.style, this.props.deviceDimensions, this.props.currentPreviewScale);
		// TODO once we have individual exercises, check to see if the exercise changed,
		// and only do `_renderIframe` if it did.
    // this._renderIframe();
		this._updateIframe();
  },
  _renderIframe() {
		const iframe = ReactDOM.findDOMNode(this);
    setupIframe(iframe).then(({jsExerciseAPI, iframe}) => {
			if (!iframe.parentNode) {
				return;
			}
			const {container, assessment_item} = this.props.assessmentItem;
			iframe.contentWindow.Calculator = {};
			jsExerciseAPI.loadNewExercise({"userExercise": getUserExercise(container)}, 0, null, saintPatrickTheSnakes(assessment_item));
      this._updateIframe();
    })
  },
	_updateIframe() {
		const iframe = ReactDOM.findDOMNode(this);
		const htmlStyle = iframe.contentDocument.documentElement.style
		this.addOverrideCSS(iframe)
	},
	addOverrideCSS(iframe) {
		const cssOverrides = this.props.currentCSSOverride;
		addOverrideCSS(iframe, cssOverrides);
		setTimeout(() => {
			this.checkContentOverflow(iframe);
		}, 100);
	},
	checkContentOverflow(iframe) {
		this.setState({doesContentOverflowBounds: doesContentOverflowBounds(iframe)})
	},
	render() {
		return <iframe className="device-preview device-preview-tablet" style={{
				width: this.props.deviceDimensions.width,
				height: this.props.deviceDimensions.height,
				position: 'absolute',
				top: 0,
				left: this.props.left,
				border: this.state.doesContentOverflowBounds ? '3px solid red' : 'none',
			}}></iframe>
	}
})

const BrowserPreview = React.createClass({
	propTypes: {
		left: React.PropTypes.number,
		deviceDimensions: React.PropTypes.object,   // TODO: use a proper shape
		currentCSSFile: React.PropTypes.string,
		currentPreviewScale: React.PropTypes.number,
		assessmentItem: React.PropTypes.object,
	},
	componentDidMount() {
		const iframe = ReactDOM.findDOMNode(this);
		scaleHtml(iframe.style, this.props.deviceDimensions, this.props.currentPreviewScale);
    this._renderIframe();
  },
  componentDidUpdate() {
		const iframe = ReactDOM.findDOMNode(this);
		scaleHtml(iframe.style, this.props.deviceDimensions, this.props.currentPreviewScale);
		// TODO once we have individual exercises, check to see if the exercise changed,
		// and only do `_renderIframe` if it did.
    // this._renderIframe();
		this._updateIframe();
  },
  _renderIframe() {
		const iframe = ReactDOM.findDOMNode(this);
		setupIframe(iframe).then(({jsExerciseAPI, iframe}) => {
			if (!iframe.parentNode) {
				return;
			}
			const {container, assessment_item} = this.props.assessmentItem;
			iframe.contentWindow.Calculator = {};
			jsExerciseAPI.loadNewExercise({"userExercise": getUserExercise(container)}, 0, null, saintPatrickTheSnakes(assessment_item));
			this._updateIframe();
		})
  },
	_updateIframe() {
		const iframe = ReactDOM.findDOMNode(this);
		const htmlStyle = iframe.contentDocument.documentElement.style;
		this.addOverrideCSS(iframe)
	},
	addOverrideCSS(iframe) {
		const cssOverrides = this.props.currentCSSOverride;
		addOverrideCSS(iframe, cssOverrides);
	},
	render() {
		return <iframe className="device-preview device-preview-browser" style={{
				width: this.props.deviceDimensions.width,
				height: this.props.deviceDimensions.height,
				position: 'absolute',
				top: 0,
				left: this.props.left,
			}}></iframe>
	}
})

const LaptopDimensions = {
	width: 1024,
	height: 768
}

const DesktopDimensions = {
	width: 1600,
	height: 1024
}

const ErrorPreview = React.createClass({
	render() {
		return <div className="device-preview-error">No Devices Selected</div>
	}
})

const ExercisePreviewDescription = React.createClass({
	propTypes: {
			name: React.PropTypes.string,
			id: React.PropTypes.string,
	},

	render() {
		return <div className="exercise-preview-description">
			<div className="exercise-preview-name">{this.props.name}</div>
			<div className="exercise-preview-id">{this.props.id}</div>
			</div>
	}
})

export default ExercisePreview
