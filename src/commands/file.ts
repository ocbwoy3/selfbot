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
	let cmd = new Command("file","Uploads a file",[]);
	
	cmd.onExecute(async(p:CommandExecutionContext)=>{
		if (!p.message) return;
		if (p.message.author.id !== client.user?.id) {
			await p.reply(`> Owner only`);
			return;
		}
		let file = p.message.content.substring(PREFIX.length).replace(/^([a-zA-Z0-9]+) /,'');
		await p.reply("> OK");
		try {
			await p.message?.reply({
				files: [file]
			})
		} catch(e_) {
			await p.reply(`> ${e_}`)
		}
	})
	
	addCommand(cmd);
})();

module.exports = null;