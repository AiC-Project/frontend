'use strict';

// Vendor
import React from 'react';
import ToolbarSeparator from 'material-ui/Toolbar/ToolbarSeparator';
import FontIcon from 'material-ui/FontIcon';
import Slider from 'material-ui/Slider';
import Paper from 'material-ui/Paper';

// APP
const ToolbarLight = class extends React.Component {
	render() {
		const styles = {
			separator: {
				margin: '0 15px 0 0px',
				float: 'left'
			},
			items: {
				float: 'left',
				width: 720
			},
			paper: {
				height: 56
			},
			icon: {
				margin: '15px 10px 0 10px',
				float: 'left'
			}
		};
		const onChange = (e, value) => {
			this.props.onChange(e, {light: value});
		};
		return (
			<Paper style={Object.assign(this.props.style, styles.paper)} zDepth={1}>
				<FontIcon style={styles.icon} className="mdi mdi-white-balance-incandescent"/>
				<ToolbarSeparator style={styles.separator}/>
				<Slider className="inputLiveSensorLight" style={styles.items} name="light" max={100} min={0} step={1} onChange={onChange}/>
			</Paper>
		);
	}
};

ToolbarLight.contextTypes = {
	muiTheme: React.PropTypes.object,
	router: React.PropTypes.object
};

ToolbarLight.defaultProps = {
	style: {}
};

ToolbarLight.propTypes = {
	onClickBack: React.PropTypes.func,
	style: React.PropTypes.object,
	onChange: React.PropTypes.func
};

module.exports = ToolbarLight;
