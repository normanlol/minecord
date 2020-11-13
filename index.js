const discordjs = require("discord.js");
const discord = new discordjs.Client();
const mc = require("minecraft-protocol");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("config.json"));

discord.login(config.djsBotToken);

var mcClient = mc.createClient({
    host: config.minecraftServerIp,
    port: config.minecraftServerPort,
    username: config.minecraftUsername,
    password: config.minecraftPassword
});

mcClient.on("chat", function(packet) {
    var packet = JSON.parse(packet.message);
    var textMessage = "";
    for (var c in packet.extra) {
        var textMessage = textMessage + packet.extra[c].text;
    }
    if (textMessage == "") {return;}
    discord.channels.cache.get(config.djsChannelId).send(textMessage);
})

discord.on("ready", function() {
    discord.user.setActivity('crossplatform messaging is rad', { type: "PLAYING"});
});

discord.on("message", function(msg) {
    if (msg.author.bot == true) {return;}
    else if (msg.channel.id == config.djsChannelId) {
        mcClient.write('chat', {message: `${msg.author.username}#${msg.author.discriminator}: ${msg.content}`});
    }
});