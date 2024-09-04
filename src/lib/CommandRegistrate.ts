import { Command } from "./CommandAPI";

let AllCommands: {[commandName: string]: Command|string} = {}

export function getAllCommands(): {[commandName: string]: Command|string} {
	return AllCommands
}

export function addCommand(c: Command): void {
	if (AllCommands[c.name]) {
		throw new Error(`Command "${c.name}" already exists in AllCommands!`);
	};
	AllCommands[c.name] = c
	c.aliases.forEach((alias: string)=>{
		if (AllCommands[alias]) {
			throw new Error(`Command "${c.name}" alias "${alias}" already exists in AllCommands!`);
		};
		AllCommands[alias] = c.name;
	});
	console.log(`Successfully registered command "${c.name}" and it's ${c.aliases.length} aliases!`)
}

export async function getCommand(command: string): Promise<Command|null> {
	const cmd = AllCommands[command]
	if (typeof(cmd) === "string") {
		return await getCommand(cmd);
	} else {
		return cmd || null;
	}
}