import type { AnyChannel, Message, User } from "discord.js-selfbot-v13";

export type MessageCommandArgument = string | User | AnyChannel;

export abstract class Command {
	syntax: string
	description: string | undefined = undefined;

	constructor(public name: string, public aliases: string[] = []) {
		this.syntax = name
		if (!this.description) this.description = `The '${name}' command.`
	}

	public async runCommand(
		message: Message,
		args: MessageCommandArgument[]
	): Promise<any> {}
}

export const clientCommands: { [name: string]: Command } = {};
export const commandAliases: { [name: string]: string } = {};

export function registerCommand(command: Command) {
	if (clientCommands[command.name])
		throw `${command.name} already exists in clientCommands`;
	if (commandAliases[command.name])
		throw `${command.name} already exists in commandAliases`;

	command.aliases.forEach((alias) => {
		if (clientCommands[alias])
			throw `${alias} already exists in clientCommands`;
		if (commandAliases[alias])
			throw `${alias} already exists in commandAliases`;
	});

	command.aliases.forEach((alias) => {
		commandAliases[alias] = command.name;
	});
	clientCommands[command.name] = command;
}
