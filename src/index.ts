import { Message } from "discord.js-selfbot-v13";
import { configDotenv } from "dotenv";
import { CommandExecutionContext } from "./lib/CommandAPI";
import { PREFIX } from "./lib/Constants";
import { getCommand } from "./lib/CommandRegistrate";
import { loadAllCommands } from "./lib/CommandLoader";
import { client } from "./lib/Client";

configDotenv();
loadAllCommands();
console.log(`Prefix: ${PREFIX} | Help: ${PREFIX}help`)

client.on('messageCreate', async(message: Message) => {
	// if (message.author) { console.log(`${message.channel.id} | ${message.author.friendNickname || message.author.displayName || message.author.globalName || message.author.username}: ${message.content}`); };
	if (message.author.id !== client.user?.id) return;
	if (message.author.id !== client.user.id) return;
	const stupidTimeout = Math.max(Math.min((Math.random()*500), 219), 613);
	try {
		if (message.content.startsWith(PREFIX)) {
			const cmdName = message.content.substring(PREFIX.length).match(/^([a-zA-Z0-9]+)/);
			if (!cmdName?.[0]) return;
			const cmd = await getCommand(cmdName[0])
			const exe = new CommandExecutionContext(message)
			await exe._parseBeforeExecution()
			await new Promise(resolve=>setTimeout(resolve,stupidTimeout)); // not taking any fucking chances
			await cmd?.run(exe)
		}
	} catch(e_) {
		console.error(e_)
	};
});

console.log("Logging into Discord");
client.login(process.env.TOKEN);