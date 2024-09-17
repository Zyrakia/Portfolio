import Konva from 'konva';

/**
 * Helper function to create an image element with a given URL and alt text.
 *
 * @param url the URL of the image to be created
 * @param alt the alt text of the image to be created
 * @returns the created image element
 */
export function createImage(url: string, alt: string = '') {
	const img = document.createElement('img');
	img.src = url;
	img.alt = alt;
	return img;
}
