'use strict';

// Vendor
import React from 'react';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';
import FontIcon from 'material-ui/lib/font-icon';
import IconButton from 'material-ui/lib/icon-button';
import SvgIcon from 'material-ui/lib/svg-icon';

// APP
const ToolbarSensors = class extends React.Component {

	render() {
		const styles = {
			button: {
				marginTop: 5,
				float: 'left'
			},
			separator: {
				margin: '0 5px 0 0px'
			}
		};

		const VoiceSVG = props => (
			<SvgIcon {...props}>
				<path d="M9,5A4,4 0 0,1 13,9A4,4 0 0,1 9,13A4,4 0 0,1 5,9A4,4 0 0,1 9,5M9,15C11.67,15 17,16.34 17,19V21H1V19C1,16.34 6.33,15 9,15M16.76,5.36C18.78,7.56 18.78,10.61 16.76,12.63L15.08,10.94C15.92,9.76 15.92,8.23 15.08,7.05L16.76,5.36M20.07,2C24,6.05 23.97,12.11 20.07,16L18.44,14.37C21.21,11.19 21.21,6.65 18.44,3.63L20.07,2Z"/>
			</SvgIcon>
		);

		const GravitySVG = props => (
			<SvgIcon {...props}>
				<path transform="translate(7,5),scale(0.8)" d="M20,10C22,13 17,22 15,22C13,22 13,21 12,21C11,21 11,22 9,22C7,22 2,13 4,10C6,7 9,7 11,8V5C5.38,8.07 4.11,3.78 4.11,3.78C4.11,3.78 6.77,0.19 11,5V3H13V8C15,7 18,7 20,10Z"/>
				<path transform="translate(0,0),scale(0.5)" d="M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z"/>
			</SvgIcon>
		);

		const SVGs = {
			VoiceSVG,
			GravitySVG
		};

		const buttons = [
			{
				name: 'GPS',
				tooltip: 'GPS',
				fontIcon: 'mdi mdi-map-marker'
			},
			{
				name: 'Battery',
				tooltip: 'Battery',
				fontIcon: 'mdi mdi-battery-charging-40'
			},
			{
				name: 'Accelerometer',
				tooltip: 'Accelerometer',
				fontIcon: 'mdi mdi-screen-rotation'
			},
			{
				name: 'Light',
				tooltip: 'Light',
				fontIcon: 'mdi mdi-white-balance-incandescent'
			},
			{
				name: 'Gravity',
				tooltip: 'Gravity',
				svgIcon: 'GravitySVG'
			},
			{
				name: 'Gyroscope',
				tooltip: 'Gyroscope',
				fontIcon: 'mdi mdi-crosshairs-gps'
			},
			{
				name: 'LinearAcc',
				tooltip: 'Linear acceleration',
				fontIcon: 'mdi mdi-run'
			},
			{
				name: 'Magnetometer',
				tooltip: 'Magnetometer',
				fontIcon: 'mdi mdi-magnet'
			},
			{
				name: 'Orientation',
				tooltip: 'Orientation',
				fontIcon: 'mdi mdi-compass'
			},
			{
				name: 'Pressure',
				tooltip: 'Pressure',
				fontIcon: 'mdi mdi-speedometer'
			},
			{
				name: 'Proximity',
				tooltip: 'Proximity',
				svgIcon: 'VoiceSVG'
			},
			{
				name: 'Humidity',
				tooltip: 'Humidity',
				fontIcon: 'mdi mdi-water'
			},
			{
				name: 'Temperature',
				tooltip: 'Temperature',
				fontIcon: 'mdi mdi-thermometer-lines'
			}
		];

		const renderedButtons = buttons.map((b, i) => {
			const handleClick = this.props[`onClick${b.name}`];
			const iconColor = i === this.props.selectedIndex ? 'rgba(255, 255, 255, 0.75)' : 'rgba(0, 0, 0, 0.4)';
			let icon;
			if (b.fontIcon) {
				icon = <FontIcon className={b.fontIcon} color={iconColor} hoverColor="rgba(0, 0, 0, 0.87)"/>;
			} else if (b.svgIcon) {
				icon = React.createElement(SVGs[b.svgIcon], {color: iconColor, hoverColor: 'rgba(0, 0, 0, 0.87)'});
			}
			return (
				<IconButton key={i} tooltip={b.tooltip} style={styles.button} onClick={handleClick}>
					{icon}
				</IconButton>
			);
		});

		return (
			<Toolbar style={this.props.style}>
				<ToolbarGroup firstChild lastChild>
					<IconButton tooltip="Back to toolbar" tooltipPosition="bottom-right" style={styles.button} onClick={this.props.onClickBack}>
						<FontIcon className="mdi mdi-arrow-left-bold" color="rgba(0, 0, 0, 0.4)" hoverColor="rgba(0, 0, 0, 0.87)"/>
					</IconButton>
					<ToolbarTitle text="Sensors" style={styles.title}/>
					<ToolbarSeparator style={styles.separator}/>
					{renderedButtons}
				</ToolbarGroup>
			</Toolbar>
		);
	}
};

ToolbarSensors.contextTypes = {
	muiTheme: React.PropTypes.object,
	router: React.PropTypes.object
};

ToolbarSensors.propTypes = {
	style: React.PropTypes.object,
	selectedIndex: React.PropTypes.number,
	onClickBack: React.PropTypes.func,
	onClickGPS: React.PropTypes.func,
	onClickBattery: React.PropTypes.func,
	onClickAccelerometer: React.PropTypes.func,
	onClickLight: React.PropTypes.func,
	onClickGravity: React.PropTypes.func,
	onClickGyroscope: React.PropTypes.func,
	onClickLinearAcc: React.PropTypes.func,
	onClickMagnetometer: React.PropTypes.func,
	onClickOrientation: React.PropTypes.func,
	onClickPressure: React.PropTypes.func,
	onClickProximity: React.PropTypes.func,
	onClickHumidity: React.PropTypes.func,
	onClickTemperature: React.PropTypes.func
};

module.exports = ToolbarSensors;
