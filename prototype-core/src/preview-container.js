import React from 'react'

import ExercisePreview from "./assessment-preview";
import {NumberOptionDropdown, RangeDropdown} from "./option-dropdown";

const PreviewContainer = React.createClass({
	propTypes: {
		attributeFilters: React.PropTypes.object, // TODO: Use a proper shape
		deviceFilters: React.PropTypes.arrayOf(React.PropTypes.object), // TODO: use a proper shape
		assessmentItems: React.PropTypes.arrayOf(React.PropTypes.object), // TODO: use a proper shape
		currentCSSOverride: React.PropTypes.string,
		previewScales: React.PropTypes.arrayOf(React.PropTypes.number),
		currentSearchString: React.PropTypes.string,
	},

	getInitialState() {
		return {
			currentPreviewScale: this.props.previewScales[0],
			pageSizeOptions: [5, 10, 20, 30, 40, 50],
			currentPageSize: 5,
			currentPageIndex: 0,
		}
	},

	render() {
		const activeWidgetTypes = this.props.attributeFilters.widgetType.filter( filter => {
			return filter.active == true;
		});

		var filteredAssessmentItems = [];
		if (this.props.currentSearchString.length > 0) {
			// If we have a search term, then filter to only show assessmentItems with that ID.
			filteredAssessmentItems = this.props.assessmentItems.filter(item => {
				return item.container.key_id === this.props.currentSearchString ||
				item.container.name === this.props.currentSearchString;
			});

		} else if (activeWidgetTypes.length > 0) {
			// If we have active widgets selected in our filter UI, then only show corresponding assessment items.
			const activeWidgetsMap = activeWidgetTypes.reduce((map, item) => {
				map[item.id] = true
				return map
			}, {});

				filteredAssessmentItems = this.props.assessmentItems.filter(item => {
					/* If every item.widget entry is contained in activeWidgetsMap and NO OTHERS, then return `true`, else false */
					return item.widgets.every(widgetId => activeWidgetsMap[widgetId]) &&
					item.widgets.length == activeWidgetTypes.length;
			});
		} else {
			// Else, return the full set of assessment items.
			filteredAssessmentItems = this.props.assessmentItems;
		}

		const numberOfRanges = Math.ceil(filteredAssessmentItems.length / this.state.currentPageSize);
		var ranges = [];
		for (var i = 0; i < numberOfRanges; i++) {
			ranges[i] = [i * this.state.currentPageSize, Math.min((i+1)*this.state.currentPageSize, filteredAssessmentItems.length)];
		}

		// var assessmentItems = [];
		// if (activeWidgetTypes.length == 0) {
		// 	assessmentItems += this.props.assessmentItems
		// } else {
		// 	assessmentItems += this.props.assessmentItems.filter(item => {
		// 		return activeWidgetTypes.reduce(function(a, b, idx, array) {
		// 			return a && item.widgets.some(itemWidgetID => activeWidgetsMap[itemWidgetID]);
		// 		}, true);
		// 	});
		// }

		// const assessmentItems = activeWidgetTypes.length == 0 ?
		// this.props.assessmentItems : /* If there are no activeWidgetTypes, return the full set. */
		// this.props.assessmentItems.filter(item => {
		// 		/* "If activeWidgetsMap contains an entry for this widget ID, then return `true`, else false." */
		// 		return item.widgets.some(widgetId => activeWidgetsMap[widgetId]);
		// })

		const exercisePreviews = filteredAssessmentItems.slice(this.state.currentPageIndex * this.state.currentPageSize, (this.state.currentPageIndex + 1) * this.state.currentPageSize).map(item => {
			return <ExercisePreview
				deviceFilters={this.props.deviceFilters}
				assessmentItem={item}
				currentCSSOverride={this.props.currentCSSOverride}
				currentPreviewScale={this.state.currentPreviewScale}
				key={item.assessment_item_id}
			/>
		});

		return <div id="preview-container">
			<div className="preview-container-title">
				Showing
				<RangeDropdown
					allRanges={ranges
					}
					currentRange={this.state.currentPageIndex}
					onChange={newPageIndex => this.setState({currentPageIndex: newPageIndex})}
				/>
			of <span style={{padding: "0 4px"}}>{" " + filteredAssessmentItems.length + " "}</span> items, up to
				<NumberOptionDropdown
						allOptions={this.state.pageSizeOptions}
						value={this.state.currentPageSize}
						onChange={newPageSize => this.setState({currentPageSize: newPageSize, currentPageIndex: 0})}
					/>
				items at a time, at
				<NumberOptionDropdown
					allOptions={this.props.previewScales}
					value={this.state.currentPreviewScale}
					onChange={newScale => this.setState({currentPreviewScale: newScale})}
				/>
				scale.
			</div>
			{exercisePreviews}
		</div>
	}
})

export default PreviewContainer
