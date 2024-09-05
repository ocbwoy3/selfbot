import { Channel, Message, User } from "discord.js-selfbot-v13";
import { client } from "./Client";
import { channel } from "diagnostics_channel";

export function escapeRegExp(string: string) {
    return string.replace(/(.)/g, '\\$&');
}

let selfbotWhitelist: {[user:string]: string} = {}

export async function addWhitelist(user:User,ch:Channel) {
    selfbotWhitelist[user.id+ch.id] = ch.id
}

export async function removeWhitelist(user:User,ch:Channel) {
    delete selfbotWhitelist[user.id+ch.id]
}

export async function isAllowed(message: Message): Promise<boolean> {
    if (message.author.id === (client.user as User).id) { 
        return true;
    }

    if (selfbotWhitelist[message.author.id+message.channel.id]) {
        const ch = selfbotWhitelist[message.author.id+message.channel.id]
        if (message.channel.id === ch) {
            return true;
        }
        return false;
    };

    return false;
}
