/**
 * https://github.com/WordPress/gutenberg/blob/master/packages/block-library/src/image/save.js
 * External dependencies
 */
import classnames from "classnames";
import { isEmpty } from "lodash";

/**
 * WordPress dependencies
 */
import { RichText } from "@wordpress/block-editor";
import { Fragment } from "@wordpress/element";

export default function save({ attributes }) {
	const {
		url,
		alt,
		caption,
		align,
		href,
		rel,
		linkClass,
		width,
		height,
		id,
		linkTarget,
		sizeSlug,
		title,
	} = attributes;

	const newRel = isEmpty(rel) ? undefined : rel;

	const classes = classnames({
		[`align${align}`]: align,
		[`size-${sizeSlug}`]: sizeSlug,
		"is-resized": width || height,
	});

	// TODO: May want to use a data el and link to full size image.
	const image = (
		<img
			src={url}
			alt={alt}
			className={classnames("u-photo", id ? `wp-image-${id}` : null)}
			width={width}
			height={height}
			title={title}
		/>
	);

	const figure = (
		<Fragment>
			{href ? (
				<a className={linkClass} href={href} target={linkTarget} rel={newRel}>
					{image}
				</a>
			) : (
				image
			)}
			{!RichText.isEmpty(caption) && (
				<RichText.Content tagName="figcaption" value={caption} />
			)}
		</Fragment>
	);

	if ("left" === align || "right" === align || "center" === align) {
		return (
			<div>
				<figure className={classes}>{figure}</figure>
			</div>
		);
	}

	return <figure className={classes}>{figure}</figure>;
}
