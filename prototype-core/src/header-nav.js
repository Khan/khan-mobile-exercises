import React from 'react'
import HeaderAttributeFilterOverlay from "./header-attribute-filter-overlay";
import HeaderCSSChooserDropdown from "./header-css-chooser";
import NumberOptionDropdown from "./option-dropdown";

const HeaderNav = React.createClass({
	propTypes: {
		attributeFilters: React.PropTypes.object,   // TODO: use a proper shape
		onAttributeFilterToggled: React.PropTypes.func,
		deviceFilters: React.PropTypes.arrayOf(React.PropTypes.object), // TODO: use a proper shape
		onDeviceFilterToggled: React.PropTypes.func,
		cssFileNames: React.PropTypes.arrayOf(React.PropTypes.string),
		currentCSSFile: React.PropTypes.string,
		onCSSFileChosen: React.PropTypes.func,
		currentSearchString: React.PropTypes.string,
		onSearchStringChange: React.PropTypes.func,
	},

	getInitialState() {
		return {
			filtersOpen: false,
		}
	},

	render() {
		return <div className="header-nav">
			<HeaderFilterToggle
				open={this.state.filtersOpen}
				onToggle={() => this.setState({filtersOpen: !this.state.filtersOpen})}
			/>
		{this.state.filtersOpen ? <HeaderSearchBar currentSearchString={this.props.currentSearchString} onSearchStringChange={this.props.onSearchStringChange}/> : <HeaderFilterDescription attributeFilters={this.props.attributeFilters} currentSearchString={this.props.currentSearchString} />}
			<HeaderCSSChooserDropdown
				cssFileNames={this.props.cssFileNames}
				currentCSSFile={this.props.currentCSSFile}
				onChange={this.props.onCSSFileChosen}
			/>
			<HeaderDeviceToggles
				deviceFilters={this.props.deviceFilters}
				onDeviceFilterToggled={this.props.onDeviceFilterToggled}
			/>
			{this.state.filtersOpen && <HeaderAttributeFilterOverlay
				attributeFilters={this.props.attributeFilters}
				onAttributeFilterToggled={this.props.onAttributeFilterToggled}
			/>}
		</div>
	}
})

const HeaderFilterToggle = React.createClass({ // TODO: Rename to "HeaderShowHideFilterButton"
	propTypes: {
		open: React.PropTypes.bool,
		onToggle: React.PropTypes.func,
	},

	render() {
		return <button className="toggle-button" onClick={this.props.onToggle}>
			<img className="filter-toggle-arrow" src={this.props.open ? "resources/images/arrow-up.png" : "resources/images/arrow-down.png"}/>
			{this.props.open ? 'Apply Filters' : 'Edit Filters'}
		</button>
	}
})

const HeaderSearchBar = React.createClass({
	propTypes: {
			currentSearchString: React.PropTypes.string,
			onSearchStringChange: React.PropTypes.func,
	},

	render() {
		return <input
			className="search-field"
			type="text"
			value={this.props.currentSearchString}
			onChange={evt => this.props.onSearchStringChange(evt.target.value)}
			placeholder="Search by pasting in an exercise ID or slug"
		/>
	}
})

const HeaderFilterDescription = React.createClass({
	propTypes: {
		attributeFilters: React.PropTypes.object,
		currentSearchString: React.PropTypes.string,
	},

	render() {
		const activeWidgets = this.props.attributeFilters.widgetType.filter( filter => {
			return filter.active == true;
		});

		var headerDescriptionText = "No filters applied - showing all assessment items.";
		if (this.props.currentSearchString.length > 0) {
			headerDescriptionText = "Showing assessment items for exercise with id or slug: " + this.props.currentSearchString
		} else if (activeWidgets.length > 0) {
			var activeWidgetsDescription = activeWidgets.reduce((summary, item) => {
			return summary + item.displayName + ", "
			}, "")
			activeWidgetsDescription = activeWidgetsDescription.substring(0, activeWidgetsDescription.length - 2);

			headerDescriptionText = "Filters applied: showing assessment items that contain all of these widgets and no others: " + activeWidgetsDescription;
		}

		/* Showing <span className="text-highlight">Articles</span> in <span className="text-highlight">Chemistry</span> that contain <span className="text-highlight">Multiple Choice</span> or <span className="text-highlight">Number Input</span> widgets (4,284 nodes) */
		return <div id="filter-description">
		{headerDescriptionText}
		</div>
	}
})

const HeaderDeviceToggles = React.createClass({
	propTypes: {
		deviceFilters: React.PropTypes.arrayOf(React.PropTypes.object),
		onDeviceFilterToggled: React.PropTypes.func,
	},

	render() {
		const deviceFilters = this.props.deviceFilters.map(deviceFilter => {
			return <DeviceFilter key={deviceFilter.id} deviceFilter={deviceFilter} onDeviceFilterToggled={this.props.onDeviceFilterToggled}/>
		});

		return <div id="device-filters-container">{deviceFilters}</div>
	}
})

const DeviceFilter = React.createClass({
	propTypes: {
		deviceFilter: React.PropTypes.object, // TODO: Use a proper shape
		onDeviceFilterToggled: React.PropTypes.func
	},

	render() {
		return <div className="device-filter" onClick={() => {this.props.onDeviceFilterToggled(this.props.deviceFilter.id);}}>
				<img className="device-filter-image"
					src={this.props.deviceFilter.active ? this.props.deviceFilter.activeImage : this.props.deviceFilter.image}
				/>
		</div>
	}
})

export default HeaderNav
