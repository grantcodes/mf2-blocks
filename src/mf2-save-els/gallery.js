/**
 * https://github.com/WordPress/gutenberg/blob/master/packages/block-library/src/gallery/save.js
 * WordPress dependencies
 */
import { RichText } from "@wordpress/block-editor";
import classnames from "classnames";

/**
 * Internal dependencies
 */
function defaultColumnsNumber(attributes) {
	return Math.min(3, attributes.images.length);
}
const LINK_DESTINATION_ATTACHMENT = "post";
const LINK_DESTINATION_MEDIA = "file";

export default function save({ attributes }) {
	const {
		images,
		columns = defaultColumnsNumber(attributes),
		imageCrop,
		caption,
		linkTo,
	} = attributes;

	return (
		<figure className={`columns-${columns} ${imageCrop ? "is-cropped" : ""}`}>
			<ul className="blocks-gallery-grid">
				{images.map((image) => {
					let href;

					switch (linkTo) {
						case LINK_DESTINATION_MEDIA:
							href = image.fullUrl || image.url;
							break;
						case LINK_DESTINATION_ATTACHMENT:
							href = image.link;
							break;
					}

					// TODO: May want to use a data el and link to full size image.
					const img = (
						<img
							src={image.url}
							alt={image.alt}
							data-id={image.id}
							data-full-url={image.fullUrl}
							data-link={image.link}
							className={classnames(
								"u-photo",
								image.id ? `wp-image-${image.id}` : null
							)}
						/>
					);

					return (
						<li key={image.id || image.url} className="blocks-gallery-item">
							<figure>
								{href ? <a href={href}>{img}</a> : img}
								{!RichText.isEmpty(image.caption) && (
									<RichText.Content
										tagName="figcaption"
										className="blocks-gallery-item__caption"
										value={image.caption}
									/>
								)}
							</figure>
						</li>
					);
				})}
			</ul>
			{!RichText.isEmpty(caption) && (
				<RichText.Content
					tagName="figcaption"
					className="blocks-gallery-caption"
					value={caption}
				/>
			)}
		</figure>
	);
}
