'use strict';

import React from 'react';
import Typography from 'material-ui/styles/typography';
import RaisedButton from 'material-ui/RaisedButton';
import FullWidthSection from 'app/components/shared/full-width-section';
import LoginDialog from 'app/components/dialog/dialog-login';
import AuthPage from 'app/components/shared/auth-page';
import AuthStore from 'app/stores/auth';
import AuthActions from 'app/actions/auth';

const debug = require('debug')('AiC:Views:Home');

const Home = class extends AuthPage {

	constructor(props) {
		super(props);
		this.handleLoginOpen = () => {
			this.setState({loginDialogOpen: true, loginErrorMessage: ''});
		};
		this.handleLoginClose = e => {
			e.preventDefault();
			this.setState({loginDialogOpen: false});
		};
		this.handleLoginSubmit = data => {
			AuthActions.login(data);
		};
		this.handleStateChange = newState => {
			debug('handleStateChange newState', newState);
			// TODO: this should be in the store not in the view
			if (newState.login.status === 'LOGIN_STATUS_CONNECTED') {
				debug('this.context.router', this.context.router);
				debug('this.props.location', this.props.location);
				debug('this.context.route', this.context.route);
				debug('this.context.location', this.context.location);
				AuthActions.redirectConnected(this.context.router, this.props.location);
			} else {
				const loginError = newState.login && newState.login.status === 'LOGIN_STATUS_CONNECT_FAILED' ? newState.login.message : '';
				const extraNewState = Object.assign({}, newState, {loginErrorMessage: loginError});
				this.setState(extraNewState);
			}
		};
		this.state = {
			loginDialogOpen: false,
			loginErrorMessage: ''
		};
	}

	render() {
		const palette = this.context.muiTheme.palette;
		const styles = {
			root: {
				overflow: 'hidden',
				backgroundImage: 'url(img/logo.png)',
				height: 'calc(100vh - 30px)',
				backgroundSize: 'auto calc(100vh - 30px)',
				position: 'relative',
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center'
			},
			svgLogo: {
				width: '420px'
			},
			tagline: {
				textAlign: 'center',
				bottom: '10vh',
				position: 'absolute',
				width: '100%'
			},
			label: {
				color: palette.accent1Color
			},
			buttonStyle: {
				margin: '16px 16px 0px 16px'
			},
			h2: {
				color: palette.textLightColor,
				fontWeight: Typography.fontWeightLight,
				fontSize: '20px',
				lineHeight: '28px',
				marginBottom: '13px',
				letterSpacing: '0px'
			},
			nowrap: {
				whiteSpace: 'nowrap'
			},
			taglineWhenLarge: {
				marginTop: '32px'
			},
			h1WhenLarge: {
				fontSize: '56px'
			},
			h2WhenLarge: {
				fontSize: '24px',
				lineHeight: '32px',
				paddingTop: '16px',
				marginBottom: '12px'
			}
		};

		return (
			<div style={{background: 'linear-gradient(to bottom, #c7e3f1 0%,#ffffff 100%)'}}>
				<FullWidthSection style={styles.root}>
					<div style={styles.tagline}>
						<RaisedButton
							label="Login"
							title="Login"
							onClick={this.handleLoginOpen}
							style={styles.buttonStyle}
							primary
							/>
						<LoginDialog
							open={this.state.loginDialogOpen}
							onRequestClose={this.handleLoginClose}
							onLoginSubmit={this.handleLoginSubmit}
							location={this.props.location}
							error={this.state.loginErrorMessage}
							formDisabled={this.state && this.state.login && this.state.login.status === 'LOGIN_STATUS_CONNECTING'}
							/>
					</div>
				</FullWidthSection>
			</div>
		);
	}

	willTransitionTo() {
		super.willTransitionTo();
	}

	componentDidMount() {
		this.unsubscribe = AuthStore.listen(this.handleStateChange);
		AuthStore.init();
	}

	componentWillUnmount() {
		this.unsubscribe();
		debug('unsubscribe');
	}

};

Home.contextTypes = {
	router: React.PropTypes.object,
	muiTheme: React.PropTypes.object,
	loginStatus: React.PropTypes.object
};

Home.propTypes = {
	location: React.PropTypes.object
};

module.exports = Home;
