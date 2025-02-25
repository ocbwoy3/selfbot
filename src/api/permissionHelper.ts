import type { User, TextChannel } from "discord.js-selfbot-v13";
import { client, prisma } from "../constants";

export async function isWhitelisted(
	u: User,
	command?: string,
	channel?: TextChannel
): Promise<boolean> {
	if (u.id === client.user!.id) return true;
	if (u.bot) return false;

	const userWhitelist = await prisma.userWhitelist.findUnique({
		where: {
			discordUserId: u.id,
		},
	});

	if (!userWhitelist) return false;

	if (command) {
		const commandWhitelist = await prisma.commandWhitelist.findUnique({
			where: {
				discordUserId: u.id,
				commandName: command
			},
		});

		if (!commandWhitelist) return false;

		if (commandWhitelist.restrictToChannel && channel) {
			if (commandWhitelist.channelId !== channel.id) return false;
		}
	}

	if (userWhitelist.restrictToChannel && channel) {
		if (userWhitelist.channelId !== channel.id) return false;
	}

	return true;
}
