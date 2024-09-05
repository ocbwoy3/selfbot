import { Channel, Message, User } from "discord.js-selfbot-v13";
import { client } from "./Client";
import { channel } from "diagnostics_channel";

export function escapeRegExp(string: string) {
    return string.replace(/(.)/g, '\\$&');
}

let selfbotWhitelist: {[user:string]: number} = {}

export async function setWhitelistLevel(user:User,ch:Channel,wll:number): Promise<void> {
    if (user.id === client.user?.id) return;
    selfbotWhitelist[user.id+" "+ch.id] = wll
}

export async function getWhitelistLevel(user:User,ch:Channel): Promise<number> {
    if (user.id === client.user?.id) return Infinity;
    return selfbotWhitelist[user.id+" "+ch.id]
}

export async function addWhitelist(user:User,ch:Channel): Promise<void> {
    selfbotWhitelist[user.id+" "+ch.id] = 1
}

export async function removeWhitelist(user:User,ch:Channel): Promise<void> {
    delete selfbotWhitelist[user.id+" "+ch.id]
}

export async function isAllowed(message: Message): Promise<boolean> {
    if (message.author.id === (client.user as User).id) { 
        return true;
    }

    if (selfbotWhitelist[message.author.id+" "+message.channel.id]) {
        const ch = selfbotWhitelist[message.author.id+" "+message.channel.id]
        if (ch > 0) {
            return true;
        }
        return false;
    };

    return false;
}
