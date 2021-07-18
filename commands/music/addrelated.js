const { Client, Message, MessageEmbed } = require('discord.js');
const functions = require('../../handlers/function')
const config = require('../../config/config.json')


module.exports = {
    name: 'addrelated',
    aliases: ["addrelated", "related", "addsimilar", "similar"],
    useage: "addrelated",
    description: "Adds a similar song of the current Track",
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {
        //If Bot not connected, return error
        if (!message.guild.me.voice.channel) return functions.embedbuilder(client, 3000, message, config.colors.no, "Nothing playing!")

        //if member not connected return error
        if (!message.member.voice.channel) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join a Voice Channel")

        //if they are not in the same channel, return error
        if (message.member.voice.channel.id != message.guild.me.voice.channel.id) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join my Voice Channel: " + ` \`${message.guild.me.voice.channel.name ? message.guild.me.voice.channel.name : ""}\``)

        //get queue
        let queue = client.distube.getQueue(message);

        //if no queue return error
        if (!queue) return functions.embedbuilder(client, 3000, message, config.colors.no, "There is nothing playing!");

        //find related videos
        let newsong = await client.distube.addRelatedVideo(message);

        //send information message
        functions.embedbuilder(client, 10000, message, config.colors.yes, "🔎 Adding:", `[${newsong.songs[0].name}](${newsong.songs[0].url})`, newsong.songs[0].thumbnail)

        //play track
        return client.distube.play(message, newsong.songs[0].url)

    }
}