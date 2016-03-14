'use strict';

// Vendor
import React from 'react';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import FontIcon from 'material-ui/lib/font-icon';
import Slider from 'material-ui/lib/slider';
import Paper from 'material-ui/lib/paper';

// APP
const ToolbarGSMSignal = class extends React.Component {

	onChange(e, value) {
		this.props.onChange(e, {
			action_type: 'SET_SIGNAL', // eslint-disable-line camelcase
			signal_strength: parseInt(value, 10) // eslint-disable-line camelcase
		});
	}

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
		const onChange = this.onChange.bind(this);
		return (
			<Paper style={Object.assign(this.props.style || {}, styles.paper)} zDepth={1}>
				<FontIcon style={styles.icon} className="mdi mdi-signal" color="rgba(0, 0, 0, 0.4)"/>
				<ToolbarSeparator style={styles.separator}/>
				<Slider className="inputLiveGSMSignal" style={styles.items} name="signal" max={4} min={0} step={1} onChange={onChange}/>
			</Paper>
		);
	}
};

ToolbarGSMSignal.contextTypes = {
	muiTheme: React.PropTypes.object,
	router: React.PropTypes.object
};

ToolbarGSMSignal.propTypes = {
	onClickBack: React.PropTypes.func,
	style: React.PropTypes.object,
	onChange: React.PropTypes.func
};

module.exports = ToolbarGSMSignal;