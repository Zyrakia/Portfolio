/**
 * Represents something that can be "destroyed" in a bin.
 */
type Trash = null | undefined | string | Function | Array<Trash> | { destroy: Function };

/**
 * Holds trash and destroys it when it's destroyed.
 */
export class Bin {
	private items: Trash[] = [];

	/**
	 * Adds the given items to the bin and returns them.
	 */
	public add(...items: Trash[]) {
		this.items.push(items);
		return this;
	}

	/**
	 * Manually destroys the given item.
	 *
	 * @param item the item to destroy
	 */
	public static destroy(item: Trash) {
		if (item === null || item === undefined) return;

		switch (typeof item) {
			case 'string': {
				console.log(item);
				break;
			}

			case 'function': {
				item();
				break;
			}

			case 'object': {
				if (Array.isArray(item)) {
					for (const subItem of item) Bin.destroy(subItem);
					break;
				}

				if ('destroy' in item) item.destroy();
				break;
			}
		}
	}

	/**
	 * Destroys all items in the bin.
	 */
	public destroy() {
		for (const item of this.items) Bin.destroy(item);
		this.items = [];
	}
}
