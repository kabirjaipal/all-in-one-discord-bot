const { Client, Message, MessageEmbed } = require('discord.js');
const { prefix } = require('../..');

module.exports = {
    name: 'ytchannelremove',
    aliases: ['ytchanneldelete'], 
    categories : 'yt_poster', 
    description: 'Delete/Remove a setup Channel by a CHANNELLINK',
    usage: '',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {

        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send(
            new MessageEmbed()
                .setColor("RED")
                .setDescription(":x: You are not allowed to execute this Command!")
        )

        let ChannelLink = args[0];
        if (!ChannelLink) return message.channel.send(`:x: Usage: \`${prefix}del <LINK>`)

         //Delete a Channel
         client.YTP.deleteChannel(message.guild.id, ChannelLink)
         .then(ch => {
             //console.log(ch) See the Responses: https://github.com/Tomato6966/discord-yt-poster/wiki/Responses
             //send information message
             message.channel.send(
                  new MessageEmbed()
                  .setColor("GREEN")
                  .setDescription(`I deleted the Settings for ${ch.deletedChannel.YTchannel} (<@${ch.deletedChannel.DiscordUser}>), posting in <#${ch.deletedChannel.DiscordChannel}>\n\nThe Message:\n${ch.deletedChannel.message}`)
             ).then(msg => msg.react("👍"))
         }).catch(e => {
             console.log(e);
             message.channel.send(`${e.message ? e.message : e}`, {
                 code: "js"
             })
         })


    }
}