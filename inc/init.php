<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// TODO: Convert this to a class.

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * Assets enqueued:
 * 1. blocks.style.build.css - Frontend + Backend.
 * 2. blocks.build.js - Backend.
 * 3. blocks.editor.build.css - Backend.
 *
 * @uses {wp-blocks} for block type registration & related functions.
 * @uses {wp-element} for WP Element abstraction — structure of blocks.
 * @uses {wp-i18n} to internationalize the block's text.
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function indieweb_cgb_block_assets() { // phpcs:ignore
	remove_theme_support('core-block-patterns');
	// Register block styles for both frontend + backend.
	wp_register_style(
		'indieweb-cgb-style-css', // Handle.
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ), // Block style CSS.
		is_admin() ? array( 'wp-editor' ) : null, // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.style.build.css' ) // Version: File modification time.
	);

	// Register block editor script for backend.
	wp_register_script(
		'indieweb-cgb-block-js', // Handle.
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ), // Block.build.js: We register the block here. Built with Webpack.
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ), // Dependencies, defined above.
		null, // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: filemtime — Gets file modification time.
		true // Enqueue the script in the footer.
	);

	// Register block editor styles for backend.
	wp_register_style(
		'indieweb-cgb-block-editor-css', // Handle.
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ), // Block editor CSS.
		array( 'wp-edit-blocks' ), // Dependency to include the CSS after it.
		null // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.editor.build.css' ) // Version: File modification time.
	);

	// WP Localized globals. Use dynamic PHP stuff in JavaScript via `cgbGlobal` object.
	wp_localize_script(
		'indieweb-cgb-block-js',
		'cgbGlobal', // Array containing dynamic data for a JS Global.
		[
			'pluginDirPath' => plugin_dir_path( __DIR__ ),
			'pluginDirUrl'  => plugin_dir_url( __DIR__ ),
			// Add more data here that you want to access from `cgbGlobal` object.
		]
	);

	/**
	 * Register Gutenberg block on server-side.
	 *
	 * Register the block on server-side to ensure that the block
	 * scripts and styles for both frontend and backend are
	 * enqueued when the editor loads.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/blocks/writing-your-first-block-type#enqueuing-block-scripts
	 * @since 1.16.0
	 */
	register_block_type(
		'cgb/block-indieweb', array(
			// Enqueue blocks.style.build.css on both frontend & backend.
			'style'         => 'indieweb-cgb-style-css',
			// Enqueue blocks.build.js in the editor only.
			'editor_script' => 'indieweb-cgb-block-js',
			// Enqueue blocks.editor.build.css in the editor only.
			'editor_style'  => 'indieweb-cgb-block-editor-css',
		)
	);
}

/**
 * Adds the "indieweb" block category
 *
 * @param array $categories Original block categories.
 * @param WP_Post $post The current post.
 * @return array Updated block categories.
 */
function indieweb_block_category( $categories, $post ) {
    if ( $post->post_type !== 'post' ) {
        return $categories;
    }
    return array_merge(
        $categories,
        array(
            array(
                'slug' => 'indieweb',
                'title' => __( 'IndieWeb', 'indieweb' ),
            ),
        )
    );
}

/**
 * Filter the_content to add mf2 markup.
 *
 * @param string $content Original content.
 * @return string Updated content.
 */
function indieweb_blocks_mf2( $content ) {
	$not_e_content_block = array(
		'indieweb/url',
	);
	$media_blocks = array(
		'core/image',
		'core/audio',
		'code/video',
		'core/gallery'
	);
	if ( is_single() && in_the_loop() && is_main_query() ) {
		$pure_content = get_the_content();
		if ( has_blocks( $pure_content ) ) {
			$blocks = parse_blocks( $pure_content );
			$e_content_open = false;
			$content = '';
			foreach( $blocks as $i => $block ) {
				$block_content = render_block( $block );
				if ( ! $e_content_open ) {
					if (
						// Don't wrap the first block with e-content if it is a media block.
						! ( $i === 0 && in_array( $block['blockName'], $media_blocks ) )
						// Don't wrap block that already support mf2.
						&& ! in_array( $block['blockName'], $not_e_content_block )
					) {
						$e_content_open = true;
						$content .= '<div class="e-content">';
					}
				} else if ( $e_content_open && in_array( $block['blockName'], $not_e_content_block ) ) {
					$e_content_open = false;
					$content .= '</div>';
				}

				// Remove mf2 classes from media if it is not the first block in the post.
				if ( $i > 0 && in_array( $block['blockName'], $media_blocks ) ) {
					$block_content = str_replace( 'u-photo', '', $block_content );
					$block_content = str_replace( 'u-video', '', $block_content );
					$block_content = str_replace( 'u-audio', '', $block_content );
				}

				$content .= $block_content;

				if ( $e_content_open && $i + 1 === count( $blocks ) ) {
					$e_content_open = false;
					$content .= '</div>';
				}
			}
		} else{
			// Wrap non block posts.
			$content = '<div class="e-content">' . $content . '</div>';
		}

		// Add hidden data.

		// Add url.
		$content .= '<data class="u-url" value="' . get_the_permalink() . '"></data>';

		// Add featured image.
		$featured_image = get_the_post_thumbnail_url();
		if ( $featured_image ) {
			$content .= '<data class="u-featured" value="' . esc_attr( $featured_image ) . '"></data>';
		}

		// Add categories / tags.
		$tags = get_the_tags();
		$categories = get_the_category();
		$items = array_merge( $tags ? $tags : array(), $categories ? $categories : array() );
		foreach ( $items as $item ) {
			$content .= '<data class="u-category" value="' . esc_attr( $item->name ) . '"></data>';
		}

		// Add publish date.
		$content .= '<data class="dt-published" value="' . esc_attr( get_the_date( 'c' ) ) . '"></data>';

		// Add author data.
		$author_name = get_the_author_meta( 'display_name' );
		$author_url = get_the_author_meta( 'user_url' );
		if ( $author_name && $author_url ) {
			$content .= '<div class="p-author h-card">';
			$content .= '<data class="u-url" value="' . esc_attr( $author_url ) . '"></data>';
			$content .= '<data class="u-name" value="' . esc_attr( $author_name ) . '"></data>';
			$content .= '</div>';
		}

	}
	return $content;
}

