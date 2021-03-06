/*
 * Copyright notice
 *
 * (c) 2018 Wilhelm Behncke <behncke@sitegeist.de>
 * All rights reserved
 *
 * This file is part of the Sitegeist/Objects project under GPL-3.0.
 *
 * For the full copyright and license information, please read the
 * LICENSE.md file that was distributed with this source code.
 */
import TextInput from '../../../lib/presentation/primitives/textInput';

const {React, PropTypes} = window.Sitegeist.Objects.runtime;
const {Component} = window.Sitegeist.Objects.runtime.React;

window.Sitegeist.Objects.plugin.registerFilterEditor('SingleLineText', class SingleLineText extends Component {
	static propTypes = {
		commit: PropTypes.func.isRequired,
		value: PropTypes.string
	};

	static defaultProps = {
		value: ''
	};

	handleChange = event => {
		const {commit} = this.props;

		commit(event.target.value || null);
	}

	render() {
		const {value} = this.props;

		return (
			<TextInput
				value={value || ''}
				onChange={this.handleChange}
			/>
		);
	}
});
