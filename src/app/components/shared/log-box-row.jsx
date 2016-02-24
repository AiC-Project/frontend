'use strict';

// React
const React = require('react');

// Material design
const mui = require('material-ui');
const {
	Spacing,
	Colors
} = mui.Styles;

// const { Spacing } = mui.Styles;
// const {
//   Paper,
//   Table,
//   TableHeader,
//   TableHeaderColumn,
//   TableBody,
//   TableRow,
//   TableRowColumn } = mui;

// APP
const GobyPalette = require('app/configs/goby-palette');

const LogBoxRow = class extends React.Component {
	render() {
		const style = {
			root: {
				backgroundColor: this.props.style.backgroundColor || '#fff',
				color: this.props.style.color || GobyPalette.primary1Color,
				// fontFamily: this.context.muiTheme.contentFontFamily,
				fontSize: 12,
				padding: Spacing.desktopGutterMini / 2
			},
			time: {
				color: this.props.style.time ? this.props.style.time.color : Colors.grey600,
				marginRight: 4
			}
		};

		const time = <time style={style.time}>[{this.props.time}]</time>;

		return (
			<div style={style.root}>
				{time}{this.props.children}
			</div>
		);
	}

};

LogBoxRow.contextTypes = {
	muiTheme: React.PropTypes.object
};

LogBoxRow.propTypes = {
	children: React.PropTypes.object,
	style: React.PropTypes.object,
	time: React.PropTypes.string
};

module.exports = LogBoxRow;
