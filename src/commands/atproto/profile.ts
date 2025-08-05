import type { Message } from "discord.js-selfbot-v13";
import {
	registerCommand,
	Command,
	type MessageCommandArgument,
} from "lib/commandProto";
import {
	agent,
	assertAtprotoCredentials,
	getModPolicy,
	LABELER_DIDS,
} from "./util.m";
import { client } from "@/constants";

assertAtprotoCredentials();

class HelloCommand extends Command {
	constructor() {
		super("profile", []);
		this.syntax = "profile <handleOrDid>";
		this.description = "resolves a bluesky user's profile details";
	}

	public async runCommand(
		message: Message,
		args: MessageCommandArgument[],
	): Promise<void> {
		if (!args[0]) {
			void message
				.edit(
					`> \`args[0]\` is \`${args[0].constructor.name}\` but expected a valid handle or atproto did`,
				)
				.catch((a) => {});
			return;
		}
		if (message.author.id !== client.user!.id) {
			void message
				.edit(
					"> can't use atproto commands unless you're the bot owner",
				)
				.catch((a) => {});
			return;
		}
		const { data: profile } = await agent.app.bsky.actor.getProfile(
			{
				actor: args[0].toString(),
			},
			{
				headers: {
					"atproto-accept-labelers": LABELER_DIDS.join(", "),
				},
			},
		);

		const fileContent = `**${profile.displayName || profile.handle}** ${
			profile.did
		}
**${profile.followersCount}** followers
**${profile.followsCount}** following

${profile.description}

${profile.viewer?.blocking ? "You are blocking this user\n" : ""}${
			profile.viewer?.blockedBy
				? "You are being blocked by this user\n"
				: ""
		}
${(profile.labels || [])
	.map((a) => {
		if (a.val === "!no-unauthenticated")
			return `${
				profile.displayName || profile.handle
			}: Logged-in users only - This is a global label value defined by the AT Protocol (!no-unauthenticated)`;
		const p = getModPolicy(`${a.src}/${a.val}`);
		if (!p) return `Invalid Label ${a.src}/${a.val}`;
		return `${p.labeler}: ${p.name} - ${p.description} (${p.id})`;
	})
	.join("\n")}`;
		await message.reply({
			files: [
				{
					name: "attachment.txt",
					contentType: "text/plain",
					attachment: Buffer.from(fileContent, "utf-8"),
				},
			],
		});
	}
}

registerCommand(new HelloCommand());
