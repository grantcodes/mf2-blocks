/**
 * BLOCK: indieweb
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

import { BiLink as LinkIcon } from "react-icons/bi";
import Edit from "./edit";
import blockTypes from "./data";

//  Import CSS.
import "./editor.scss";
import "./style.scss";

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType("indieweb/url", {
	title: __("IndieWeb URL"),
	icon: LinkIcon,
	category: "indieweb",
	keywords: [
		__("Reply"),
		__("Repost"),
		__("Like"),
		__("Bookmark"),
		__("Quote"),
	],

	attributes: {
		url: {
			type: "string",
			source: "attribute",
			selector: "a",
			attribute: "href",
		},
		property: {
			type: "string",
			source: "attribute",
			selector: "a",
			attribute: "class",
		},
	},

	supports: {
		align: false,
		html: false,
		multiple: false,
		reusable: false,
	},

	variations: blockTypes.map((block, i) => {
		return {
			name: block.property,
			isDefault: i === 0,
			title: block.title,
			description: block.description,
			icon: block.icon,
			attributes: { property: block.property },
		};
	}),

	edit: Edit,

	save: ({ className, attributes }) => (
		<div className={className}>
			<a className={attributes.property} href={attributes.url}>
				{attributes.url}
			</a>
		</div>
	),
});
