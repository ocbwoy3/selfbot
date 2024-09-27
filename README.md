# OCbwoy3's Selfbot
Only made for fun.

> [!CAUTION]
> Don't actually do this, you will be banned. You have been warned.
> Discord hates them for some reason, quoting "API Abuse". (Not remotely intended to abuse the API.)

![fuck you discord](https://raw.githubusercontent.com/ocbwoy3/112/main/media/discord.png)

<img style="display: block; margin: auto; height: 256px;" src="https://cdn.ocbwoy3.dev/27092024_184339.png" alt="fuck you discord">

Discord quoting "API Abuse" with this:

```js
fetch("https://discord.com/api/v9/invites/invitecodehere", {
  "headers": {
    "accept": "*/*",
    "accept-language": "lv",
    "authorization": (webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken(),
  },
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});
```

To add your own commands, clone an existing one, and add either `nsfw_` (self explanatory) or `user_` infront of the filename, so it would be `user_myplugin.ts`, so it will be gitignored.
To mark a command as NSFW, do something like `command.nsfw = true;`.

Your `.env` file must contain the discord token to your own personal discord account, like this:

```
TOKEN=YOUR.TOKEN
```
