const { Client, Message, MessageEmbed } = require('discord.js');
const { prefix } = require('../..');

module.exports = {
    name: 'getallytchannels',
    aliases: ['getalluser'],
    categories: 'yt_poster',
    description: 'Get all setup Channels of this Guild',
    usage: '',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {

        //get all channels
        client.YTP.getAllChannels(message.guild.id)
            .then(chs => {
                message.channel.send(
                    new MessageEmbed()
                        .setColor("GREEN")
                        .setDescription(`There are ${chs.length} Channels Setupped!`)
                ).then(msg => msg.react("👍"))
            }).catch(e => {
                console.log(e);
                message.channel.send(`${e.message ? e.message : e}`, {
                    code: "js"
                })
            })

    }
}