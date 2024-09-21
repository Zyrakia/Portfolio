import { browser } from '$app/environment';
import { readable } from 'svelte/store';

/**
 * Calculates the suggested radius for a bubble based on the window size.
 */
export const suggestedBubbleRadius = readable(50, (set) => {
	if (!browser) return;

	const dynamicallySize = () => {
		const width = window.innerWidth;
		const height = window.innerHeight;

		const preferred = (width / height) * 65;
		const max = 250;
		set(Math.min(preferred, max));
	};

	window.addEventListener('resize', dynamicallySize);
	dynamicallySize();
});
