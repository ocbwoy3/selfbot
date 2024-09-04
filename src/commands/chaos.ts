import { exec } from "child_process";
import { Command, CommandExecutionContext } from "../lib/CommandAPI";
import { addCommand } from "../lib/CommandRegistrate";
import { client } from "../lib/Client";
import { Message } from "discord.js-selfbot-v13";

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

let cmd = new Command("chaos","Uses notify-send to notify you about EVERY SINGLE message that the Discord gateway sends. **DO NOT USE THIS AS IT ALLOWS ANYONE TO EXECUTE BASH CODE ON YOUR DEVICE**",[])

let chaosModeEnabled: boolean = false;
let useNotifySend: boolean = false;

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
	useNotifySend = (await wtf ("ls /bin/notify-send")).length !== 0
	if (<boolean>chaosModeEnabled === true) {
		chaosModeEnabled = false
		await p.reply("disabled")
		wtf(`notify-send "OCbwoy3's Selfbot" "Chaos mode disabled!"`)
	} else if (<boolean>chaosModeEnabled === false) {
		chaosModeEnabled = true
		await p.reply("good luck")
		wtf(`notify-send "OCbwoy3's Selfbot" "Chaos mode enabled, good luck!"`)
	}
})

addCommand(cmd)

module.exports = null;