type Callback = (...params: unknown[]) => unknown;

type Params<T> = T extends unknown[] ? T : T extends Callback ? Parameters<T> : [T];
type Handler<T> = (...params: Params<T>) => unknown;
type EventRecord = { [key: string]: unknown };

/**
 * Represents a connection related to an event, this can be used to disconnect
 * a listener.
 */
interface Connection {
	disconnect(): void;
	destroy(): void;
	isConnected(): boolean;
}

/**
 * Represents a class that can connect to events.
 */
export interface Connectable<T extends EventRecord> {
	/**
	 * Connects to the given event with the given listener.
	 *
	 * @param event the event to connect to
	 * @param listener the listener to connect with
	 * @returns a connection that can be used to disconnect the listener
	 */
	on<K extends keyof T>(event: K, listener: Handler<T[K]>): Connection;

	/**
	 * Connects to the given event with the given listener. The listener will
	 * automatically disconnect itself after the first event.
	 *
	 * @param event the event to connect to
	 * @param listener the listener to connect with
	 * @returns a connection that can be used to disconnect the listener
	 */
	once<K extends keyof T>(event: K, listener: Handler<T[K]>): Connection;

	/**
	 * Waits for the given event to be emitted and returns the parameters of the
	 * event as an array.
	 *
	 * @param event the event to wait for
	 * @returns a promise that resolves with the params of the event
	 */
	wait<K extends keyof T>(event: K): Promise<Params<T[K]>>;
}

/**
 * Represents an emitter that can emit events and manage event listeners.
 */
export class Emitter<T extends EventRecord> implements Connectable<T> {
	/** The currently registered listeners for each event key. */
	private listeners: Map<keyof T, Handler<T[keyof T]>[]> = new Map();

	public on<K extends keyof T>(event: K, listener: Handler<T[K]>) {
		return this.createConnection(event, listener);
	}

	public once<K extends keyof T>(event: K, listener: Handler<T[K]>) {
		let conn: Connection | undefined = undefined;
		const wrappedListener: Handler<T[K]> = (...params) => {
			if (!conn || !conn.isConnected()) return;
			listener(...params);
			conn.disconnect();
		};

		conn = this.on(event, wrappedListener);
		return conn;
	}

	public wait<K extends keyof T>(event: K) {
		return new Promise<Params<T[K]>>((resolve, reject) => {
			try {
				this.once(event, (...params) => resolve(params));
			} catch (e) {
				reject(e);
			}
		});
	}

	/**
	 * Emits the given event with the given parameters. This will call all
	 * listeners for the event, in the order they were registered.
	 *
	 * @param event the event to emit
	 * @param params the parameters to pass to the listeners
	 */
	public emit<K extends keyof T>(event: K, ...params: Params<T[K]>) {
		const listeners = this.getListeners(event);
		for (const listener of listeners) listener(...params);
	}

	/**
	 * Emits the given event with the given parameters in parallel. This will call all
	 * listeners for the event asynchronously.
	 *
	 * @param event the event to emit
	 * @param params the parameters to pass to the listeners
	 */
	public emitParralel<K extends keyof T>(event: K, ...params: Params<T[K]>) {
		const listeners = this.getListeners(event);
		listeners.forEach(async (listener) => listener(...params));
	}

	/**
	 * Returns listeners for the given event key.
	 */
	private getListeners<K extends keyof T>(event: K) {
		const listeners = this.listeners.get(event) ?? [];
		this.listeners.set(event, listeners);
		return listeners as Handler<T[K]>[];
	}

	/**
	 * Creates a connection for the given event key that modifies the listeners
	 * array to include the given listeners.
	 *
	 * @param event the event key
	 * @param listener the listener to add
	 * @returns a connection that can be used to disconnect the listener
	 */
	private createConnection<K extends keyof T>(event: K, listener: Handler<T[K]>) {
		const listeners = this.getListeners(event);
		listeners.push(listener);

		return {
			disconnect: () => {
				const index = listeners.indexOf(listener);
				if (index !== -1) listeners.splice(index, 1);
			},
			destroy: function () {
				this.disconnect();
			},
			isConnected: () => listeners.includes(listener),
		};
	}

	/**
	 * Completely removes all listeners, disconnecting them all.
	 */
	public wipe() {
		this.listeners.clear();
	}

	/**
	 * Returns a new bridge that can be used to connect to events on this emitter, without being able to emit events.
	 */
	public getBridge() {
		return new ConnectionBridge(this);
	}
}

/**
 * Can be used to connect to events on an emitter.
 */
export class ConnectionBridge<T extends EventRecord> implements Connectable<T> {
	/**
	 * Creates a new connection bridge for the given emitter.
	 *
	 * @param emitter the emitter to manage with this bridge
	 */
	public constructor(protected emitter: Emitter<T>) {}

	public on<K extends keyof T>(event: K, listener: Handler<T[K]>) {
		return this.emitter.on(event, listener);
	}

	public once<K extends keyof T>(event: K, listener: Handler<T[K]>) {
		return this.emitter.once(event, listener);
	}

	public wait<K extends keyof T>(event: K) {
		return this.emitter.wait(event);
	}
}
