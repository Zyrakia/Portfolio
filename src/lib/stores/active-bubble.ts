import { writable } from 'svelte/store';

/**
 * Represents the title of the bubble that is currently active.
 */
export const activeBubbleTitle = writable<string | undefined>(undefined);

