'use strict';

import React from 'react';
import Toolbar from 'material-ui/Toolbar/Toolbar';
import ToolbarGroup from 'material-ui/Toolbar/ToolbarGroup';
import ToolbarSeparator from 'material-ui/Toolbar/ToolbarSeparator';
import ToolbarTitle from 'material-ui/Toolbar/ToolbarTitle';
import FontIcon from 'material-ui/FontIcon';
import iconList from 'app/components/icon/icon-list';

const ToolbarLive = props => {
	const styleToolbar = {justifyContent: 'initial'};
	const styleSeparator = {margin: '0 5px 0 0px'};
	const styleButtons = {marginTop: 5};
	const styleIcon = {
		cursor: 'default',
		margin: '16px 36px 0px -6px',
		width: 24
	};

	const canUserCreateVm = props.vmCount < props.vmMaxAllowed;

	const buttons = [
		{
			id: 'start',
			tooltip: canUserCreateVm ? 'Start session' : 'quota reached',
			fontIcon: 'mdi mdi-play',
			disabled: !canUserCreateVm
		}
	];

	const renderedButtons = iconList({
		buttons,
		style: styleButtons,
		onClick: {
			start: props.onClickStart
		},
		iconClassNamePrefix: 'btLive',
		selectedId: null
	});

	return (
		<Toolbar style={Object.assign(props.style || {}, styleToolbar)}>
			<FontIcon style={styleIcon} className="mdi mdi-android" color="rgba(0, 0, 0, 0.4)"/>
			<ToolbarGroup firstChild lastChild>
				<ToolbarTitle className="txtLiveTitle" text="Live sessions"/>
				<ToolbarSeparator style={styleSeparator}/>
				{renderedButtons}
			</ToolbarGroup>
		</Toolbar>
	);
};

ToolbarLive.propTypes = {
	style: React.PropTypes.object,
	onClickStart: React.PropTypes.func,
	variants: React.PropTypes.array.isRequired,
	vmCount: React.PropTypes.number.isRequired,
	vmMaxAllowed: React.PropTypes.number.isRequired
};

module.exports = ToolbarLive;
