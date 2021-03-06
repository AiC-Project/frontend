/* global document */
'use strict';

import React from 'react';
import LiveActions from 'app/actions/live';
import {throttle} from 'lodash';
import FontIcon from 'material-ui/FontIcon';
import AppPalette from 'app/configs/app-palette';

const debug = require('debug')('AiC:Components:Project:Live:LiveToolbox');

// Android toolbar
const TOOLBAR_ANDROID = 'android';
const TOOLBAR_SENSORS = 'sensors';
const TOOLBAR_CAMERA = 'camera';
const TOOLBAR_GSM = 'gsm';
const TOOLBAR_APKS = 'apks';
const TOOLBAR_SESSIONDETAILS = 'details';
const TOOLBAR_MONKEYURUNNER = 'monkeyRunner';
const TOOLBAR_TESTS = 'tests';
const TOOLBAR_SCREEN = 'screen';
const TOOLBAR_MAIN_ORDER = [TOOLBAR_SENSORS, TOOLBAR_CAMERA, TOOLBAR_GSM, TOOLBAR_APKS, TOOLBAR_SESSIONDETAILS, TOOLBAR_MONKEYURUNNER, TOOLBAR_TESTS, TOOLBAR_SCREEN, TOOLBAR_ANDROID];

// Sensors toolbar
const TOOLBAR_GPS = 'gps';
const TOOLBAR_BATTERY = 'battery';
const TOOLBAR_ACCELEROMETER = 'accelerometer';
const TOOLBAR_LIGHT = 'light';
const TOOLBAR_GRAVITY = 'gravity';
const TOOLBAR_GYROSCOPE = 'gyroscope';
const TOOLBAR_LINEARACC = 'linear_acc';
const TOOLBAR_MAGNETOMETER = 'magnetometer';
const TOOLBAR_ORIENTATION = 'orientation';
const TOOLBAR_PRESSURE = 'pressure';
const TOOLBAR_PROXIMITY = 'proximity';
const TOOLBAR_HUMIDITY = 'relative_humidity';
const TOOLBAR_TEMPERATURE = 'temperature';
const TOOLBAR_SENSORS_ORDER = [TOOLBAR_GPS, TOOLBAR_BATTERY, TOOLBAR_ACCELEROMETER, TOOLBAR_LIGHT, TOOLBAR_GRAVITY, TOOLBAR_GYROSCOPE, TOOLBAR_LINEARACC, TOOLBAR_MAGNETOMETER, TOOLBAR_ORIENTATION, TOOLBAR_PRESSURE, TOOLBAR_PROXIMITY, TOOLBAR_HUMIDITY, TOOLBAR_TEMPERATURE];

// GSM panels
const PANEL_GSM_CALL = 'gsmCall';
const PANEL_GSM_ACCEPTCALL = 'gsmAcceptCall';
const PANEL_GSM_HOLDCALL = 'gsmHoldCall';
const PANEL_GSM_CANCELCALL = 'gsmCancelCall';
const PANEL_GSM_SMS = 'gsmSMS';
const PANEL_GSM_SIGNAL = 'gsmSignal';
const PANEL_GSM_NETWORK = 'gsmNetwork';
const PANEL_GSM_ROAMING = 'gsmRoaming';
const PANEL_GSM_ORDER = [PANEL_GSM_CALL, PANEL_GSM_ACCEPTCALL, PANEL_GSM_HOLDCALL, PANEL_GSM_CANCELCALL, PANEL_GSM_SMS, PANEL_GSM_SIGNAL, PANEL_GSM_NETWORK, PANEL_GSM_ROAMING];

// Components
// NOFIX: can not put in a map because browserify will then not resolve the requires
const toolbars = {};

// Main bar
toolbars.android = require('app/components/toolbar/toolbar-android');

