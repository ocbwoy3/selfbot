import { Message, User } from "discord.js-selfbot-v13";
import { client } from "./Client";

export function escapeRegExp(string: string) {
    return string.replace(/(.)/g, '\\$&');
}

export async function isAllowed(message: Message): Promise<boolean> {
    if (message.author.id === (client.user as User).id) { 
        return true;
    }
    if (message.channel.id === "1193308730536767559") {
        if (message.author.id === "1036309466125176884") {
            return true;
        }
    }

    return false;
}