/**
 * List of allowed blocks
 *
 * @param array $allowed_block_types Original allowed posts.
 * @param WP_Post $post Current post.
 * @return array Updated allowed posts.
 */
function indieweb_blocks_allowed( $allowed_block_types, $post ) {
    if ( $post->post_type !== 'post' ) {
        return $allowed_block_types;
    }
    return array(
		// Top Level Items
		'indieweb/url',
		'indieweb/e-content',
		'indieweb/post',
		'core/image',
		'core/video',
		'core/audio',
		'core/gallery',
		// e-content items
		"core/paragraph",
		"core/heading",
		"core/list",
		"core/image",
		"core/audio",
		"core/block",
		"core/buttons",
		"core/code",
		"core/gallery",
		"core/group",
		"core/preformatted",
		"core/quote",
		"core/separator",
		"core/table",
		"core/video",
	);
}

/**
 * Register indieweb block patterns.
 *
 * @return void
 */
function indieweb_block_patterns() {
	if ( class_exists( 'WP_Block_Patterns_Registry' ) ) {
		// Register category.
		register_block_pattern_category(
			'indieweb',
			array( 'label' => 'IndieWeb' )
		);

		// TODO: Decide if I want to use patterns or not.
		// Photo pattern.
		register_block_pattern(
		  'indieweb/pattern/photo',
		  array(
			'title' => __( 'Photo Post', 'indieweb' ),
			'description' => __( 'An IndieWeb friendly photo post', 'indieweb' ),
			'content' => '<!-- wp:image --> <figure><img src="https://ipsumimage.appspot.com/500x500
			" alt="" class="u-photo"/><</figure> <!-- /wp:image --> <!-- wp:paragraph --> <p>This is a photo post.</p> <!-- /wp:paragraph --> ',
			'categories' => array( 'indieweb' ),
		  )
		);

		// Reply patten.
		register_block_pattern(
			'indieweb/pattern/reply',
			array(
			  'title' => __( 'Reply Post', 'indieweb' ),
			  'description' => __( 'An IndieWeb friendly reply post', 'indieweb' ),
			  'content' => '<!-- wp:indieweb/url --> <div class="wp-block-indieweb-url"><a class="in-reply-to" href=""></a></div> <!-- /wp:indieweb/url --> <!-- wp:paragraph --> <p>Wow that\'s cool! Remember to update the URL above.</p> <!-- /wp:paragraph -->',
			  'categories' => array( 'indieweb' ),
			)
		);
	}
}

/**
 * Add h-entry post class.
 *
 * @param array $classes Original post classes.
 * @return array Updated post classes.
 */
function indieweb_post_class( $classes ) {
	if ( is_single() ) {
		$classes[] = 'h-entry';
		// TODO: May want to add post type class based on the blocks.
	}

	return $classes;
}

/**
 * Wrap title with p-name.
 *
 * @param string $title Original title.
 * @return string Updated title.
 */
function indieweb_post_title( $title ) {
	// TODO: This needs to only be applied to the main title somehow.
	if ( is_single() && in_the_loop() && is_main_query() ) {
		return '<span class="p-name">' . $title . '</span>';
	}

	return $title;
}



add_action( 'init', 'indieweb_cgb_block_assets' );
add_action( 'admin_init', 'indieweb_block_patterns' );
add_filter( 'block_categories', 'indieweb_block_category', 10, 2 );
add_filter( 'the_content', 'indieweb_blocks_mf2' );
add_filter( 'allowed_block_types', 'indieweb_blocks_allowed', 10, 2 );
add_filter( 'post_class', 'indieweb_post_class' );
add_filter( 'the_title', 'indieweb_post_title' );
