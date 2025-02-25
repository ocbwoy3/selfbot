import { configDotenv } from "dotenv";
import { client } from "./constants";
import type { Message } from "discord.js-selfbot-v13";
import { handleCommand } from "./api/commandHandler";
import { readdirSync } from "fs";
import { join } from "path";

configDotenv();

client.on("ready", async () => {
	console.log(
		`Logged in as ${client.user!.displayName} (${client.user!.id})`
	);
});

client.on("messageCreate", async (m: Message) => {
	await handleCommand(m);
});

async function loadFilesFromDir(dir: string) {
	const path = join(__dirname, dir);
	const files = readdirSync(path, { recursive: true }).filter((file) => {
		const f = (file as any as string)
		return f.endsWith(".ts") && !f.endsWith(".m.ts")
	});

	for (const file of files) {
		const filePath = join(path, file as any as string);
		try {
			await import(filePath)
			console.log(`Loaded file ${dir}/${file}`);
		} catch (error) {
			console.error(`Failed to load command ${file}:`, error);
		}
	}
}

await loadFilesFromDir("commands");
await loadFilesFromDir("modules");

client.login(process.env.TOKEN!);
