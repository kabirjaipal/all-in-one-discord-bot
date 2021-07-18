const { Client, Message, MessageEmbed } = require('discord.js');
const functions = require('../../handlers/function')
const config = require('../../config/config.json')

module.exports = {
    name: 'resume',
    aliases: ["r"],
    useage: "resume",
    description: "Resume the song",
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

        //if Bot is not paused, return error
        if (!client.distube.isPaused(message)) return functions.embedbuilder(client, "null", message, config.colors.no, "Not paused!")

        //send information embed
        functions.embedbuilder(client, 3000, message, config.colors.yes, "Resume!")

        //resume
        client.distube.resume(message);


    }
}