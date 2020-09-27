/**
 * https://github.com/WordPress/gutenberg/blob/master/packages/block-library/src/video/save.js
 * WordPress dependencies
 */
import { RichText } from "@wordpress/block-editor";

export default function save({ attributes }) {
	const {
		autoplay,
		caption,
		controls,
		loop,
		muted,
		poster,
		preload,
		src,
		playsInline,
	} = attributes;
	return (
		<figure>
			{src && (
				<video
					autoPlay={autoplay}
					controls={controls}
					loop={loop}
					muted={muted}
					poster={poster}
					preload={preload !== "metadata" ? preload : undefined}
					src={src}
					playsInline={playsInline}
					className="u-video"
				/>
			)}
			{!RichText.isEmpty(caption) && (
				<RichText.Content tagName="figcaption" value={caption} />
			)}
		</figure>
	);
}
