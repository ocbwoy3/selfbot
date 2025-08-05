import { client } from "@/constants";
import { Message, type PartialMessage } from "discord.js-selfbot-v13";

client.on("messageDelete", (msg: Message<boolean> | PartialMessage) => {
	if (msg.mentions.has(client.user!)) {
		if (msg.author) {
			console.warn(
				`Ghostping! (${msg.author.username}) | ${msg.content}`,
			);
		} else {
			console.warn(`Ghostping! <Partial> | ${msg.content}`);
		}
	}
});
