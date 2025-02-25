import { client } from "@/constants";
import type { Message } from "discord.js-selfbot-v13";
import { registerCommand, Command, type MessageCommandArgument } from "lib/commandProto";
import { exec } from "child_process";

class HelloCommand extends Command {
	constructor() {
		super("bash", []);
	}

	public async runCommand(message: Message, args: MessageCommandArgument[]): Promise<void> {
		if (message.author.id !== client.user!.id) {
			void message.reply("> can't execture arbitrary commands unless you're the bot owner").catch(a => { });
			return
		}
		exec(args.map(a => `${a}`).join(" "), (error, stdout, stderr) => {
			if (error) {
				void message.reply(`Error: ${error.message}`).catch(a => { });
				return;
			}
			if (stderr) {
				void message.reply(`Stderr: ${stderr}`).catch(a => { });
				return;
			}
			void message.reply(`Stdout: ${stdout}`).catch(a => { });
		});
	}
}

registerCommand(new HelloCommand());
