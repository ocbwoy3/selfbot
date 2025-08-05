import { User, type Message } from "discord.js-selfbot-v13";
import { Command, type MessageCommandArgument } from "lib/commandProto";
import { registerCommand } from "lib/commandProto";
import { client, prisma } from "@/constants";

class UnwhitelistCommand extends Command {
	constructor() {
		super("unwhitelist", ["unwl", "uwl", "unwlremove"]);
		this.syntax = "unwhitelist <user>";
		this.description = "unwhitelists someone from the bot";
	}

	public async runCommand(
		message: Message,
		args: MessageCommandArgument[],
	): Promise<any> {
		if (message.author.id !== client.user!.id) return;

		// 1: user
		if (!["User", "ClientUser"].includes(args[0].constructor.name)) {
			await message.reply(
				`> \`args[0]\` is \`${args[0].constructor.name}\` but expected \`User\` or \`ClientUser\``,
			);
			return;
		}
		const user = args[0] as User;

		await prisma.userWhitelist.delete({
			where: {
				discordUserId: user.id,
				channelId: undefined,
			},
		});

		await message.reply(`> unwhitelisted`);
	}
}

registerCommand(new UnwhitelistCommand());
