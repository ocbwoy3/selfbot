import { exec } from "child_process";
import { Command, CommandExecutionContext } from "../lib/CommandAPI";
import { addCommand } from "../lib/CommandRegistrate";
import { client } from "../lib/Client";
import { Message } from "discord.js-selfbot-v13";
import { hostname } from "os";

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

let cmd = new Command("chaos","Logs every chat message the Discord gateway sends, if device hostname is ocbwoy3dotdev, otherwise sends a notification with notify-send",[])
cmd.whitelistLevel = 4;

let chaosModeEnabled: boolean = (hostname() === "ocbwoy3dotdev");
let useNotifySend: boolean = (hostname() !== "ocbwoy3dotdev");

client.on('messageCreate',async(message: Message)=>{
	if (!chaosModeEnabled) return;
	if (!message.content) return;
	if (!message.author) return;
	if (message.webhookId) return;
	if (useNotifySend === true) {
		wtf(`notify-send "${`${message.author.displayName || message.author.globalName} (${message.guild?.name || "DM or Groupchat"})`.replace(`\\`,`\\\\`).replace(`"`,`\"`).replace(`\n`,`\\n`).replace(`$`,`\\$`)}" "${`${message.content}`.replace(`\\`,`\\\\`).replace(`"`,`\"`).replace(`\n`,`\\n`).replace(`$`,`\\$`)}"`)
	} else {
		console.log(`(${message.guild?.name || "DM/GC"}) ${message.author.displayName || message.author.globalName}: ${message.content}`)
	}
})

cmd.onExecute(async(p:CommandExecutionContext)=>{
	useNotifySend = (hostname() !== "ocbwoy3dotdev")
	if (<boolean>chaosModeEnabled === true) {
		chaosModeEnabled = false
		await p.reply("> Disabled")
		wtf(`notify-send "OCbwoy3's Selfbot" "Chaos mode disabled!"`)
	} else if (<boolean>chaosModeEnabled === false) {
		chaosModeEnabled = true
		await p.reply("> Good luck")
		wtf(`notify-send "OCbwoy3's Selfbot" "Chaos mode enabled, good luck!"`)
	}
})

addCommand(cmd)

module.exports = null;