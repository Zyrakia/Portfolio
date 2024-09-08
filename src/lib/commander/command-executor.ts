import { ArgumentParser } from './args/argument-parser';

/** Describes the arguments passed to a command executor. */
export type ExecutorArgs<Context> = [ctx: Context, args: ArgumentParser, usedAlias: string];

/** Describes a class that can execute a command. */
export interface ICommandExecutor<Context> {
	execute(...args: ExecutorArgs<Context>): void;
}

/** Describes a function that can execute a command. */
export type AnonCommandExecutor<Context> = (...args: ExecutorArgs<Context>) => void;

/** Describes anything that can execute a command. */
export type CommandExecutor<Context> = ICommandExecutor<Context> | AnonCommandExecutor<Context>;
