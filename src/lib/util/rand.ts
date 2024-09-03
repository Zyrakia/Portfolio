/**
 * Returns a random number constrained between min and max (inclusive).
 *
 * @param min the minimum value
 * @param max the maximum value
 * @returns a random number between min and max
 */
export function rand(min: number, max: number) {
	return Math.random() * (max - min + 1) + min;
}

/**
 * Returns a random integer constrained between min and max (inclusive).
 *
 * @param min the minimum value
 * @param max the maximum value
 * @returns a random integer between min and max
 */
export function randInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
