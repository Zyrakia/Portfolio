/**
 * Wraps the given callback to ensure it only executes if the time gap between
 * the last execution is large enough.
 *
 * @param minimumMs the minimum amount of milliseconds between callback executions
 * @param cb the callback to throttle wrap
 * @returns the wrapper function
 */
export function throttled<A extends any[], R>(minimumMs: number, cb: (...args: A) => R) {
	let available = true;

	return (...args: A) => {
		if (!available) return;
		available = false;
		setTimeout(() => (available = true), minimumMs);
		return cb(...args);
	};
}
