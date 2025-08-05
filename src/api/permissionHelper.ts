import type { User, TextChannel } from "discord.js-selfbot-v13";
import { client, prisma } from "../constants";

export async function isWhitelisted(
	u: User,
	command?: string,
	channel?: TextChannel,
): Promise<boolean> {
	if (u.id === client.user!.id) return true;
	if (u.bot) return false;

	const userWhitelistT = await prisma.userWhitelist.findMany({
		where: {
			discordUserId: u.id
		},
	});

	if (userWhitelistT.length === 0) return false;
	const userWhitelist = userWhitelistT[0];

	if (userWhitelist.admin === true) return true;

	if (command) {
		const commandWhitelist = await prisma.commandWhitelist.findUnique({
			where: {
				discordUserId: u.id,
				commandName: command,
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
