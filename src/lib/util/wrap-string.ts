/**
 * Wraps a long string into a list of lines of a given maximum width. By default, it will not break words, and only break into a new line if the current word is terminated by whitespace.
 *
 * @param str the string to wrap
 * @param maxWidth the maximum width of each line
 * @param breakWord whether to break words or not
 * @returns an array of lines
 */
export function wrapString(str: string, maxWidth: number, breakWord = false) {
	const chars = str.split('');
	const lines: string[] = [];

	let currentLine = '';
	const push = () => {
		lines.push(currentLine);
		currentLine = '';
	};

	for (let i = 0; i < chars.length; i++) {
		const char = chars[i];
		currentLine += char;
		if (currentLine.length <= maxWidth) continue;

		if (breakWord) {
			push();
			continue;
		}

		if (/\s/.test(char)) {
			currentLine = currentLine.slice(0, -1);
			push();
		}
	}

	return lines;
}
