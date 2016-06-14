import React from 'react'
import ReactDOM from 'react-dom'
import setupIframe from "../../bridge/src/setup"
import {
  scaleHtml,
  addOverrideCSS,
  doesContentOverflowBounds,
  snakeToCamel,
  saintPatrickTheSnakes,
  getUserExercise,
} from './utils'

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

export default BrowserPreview
