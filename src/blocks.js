/**
 * Gutenberg Blocks
 *
 * All blocks related JavaScript files should be imported here.
 * You can create a new block folder in this dir and include code
 * for that block here as well.
 *
 * All blocks should be included here since this is the file that
 * Webpack is compiling as the input file.
 */
// TODO: Split up this file a bit.
import { updateCategory } from "@wordpress/blocks";
import { Icon } from "@wordpress/components";
import { addFilter } from "@wordpress/hooks";
import AudioSave from "./mf2-save-els/audio";
import ImageSave from "./mf2-save-els/image";
import VideoSave from "./mf2-save-els/video";
import GallerySave from "./mf2-save-els/gallery";

// Add mf2 to some built in blocks.
// TODO: May be easier to modify them to append <data> elements instead of modifying the core save function.
const addMf2SaveEl = (element, blockType, attributes) => {
	switch (blockType.name) {
		case "core/audio":
			return <AudioSave attributes={attributes} />;
		case "core/image":
			return <ImageSave attributes={attributes} />;
		case "core/video":
			return <VideoSave attributes={attributes} />;
		case "core/gallery":
			return <GallerySave attributes={attributes} />;
		default:
			return element;
	}
};
addFilter("blocks.getSaveElement", "indieweb/addMf2SaveEl", addMf2SaveEl);

// Add category icon
updateCategory("indieweb", {
	icon: (
		<Icon
			size={487}
			icon={
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 487 183.7">
					<path
						fill="currentColor"
						d="M163.8 34l59.1 126.1 18.6-39.8L201.3 34zm169.1 0h-118l38.8 83.2 20.1 42.9zM33 34h117.8v33H33z"
					/>
					<path
						fill="currentColor"
						d="M31.4 32.4h120.9v36.1H31.4zM33 79h117.8v71.8H33z"
					/>
					<path
						fill="currentColor"
						d="M31.4 77.4h120.9v74.9H31.4zM453.1 98.9c-3.1 32.4-30.3 57.8-63.5 57.8-35.2 0-63.8-28.6-63.8-63.8 0-35.3 28.6-63.8 63.8-63.8 33.1 0 60.3 25.2 63.5 57.5h-63.5c-3.4 0-6.2 2.8-6.2 6.2 0 3.4 2.8 6.2 6.2 6.2h63.5z"
					/>
					<path fill="none" d="M0 0h487v183.7H0z" />
				</svg>
			}
		/>
	),
});

import "./url/block";
// TODO: Custom blocks:
// 1. Checkin & location
// 2. Watch of / read of etc with auto fills
// 3. Some sort of quote / context functionality
// 4. RSVP
// 5. Event ? - would also need to change h-entry class
// 6. Recipe ? - same as above (also way more complex)
// 7. Some way to embed posts in posts to create colections ?
