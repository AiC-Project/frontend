/* global window */
'use strict';

// React
const React = require('react');

// Material design
const mui = require('material-ui');
const {Spacing} = mui.Styles;
const {
	Paper,
	CircularProgress
} = mui;

// Vendors
const debug = require('debug')('AiC:Views:Project:Live:Session');

// APP
import AreaStatus from 'app/components/project/area-status';
import LiveScreen from 'app/components/project/live-screen';
import LiveToolbox from 'app/components/project/live-toolbox';
// import LogBox from 'app/components/shared/log-box';
// import LogBoxRow from 'app/components/shared/log-box-row';
import LiveStore from 'app/stores/live';
import APKStore from 'app/stores/apk';
import CameraStore from 'app/stores/camera';
import LiveActions from 'app/actions/live';

const availableLiveActions = ['test', 'check', 'start', 'load', 'connect', 'close', 'setState', 'check', 'close', 'restart'];
let avmId;
let projectId;

const LiveSession = class extends React.Component {

	constructor(props) {
		super(props);
		this._onStateChange = this._onStateChange.bind(this);
		this.handleOnLiveActions = {};
		availableLiveActions.forEach(actionName => {
			this.handleOnLiveActions[actionName] = this.handleOnLiveAction.bind(this, actionName);
		});
		this.handleBatteryChange = this.handleBatteryChange.bind(this);
		this.handleClickGPS = this.handleClickGPS.bind(this);
		this.handleChangeRotation = this.handleChangeRotation.bind(this);
		this.handleChangeSensor = this.handleChangeSensor.bind(this);
		this.handleAPKs = (e, apkId) => {
			LiveActions.installAPK(projectId, avmId, apkId);
		};
		this.handleMonkeyRunner = (e, packages, eventCount, throttle) => {
			LiveActions.monkeyRunner(avmId, packages, eventCount, throttle);
		};
	}

	render() {
		debug('render');
		const style = {
			paperCenter: {
				textAlign: 'center',
				padding: Spacing.desktopGutter
			},
			paperLive: {
				padding: Spacing.desktopGutter
			},
			error: {
				icon: {
					color: this.context.muiTheme.palette.errorColor,
					fontSize: '50px',
					float: 'left'
				},
				message: {
					color: this.context.muiTheme.palette.errorColor
				},
				status: {
					display: 'none'
				}
			},
			infoArea: {
				width: 547,
				margin: '0 auto',
				paddingBottom: `${Spacing.desktopGutter}px`
			}
		};

		// const logBoxRows = null;

		// if (this.state && this.state.live) {
		// 	this.state.live.logBox.map((v, i) => {
		// 		return <LogBoxRow key={i} time={v.time}>{v.message}</LogBoxRow>;
		// 	});
		// }
		// <div style={{width: 547}}>
		// 				<LogBox>
		// 				{logBoxRows}
		// 				</LogBox>
		// 			</div>

		return (
			<div>

				<div style={style.infoArea}>
					<AreaStatus typeName="live"/>
				</div>

				{this.state && this.state.live.status.substr(-6) === 'FAILED' ? (
					<Paper style={style.paperCenter}>

						<span style={style.error.icon} className="mdi mdi-android"/>
						<p style={style.error.status}>{this.state.live.status}</p>
						<p style={style.error.message}>{this.state.live.message}</p>

					</Paper>
				) : null}

				{this.state && (this.state.live.status === 'LIVE_STATUS_CONNECTING' || this.state.live.status === 'LIVE_STATUS_CONNECTED') ? (
					<Paper style={style.paperLive}>

						{this.state.live.status === 'LIVE_STATUS_CONNECTING' ? (
							<div style={style.paperCenter}>
								<CircularProgress mode="indeterminate" size={2}/>
							</div>
						) : null}

						<LiveScreen/>

						{this.state.live.status === 'LIVE_STATUS_CONNECTED' ? (
							<div>
								<LiveToolbox
									onInputFocus={this.handleOnInputFocus}
									onInputBlur={this.handleOnInputBlur}
									avmId={this.state.liveInfo.avm_id}
									// Terminate //
									onClickTerminate={this.handleStopVM}
									// Sensors //
									onChangeSensor={this.handleChangeSensor}
									sensorsValues={this.state.live.sensors}
									// APKs
									onInstallAPK={this.handleAPKs}
									apkList={this.state.apk ? this.state.apk.apks : []}
									// Monkey Runner
									onMonkeyRunner={this.handleMonkeyRunner}
									packageList={this.state.live.packages}
									// Camera
									cameraList={this.state.camera ? this.state.camera.files : []}
									// Details
									properties={this.state.live.properties}
									avmInfo={this.state.liveInfo}
									/>
							</div>
						) : null}

					</Paper>
				) : null}

				{this.state && (this.state.live.status === 'LIVE_STATUS_STOPPED') ? (
					<Paper style={style.paperCenter}>

						<p>Your live session was sucessfully stopped.</p>

					</Paper>
				) : null}

			</div>
		);
	}

	_onStateChange(state) {
		this.setState(state);
		// if(state.live.status === 'LIVE_STATUS_INITIALIZED'){
			// LiveActions.liveCheck();
		// }
	}

	handleOnLiveAction(actionName) {
		// debug(arguments);
		switch (actionName) {
			case 'test':
				debug(arguments);
				break;
			case 'check':
				LiveActions.liveCheck();
				break;
			case 'start':
				LiveActions.liveStart();
				break;
			case 'restart':
				LiveActions.liveReset();
				LiveActions.liveCheck();
				break;
			case 'connect':
				LiveActions.liveConnect(this.state.live.screen.ip, this.state.live.screen.port);
				break;
			case 'close':
				LiveActions.liveStop(this.state.live.screen.port);
				break;
			case 'setState': {
				if (!this.context.appConfig.debug) {
					return;
				}
				const newState = this.state;
				newState.live.status = 'LIVE_STATUS_CONNECTING';
				newState.live.screen.ip = '10.2.0.156';
				newState.live.screen.port = '5909';
				newState.live.audio = {};
				newState.live.audio.ip = '10.2.0.156';
				newState.live.audio.port = '6909';
				newState.live.screen.rotation = 'horizontal';
				newState.live.delayedRotation = 'horizontal';
				LiveActions.setState(newState);
				break;
			}
			default:
				break;
		}
	}

	handleOnInputFocus() {
		debug('focus');
		if (!window.rfb) {
			return;
		}
		debug('rfb exists?');
		window.rfb.get_keyboard().set_focused(false);
		window.rfb.get_mouse().set_focused(false);
	}

	handleOnInputBlur() {
		if (!window.rfb) {
			return;
		}
		window.rfb.get_keyboard().set_focused(true);
		window.rfb.get_mouse().set_focused(true);
	}

	handleChangeSensor(sensor, e, payload) {
		debug('handleChangeSensor', arguments);
		debug('handleChangeSensor', e, sensor, payload);
		LiveActions.setSensor(avmId, sensor, payload);
	}

	handleBatteryChange(e, value) {
		e.preventDefault();
		LiveActions.setSensorBattery(avmId, value);
	}

	handleChangeRotation(e) {
		e.preventDefault();
		const newRotationName = this.state.live.rotationSets[this.state.live.screen.rotation].next;
		const newRotationValue = this.state.live.rotationSets[newRotationName];
		LiveActions.setSensorAccelerometer(avmId, newRotationValue.x, newRotationValue.y, newRotationValue.z, newRotationName);

		setTimeout(() => {
			LiveActions.setDelayedRotation();
		}, 1500);
	}

	handleClickGPS(e, lat, lon) {
		// e.preventDefault();
		// const lat = parseFloat(this.lat.getValue());
		// const lon = parseFloat(this.lon.getValue());
		LiveActions.setSensorLocation(avmId, lat, lon);
	}

	handleStopVM() {
		LiveActions.stop(avmId);
	}

	componentDidMount() {
		debug('this.props.params', this.props.params);
		projectId = this.props.params.projectId;
		avmId = this.props.params.androId;
		this.unsubscribe = [];
		this.unsubscribe.push(LiveStore.listen(this._onStateChange));
		this.unsubscribe.push(APKStore.listen(this._onStateChange));
		this.unsubscribe.push(CameraStore.listen(this._onStateChange));
		LiveActions.liveReset();
		LiveActions.setProjectId(projectId);
		// LiveActions.loadInfo(avmId);
		window.intervalTimeoutLoad = setInterval(LiveActions.loadInfo, 1000, avmId);
	}

	componentWillUnmount() {
		clearInterval(window.intervalTimeoutLoad);
		clearInterval(window.intervalTimeout);
		this.handleOnInputFocus();
		// Subscribe and unsubscribe because we don't want to use the mixins
		this.unsubscribe.map(v => v());
	}

};

LiveSession.contextTypes = {
	router: React.PropTypes.object,
	muiTheme: React.PropTypes.object,
	appConfig: React.PropTypes.object
};

LiveSession.propTypes = {
	onInputFocus: React.PropTypes.func,
	onInputBlur: React.PropTypes.func,
	params: React.PropTypes.object
};

module.exports = LiveSession;
