import { ArgumentParser } from './args/argument-parser';
import type { CommandExecutor, ExecutorArgs } from './command-executor';
import { ExecutionResult } from './execution-result';

/**
 * Represents the bare minimum of a command.
 */
export interface CommandConfig {
	identifier: string;
	aliases?: string[];
}

/**
 * Represents a command that can be executed.
 */
type CommandDescriptor<Config extends CommandConfig, Context> = {
	config: Config;
	executor: CommandExecutor<Context>;
};

/**
 * Utility class for handling execution and registration of commands.
 */
export class Commander<Context = unknown, Config extends CommandConfig = CommandConfig> {
	/**
	 * Maps commands by their identifier and aliases.
	 */
	private commands = new Map<string, CommandDescriptor<Config, Context>>();

	/**
	 * Registers the given command in this commander, and maps it to the
	 * given executor.
	 *
	 * @param config the command config
	 * @param executor the command executor
	 */
	public register(config: Config, executor: CommandExecutor<Context>) {
		this.registerDescriptor({ config, executor });
	}

	/**
	 * Deregisters the given command in this commander.
	 *
	 * @param config the command config
	 */
	public deregister(config: Config) {
		this.commands.delete(config.identifier);
		if (config.aliases) config.aliases.forEach((a) => this.commands.delete(a));
	}

	/**
	 * Executes the given command with the given arguments.
	 *
	 * @param command the command identifier or alias to execute
	 * @param args the arguments to pass to the command
	 * @param context the context to pass to the command
	 * @returns the execution result
	 */
	public execute(command: string, args: string[], context: Context) {
		const executor = this.getExecutor(command);
		if (!executor) return ExecutionResult.NOT_FOUND;

		Commander.runExecutor(executor, [context, new ArgumentParser(args), command]);
		return ExecutionResult.EXECUTED;
	}

	/**
	 * Registers the given command descriptor in this commander. Including the identifier
	 * and aliases.
	 *
	 * @param descriptor the command descriptor
	 */
	public registerDescriptor(descriptor: CommandDescriptor<Config, Context>) {
		this.commands.set(descriptor.config.identifier, descriptor);
		if (descriptor.config.aliases)
			descriptor.config.aliases.forEach((a) => this.commands.set(a, descriptor));
	}

	/**
	 * Returns the executor for the given command, or undefined if none was found.
	 *
	 * @param command the command identifier or alias
	 * @returns the executor, or undefined
	 */
	private getExecutor(command: string) {
		const descriptor = this.commands.get(command);
		if (!descriptor) return;

		return descriptor.executor;
	}

	/**
	 * Executes the given command executor with the given arguments.
	 *
	 * @param executor the command executor
	 * @param args the arguments to pass to the executor
	 */
	private static async runExecutor<Context>(
		executor: CommandExecutor<Context>,
		args: ExecutorArgs<Context>,
	) {
		if (typeof executor === 'function') executor(...args);
		else executor.execute(...args);
	}

	/**
	 * Returns all registered commands.
	 */
	public getCommands() {
		return this.commands;
	}
}
