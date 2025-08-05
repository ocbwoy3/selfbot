import { $ } from "bun";
import type { Message } from "discord.js-selfbot-v13";
import {
	registerCommand,
	Command,
	type MessageCommandArgument,
} from "lib/commandProto";

class HelloCommand extends Command {
	constructor() {
		super("windows", []);
		this.description = "Lists out all current Hyprland windows/clients";
	}

	public async runCommand(
		message: Message,
		args: MessageCommandArgument[],
	): Promise<void> {
		const windows = (await $`hyprctl clients -j"`.json()) as {
			title: string;
			address: string;
			initialClass: string;
		}[];
		await message.reply({
			content: `Currently active windows (Hyprland)\n${windows.map((a) => `-# \`${a.title}\` ${a.initialClass} | ${a.address}`).join("\n")}`,
		});
	}
}

registerCommand(new HelloCommand());
