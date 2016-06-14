// AttributeFilter (id, displayName, active - defaults to false)
/*
Filters
	ContentType
	Domain
	Widgets
*/

// SearchFilter (string)

// DeviceFilter (displayName, width, height, iconName)

import "babel-polyfill"
import React from 'react'
import ReactDOM from 'react-dom'
import attributeFilters from "./attribute-filters";
import deviceFilters from "./device-filters";
import deepEquals from 'deep-equal'
// fetch polyfill
import 'whatwg-fetch'

import HeaderNav from "./header-nav";
import PreviewContainer from "./preview-container";

const cssFileName1 = "/prototype-core/public/css/css-overrides/version-1.css";
const cssFileName2 = "/prototype-core/public/css/css-overrides/version-2.css";

const toggleAttributeFilter = (id) => {
	Object.keys(attributeFilters).forEach(filterType => {
		const filters = attributeFilters[filterType];
		filters.forEach(filter => {
			if (filter.id === id) {
				filter.active = !filter.active;
			}
		});
	});
	renderApp();
};

const toggleDeviceFilter = (id) => {
	deviceFilters.forEach(deviceFilter => {
		if (deviceFilter.id === id) {
			deviceFilter.active = !deviceFilter.active;
		}
	});
	renderApp();
};

const getCSSFiles = (done) => {
	fetch('/css-files').then(response => response.json()).then(data => done(data))
};

// MARK: The Whole Enchilada

const ExerciseHarness = React.createClass({
	propTypes: {
		attributeFilters: React.PropTypes.object,   // TODO: use a proper shape
		onAttributeFilterToggled: React.PropTypes.func,
		deviceFilters: React.PropTypes.array,
		onDeviceFilterToggled: React.PropTypes.func,
		assessmentItems: React.PropTypes.array,
		initialCssFiles: React.PropTypes.object,
		onCSSFileChosen: React.PropTypes.func,
		previewScales: React.PropTypes.arrayOf(React.PropTypes.number),
	},

	getInitialState() {
		return {
			currentCSSFile: "",
			cssFiles: this.props.initialCssFiles,
			currentPreviewScale: this.props.previewScales[0],
			currentSearchString: "",
		}
	},

	componentDidMount() {
		this._tick = setInterval(this.checkCss.bind(this), 500);
	},

	checkCss() {
		getCSSFiles((cssFiles) => {
			if (!deepEquals(cssFiles, this.state.cssFiles)) {
				this.setState({cssFiles});
			}
		})
	},

	componentWillUnmount() {
		clearInterval(this._tick);
	},

	render() {
		return <div>
		  <HeaderNav
				attributeFilters={this.props.attributeFilters}
				onAttributeFilterToggled={this.props.onAttributeFilterToggled}
				deviceFilters={this.props.deviceFilters}
				onDeviceFilterToggled={this.props.onDeviceFilterToggled}
				cssFileNames={Object.keys(this.state.cssFiles)}
				currentCSSFile={this.state.currentCSSFile}
				onCSSFileChosen={newCssFile => this.setState({currentCSSFile: newCssFile})}
				currentSearchString={this.state.currentSearchString}
				onSearchStringChange={newSearchString => this.setState({currentSearchString: newSearchString, })}
			/>
		  <PreviewContainer
				attributeFilters={this.props.attributeFilters}
				deviceFilters={this.props.deviceFilters}
				assessmentItems={this.props.assessmentItems}
				currentCSSOverride={this.state.cssFiles[this.state.currentCSSFile]}
				previewScales={this.props.previewScales}
				currentPreviewScale={this.state.currentPreviewScale}
				onPreviewScaleChange={newScale => this.setState({currentPreviewScale: newScale})}
				currentSearchString={this.state.currentSearchString}
				/>
		</div>
	}
})

// MARK: Render

const renderApp = (initialCssFiles) => {
	ReactDOM.render(<ExerciseHarness
		initialCssFiles={initialCssFiles}
		attributeFilters={attributeFilters}
		onAttributeFilterToggled={toggleAttributeFilter}
		deviceFilters={deviceFilters}
		onDeviceFilterToggled={toggleDeviceFilter}
		assessmentItems={window.ASSESSMENT_ITEMS}
		cssFileNames={[cssFileName1, cssFileName2]}
		previewScales={[0.25, 0.50, 0.75, 1.0]}
	/>,
	document.getElementById("container"))
};

getCSSFiles(initialCssFiles => {
	renderApp(initialCssFiles);
});
