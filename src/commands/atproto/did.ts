import type { Message } from "discord.js-selfbot-v13";
import { registerCommand, Command, type MessageCommandArgument } from "lib/commandProto";
import { agent, assertAtprotoCredentials, LABELER_DIDS } from "./util.m";
import { client } from "@/constants";

assertAtprotoCredentials();

class HelloCommand extends Command {
	constructor() {
		super("did", []);
	}

	public async runCommand(message: Message, args: MessageCommandArgument[]): Promise<void> {
		if (!args[0]) {
			void message.reply(`> \`args[0]\` is \`${args[0].constructor.name}\` but expected a valid handle or atproto did`).catch(a => { });
			return
		}
		if (message.author.id !== client.user!.id) {
			void message.reply("> can't use atproto commands unless you're the bot owner").catch(a => { });
			return
		}
		const { data: {did} } = await agent.com.atproto.identity.resolveHandle({
			handle: args[0].toString()
		},{
			headers: {
				'atproto-accept-labelers': LABELER_DIDS.join(", ")
			}
		})

		await message.reply({
			content: did
		})
	}
}

registerCommand(new HelloCommand());
