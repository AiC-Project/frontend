'use strict';

// Vendor
import React from 'react';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import FontIcon from 'material-ui/lib/font-icon';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import Paper from 'material-ui/lib/paper';

// APP
const ToolbarGyroscope = class extends React.Component {

	constructor(props) {
		super(props);
		this.setRefAzimuth = c => {
			this.azimuth = c;
		};
		this.setRefPitch = c => {
			this.pitch = c;
		};
		this.setRefRoll = c => {
			this.roll = c;
		};
		this.handleClick = e => {
			const payload = {
				azimuth: parseFloat(this.azimuth.getValue()),
				pitch: parseFloat(this.pitch.getValue()),
				roll: parseFloat(this.roll.getValue())
			};
			this.props.onChange(e, payload);
		};
	}

	render() {
		const styles = {
			button: {
				marginTop: 5,
				float: 'left'
			},
			separator: {
				margin: '0 15px 0 0px',
				float: 'left'
			},
			items: {
				float: 'left',
				width: 100
			},
			paper: {
				height: 56
			},
			buttonSubmit: {
				float: 'left',
				marginTop: 10,
				marginLeft: 15
			},
			icon: {
				margin: '15px 10px 0 10px',
				float: 'left'
			}
		};
		return (
			<Paper style={Object.assign(this.props.style, styles.paper)} zDepth={1}>
				<FontIcon style={styles.icon} className="mdi mdi-crosshairs-gps" color="rgba(0, 0, 0, 0.4)"/>
				<ToolbarSeparator style={styles.separator}/>
				<TextField className="inputLiveSensorGyroscopeAzimuth" style={styles.items} ref={this.setRefAzimuth} hintText="azimuth" onFocus={this.props.onInputFocus} onBlur={this.props.onInputBlur}/>
				<TextField className="inputLiveSensorGyroscopePitch" style={styles.items} ref={this.setRefPitch} hintText="pitch" onFocus={this.props.onInputFocus} onBlur={this.props.onInputBlur}/>
				<TextField className="inputLiveSensorGyroscopeRoll" style={styles.items} ref={this.setRefRoll} hintText="roll" onFocus={this.props.onInputFocus} onBlur={this.props.onInputBlur}/>
				<RaisedButton
					className="btLiveSensorGyroscopeSubmit"
					label="Submit"
					title="Submit"
					href="#"
					secondary
					onClick={this.handleClick}
					style={styles.buttonSubmit}
					/>
			</Paper>
		);
	}
};

ToolbarGyroscope.contextTypes = {
	muiTheme: React.PropTypes.object,
	router: React.PropTypes.object
};

ToolbarGyroscope.propTypes = {
	onChange: React.PropTypes.func,
	style: React.PropTypes.object,
	onInputFocus: React.PropTypes.func,
	onInputBlur: React.PropTypes.func
};

module.exports = ToolbarGyroscope;
