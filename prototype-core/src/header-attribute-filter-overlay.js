
import React from 'react';

const HeaderAttributeFilterOverlay = React.createClass({
	propTypes: {
		attributeFilters: React.PropTypes.object,
		onAttributeFilterToggled: React.PropTypes.func
	},

	render() {
		// Removed these for now - they don't do anything!
		/*
		<FilterCollection
			collectionTitle="Content Type"
			attributeFilters={this.props.attributeFilters.contentType}
			onAttributeFilterToggled={this.props.onAttributeFilterToggled}
		/>
		<FilterCollection
			collectionTitle="Domain"
			attributeFilters={this.props.attributeFilters.domain}
			onAttributeFilterToggled={this.props.onAttributeFilterToggled}
		/>
		*/

		return <div className="overlay filter-overlay">
			<FilterCollection
				collectionTitle="Widgets"
				attributeFilters={this.props.attributeFilters.widgetType}
				onAttributeFilterToggled={this.props.onAttributeFilterToggled}
			/>
		</div>
	}
})

const FilterCollection = React.createClass({
	propTypes: {
		attributeFilters: React.PropTypes.arrayOf(React.PropTypes.object),
		onAttributeFilterToggled: React.PropTypes.func
	},

	render() {
		const filterCheckboxes = this.props.attributeFilters.map(filterItem => {
			return <FilterCollectionListItem
				key={filterItem.id}
				title={filterItem.displayName}
				active={filterItem.active}
				onClick={() => {this.props.onAttributeFilterToggled(filterItem.id);}} />
			});

		return <div className="filter-collection">
			<div className="filter-collection-title">{this.props.collectionTitle}</div>
			<div className="filter-collection-list">{filterCheckboxes}</div>
		</div>
	}
})

const FilterCollectionListItem = React.createClass({
	render() {
		return <div className="filter-collection-list-item" onClick={this.props.onClick} >
		<img className="checkbox" src={this.props.active ? "resources/images/checkbox-filled.png" : "resources/images/checkbox-empty.png"}/>
		{this.props.title}
		</div>
	}
})

export default HeaderAttributeFilterOverlay;
