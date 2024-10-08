import { Message, MessageEditOptions, MessagePayload, ReplyMessageOptions, TextChannel, User } from "discord.js-selfbot-v13"
import { getCommand } from "./CommandRegistrate";
import { PREFIX } from "./Constants";
import { MessageOptions } from "child_process";
import { client } from "./Client";
import { getWhitelistLevel } from "./Utility";

export type MessageCommandArgument = string | User

export async function parseArguments(message: Message): Promise<MessageCommandArgument[]> {
	const regex = /<@!?(\d+)>|("[^"]*"|\S+)/g;
	let cx: string = message.content.substring(PREFIX.length).replace(/^([a-zA-Z0-9]+) ?/,'');
	// console.log(cx,"THIS FUCKING SHIT!!",cx.length,message.content)
	if (cx.length===0) { return []; };
	const matches = cx.matchAll(regex);
  
	const args: MessageCommandArgument[] = [];
	for (const match of matches) {
		if (match[1]) {
			try {
				args.push(await message.client.users.fetch(match[1]));
			} catch (error) {
				console.error(`Failed to fetch user: ${error}`);
			}
		} else {
			args.push(match[0].replace(/^"|"$/g, ''));
		}
	}
  
	return args; // .slice(1);
}

export class CommandExecutionContext {
	public message?: Message;
	public command: string = "";
	public args: MessageCommandArgument[] = []
	
	public whitelistLevel: number = 0;

	constructor(m: Message) {
		this.message = m;
		this.command = m.content.substring(PREFIX.length).match(/^([a-zA-Z0-9]+)/)?.[0] as string;
	}
	
	public async _parseBeforeExecution() {
		this.whitelistLevel = await getWhitelistLevel(this.message?.author as User,this.message?.channel as TextChannel) as number
		this.args = await parseArguments(this.message as Message);
	}

	private _alreadyReplied: boolean = false

	public async reply(mp: string) {
		if (this.message?.author.id !== client.user?.id) {
			await this.message?.reply(mp);
			return;
		}
		if (this._alreadyReplied) {
			this._alreadyReplied = true;
			await this.message?.reply(mp);
		} else {
			await this.message?.edit(mp);
		}
	}

}
export class Command {
	public name: string = "%undefined";
	public aliases: string[] = [];
	public desc: string = "an undefined command";
	public nsfw: boolean = false;
	public whitelistLevel: number = 1;
	constructor(name: string, desc?: string, aliases?: string[]) {
		this.name = name;
		this.desc = desc || "Unspecified command";
		this.aliases = aliases || [];
	}

	private execute: Function = (_: CommandExecutionContext)=>{};

	public onExecute(f: (_: CommandExecutionContext)=>void): void {
		this.execute = f;
	}

	public async run(c: CommandExecutionContext): Promise<void> {
		await this.execute(c)
	}
}
