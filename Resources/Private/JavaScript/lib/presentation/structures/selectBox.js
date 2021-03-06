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
import React, {Component} from 'shim/react';
import PropTypes from 'shim/prop-types';
import styled from 'shim/styled-components';

import Condition from '../../../core/util/condition';
import Toggle from '../../../core/util/toggle';
import Select from '../../../core/util/select';

import Button from '../primitives/button';
import Icon from '../primitives/icon';

const Overlay = styled.div`
	position: fixed;

	${props => props.isOpen && `
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 19999;
	`}
`;

const Container = styled.div`
	position: relative;
	display: inline-block;

	${props => props.isOpen && `
		z-index: 20000;
	`}
`;

const Chevron = styled(Icon)``;

const Head = styled.div`
	width: 100%;

	${Chevron} {
		margin-right: 0;
		margin-left: 10px;
		/* @TODO: There must be a better way... */
		font-size: 10px!important;
	}
`;

const Body = styled.div`
	position: absolute;
	left: 0;
	${({shouldOpenTop}) => shouldOpenTop ? 'bottom: 100%;' : 'top: 100%;'}
	display: ${props => props.isOpen ? 'block' : 'none'};
	width: 100%;
	min-width: 300px;
	max-height: 300px;
	overflow-y: scroll;
	background-color: #3f3f3f;

	${Button} {
		width: 100%;
	}
`;

const DefaultSelectHead = ({open, select}) => (
	<div>
		<Button>
			<Condition condition={Boolean(select.selectedItem.data.icon)}>
				<Icon className={select.selectedItem.data.icon}/>
			</Condition>
			{select.selectedItem.data.label}
			<Chevron className={open.is ? 'icon-chevron-up' : 'icon-chevron-down'}/>
		</Button>
	</div>
);

DefaultSelectHead.propTypes = {
	open: PropTypes.object.isRequired,
	select: PropTypes.shape({
		selectedItem: PropTypes.shape({
			data: PropTypes.shape({
				icon: PropTypes.string,
				label: PropTypes.string.isRequired
			})
		})
	}).isRequired
};

const DefaultSelectBody = ({select}) => (
	<React.Fragment>
		{select.allItems.map(({name, data}) => (
			<Button
				key={name}
				onMouseDown={event => {
					event.preventDefault();
					select.select(name);
				}}
			>
				<Condition condition={Boolean(data.icon)}>
					<Icon className={data.icon}/>
				</Condition>
				{data.label}
			</Button>
		))}
	</React.Fragment>
);

DefaultSelectBody.propTypes = {
	select: PropTypes.shape({
		allItems: PropTypes.arrayOf(PropTypes.shape({
			name: PropTypes.string.isRequired,
			data: PropTypes.shape({
				icon: PropTypes.string,
				value: PropTypes.string.isRequired,
				label: PropTypes.string.isRequired
			})
		}))
	}).isRequired
};

export default class SelectBox extends Component {
	static propTypes = {
		renderHead: PropTypes.func,
		children: PropTypes.func,
		onChange: PropTypes.func,
		className: PropTypes.string
	};

	static defaultProps = {
		renderHead: DefaultSelectHead,
		children: DefaultSelectBody,
		className: '',
		onChange: () => {}
	};

	handleRef = ref => {
		this.ref = ref;
	}

	render() {
		const {renderHead, children, onChange, ...rest} = this.props;

		return (
			<Toggle initial={false}>
				{open => (
					<Select
						onChange={({selectedItem}) => {
							onChange(selectedItem);
							open.setFalse();
						}}
						{...rest}
					>
						{select => (
							<Select {...rest}>
								{focus => (
									<React.Fragment>
										<Overlay
											isOpen={open.is}
											onMouseDown={event => {
												event.preventDefault();
												open.setFalse();
											}}
										/>
										<Container
											innerRef={this.handleRef}
											className={this.props.className}
											isOpen={open.is}
										>
											<Head
												onMouseDown={event => {
													event.preventDefault();
													open.toggle();
												}}
											>
												{renderHead({open, select, focus})}
											</Head>
											<Body
												isOpen={open.is}
												shouldOpenTop={(
													this.ref &&
													(window.innerHeight - this.ref.getBoundingClientRect().bottom) < 320
												)}
											>
												{children({open, select, focus})}
											</Body>
										</Container>
									</React.Fragment>
								)}
							</Select>
						)}
					</Select>
				)}
			</Toggle>
		);
	}
}
