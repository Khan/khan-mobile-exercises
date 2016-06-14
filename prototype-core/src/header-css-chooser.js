import React from 'react'

const HeaderCSSChooserDropdown = React.createClass({
	propTypes: {
		cssFileNames: React.PropTypes.arrayOf(React.PropTypes.string),
		currentCSSFile: React.PropTypes.string,
		onChange: React.PropTypes.func,
	},

	render() {
		const cssFiles = this.props.cssFileNames.map(fileName => {
			return <option key={fileName} value={fileName}>{fileName}</option>
		});

		return <div className="option-dropdown-container">
			<select value={this.props.currentCSSFile} onChange={evt => this.props.onChange(evt.target.value)}>
					<option value="">No CSS Overrides</option>
	  			{cssFiles}
			</select>
		</div>
	}
})

export default HeaderCSSChooserDropdown
