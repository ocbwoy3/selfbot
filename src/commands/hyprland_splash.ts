import { exec } from "child_process";
import { Command, CommandExecutionContext } from "../lib/CommandAPI";
import { addCommand, getAllCommands, getCommand } from "../lib/CommandRegistrate";
import { PREFIX } from "../lib/Constants";

let cmd = new Command("splash","Get the splash text via hyprctl",[]);

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

cmd.onExecute(async(p:CommandExecutionContext)=>{
	if ((await wtf("ls /bin/Hyprland")).length < 2) {
		await p.reply("hyprland is not installed");
		return;
	}
	if ((await wtf("pidof Hyprland")).length < 1) {
		await p.reply("hyprland is not running");
		return;
	}
	await p.reply(await wtf("hyprctl splash"));
})

addCommand(cmd);

module.exports = null;