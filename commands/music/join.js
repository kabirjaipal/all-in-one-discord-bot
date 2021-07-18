const { Client, Message, MessageEmbed } = require('discord.js');
const functions = require('../../handlers/function')
const config = require('../../config/config.json')

module.exports = {
    name: 'join',
    aliases: ["connect", "summon"],
    description: "Joins the Voice Channel",
    usage: 'join',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {

        //if user not connected return
        if (!message.member.voice.channel) return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " You must join a Voice Channel")

        //if bot is connected somewhere return
        if (message.guild.me.voice.channel) return functions.embedbuilder(client, 5000, message, config.colors.no, " I am already connected somewhere")

        //if not allowed to CONNECT to the CHANNEL
        if (!message.guild.me.permissionsIn(message.member.voice.channel).has("CONNECT"))
            return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " I am not allowed to \`join\` your Channel")

        //try to join the channel
        message.member.voice.channel.type === 'stage'

        message.member.voice.channel.join().catch(e => {
            return functions.embedbuilder(client, 5000, message, config.colors.no, "`" + message.author.tag + "`" + " I am not allowed to \`join\` your Channel")
        })

        //send info msg
        functions.embedbuilder(client, 5000, message, config.colors.yes, "Joined your Channel", `Play Tracks with: \`${config.prefix}play\``)

    }
}