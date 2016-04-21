/* global window, RFB, $D, WebSocket, Util, $, document */
'use strict';

// Vendor
import Reflux from 'reflux';
const debug = require('debug')('AiC:Live:Actions');

// APP
import Gateway from 'app/libs/gateway';

// Actions
const LiveActions = Reflux.createActions({

	list: {asyncResult: true},
	stop: {asyncResult: true},
	start: {asyncResult: true},
	listPackages: {asyncResult: true},
	properties: {asyncResult: true},
	clearTimeouts: {},
	loadInfo: {asyncResult: true},

	setProjectId: {asyncResult: true},
	loadState: {},

	setState: {},
	liveReset: {},
	setDelayedRotation: {},
	socketMessage: {},
	logMessage: {},
	liveConnect: {asyncResult: true},
	liveStop: {asyncResult: true},
	setSensor: {asyncResult: true},
	installAPK: {asyncResult: true},
	monkeyRunner: {asyncResult: true}
});

// Listeners for asynchronous Backend API calls

LiveActions.list.listenAndPromise(Gateway.live.list);
LiveActions.stop.listenAndPromise(Gateway.live.delete);
LiveActions.start.listenAndPromise(Gateway.live.create);
LiveActions.listPackages.listenAndPromise(Gateway.live.listPackages);
LiveActions.properties.listenAndPromise(Gateway.live.properties);
LiveActions.loadInfo.listenAndPromise(Gateway.live.read);

LiveActions.monkeyRunner.listen(function (avmId, packages, eventCount, throttle, refId) {
	Gateway.live.monkeyRunner({avmId, packages, eventCount, throttle})
	.then(res => {
		this.completed(res, avmId, packages, eventCount, throttle, refId);
	}, err => {
		this.failed(err, avmId, packages, eventCount, throttle, refId);
	});
});

LiveActions.setProjectId.listen(function () {
	LiveActions.tryLoadNoVNC(res => {
		if (res.success) {
			this.completed();
		} else {
			this.failed(res.errorMessage);
		}
	});
});


LiveActions.liveConnect.listen(function (vmhost, vmport, avmId) {
	// TODO: audio vmport must be informed

	LiveActions.tryConnection(vmhost, vmport, avmId, res => {
		if (res.success) {
			this.completed();
			// LiveActions.tryAudioConnection( vmhost, vmport+1000, res => {
			//   // TODO: Promise all
			//   if (res.success) {
			//     this.completed();
			//   }else{
			//     this.failure(res.errorMessage);
			//   }
			//   return false;
			// } );
		} else {
			this.failed(res.errorMessage);
		}
	});
});

LiveActions.liveStop.listen(function (avmId) {
	const WebsocketActions = require('app/actions/websocket');
	WebsocketActions.close();
	if (window.rfb) {
		window.rfb.disconnect();
	}
	Gateway.live.delete({avmId})
	.then(result => {
		this.completed(result);
	}, err => {
		this.failed(err);
	});
	// BackendAPI.liveStop(avmId, res => {
	// 	this.completed(res);
	// });
	// TODO: Call disconnect from noNVC if connected before

	LiveActions.stopAudioConnection();
});

LiveActions.setSensor.listen(function (avmId, sensor, payload) {
	Gateway.live.sensor({avmId, sensor, payload})
	.then(res => {
		this.completed(res);
	}, err => {
		this.failed(err);
	});
	// BackendAPI.setSensor(avmId, sensor, payload, res => {
	// 	this.completed(res);
	// });
});

LiveActions.installAPK.listen(function (projectId, avmId, apkId, refId) {
	Gateway.live.installAPK({avmId, apkId})
	.then(res => {
		this.completed(res, projectId, avmId, apkId, refId);
	}, err => {
		this.failed(err, projectId, avmId, apkId, refId);
	});
	// BackendAPI.liveInstallAPK(projectId, avmId, apkId, res => {
	// 	this.completed(res);
	// });
});

window.onscriptsload = function () {
	// const updateState = function (rfb, state, oldstate, msg) {
	const updateState = function (rfb, state) {
		debug('rfb updateState');
		debug(arguments);
		if (state === 'normal') {
			window.AiClive.completed = true;
			LiveActions.logMessage('noVNC utils loaded.');
			LiveActions.liveConnect.completed();
			LiveActions.tryAudioConnection(null, null, () => {});
		}
	};
	try {
		LiveActions.logMessage('Creating noVNC client.');
		window.rfb = new RFB({target: $D('noVNC_canvas'), encrypt: true, onUpdateState: updateState});
	} catch (exc) {
		window.AiClive.completed = true;
		LiveActions.logMessage('Unable to create noVNC client.');
		LiveActions.liveConnect.failed(`Unable to create noVNC client (${exc}).`);
	}
	LiveActions.tryWebsocket();
};

LiveActions.tryWebsocket = function () {
	try {
		LiveActions.logMessage('Connecting to VNC session.');
		window.AiClive.socket = new WebSocket(`wss://${window.AiClive.host}:${window.AiClive.port}/${window.AiClive.path}`, 'base64');
		window.AiClive.socket.onerror = function () {
			debug('socket test on error');
			debug(arguments);
			debug(LiveActions);
			if (window.AiClive.errorCount >= window.AiClive.maxTries) {
				window.AiClive.completed = true;
				LiveActions.logMessage('Unable to connect session (websockify error).');
				LiveActions.liveConnect.failed('Unable to connect session (websockify error).');
			} else {
				window.AiClive.errorCount += 1;
				setTimeout(() => {
					LiveActions.tryWebsocket();
				}, 2000 * window.AiClive.errorCount);
			}
		};
		// window.AiClive.socket.onopen = function (event) {
		window.AiClive.socket.onopen = function () {
			debug('socket test on open');
			debug(LiveActions);
			window.AiClive.socket.close();
			window.rfb.connect(window.AiClive.host, window.AiClive.port, window.AiClive.password, window.AiClive.path);
		};
		// window.AiClive.socket.onclose = function (event) {
		window.AiClive.socket.onclose = function () {
			debug('socket test on close');
		};
	} catch (exc) {
		// ignore errors
	}
};

