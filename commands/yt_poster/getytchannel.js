const { Client, Message, MessageEmbed } = require('discord.js');
const { prefix } = require('../..');

module.exports = {
    name: 'getytchannel',
    aliases: ['getchannel'],
    categories: 'yt_poster',
    description: 'Get a setup Channel by a CHANNELLINK',
    usage: '',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {

        let ChannelLink = args[0];
        if (!ChannelLink) return message.channel.send(`:x: Usage: \`${prefix}get <LINK>\``)

        //get a Channel
        client.YTP.getChannel(message.guild.id, ChannelLink).then(ch => {
            message.channel.send(
                new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`**Guild:**\n> **\`${client.guilds.cache.get(ch.DiscordGuild).name}\`**` + "\n" +
                        `**Channel to Post:**\n> **${message.guild.channels.cache.get(ch.DiscordChannel)}**` + "\n" +
                        `**Channel Link:**\n> **${ch.YTchannel}**` + "\n" +
                        `**Linked User:**\n> **\`${message.guild.members.cache.get(ch.DiscordUser).user.tag}\`**` + "\n" +
                        `**Last Video:**\n> **\`https://youtube.com/watch=?v${ch.oldvid}\`**` + "\n" +
                        `**Message:**\n>>> \`\`\`${ch.message}\`\`\``)
            ).then(msg => msg.react("👍"))
        }).catch(e => {
            console.log(e);
            message.channel.send(`${e.message ? e.message : e}`, {
                code: "js"
            })
        })


    }
}