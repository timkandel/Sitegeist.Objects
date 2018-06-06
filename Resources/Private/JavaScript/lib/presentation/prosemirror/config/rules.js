import {inputRules, wrappingInputRule, textblockTypeInputRule, smartQuotes, emDash, ellipsis} from 'prosemirror-inputrules';

import schema from './schema';

export default inputRules({
	rules: [
		...smartQuotes,
		ellipsis,
		emDash,

		// > blockquote
		wrappingInputRule(
			/^\s*>\s$/,
			schema.nodes.blockquote
		),

		// 1. ordered list
		wrappingInputRule(
			/^(\d+)\.\s$/,
			schema.nodes.ordered_list,
			match => ({order: Number(match[1])}),
			(match, node) => node.childCount + node.attrs.order === Number(match[1])
		),

		// * Bullet list
		wrappingInputRule(
			/^\s*([-+*])\s$/,
			schema.nodes.bullet_list
		),

		// ``` code block
		textblockTypeInputRule(
			/^```$/,
			schema.nodes.code_block
		),

		// # heading
		textblockTypeInputRule(
			new RegExp('^(#{1,6})\\s$'),
			schema.nodes.heading,
			match => ({level: match[1].length})
		)
	]
});