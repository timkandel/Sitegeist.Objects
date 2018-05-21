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
import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import Layout from '../../ui/layout';

export const GET_STORE = gql`
	query getStore(
		$context: ContentContextInput!,
		$identifier: ID!,
		$from: Int!,
		$length: Int!,
		$search: String,
		$sort: String,
		$order: String,
		$filters: [JSON]
	) {
		store(context: $context, identifier: $identifier) {
			identifier
			icon
			label
			title
			description
			nodeType {
				allowedChildNodeTypes {
					name
					label
					icon
				}
			}
			parents {
				type
				identifier
				icon
				label
			}
			objectIndex(from: $from, length: $length, sort: $sort, order: $order, search: $search, filters: $filters) {
				totalNumberOfRows
				filterConfiguration {
					name
					property
					label
					operations
				}
				tableHeads {
					name
					label
					sortProperty
				}
				tableRows {
					object {
						identifier
						icon
						label
						isRemoved
						isHidden
						hasUnpublishedChanges
					}
					tableCells {
						value
					}
				}
			}
		}
	}
`;

/* @TODO: PropTypes */
const GetStoreQuery = ({children, context, identifier, from, length, sort, order, search, filters}) => (
	<Query
		query={GET_STORE}
		variables={{context, identifier, from, length, sort, order, search, filters}}
	>
		{({loading, error, data}) => {
			//
			// @TODO: Better load handling
			//
			if (loading) {
				return (
					<Layout
						renderHeader={() => null}
						renderFooter={() => null}
					>
						{() => 'Loading...'}
					</Layout>
				);
			}
			if (error) {
				return `Error: ${error}`;
			}

			return children(data);
		}}
	</Query>
);

GetStoreQuery.propTypes = {
	context: PropTypes.shape({
		workspaceName: PropTypes.string.isRequired,
		invisibleContentShown: PropTypes.bool.isRequired,
		removedContentShown: PropTypes.bool.isRequired,
		inaccessibleContentShown: PropTypes.bool.isRequired
	}),
	identifier: PropTypes.string.isRequired,
	children: PropTypes.func.isRequired
};

GetStoreQuery.defaultProps = {
	/* @TODO: Better context handling */
	context: window.Sitegeist.Objects.contentContext
};

export default GetStoreQuery;