// Secondary bars
toolbars.sensors = require('app/components/toolbar/toolbar-sensors');
toolbars.camera = require('app/components/panel/panel-camera');
toolbars.gsm = require('app/components/toolbar/toolbar-gsm');
toolbars.apks = require('app/components/toolbar/toolbar-apks-install');
toolbars.error = require('app/components/toolbar/toolbar-error');
toolbars.screen = require('app/components/toolbar/toolbar-screen');

// Sensors panels
toolbars.gps = require('app/components/toolbar/toolbar-gps');
toolbars.battery = require('app/components/toolbar/toolbar-battery');
toolbars.accelerometer = require('app/components/toolbar/toolbar-accelerometer');
toolbars.light = require('app/components/toolbar/toolbar-light');
toolbars.gravity = require('app/components/toolbar/toolbar-gravity');
toolbars.gyroscope = require('app/components/toolbar/toolbar-gyroscope');
toolbars.linear_acc = require('app/components/toolbar/toolbar-linearacc'); // eslint-disable-line camelcase
toolbars.magnetometer = require('app/components/toolbar/toolbar-magnetometer');
toolbars.orientation = require('app/components/toolbar/toolbar-orientation');
toolbars.pressure = require('app/components/toolbar/toolbar-pressure');
toolbars.proximity = require('app/components/toolbar/toolbar-proximity');
toolbars.relative_humidity = require('app/components/toolbar/toolbar-humidity'); // eslint-disable-line camelcase
toolbars.temperature = require('app/components/toolbar/toolbar-temperature');

// GSM panels
toolbars.gsmCall = require('app/components/toolbar/toolbar-gsm-call');
toolbars.gsmSMS = require('app/components/toolbar/toolbar-gsm-sms');
toolbars.gsmSignal = require('app/components/toolbar/toolbar-gsm-signal');
toolbars.gsmNetwork = require('app/components/toolbar/toolbar-gsm-network');
toolbars.gsmRoaming = require('app/components/toolbar/toolbar-gsm-roaming');

// Monkey Runner panel
toolbars.monkeyRunner = require('app/components/toolbar/toolbar-monkey-runner');

// Tests panel
toolbars.tests = require('app/components/toolbar/toolbar-tests');

// Info panel
toolbars.details = require('app/components/panel/panel-session-details');

// Monkey Runner
// http://developer.android.com/intl/es/tools/help/monkey.html
// adb shell pm list packages -f
// adb shell pm list packages -f | grep data
// adb shell monkey -p com.vonglasow.michael.satstat --throttle 500 -v 10
//
// this.handleClickFirstBar.monkeyRunner = e => {
// 	this.props.onChangeSensor('system', e, {
// 		uid: '123',
// 		command: 'shell',
// 		// params: 'pm list packages -f'
// 		params: 'monkey --throttle 500 -v 10'
// 	});
// };

