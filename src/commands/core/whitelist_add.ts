import { User, type Message } from "discord.js-selfbot-v13";
import {
	registerCommand,
	Command,
	type MessageCommandArgument,
} from "lib/commandProto";
import { client, prisma } from "@/constants";

class HelloCommand extends Command {
	constructor() {
		super("whitelist", ["wl", "wladd"]);
		this.syntax = "whitelist <user> [here|all]";
		this.description = "whitelists someone to the bot";
	}

	public async runCommand(
		message: Message,
		args: MessageCommandArgument[],
	): Promise<any> {
		if (message.author.id !== client.user!.id) return;

		// 1: user
		// 2: channel (optional)
		if (!["User", "ClientUser"].includes(args[0].constructor.name)) {
			await message.reply(
				`> \`args[0]\` is \`${args[0].constructor.name}\` but expected \`User\` or \`ClientUser\``,
			);
			return;
		}
		const user = args[0] as User;
		let channel: string | null = message.channel.id;

		switch (args[1]) {
			case "here": {
				channel = message.channel.id;
				break;
			}
			case "all": {
				channel = null;
				break;
			}
			default: {
				if (args[1]) {
					await message.reply(
						`> \`args[1]\` expected one of these: \`here\`, \`all\`, \`<#channelId>\``,
					);
					return;
				}
			}
		}

		await prisma.userWhitelist.upsert({
			where: {
				id: user.id,
				channelId: channel || "",
			},
			update: {
				channelId: channel,
				restrictToChannel: channel !== null,
			},
			create: {
				id: user.id,
				discordUserId: user.id,
				admin: true,
				channelId: channel,
				restrictToChannel: channel !== null,
			},
		});

		await message.reply(
			`> whitelisted - ${channel ? `<#${channel}>` : " all channels"}`,
		);
	}
}

registerCommand(new HelloCommand());
