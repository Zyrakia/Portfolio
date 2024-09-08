import type { ArgumentValueParser } from '../argument-parser';

/**
 * An argument parser that always returns the same value, regardless of the
 * arguments passed to it.
 */
export class ConstantParser<T> implements ArgumentValueParser<T> {
	/**
	 * Creates a new parser that always returns the specified value.
	 *
	 * @param value the value to return
	 */
	public constructor(private value: T) {}

	public parse() {
		return this.value;
	}
}