const LiveToolbox = class extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			activeBar: TOOLBAR_ANDROID,
			activeSecondBar: null,
			toolbarPosition: [0, 0],
			toolbarCollapsed: false
		};

		// Secondary toolbars
		this.handleClickFirstBar = {};
		TOOLBAR_MAIN_ORDER.forEach(v => {
			this.handleClickFirstBar[v] = this.changeActiveToolbar.bind(this, v);
		});

		this.handleClickFirstBar.tests = () => {
			props.onTestPackagesLoad();
			this.changeActiveSecondToolbar('tests');
		};
		this.handleClickFirstBar.monkeyRunner = this.changeActiveSecondToolbar.bind(this, 'monkeyRunner');
		this.handleClickFirstBar.camera = this.changeActiveSecondToolbar.bind(this, 'camera');
		this.handleClickFirstBar.apks = this.changeActiveSecondToolbar.bind(this, 'apks');
		this.handleClickFirstBar.details = this.changeActiveSecondToolbar.bind(this, 'details');

		this.handleClickFirstBar.terminate = () => {
			this.props.onClickTerminate();
		};

		this.handleClickFirstBar.fullscreen = () => {
			if (this.props.isFullscreen) {
				this.props.onExitFullscreen();
			} else {
				this.props.onEnterFullscreen();
			}
		};

		this.handleClickFirstBar.scalescreen = () => {
			if (this.props.isScaledscreen) {
				this.props.onExitScaledscreen();
			} else {
				this.props.onEnterScaledscreen();
			}
		};

		// Third toolbars - Panels
		this.handleClickSecondBar = {};
		this.handleChangeSensorsBinded = {};
		this.handleChangeSensorsBinded.camera = this.handleChangeSensors.bind(this, 'camera');
		this.handleClickSecondBar.android = this.changeActiveToolbar.bind(this, TOOLBAR_ANDROID);
		TOOLBAR_SENSORS_ORDER.forEach(v => {
			this.handleClickFirstBar[v] = this.changeActiveSecondToolbar.bind(this, v);
			this.handleChangeSensorsBinded[v] = this.handleChangeSensors.bind(this, v);
		});
		PANEL_GSM_ORDER.forEach(v => {
			// TODO: fix phone_number
			if (v === 'gsmAcceptCall') {
				this.handleClickFirstBar[v] = e => this.handleGSM(e, 'call', {action: 'accept', phone_number: this.props.sensorsValues['gsm/call'].phone_number}); // eslint-disable-line camelcase
			} else if (v === 'gsmHoldCall') {
				this.handleClickFirstBar[v] = e => this.handleGSM(e, 'call', {action: 'hold', phone_number: this.props.sensorsValues['gsm/call'].phone_number}); // eslint-disable-line camelcase
			} else if (v === 'gsmCancelCall') {
				this.handleClickFirstBar[v] = e => this.handleGSM(e, 'call', {action: 'cancel', phone_number: this.props.sensorsValues['gsm/call'].phone_number}); // eslint-disable-line camelcase
			} else {
				this.handleClickFirstBar[v] = this.changeActiveSecondToolbar.bind(this, v);
			}
		});

		this.handleGSM = (e, action, payload) => this.props.onChangeSensor(`gsm/${action}`, e, payload);

		this.listPackages = throttle(() => {
			LiveActions.listPackages({avmId: this.props.avmInfo.avm_id});
		}, 2000, {trailing: false});

		this.handleInputFocusMonkeyRunner = e => {
			this.listPackages();
			this.props.onInputFocus(e);
		};

		this.handleDragOverThrottled = throttle(e => {
			// debug('handleDragThrottled');
			this.handleDragOver(e);
		}, 66);
	}

	changeActiveToolbar(toolbar) {
		this.setState({activeBar: toolbar, activeSecondBar: null});
	}

	changeActiveSecondToolbar(toolbar) {
		if (this.state.activeSecondBar === toolbar) {
			this.setState({activeSecondBar: null});
		} else {
			this.setState({activeSecondBar: toolbar});
		}
	}

	handleChangeSensors(sensorType, e, payload) {
		this.props.onChangeSensor(sensorType, e, payload);
	}

	handleDrag = e => {
		// debug('handleDrag e', e, Object.keys(e), e.clientX, e.screenX, e.pageX, e.detail);
		if (e.pageX) {
			debug('handleDrag', Object.keys(e), e.clientX, e.screenX, e.pageX);
			debug('handleDrag ct', Object.keys(e.currentTarget));
			this.setState({toolbarPosition: [e.pageX + this.offSetX, e.pageY + this.offSetY]});
		}
	}

	handleDragStart = e => {
		debug('handleDragStart', Object.keys(e));
		debug('handleDrag ct', Object.keys(e.currentTarget));
		this.offSetX = this.state.toolbarPosition[0] - e.pageX;
		this.offSetY = this.state.toolbarPosition[1] - e.pageY;
		e.dataTransfer.setData('text', '');
		debug('handleDrag st off', this.offSetX, this.offSetY);
		document.addEventListener('dragover', this.handleDragOverThrottled);
	}

	handleDragEnd = e => {
		debug('handleDragEnd');
		document.removeEventListener('dragover', this.handleDragOverThrottled);
		this.handleDrag(e);
	}

	handleDragOver = e => {
		// debug('handleDragOver e', e, Object.keys(e), e.clientX, e.screenX, e.pageX, e.detail);
		this.handleDrag(e);
	}

	handleToggleToolbar = () => {
		this.setState({toolbarCollapsed: !this.state.toolbarCollapsed});
	}

	showCurrentBar = () => {
		return !this.props.isFullscreen || !this.state.toolbarCollapsed;
	}

	render() {
		debug('render');
		const styles = {
			secondToolbar: {
				marginLeft: 0,
				marginRight: 0
			}
		};

		// Build the main toolbar
		let currentBar;

		if (this.state.activeBar === null) {
			currentBar = null;
		} else if (TOOLBAR_MAIN_ORDER.indexOf(this.state.activeBar) === -1) {
			currentBar = React.createElement(toolbars.error);
			debug('could not find main toolbar', this.state.activeBar);
		} else {
			const props = {
				onClick: this.handleClickFirstBar,
				secondBar: this.state.activeSecondBar,
				isFullscreen: this.props.isFullscreen,
				isScaledscreen: this.props.isScaledscreen
			};
			currentBar = React.createElement(toolbars[this.state.activeBar], props);
		}

		// Build second toolbar (when clicking on the sensors for example)
		let currentSecondBar;

		if (this.state.activeSecondBar === null) {
			currentSecondBar = null;
		} else if (TOOLBAR_SENSORS_ORDER.indexOf(this.state.activeSecondBar) !== -1) {
			const onChangeSensorBinded = this.handleChangeSensorsBinded[this.state.activeSecondBar];
			const props = {
				style: styles.secondToolbar,
				onInputFocus: this.props.onInputFocus,
				onInputBlur: this.props.onInputBlur,
				onChange: onChangeSensorBinded,
				secondBar: this.state.activeSecondBar
			};
			props[this.state.activeSecondBar] = this.props.sensorsValues[this.state.activeSecondBar];
			debug('currentSecondBar props', props);
			if (this.state.activeSecondBar === 'accelerometer') {
				props.rotation = this.props.properties['aicd.screen_rotation'];
			}
			currentSecondBar = React.createElement(toolbars[this.state.activeSecondBar], props);
		} else if (this.state.activeSecondBar === 'apks') { // eslint-disable-line no-negated-condition
			const props = {
				apkList: this.props.apkList,
				onClick: this.props.onInstallAPK,
				apkInstalled: this.props.apkInstalled,
				onInputFocus: this.props.onInputFocus,
				onInputBlur: this.props.onInputBlur
			};
			currentSecondBar = React.createElement(toolbars[this.state.activeSecondBar], props);
		} else if (this.state.activeSecondBar === 'camera') { // eslint-disable-line no-negated-condition
			const onChangeSensorBinded = this.handleChangeSensorsBinded[this.state.activeSecondBar];
			const props = {
				fileList: this.props.cameraList,
				onClick: onChangeSensorBinded,
				onInputFocus: this.props.onInputFocus,
				onInputBlur: this.props.onInputBlur
			};
			currentSecondBar = React.createElement(toolbars[this.state.activeSecondBar], props);
		} else if (PANEL_GSM_ORDER.indexOf(this.state.activeSecondBar) !== -1) { // eslint-disable-line no-negated-condition
			const props = {
				onChange: this.handleGSM,
				onInputFocus: this.props.onInputFocus,
				onInputBlur: this.props.onInputBlur,
				secondBar: this.state.activeSecondBar
			};
			currentSecondBar = React.createElement(toolbars[this.state.activeSecondBar], props);
		} else if (this.state.activeSecondBar === 'monkeyRunner') { // eslint-disable-line no-negated-condition
			const props = {
				onClick: this.props.onMonkeyRunner,
				onInputFocus: this.handleInputFocusMonkeyRunner,
				onInputBlur: this.props.onInputBlur,
				packageList: this.props.packageList,
				monkeyCalls: this.props.monkeyCalls
			};
			currentSecondBar = React.createElement(toolbars[this.state.activeSecondBar], props);
		} else if (this.state.activeSecondBar === 'tests') { // eslint-disable-line no-negated-condition
			const props = {
				onInputFocus: this.handleInputFocusMonkeyRunner,
				onInputBlur: this.props.onInputBlur,
				testPackages: this.props.testPackages,
				testRuns: this.props.testRuns,
				onTestRun: this.props.onTestRun
			};
			currentSecondBar = React.createElement(toolbars[this.state.activeSecondBar], props);
		} else if (this.state.activeSecondBar === 'details') { // eslint-disable-line no-negated-condition
			const props = {
				properties: this.props.properties,
				apkList: this.props.packageList,
				avmInfo: this.props.avmInfo
			};
			currentSecondBar = React.createElement(toolbars[this.state.activeSecondBar], props);
		} else {
			currentSecondBar = React.createElement(toolbars.error);
			debug('could not find second toolbar', this.state.activeSecondBar);
		}

		const styleDrag = {
			background: AppPalette.toolbarBGColor,
			padding: '14px 0 14px 0',
			cursor: 'move',
			float: 'left'
		};

		const styleToggle = {
			background: AppPalette.toolbarBGColor,
			padding: '14px 0 14px 0',
			cursor: 'pointer',
			float: 'left'
		};

		const styleLiveToolBox = {
			position: this.props.isFullscreen ? 'absolute' : 'initial',
			top: this.state.toolbarPosition[1],
			left: this.state.toolbarPosition[0],
			width: this.props.isFullscreen ? 820 : 'auto'
		};

		return (
			<div style={styleLiveToolBox}>
				{this.props.isFullscreen && <FontIcon style={styleToggle} onClick={this.handleToggleToolbar} className={`mdi mdi-menu-${this.state.toolbarCollapsed ? 'right' : 'left'}`}/>}
				{this.props.isFullscreen && <FontIcon style={styleDrag} draggable onDragEnd={this.handleDragEnd} onDragStart={this.handleDragStart} className="mdi mdi-drag"/>}
				{this.showCurrentBar() && currentBar}
				{this.showCurrentBar() && currentSecondBar}
			</div>
		);
	}
};

