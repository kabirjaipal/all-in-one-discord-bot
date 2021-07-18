const { Client, Message, MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: '24/7',
    aliases: ['24', 'afkmusic'],
    description: "to keep the bot in the voice channel for 24/7",
    usage: '',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {

        let afk = JSON.parse(fs.readFileSync("./afk.json", "utf8"));
        if (!message.member.permissions.has('MANAGE_SERVER')) return sendError("You do not have permission to use this command", message.channel);
        if (!afk[message.guild.id]) afk[message.guild.id] = {
            afk: false,
        };
        var serverQueue = afk[message.guild.id]
        if (serverQueue) {

            serverQueue.afk = !serverQueue.afk;
            message.channel.send(
                new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`💤  **|**  AFK is **\`${serverQueue.afk === true ? "enabled" : "disabled"}\`**`)
                    .setAuthor(message.author.tag)
            )
            return fs.writeFile("./afk.json", JSON.stringify(afk), (err) => {
                if (err) console.error(err);
            });
        };
        return message.channel.send(
            new MessageEmbed()
                .setTitle(`There is nothing playing in this server. ${message.channel}`)
        )

    }
}