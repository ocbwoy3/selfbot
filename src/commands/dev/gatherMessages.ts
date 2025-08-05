import { client } from "@/constants";
import type { Message } from "discord.js-selfbot-v13";
import { homedir } from "os";
import {
	registerCommand,
	Command,
	type MessageCommandArgument,
} from "lib/commandProto";
import { randomUUID } from "crypto";
import { writeFileSync } from "fs";

class HelloCommand extends Command {
	constructor() {
		super("gathermessages", []);
		this.syntax = "gathermessages";
		this.description =
			"gathers messages between you and all users in the current channel";
	}

	public async runCommand(
		message: Message,
		args: MessageCommandArgument[],
	): Promise<void> {
		if (message.author.id !== client.user!.id) {
			void message
				.reply("> can't gather messages unless you're the bot owner")
				.catch((a) => {});
			return;
		}

		const MAX_MESSAGES = 5000;

		const fetchAllMessages = async () => {
			let messages: Message[] = [];
			let lastMessage = await message.channel.messages
				.fetch({ limit: 1 })
				.then((messagePage) =>
					messagePage.size === 1 ? messagePage.at(0) : null,
				);

			while (lastMessage) {
				console.log(`at ${messages.length}/${MAX_MESSAGES}`);
				if (messages.length >= MAX_MESSAGES) break;
				await message.channel.messages
					.fetch({ limit: 100, before: lastMessage.id })
					.then((messagePage) => {
						messagePage.forEach((msg) => messages.push(msg));
						lastMessage =
							messagePage.size > 0
								? messagePage.at(messagePage.size - 1)
								: null;
					});
			}

			return messages;
		};

		const mF = await fetchAllMessages();
		const messages: string[] = mF
			.sort((a, b) => a.createdTimestamp - b.createdTimestamp)
			.map((a) => `${a.author.displayName}: ${a.content}`);

		const path = `${homedir()}/Documents/${message.channel.id}-${randomUUID()}.txt`;

		writeFileSync(path, messages.join("\n"));

		await message.reply({
			content: `${path}`,
		});
	}
}

registerCommand(new HelloCommand());
