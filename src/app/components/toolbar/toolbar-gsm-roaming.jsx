'use strict';

// Vendor
import React from 'react';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import FontIcon from 'material-ui/lib/font-icon';
import Paper from 'material-ui/lib/paper';
import SelectField from 'material-ui/lib/SelectField';
import MenuItem from 'material-ui/lib/menus/menu-item';
import RaisedButton from 'material-ui/lib/raised-button';

// APP
// TODO: Change to a single place, I think this repeats at app/libs/backend-api.js
const GSMRoaming = ['home', 'denied', 'searching', 'roaming', 'none'];

const ToolbarGSMRoaming = class extends React.Component {

	constructor(props) {
		super(props);
		this.state = {value: null};
		this.handleChange = (event, index, value) => {
			this.setState({value});
		};
		this.handleClick = e => {
			const payload = {
				action_type: 'SET_NETWORK_REGISTRATION', // eslint-disable-line camelcase
				registration: this.state.value
			};
			this.props.onChange(e, payload);
		};
	}

	render() {
		const styles = {
			separator: {
				margin: '0 15px 0 0px',
				float: 'left'
			},
			items: {
				float: 'left'
			},
			paper: {
				height: 56
			},
			icon: {
				margin: '15px 10px 0 10px',
				float: 'left'
			},
			buttonSubmit: {
				float: 'left',
				marginTop: 10,
				marginLeft: 15
			}
		};
		// TODO: should check all other panels for the style presence
		if (this.props.style) {
			styles.paper = Object.assign({}, this.props.style, styles.paper);
		}

		const items = [];
		GSMRoaming.forEach(v => {
			items.push(<MenuItem value={v} key={v} primaryText={v}/>);
		});
		return (
			<Paper style={styles.paper} zDepth={1}>
				<FontIcon style={styles.icon} className="mdi mdi-home" color="rgba(0, 0, 0, 0.4)"/>
				<ToolbarSeparator style={styles.separator}/>
				<SelectField className="inputLiveGSMRoaming" style={styles.items} maxHeight={300} value={this.state.value} onChange={this.handleChange}>
					{items}
				</SelectField>
				<RaisedButton
					className="btLiveGSMRoamingSubmit"
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

ToolbarGSMRoaming.contextTypes = {
	muiTheme: React.PropTypes.object,
	router: React.PropTypes.object
};

ToolbarGSMRoaming.propTypes = {
	style: React.PropTypes.object,
	onChange: React.PropTypes.func
};

module.exports = ToolbarGSMRoaming;
