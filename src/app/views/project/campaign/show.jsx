'use strict';

import React from 'react';
import CampaignStore from 'app/stores/campaign';
import CampaignActions from 'app/actions/campaign';
import PanelCampaignShow from 'app/components/panel/panel-campaign-show';

const debug = require('debug')('AiC:Views:Campaign:CampaignShow');

const CampaignShow = class extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		if (this.state.campaign) {
			return (<PanelCampaignShow {...this.state.campaign.campaign}/>);
		}
		return <div>Loading</div>;
	}

	handleStateChange = newState => {
		this.setState(newState);
	}

	componentDidMount() {
		debug('componentDidMount');
		this.unsubscribe = [];
		this.unsubscribe.push(CampaignStore.listen(this.handleStateChange));
		CampaignActions.read({projectId: this.props.params.projectId, campaignId: this.props.params.campaignId});
	}

	componentWillUnmount() {
		debug('componentWillUnmount');
		this.unsubscribe.map(fn => fn());
	}
};

CampaignShow.contextTypes = {
	router: React.PropTypes.object
};

CampaignShow.propTypes = {
	params: React.PropTypes.object
};

module.exports = CampaignShow;
