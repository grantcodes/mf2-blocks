/**
 * BLOCK: indieweb
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

import {
	BiReply as ReplyIcon,
	BiLike as LikeIcon,
	BiRepost as RepostIcon,
	BiBookmark as BookmarkIcon,
} from "react-icons/bi";
import { RiChatQuoteLine as QuoteIcon } from "react-icons/ri";

const { __ } = wp.i18n;

const urlTypes = [
	{
		property: "in-reply-to",
		title: __("In Reply To", "indieweb"),
		description: __("In reply to", "indieweb"),
		icon: ReplyIcon,
	},
	{
		property: "repost-of",
		title: __("Repost Of", "indieweb"),
		description: __("Repost of", "indieweb"),
		icon: RepostIcon,
	},
	{
		property: "like-of",
		title: __("Like Of", "indieweb"),
		description: __("Like of", "indieweb"),
		icon: LikeIcon,
	},
	{
		property: "bookmark-of",
		title: __("Bookmark Of", "indieweb"),
		description: __("Bookmark of", "indieweb"),
		icon: BookmarkIcon,
	},
	{
		property: "quote-of",
		title: __("Quote Of", "indieweb"),
		description: __("Quote of", "indieweb"),
		icon: QuoteIcon,
	},
];

export default urlTypes;
