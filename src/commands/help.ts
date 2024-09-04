import { exec } from "child_process";
import { Command, CommandExecutionContext } from "../lib/CommandAPI";
import { addCommand, getAllCommands, getCommand } from "../lib/CommandRegistrate";
import { PREFIX } from "../lib/Constants";

let cmd = new Command("help","Shows helpful information about a command, or lists them.",["cmd","cmds"]);

cmd.onExecute(async(p:CommandExecutionContext)=>{
	// console.log(p.args)
	if (p.args.length === 0) {
		let m = `## Prefix: \`${PREFIX}\``;
		const AllCommands = getAllCommands();
		Object.keys(AllCommands).forEach((command:string)=>{
			let cmd: string|Command = AllCommands[command]
			// console.log(command,cmd)
			if (typeof(cmd) === "string") {
				let cmd2: Command = AllCommands[cmd] as Command
				m += `\n-# ${cmd2.nsfw === true ? ":underage: " : "" } **${command}** - alias of ${cmd2.name}`
			} else {
				m += `\n-# ${cmd.nsfw === true ? ":underage: " : "" } **${cmd.name}** - ${cmd.desc}`
			}
		})
		await p.reply(m)
		return;
	}
	const cmd = await getCommand(p.args[0].toString())
	if (!cmd) {
		await p.reply("command not found");
		return;
	}
	const m = `## ${cmd.nsfw === true ? ":underage: " : "" } ${cmd.name}\n${cmd.desc}\nAliases: ${cmd.aliases.join(", ")}`
	await p.reply(m)
})

addCommand(cmd);

module.exports = null;