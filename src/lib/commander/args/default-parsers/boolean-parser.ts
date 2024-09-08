import type { ArgumentValueParser } from '../argument-parser';

interface Config {
	/** The words that represent false. */
	trueWords: string[];
	/** The words that represent true. */
	falseWords: string[];
	/** Whether to ignore casing when parsing. */
	ignoreCasing: boolean;
}

/**
 * An argument parser that parses boolean values from the arguments.
 */
export class BooleanParser implements ArgumentValueParser<boolean> {
	private static DEFAULTS: Config = {
		falseWords: ['false', 'off', '0', 'no'],
		trueWords: ['true', 'on', '1', 'yes'],
		ignoreCasing: true,
	};

	private config: Config;

	/**
	 * Creates a new parser with the specified configuration.
	 *
	 * @param config the configuration to use
	 */
	public constructor(config: Partial<Config> = {}) {
		this.config = { ...BooleanParser.DEFAULTS, ...config };
	}

	public parse(value: string) {
		const { falseWords, trueWords, ignoreCasing } = this.config;
		let s = ignoreCasing ? value.toLowerCase() : value;
		if (falseWords.includes(s)) return false;
		if (trueWords.includes(s)) return true;
	}
}
