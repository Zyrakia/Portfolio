/**
 * Immitates `setInterval` but with a random delay between calls, based on a min and max delay.
 *
 * @param callback the callback to call
 * @param minMs the minimum delay between calls (inclusive)
 * @param maxMs the maximum random delay between calls (inclusive)
 * @returns a function that will cancel the interval
 */
export function setIntervalRandom(callback: () => void, minMs: number, maxMs: number) {
	const getNextDelay = () => Math.random() * (maxMs - minMs + 1) + minMs;

	let cont = true;
	(async () => {
		while (cont) {
			await new Promise<void>((res) => {
				setTimeout(() => {
					if (cont) callback();
					res();
				}, getNextDelay());
			});
		}
	})();

	return () => (cont = false);
}
