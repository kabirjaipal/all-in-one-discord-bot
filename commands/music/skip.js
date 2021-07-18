const { Client, Message, MessageEmbed } = require('discord.js');
const functions = require('../../handlers/function')
const config = require('../../config/config.json')


module.exports = {
    name: 'skip',
    aliases: ["s"],
    useage: "skip",
    description: "Skips current song",
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

        //send information message
        functions.embedbuilder(client, 3000, message, config.colors.yes, "SKIPPED!", `Skipped the song`)

        //skip track
        client.distube.skip(message);

    }
}