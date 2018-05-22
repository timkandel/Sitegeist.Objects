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

import Condition from '../../core/util/condition';
import Confirm from '../../core/util/confirm';

import EditorManager from '../../core/plugin/editorManager';

import Icon from '../../ui/primitives/icon';
import Button from '../../ui/primitives/button';
import ButtonList from '../../ui/primitives/buttonList';
import Breadcrumb from '../../ui/structures/breadcrumb';
import Tabs from '../../ui/structures/tabs';
import Group from '../../ui/structures/group';

import Layout from '../../ui/layout';

import Controller from './controller';

/**
 * @TODO: renderParent Redundancy
 */
const renderParent = (parent, index, parents) => {
	switch (parent.type) {
		case 'object': {
			const grandparent = parents[index - 1];

			return {
				icon: parent.icon,
				label: parent.label,
				link: `/${grandparent.type}/${grandparent.identifier}/edit/${parent.identifier}`
			};
		}

		case 'store':
		default:
			return {
				icon: parent.icon,
				label: parent.label,
				link: `/${parent.type}/${parent.identifier}`
			};
	}
};

const Body = styled.div`
	padding: 0 54px!important;
`;

export default class DetailView extends Component {
	static propTypes = {
		storeIdentifier: PropTypes.string.isRequired,
		nodeType: PropTypes.string,
		objectIdentifier: PropTypes.string
	};

	static defaultProps = {
		nodeType: null,
		objectIdentifier: null
	};

	render() {
		const {storeIdentifier, nodeType, objectIdentifier} = this.props;

		return (
			<Controller
				storeIdentifier={storeIdentifier}
				objectIdentifier={objectIdentifier}
				nodeType={nodeType}
				forceUpdate={() => {
					this.forceUpdate();
				}}
			>
				{({
					store,
					...controller
				}) => (
					<React.Fragment>
						{this.renderBreadCrumb(store)}
						{this.renderBody({store, ...controller})}
					</React.Fragment>
				)}
			</Controller>
		);
	}

	renderBreadCrumb = store => {
		const {storeIdentifier, objectIdentifier} = this.props;

		return (
			<Breadcrumb
				items={[
					...[...store.objectDetail.object.parents].reverse().map(renderParent),
					{
						icon: store.objectDetail.object.icon,
						label: objectIdentifier ?
							`${store.objectDetail.object.label} bearbeiten` : /* @TODO: I18n */
							`Neues ${store.objectDetail.object.label} erstellen`, /* @TODO: I18n */
						link: objectIdentifier ?
							`/store/${storeIdentifier}/edit/${objectIdentifier}` :
							`/store/${storeIdentifier}/create/${store.objectDetail.object.nodeType.name}`,
						isActive: true
					}
				]}
			/>
		);
	}

	renderBody = ({store, transient, ...controller}) => {
		const {storeIdentifier, nodeType, objectIdentifier} = this.props;

		return (
			<Tabs tabs={store.objectDetail.tabs}>
				{tab => (
					<Layout
						renderHeader={tab.renderTabsHeader}
						renderFooter={() => this.renderFooter({
							store,
							transient,
							...controller
						})}
					>
						{() => (
							<Body>
								{tab.groups.map(group => (
									<Group
										key={group.name}
										headline={
											<React.Fragment>
												<Icon className={group.icon}/>
												{group.label}
											</React.Fragment>
										}
									>
										{group.properties.map(property => (
											<EditorManager
												key={property.name}
												name={property.editor}
												property={property}
												transient={transient}
												storeIdentifier={storeIdentifier}
												objectIdentifier={objectIdentifier}
												nodeType={nodeType}
											/>
										))}
									</Group>
								))}
							</Body>
						)}
					</Layout>
				)}
			</Tabs>
		);
	}

	renderFooter = ({
		store,
		transient,
		isBusy,
		createObjectMutation,
		createObjectAndContinueMutation,
		updateObjectMutation,
		removeObjectMutation
	}) => (
		<ButtonList>
			<Condition condition={Boolean(store.objectDetail.object.identifier)}>
				<Button
					disabled={isBusy || !transient.hasValues}
					onClick={() => updateObjectMutation.updateObject(transient.values)}
				>
					<Icon className="icon-save"/>
					Speichern
				</Button>
			</Condition>

			<Condition condition={!store.objectDetail.object.identifier}>
				<Button
					disabled={isBusy || !transient.hasValues}
					onClick={() => createObjectMutation.createObject(transient.values)}
				>
					<Icon className="icon-plus"/>
					{/* @TODO: I18n */}
					Erstellen
				</Button>
			</Condition>

			<Condition condition={!store.objectDetail.object.identifier}>
				<Button
					disabled={isBusy || !transient.hasValues}
					onClick={() => {
						createObjectAndContinueMutation.createObject(transient.values);
						transient.reset();
					}}
				>
					<Icon className="icon-plus"/>
					{/* @TODO: I18n */}
					Erstellen & weiter
				</Button>
			</Condition>

			<Condition condition={transient.hasValues}>
				<Button disabled={isBusy} onClick={transient.reset}>
					<Icon className="icon-undo"/>
					{/* @TODO: I18n */}
					Zurücksetzen
				</Button>
			</Condition>

			<Condition condition={Boolean(store.objectDetail.object.identifier)}>
				<Confirm
					question={`Wollen Sie ${store.objectDetail.object.label} wirklich löschen?`}
					onConfirm={removeObjectMutation.removeObject}
				>
					{confirm => (
						<Button
							disabled={isBusy}
							className="neos-button-danger"
							onClick={confirm.show}
						>
							<Icon className="icon-trash"/>
							{/* @TODO: I18n */}
							Löschen
						</Button>
					)}
				</Confirm>
			</Condition>
		</ButtonList>
	);
}