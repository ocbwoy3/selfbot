import { exec } from "child_process";
import { Command, CommandExecutionContext } from "../lib/CommandAPI";
import { addCommand } from "../lib/CommandRegistrate";
import { PREFIX } from "../lib/Constants";
import { hostname, userInfo } from "os";
import { client } from "../lib/Client";
import { addWhitelist, removeWhitelist } from "../lib/Utility";
import { Channel, TextChannel, User } from "discord.js-selfbot-v13";

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
	});
};

(()=>{
	let cmd = new Command("whitelist","Allows a user to run commands in this channel",['wladd']);
	
	cmd.onExecute(async(p:CommandExecutionContext)=>{
		if (!p.message) return;
		if (p.message.author.id !== client.user?.id) {
			await p.reply(`> Owner only`);
			return;
		}

		await addWhitelist((p.args[0] as User),(p.message?.channel as TextChannel))

		await p.reply(`> Allowed ${(p.args[0] as User).id} to run commands.`);
	})
	
	addCommand(cmd);
})();

(()=>{
	let cmd = new Command("unwhitelist","Disallows a user to run commands in this channel",['wldel']);
	
	cmd.onExecute(async(p:CommandExecutionContext)=>{
		if (!p.message) return;
		if (p.message.author.id !== client.user?.id) {
			await p.reply(`> Owner only`);
			return;
		}

		await removeWhitelist((p.args[0] as User),(p.message?.channel as TextChannel))

		await p.reply(`> Disallowed ${(p.args[0] as User).id} to run commands.`);
	})
	
	addCommand(cmd);
})();

module.exports = null;