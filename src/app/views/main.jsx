/* global window */
// TODO: remove global window
'use strict';

import React from 'react';
import * as Colors from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppTheme from 'app/configs/app-theme';
import FullWidthSection from 'app/components/shared/full-width-section';
import SessionEndedDialog from 'app/components/dialog/dialog-session-ended';
import AuthStore from 'app/stores/auth';
import AppConfigStore from 'app/stores/app-config';
import AppStore from 'app/stores/app';
import AuthActions from 'app/actions/auth';
import AppConfigActions from 'app/actions/app-config';
import AppActions from 'app/actions/app';
import ServerErrorDialog from 'app/components/dialog/dialog-server-error';
import Snackbar from 'material-ui/Snackbar';
import {deepAssign} from 'app/libs/helpers';

const debug = require('debug')('AiC:Views:Main');

const Main = class extends React.Component {
	constructor(props) {
		super(props);
		this._onHomeClick = this._onHomeClick.bind(this);
		this._onStateChange = this._onStateChange.bind(this);
		this.handleSessionEndedDialogClose = this.handleSessionEndedDialogClose.bind(this);
		this.handleSessionEndedDialogOpen = this.handleSessionEndedDialogOpen.bind(this);
		this.state = {
			sessionEndedDialogOpen: false,
			serverErrorDialogOpen: false
		};
		this.unsubscribe = [];

		// this.handleServerErrorDialogOpen = () => this.setState({serverErrorDialogOpen: true});
		this.handleServerErrorDialogClose = () => AppActions.hideServerError();
	}

	_onHomeClick() {
		this.context.router.push('/');
	}

	getChildContext() {
		return {
			muiTheme: AppTheme,
			appConfig: this.state.config ? this.state.config : {},
			loginStatus: this.state.login ? this.state.login : {}
		};
	}

	handleSnackbarClose = () => {
		AppActions.closeSnackBar();
	}

	render() {
		const styles = {
			footer: {
				backgroundColor: Colors.grey900,
				textAlign: 'center',
				lineHeight: '30px'
			},
			a: {
				color: Colors.darkWhite
			},
			p: {
				margin: '0 auto',
				padding: '0',
				color: Colors.lightWhite,
				maxWidth: '335px'
			},
			iconButton: {
				color: Colors.darkWhite
			},
			root: {
				// backgroundColor: ThemeManager.getCurrentTheme().palette.logo1Color,
				backgroundColor: AppTheme.palette.logo1Color,
				overflow: 'hidden',
				width: '100vw',
				height: '100vh',
				color: 'white',
				textAlign: 'center'
			}
		};

		const styleContent = {
			background: '#fff',
			minHeight: 'calc(100vh - 30px)'
		};
		// debug('render state ', this.state);

		if (this.state.config && this.state.config.isLoaded && !this.state.config.hasErrors) {
			return (
				<MuiThemeProvider muiTheme={AppTheme}>
					<div>
						<div style={styleContent}>
						{this.props.children}
						</div><div style={styles.footer}><p style={styles.p}>COPYRIGHT © AiC 2.0</p></div>
						<SessionEndedDialog open={this.state.sessionEndedDialogOpen} onRequestClose={this.handleSessionEndedDialogClose}/>
						<ServerErrorDialog open={this.state.app ? this.state.app.serverError.open : false} onRequestClose={this.handleServerErrorDialogClose} message={this.state.app ? this.state.app.serverError.message : ''}/>
						{this.state && this.state.app && <Snackbar
							open={this.state.app.snackBar.open}
							message={this.state.app.snackBar.message}
							action="close"
							autoHideDuration={10000}
							onRequestClose={this.handleSnackbarClose}
							onActionTouchTap={this.handleSnackbarClose}
							/>}
					</div>
				</MuiThemeProvider>
			);
		}

		if (this.state.config && this.state.config.isLoaded && this.state.config.hasErrors) {
			return (
				<FullWidthSection style={styles.root}>
					It was not possible to load the application. <br/>
					Please contact administrator to verify the application installation.
				</FullWidthSection>
			);
		}

		return (
			<FullWidthSection style={styles.root}>
				Loading application configuration.
			</FullWidthSection>
		);
	}

	handleSessionEndedDialogClose() {
		debug('handleSessionEndedDialogClose', this.context.router, this.props.location);
		AuthActions.redirectDisconnected(this.context.router, this.props.location);
		this.setState({sessionEndedDialogOpen: false});
	}

	handleSessionEndedDialogOpen() {
		this.setState({sessionEndedDialogOpen: true});
	}

	_onStateChange(newState) {
		debug('main new state', newState);
		if (newState.login) {
			debug('this.context.router', this.context.router);
			debug('this.props.location', this.props.location);
			// const currentPathName = AuthActions.getPathName(this.context.router);
			const currentPathName = this.props.location.pathname;
			if ((newState.login.status === 'LOGIN_STATUS_DISCONNECTED' || newState.login.status === 'LOGIN_STATUS_DISCONNECT_FAILED') &&
				currentPathName !== '/' &&
				currentPathName !== '/home') {
				if (newState.login.showMessage) {
					this.handleSessionEndedDialogOpen();
				} else {
					AuthActions.redirectDisconnected(this.context.router, this.props.location);
				}
			}
			// One baby panda dies each time we use window.GobyAppGlobals
			// TODO: Therefore we MUST change this
			// We need this because WillTransitionTo have no this.* this.context, etc
			// and we need login information on WillTransitionTo of AuthRequired component
			window.GobyAppGlobals.login = newState.login;
			this.setState(newState);
			debug('changed main state', newState);
		}
		if (newState.config) {
			debug('Config loaded');
			window.GobyAppGlobals.config = newState.config;
			// debug('main new state config', newState, window.GobyAppGlobals);
			// Set state MUST be the last call
			this.setState(newState);
		}
		if (newState.app) {
			if (newState.app.notFound) {
				if (this.props.location.pathname === '/not-found') {
					AppActions.notFoundOff();
				} else {
					this.context.router.replace('/not-found');
				}
			} else {
				const mergedState = deepAssign({}, this.state, {app: newState.app});
				debug('setState', mergedState);
				this.setState(mergedState);
			}
		}
	}

	componentWillMount() {
		debug('Main componentWillMount');
		// ThemeManager.setPalette(GobyPalette);
		// ThemeManager.setTheme(GobyTheme);
		this.unsubscribe.push(AuthStore.listen(this._onStateChange));
		AuthStore.init();
		this.unsubscribe.push(AppConfigStore.listen(this._onStateChange));
		AppConfigActions.load();

		this.unsubscribe.push(AppStore.listen(this._onStateChange));
	}

	// componentDidMount() {
	//   this.unsubscribe.push(AuthStore.listen( this._onStateChange ));
	//   AuthStore.init();
	//   this.unsubscribe.push(AppConfigStore.listen( this._onStateChange ));
	//   AppConfigActions.load();
	// }

	componentWillUnmount() {
		// Subscribe and unsubscribe because we don't want to use the mixins
		this.unsubscribe.forEach(func => {
			func();
		});
		debug('unsubscribe');
	}

};

Main.willTransitionTo = function (transition, params, query, callback) {
	debug('Main willTransitionTo');
	// this.unsubscribe.push(AppConfigStore.listen( this._onStateChange ));
	// AppConfigActions.load();
	callback();
};

Main.contextTypes = {
	router: React.PropTypes.object,
	muiTheme: React.PropTypes.object,
	appConfig: React.PropTypes.object
};

Main.childContextTypes = {
	muiTheme: React.PropTypes.object,
	appConfig: React.PropTypes.object,
	loginStatus: React.PropTypes.object
};

Main.propTypes = {
	location: React.PropTypes.object,
	children: React.PropTypes.node
};

module.exports = Main;