LiveActions.tryConnection = function (vmhost, vmport, amvId) {
	// This is noVNC dependent
	window.INCLUDE_URI = '/noVNC/';
	// FIXME: probably not the best way to set global var.
	const AuthActions = require('app/actions/auth');
	const token = ` Bearer ${AuthActions.getToken()}`;
	window.AiClive = {
		host: window.GobyAppGlobals.config.backend.host,
		port: window.GobyAppGlobals.config.backend.port,
		password: '',
		// path: `android/${amvId}/screen`,
		path: `android/${amvId}/screen?token=${token}`,
		audioPath: `android/${amvId}/audio?token=${token}`,
		socket: null,
		// first try instantly, second on +2s, third on +4s... +6
		maxTries: 3,
		errorCount: 0,
		timeout: 15000,
		completed: false,
		timeoutcb: null
	};
	// window.AiClive = {
	// 	host: vmhost,
	// 	port: vmport,
	// 	password: '',
	// 	path: 'websockify',
	// 	socket: null,
	// 	// first try instantly, second on +2s, third on +4s... +6
	// 	maxTries: 3,
	// 	errorCount: 0,
	// 	timeout: 15000,
	// 	completed: false,
	// 	timeoutcb: null
	// };

	LiveActions.logMessage('Loading noVNC utils.');
	// Load supporting scripts
	// noVNC@v5.0.1
	Util.load_scripts(['webutil.js', 'base64.js', 'websock.js', 'des.js',
										'keysymdef.js', 'keyboard.js', 'input.js', 'display.js',
										'jsunzip.js', 'rfb.js', 'keysym.js']);
	// When finished will call onscriptsload
	setTimeout(() => {
		if (!window.AiClive.completed) {
			window.AiClive.completed = true;
			LiveActions.logMessage('noVNC utils load failed.');
			LiveActions.liveConnect.failed('Unable to connect session (timeout error).');
		}
	}, window.AiClive.timeout);
};

LiveActions.tryLoadNoVNC = function (cb) {
	LiveActions.logMessage('Loading noVNC core.');
	$.getScript('/noVNC/util.js')
	.done(() => {
		if (typeof Util === 'undefined') {
			LiveActions.logMessage('noVNC core load failed.');
			cb({success: false, errorMessage: 'Failed to set noVNC core.'});
		} else {
			LiveActions.logMessage('noVNC core loaded.');
			cb({success: true});
		}
	})
	.fail(() => {
		LiveActions.logMessage('noVNC core load failed.');
		cb({success: false, errorMessage: 'Failed to load noVNC core.'});
	});
};

LiveActions.tryAudioConnection = function (audiohost, audioport, cb) {
	const gobyVMAudio = document.getElementById('gobyVMAudio');
	gobyVMAudio.tries = 0;
	gobyVMAudio.maxTries = 4;
	gobyVMAudio.addEventListener('error', function (e) {
		debug('audio error:', arguments);
		// audio playback failed - show a message saying why
		// to get the source of the audio element use $(this).src
		switch (e.target.error.code) {
			case e.target.error.MEDIA_ERR_ABORTED:
				debug('You aborted the video playback.');
				break;
			case e.target.error.MEDIA_ERR_NETWORK:
				debug('A network error caused the audio download to fail.');
				break;
			case e.target.error.MEDIA_ERR_DECODE:
				debug('The audio playback was aborted due to a corruption problem or because the video used features your browser did not support.');
				break;
			case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
				debug('The video audio not be loaded, either because the server or network failed or because the format is not supported.');
				gobyVMAudio.tries += 1;
				if (gobyVMAudio.tries < gobyVMAudio.maxTries) {
					debug('audio trying again in', 2000 * gobyVMAudio.tries);
					setTimeout(() => {
						debug('audio setting src', gobyVMAudio.src + gobyVMAudio.tries);
						gobyVMAudio.src += gobyVMAudio.tries;
						gobyVMAudio.play();
					}, 2000 * gobyVMAudio.tries);
				} else {
					debug('audio max tries reached.');
				}
				break;
			default:
				debug('An unknown error occurred.');
				break;
		}
	}, false);
	gobyVMAudio.addEventListener('canplay', function () {
		debug('audio canplay:', arguments);
		if (gobyVMAudio.duration === 0 || gobyVMAudio.paused) {
			debug('audio canplay not pause');
			gobyVMAudio.play();
		}
	}, false);
	// FIXME: put url parser
	// const audioURL = `http://${audiohost}:${audioport}/test.webm?uid=${Date.now()}`;
	const audioURL = `https://${window.AiClive.host}:${window.AiClive.port}/${window.AiClive.audioPath}&uid=${Date.now()}`;
	debug('setting audio url', audioURL);
	gobyVMAudio.src = audioURL;
	gobyVMAudio.play();
	cb({success: true, errorMessage: ''});
};

LiveActions.stopAudioConnection = function () {
	const gobyVMAudio = document.getElementById('gobyVMAudio');
	debug(gobyVMAudio);
	if (gobyVMAudio) {
		gobyVMAudio.pause();
		gobyVMAudio.src = '';
	}
};

module.exports = LiveActions;
