import type { ArgumentValueParser } from '../argument-parser';

interface Config {
	/**
	 * The format to use.
	 *
	 * - `'keep'` - keeps the original value
	 * - `'upper'` - converts the value to uppercase
	 * - `'lower'` - converts the value to lowercase
	 * - `'capitalize'` - capitalizes the first letter of the value
	 * - `'lowerCapitalize'` - capitalizes the first letter of the value and converts the rest to lowercase
	 * - a function that takes the value and returns the formatted value
	 */
	format: 'upper' | 'lower' | 'capitalize' | 'lowerCapitalize' | 'keep' | ((value: string) => string);
}

/**
 * An argument parser that parses strings from the arguments.
 * The format of the string can be configured.
 */
export class StringParser implements ArgumentValueParser<string> {
	private static DEFAULTS: Config = {
		format: 'keep',
	};

	private config: Config;

	/**
	 * Creates a new parser with the specified configuration.
	 *
	 * @param config the configuration to use
	 */
	public constructor(config: Partial<Config> = {}) {
		this.config = { ...StringParser.DEFAULTS, ...config };
	}

	public parse(value: string) {
		return this.format(value);
	}

	/**
	 * Formats the specified value using the configured format.
	 *
	 * @param value the value to format
	 * @returns the formatted value
	 */
	private format(value: string) {
		const { format } = this.config;
		if (typeof format === 'function') return format(value);

		switch (format) {
			case 'keep':
				return value;
			case 'upper':
				return value.toUpperCase();
			case 'lower':
				return value.toUpperCase();
			case 'capitalize':
				return value.charAt(0).toUpperCase() + value.slice(1);
			case 'lowerCapitalize':
				return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
		}
	}
}
