import { readdirSync } from "fs";

var normalizedPath = require("path").join(__dirname, "../commands/");

export function loadAllCommands() {
	readdirSync(normalizedPath).forEach((file: string)=>{
		if (!file.endsWith(".js")) return;
		console.log(`Requiring ./commands/${file}`)
		try {
			require("../commands/" + file);
		} catch(e_) {
			console.log(`./commands/${file} errored - ${e_}`)
		}
	});
}


