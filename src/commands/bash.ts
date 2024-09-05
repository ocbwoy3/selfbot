import { exec } from "child_process";
import { Command, CommandExecutionContext } from "../lib/CommandAPI";
import { addCommand } from "../lib/CommandRegistrate";
import { PREFIX } from "../lib/Constants";
import { hostname, userInfo } from "os";
import { client } from "../lib/Client";

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
	let cmd = new Command("bash","Runs the concatenation of the command arguments as a bash command",['sh']);

	cmd.onExecute(async(p:CommandExecutionContext)=>{
		if (!p.message) return;
		if (p.message.author.id !== client.user?.id) {
			await p.reply(`> Owner only`);
			return;
		}
		let stdout = await wtf(p.message.content.substring(PREFIX.length).replace(/^([a-zA-Z0-9]+) /,''));
		if (stdout.length === 0) {
			await p.reply("> [empty stdout]");
			return;
		}

		await p.reply(stdout.trim().replace(/^/gm,"> "));
	})
	
	addCommand(cmd);
})();

(()=>{
	let cmd = new Command("hostname","Gets the system hostname",[])
	cmd.whitelistLevel = 2;
	
	cmd.onExecute(async(p:CommandExecutionContext)=>{
		if (!p.message) return;
		const ui = userInfo()
		await p.reply(`**${ui.username}@${hostname()}** - Home Dir: ${ui.homedir} | Shell: ${ui.shell}`);
	})
	
	addCommand(cmd);
})();

(()=>{
	let cmd = new Command("killproc","Kills the current process with code 0",[])
	
	cmd.onExecute(async(p:CommandExecutionContext)=>{
		if (!p.message) return;
		if (p.message.author.id !== client.user?.id) {
			await p.reply(`error`);
			return;
		}
		await p.reply(`Adios!`);
		process.exit(0)
	})
	
	addCommand(cmd);
})();

module.exports = null;