import { Client } from "discord.js-selfbot-v13";

export const client: Client = new Client();

client.on('ready',async()=>{
	console.warn(`Logged in as ${client.user?.globalName} (${client.user?.id})`);
});