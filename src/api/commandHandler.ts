import type {
	AnyChannel,
	Channel,
	Message,
	User,
} from "discord.js-selfbot-v13";
import { PREFIX } from "../constants";
import { isWhitelisted } from "./permissionHelper";
import { clientCommands, commandAliases } from "./commandProto";

type MessageCommandArgument = string | User | AnyChannel;

export async function parseArguments(
	message: Message
): Promise<MessageCommandArgument[]> {
	const regex = /<((\@|\#)!?\d+)>|("[^"]*"|\S+)/g;
	let cx: string = message.content
		.substring(PREFIX.length)
		.replace(/^([a-zA-Z0-9]+) ?/, "");
	if (cx.length === 0) {
		return [];
	}
	const matches = cx.matchAll(regex);

	const args: MessageCommandArgument[] = [];
	for (const match of matches) {
		if (match[1]) {
			try {
				if (match[1].startsWith("@")) {
					args.push(
						await message.client.users.fetch(
							match[1].replace(/[\@\#\!]/g, "")
						)
					);
				}
				if (match[1].startsWith("#")) {
					const ch = await message.client.channels.fetch(
						match[1].replace(/[\@\#\!]/g, "")
					);
					if (!ch) throw `Channel not exists: <${match[1]}>`;
					args.push(ch);
				}
			} catch (error) {
				console.error(
					`Failed to fetch user/channel - ${match[1]}: ${error}`
				);
				args.push("null");
			}
		} else {
			args.push(match[0].replace(/^"|"$/g, ""));
		}
	}

	return args; // .slice(1);
}

export async function handleCommand(message: Message): Promise<void> {
	if (!message.content.startsWith(PREFIX)) return;
	const commandName = message.content
		.substring(PREFIX.length)
		.match(/^([a-zA-Z0-9]+)/)?.[0];
	if (!commandName) return;
	let command = clientCommands[commandName];
	if (!command) {
		const alias = commandAliases[commandName];
		if (alias) {
			command = clientCommands[alias];
		}
	}
	if (!command) return;
	if (!(await isWhitelisted(message.author, commandName))) return;

	const args = await parseArguments(message);
	// if (args.length === 0) return;

	try {
		console.log(`${message.author.username} ran ${command.name} with args: [ ${args.join(", ")} ]`);
		await command.runCommand(message, args);
	} catch (error) {
		console.error(`${message.author.username} ${command.name} error: `, error);
	}

	return;
}
