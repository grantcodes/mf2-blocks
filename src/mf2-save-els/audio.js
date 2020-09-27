/**
 * https://github.com/WordPress/gutenberg/blob/master/packages/block-library/src/audio/save.js
 * WordPress dependencies
 */
import { RichText } from "@wordpress/block-editor";

export default function save({ attributes }) {
	const { autoplay, caption, loop, preload, src } = attributes;

	return (
		src && (
			<figure>
				<audio
					controls="controls"
					src={src}
					autoPlay={autoplay}
					loop={loop}
					preload={preload}
					className="u-audio"
				/>
				{!RichText.isEmpty(caption) && (
					<RichText.Content tagName="figcaption" value={caption} />
				)}
			</figure>
		)
	);
}
