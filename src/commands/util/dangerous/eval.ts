import { client } from "@/constants";
import type { Message } from "discord.js-selfbot-v13";
import { registerCommand, Command, type MessageCommandArgument } from "lib/commandProto";

class HelloCommand extends Command {
	constructor() {
		super("eval", []);
	}

	public async runCommand(message: Message, args: MessageCommandArgument[]): Promise<void> {
		if (message.author.id !== client.user!.id) {
			void message.reply("> can't evaluate arbitrary javascript on the process unless you're the bot owner").catch(a => { });
			return
		}
		const text = eval(args.map(a=>`${a}`).join(" "))
		await message.reply({
			content: `${text}`
		})
	}
}

registerCommand(new HelloCommand());
