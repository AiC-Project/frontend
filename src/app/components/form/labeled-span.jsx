'use strict';

import React from 'react';

const LabeledSpan = (props, context) => {
	const hasValue = 'value' in props;

	const {
		className,
		off,
		key,
		value,
		label,
		style,
		...others
	} = props;

	const styles = {
		label: {
			position: 'relative',
			// transform: 'scale(0.75)', // hasValue ? 'perspective(1px) scale(0.75) translate3d(0px, -20px, 0px)' : 'scale(0.75)',
			// transformOrigin: 'left top 0px',
			color: off ? context.muiTheme.palette.disabledColor : context.muiTheme.palette.primary1Color,
			fontWeight: 500,
			whiteSpace: 'nowrap',
			display: 'block',
			fontSize: '0.75em',
			lineHeight: '0.9em'
		},
		root: {
			marginTop: 14,
			marginRight: 14,
			display: 'inline-block',
			lineHeight: '20px',
			position: 'relative'
		},
		value: {
			color: 'rgba(0, 0, 0, 0.5)',
			minHeight: 15,
			display: 'inline-block'
		}
	};

	const spanValue = <span className={`sp${className}`} style={styles.value}>{value}</span>;

	return (
		<span {...others} className={`spWrapper${className}`} style={Object.assign(styles.root, style)} key={key}>
			<label className={`lb${className}`} style={styles.label}>{label}</label>
			{hasValue && spanValue}
		</span>
	);
};

LabeledSpan.contextTypes = {
	muiTheme: React.PropTypes.object
};

LabeledSpan.defaultProps = {
	key: null,
	off: false,
	style: {}
};

LabeledSpan.propTypes = {
	value: React.PropTypes.node,
	label: React.PropTypes.node,
	key: React.PropTypes.string,
	className: React.PropTypes.string,
	off: React.PropTypes.bool,
	style: React.PropTypes.object
};

module.exports = LabeledSpan;
