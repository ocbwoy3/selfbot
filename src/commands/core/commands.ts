import type { Message } from "discord.js-selfbot-v13";
import {
	registerCommand,
	Command,
	type MessageCommandArgument,
} from "lib/commandProto";
import { clientCommands } from "lib/commandProto";

class ListCommands extends Command {
	constructor() {
		super("commands", ["cmds"]);
		this.syntax = "commands [search]";
		this.description = "lists out commands";
	}

	public async runCommand(
		message: Message,
		args: MessageCommandArgument[],
	): Promise<void> {
		const filteredCommands = Object.values(clientCommands).filter((a) =>
			`${a.name}\x00${a.aliases.join("\x00")}`.includes(
				(args[0] || "").toString(),
			),
		);
		const commandList = filteredCommands
			.map(
				(cmd) =>
					`-# \`${cmd.syntax}\` - ${cmd.description?.toLowerCase()}`,
			)
			.join("\n");
		await message.reply({
			content:
				filteredCommands.length === 0
					? "no commands :("
					: `**syntax:** command <required> [optional]\n${commandList}`,
		});
	}
}

registerCommand(new ListCommands());
