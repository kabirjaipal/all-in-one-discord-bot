const { Client, Message, MessageEmbed } = require('discord.js');
const { prefix } = require('../..');

module.exports = {
    name: 'deleteallytchannels',
    aliases: ['delallytuser'],
    categories: 'yt_poster',
    description: 'Delete/Remove all setup Channels of this Guild',
    usage: '',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {

        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send(
            new MessageEmbed()
                .setColor("RED")
                .setDescription(":x: You are not allowed to execute this Command!")
        )

        //delete all channels method
        client.YTP.deleteAllChannels(message.guild.id)
            .then(data => {
                //console.log(ch) See the Responses: https://github.com/Tomato6966/discord-yt-poster/wiki/Responses
                //send a successmessage
                message.channel.send(
                    new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(`I deleted ${data.deletedChannels.length} Channels`)
                ).then(msg => msg.react("👍"))
            }).catch(e => {
                console.log(e);
                message.channel.send(`${e.message ? e.message : e}`, {
                    code: "js"
                })
            })

    }
}