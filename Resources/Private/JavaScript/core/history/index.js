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
import {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';

class History extends Component {
	static propTypes = {
		children: PropTypes.func.isRequired,
		history: PropTypes.object.isRequired
	};

	render() {
		return this.props.children(this.props.history);
	}
}

export default withRouter(History);