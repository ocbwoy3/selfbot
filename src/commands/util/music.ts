import { $ } from "bun";
import type { Message } from "discord.js-selfbot-v13";
import {
	registerCommand,
	Command,
	type MessageCommandArgument,
} from "lib/commandProto";

class HelloCommand extends Command {
	constructor() {
		super("music", []);
		this.description = "Uses playerctl to obtain current song";
	}

	public async runCommand(
		message: Message,
		args: MessageCommandArgument[],
	): Promise<void> {
		const music =
			await $`playerctl metadata -p cider -f "**{{artist}} - {{title}}**\n[{{album}}]({{mpris:artUrl}})"`.text();
		await message.reply({
			content: music,
		});
	}
}

registerCommand(new HelloCommand());