LiveToolbox.contextTypes = {
	muiTheme: React.PropTypes.object,
	router: React.PropTypes.object
};

LiveToolbox.propTypes = {
	onChangeSensor: React.PropTypes.func,
	onInputFocus: React.PropTypes.func,
	onInputBlur: React.PropTypes.func,
	sensorsValues: React.PropTypes.object,
	onClickTerminate: React.PropTypes.func,
	onInstallAPK: React.PropTypes.func,
	onMonkeyRunner: React.PropTypes.func,
	apkList: React.PropTypes.array,
	packageList: React.PropTypes.array,
	cameraList: React.PropTypes.array,
	properties: React.PropTypes.object,
	avmInfo: React.PropTypes.object,
	apkInstalled: React.PropTypes.array,
	monkeyCalls: React.PropTypes.array,
	onEnterFullscreen: React.PropTypes.func,
	onExitFullscreen: React.PropTypes.func,
	isFullscreen: React.PropTypes.bool,
	isScaledscreen: React.PropTypes.bool,
	style: React.PropTypes.object,
	onExitScaledscreen: React.PropTypes.func,
	onEnterScaledscreen: React.PropTypes.func,
	testPackages: React.PropTypes.array,
	testRuns: React.PropTypes.array,
	onTestPackagesLoad: React.PropTypes.func,
	onTestRun: React.PropTypes.func
};

module.exports = LiveToolbox;
