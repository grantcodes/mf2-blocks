/**
 * BLOCK: indieweb
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

import { BiLink as LinkIcon } from "react-icons/bi";
import { useState } from "@wordpress/element";
import { Placeholder, TextControl, Button } from "@wordpress/components";
import blockTypes from "./data";

const { __ } = wp.i18n; // Import __() from wp.i18n

const Edit = ({ attributes, setAttributes, className }) => {
	const { url, property } = attributes;
	const blockData = blockTypes.find((b) => b.property === property);
	const icon = blockData ? blockData.icon : LinkIcon;

	const [isEditing, setIsEditing] = useState(false);

	if (!url || isEditing) {
		return (
			<Placeholder
				icon={icon}
				label="Enter URL"
				instructions="Enter the URL you are replying to."
			>
				<form
					onSubmit={(e) => {
						setIsEditing(false);
					}}
				>
					{/* <TextControl
						type="url"
						value={url}
						label="URL"
						onChange={(val) => {
							if (!isEditing) {
								setIsEditing(true);
							}
							setAttributes({ url: val });
						}}
						required
					/> */}
					<input
						type="url"
						value={url || ""}
						className="components-placeholder__input"
						aria-label="URL"
						placeholder={__("Enter URL here…")}
						onChange={(e) => {
							if (!isEditing) {
								setIsEditing(true);
							}
							setAttributes({ url: e.target.value });
						}}
					/>
					<Button type="submit" isPrimary>
						Set URL
					</Button>
				</form>
			</Placeholder>
		);
	}
	return (
		<div className={className}>
			<a className={property} href={url}>
				{url}
			</a>
		</div>
	);
};

export default Edit;
