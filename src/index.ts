import { ClientUser, Message, User } from "discord.js-selfbot-v13";
import { configDotenv } from "dotenv";
import { CommandExecutionContext } from "./lib/CommandAPI";
import { PREFIX } from "./lib/Constants";
import { getCommand } from "./lib/CommandRegistrate";
import { loadAllCommands } from "./lib/CommandLoader";
import { client } from "./lib/Client";
import { isAllowed } from "./lib/Utility";
import { exec } from "child_process";

configDotenv();
loadAllCommands();
console.log(`Prefix: ${PREFIX} | Help: ${PREFIX}help`)

async function wtf(cmd:string): Promise<string> {
	// console.log('EXECUTING COMMAND:',cmd)
	return await new Promise((resolve, reject)=>{
		try {
			exec(cmd,(a,b)=>resolve(b));
		} catch {
			resolve('command error');
		};
		setTimeout(()=>{
			try { resolve("command timeout") } catch {};
		}, 2000);
	})
};

client.on('messageCreate', async(message: Message) => {
	// if (message.author) { console.log(`${message.channel.id} | ${message.author.friendNickname || message.author.displayName || message.author.globalName || message.author.username}: ${message.content}`); };
	if (!isAllowed) return;
	const stupidTimeout = Math.max(Math.min((Math.random()*500), 219), 613);
	try {
		if (message.content.startsWith(PREFIX)) {
			const cmdName = message.content.substring(PREFIX.length).match(/^([a-zA-Z0-9]+)/);
			if (!cmdName?.[0]) return;
			const cmd = await getCommand(cmdName[0])
			if (!cmd) return;
			if (cmd.nsfw === true) {
				if (!(client.user as ClientUser).nsfwAllowed) {
					if (message.author.id === client.user?.id) {
						await message.edit({
							content: "This command is blocked due to account settings."
						})
					} else {
						await message.reply({
							content: "This command is blocked due to account settings."
						})
					}
					return;
				}
				// HOW THE FUCK DO I FETCH A CHANNEL'S NSFW STATUS
				if (message.channel.type === "GUILD_TEXT" || message.channel.type === "GUILD_VOICE" || message.channel.type === "GUILD_NEWS" || message.channel.type === "GUILD_STAGE_VOICE") {
					if (message.channel.nsfw === false) {
						if (message.author.id === client.user?.id) {
							await message.edit({
								content: "This command is blocked due to channel settings."
							})
						} else {
							await message.reply({
								content: "This command is blocked due to channel settings."
							})
						}
						return;
					}
				}
			}
			const exe = new CommandExecutionContext(message)
			await exe._parseBeforeExecution()
			await new Promise(resolve=>setTimeout(resolve,stupidTimeout)); // not taking any fucking chances
			await cmd?.run(exe)
		}
	} catch(e_) {
		console.error(e_)
	};
});

(async()=>{
	// if ((await wtf("ls /bin/pacman")).length < 2) {
	// 	console.error("Not running on Arch!")
	// 	return;
	// }
	console.log("Logging into Discord");
	client.login(process.env.TOKEN);
})()