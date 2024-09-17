# OCbwoy3's Selfbot
Only made for fun.

> [!DANGER]
> Don't actually do this, you will be banned. You have been warned.
> Discord hates them for some reason, quoting "API Abuse". (Not remotely intended to abuse the API.)


![Discord is brutal](https://raw.githubusercontent.com/ocbwoy3/112/main/media/discord.png)

<img style="display: block; margin: auto; height: 256px;" src="https://raw.githubusercontent.com/ocbwoy3/112/main/media/17092024_215214.png">

To add your own commands, clone an existing one, and add either `nsfw_` (self explanatory) or `user_` infront of the filename, so it would be `user_myplugin.ts`, so it will be gitignored.
To mark a command as NSFW, do something like `command.nsfw = true;`.

Your `.env` file must contain the discord token to your own personal discord account, like this:

```
TOKEN=YOUR.TOKEN
```