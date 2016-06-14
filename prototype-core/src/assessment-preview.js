import React from 'react'
import ReactDOM from 'react-dom'

import BrowserPreview from './browser-preview'
import MobilePreview from './mobile-preview'

const iPadDimensions = {
	width: 600,
	height: 960
};

const iPhoneDimensions = {
	width: 320,
	height: 480
}

const LaptopDimensions = {
	width: 1024,
	height: 768
}

const DesktopDimensions = {
	width: 1600,
	height: 1024
}

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
				aid={this.props.assessmentItem.assessment_item_id}
				/>
			</div>
	}
})

const ErrorPreview = React.createClass({
	render() {
		return <div className="device-preview-error">No Devices Selected</div>
	}
})

const ExercisePreviewDescription = React.createClass({
	propTypes: {
			name: React.PropTypes.string,
			id: React.PropTypes.string,
			aid: React.PropTypes.string,
	},

	render() {
		return <div className="exercise-preview-description">
			<a
				target="_blank"
				href={"https://khanacademy.org/e/" + this.props.name}
				className="exercise-preview-name"
			>
				{this.props.name}
			</a>
			<div className="exercise-preview-id">{this.props.id}</div>
      {this.props.aid}
		</div>
	}
})

export default ExercisePreview
