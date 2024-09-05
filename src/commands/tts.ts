import { exec } from "child_process";
import { Command, CommandExecutionContext } from "../lib/CommandAPI";
import { addCommand, getAllCommands, getCommand } from "../lib/CommandRegistrate";
import { PREFIX } from "../lib/Constants";

let cmd = new Command("tts","Plays the spoken text from the speakers, requires flite and pulseaudio",[]);

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
	if (!p.message) return;
	if (p.args.length === 0) {
		await p.reply("> No text given")
	} else {
		if ((await wtf("ls /bin/flite")).length < 2) {
			await p.reply("> Flite is not installed");
			return;
		}
		if ((await wtf("pidof pulseaudio")).length < 2) {
			await p.reply("> PulseAudio is not installed/running");
			return;
		}
		const message = p.message.content.substring(PREFIX.length).replace(/^([a-zA-Z0-9]+) /,'')
		.replace(`\\`,`\\\\`).replace(`"`,`\"`).replace(`\n`,`\\n`).replace(`$`,`\\$`);
		await p.reply("> Attempting to say");
		await wtf(`echo ". . . . . . ${message}" | flite`)
	}
})

wtf("ls /bin/flite").then(async(stdout)=>{
	if (stdout.length < 2) {
		console.error("Flite is not installed")
	} else {
		wtf("pidof pulseaudio").then(async(stdout)=>{
			if (stdout.length < 2) {
				console.error("PulseAudio is not installed")
			} else {
				addCommand(cmd);
			}
		})
	}
})

module.exports = null;