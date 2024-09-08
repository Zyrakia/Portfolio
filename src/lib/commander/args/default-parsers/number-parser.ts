import type { ArgumentValueParser } from '../argument-parser';

interface Config {
	/** The minimum value. */
	min: number;
	/** The maximum value. */
	max: number;
	/** Whether to take the absolute value of the parsed value. */
	abs: boolean;
	/** Whether to round the parsed value. */
	round: boolean;
}

/**
 * An argument parser that parses numbers from the arguments.
 */
export class NumberParser implements ArgumentValueParser<number> {
	private static DEFAULTS: Config = {
		min: -Infinity,
		max: Infinity,
		abs: false,
		round: false,
	};

	private config: Config;

	/**
	 * Creates a new parser with the specified configuration.
	 *
	 * @param config the configuration to use
	 */
	public constructor(config: Partial<Config> = {}) {
		this.config = { ...NumberParser.DEFAULTS, ...config };
	}

	public parse(value: string) {
		let n = parseFloat(value);
		if (n === undefined || isNaN(n)) return;

		const { min, max, abs: absPreClamp, round } = this.config;

		if (absPreClamp) n = Math.abs(n);
		n = Math.min(Math.max(n, min), max);
		if (round) n = Math.round(n);

		return n;
	}
}
