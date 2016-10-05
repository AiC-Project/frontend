'use strict';

import React from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';
import ToolbarEditFile from 'app/components/toolbar/toolbar-edit-file';
import TestActions from 'app/actions/test';
import 'brace/theme/github';
import 'app/libs/mode-aicdsl';

const debug = require('debug')('AiC:Views:TestEditor');
let projectId = null;
let testId = null;

const TestEditor = class extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		const testFile = this.importFile();
		return (
			<div>
				<ToolbarEditFile
					title="Test Editor"
					icon="mdi mdi-puzzle"
					/>
				<AceEditor
					mode="aicdsl"
					theme="github"
					onChange={onChange}
					name="Test-Editor"
					editorProps={{$blockScrolling: true}}
					value={String(testFile)}
					/>
			</div>
		);
	}

	isEdit() {
		if (this.props.params.testId === 'create') {
			return false;
		}
		return true;
	}

	importFile() {
		projectId = this.props.params.projectId;
		testId = this.props.params.testId;
		if (this.isEdit()) {
			return TestActions.download({projectId, testId});
			// return 'Edited test file: ' + this.props.params.testId;
		}
		return 'New test file';
	}

	componentDidMount() {
		TestActions.initiate();
	}
};

function onChange(newValue) {
	console.log('change', newValue);
}

TestEditor.contextTypes = {
	router: React.PropTypes.object,
	muiTheme: React.PropTypes.object
};

TestEditor.propTypes = {
	params: React.PropTypes.object
};

module.exports = TestEditor;
