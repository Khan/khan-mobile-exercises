import React from 'react'

export const NumberOptionDropdown = React.createClass({
	propTypes: {
		allOptions: React.PropTypes.arrayOf(React.PropTypes.number),
		currentOption: React.PropTypes.number,
		onChange: React.PropTypes.func,
	},

	render() {
		const optionElements = this.props.allOptions.map(option => {
			const stringOption = option.toString();
			return <option value={option}>{stringOption}</option>
		});

		return <div className="option-dropdown-container">
			<select className="option-dropdown" value={this.props.currentOption} onChange={evt => this.props.onChange(parseFloat(evt.target.value))}>
				{optionElements}
			</select>
		</div>
	}
})

export const RangeDropdown = React.createClass({
	propTypes: {
		allRanges: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.number)),
		currentRangeIndex:React.PropTypes.number,
		onChange: React.PropTypes.func,
	},

	render() {
		const optionElements = this.props.allRanges.map((range, i) => {
			const stringOption = range[0].toString()+ "-" + range[1].toString();
			return <option value={i}>{stringOption}</option>
		});

		return <div className="option-dropdown-container">
			<select className="option-dropdown" value={this.props.currentRangeIndex} onChange={evt => this.props.onChange(parseFloat(evt.target.value))}>
				{optionElements}
			</select>
		</div>
	}
})
