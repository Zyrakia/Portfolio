/**
 * Utility class for parsing a string into
 * a command name and arguments.
 */
export class CommandParser {
	/**
	 * Constructs a new CommandParser with the given
	 * command prefix.
	 *
	 * @param prefix the command prefix, defaults to empty string
	 */
	public constructor(private prefix = '') {}

	/**
	 * Disects the given string into a command name and
	 * arguments.
	 *
	 * @param input the input string
	 * @return the command name and arguments, or undefined
	 */
	public disect(input: string) {
		if (!input) return;

		const trimmed = input.trim();
		if (!trimmed || !trimmed.startsWith(this.prefix)) return;

		const deprefixed = trimmed.slice(this.prefix.length + 1);
		if (!deprefixed) return;

		const split = deprefixed.split(' ');
		const name = split.shift();
		const args = split;

		if (name) return { name, args, input };
	}

	/**
	 * Sets the command prefix.
	 */
	public setPrefix(prefix: string) {
		this.prefix = prefix;
	}

	/**
	 * Returns the command prefix.
	 */
	public getPrefix() {
		return this.prefix;
	}
}
