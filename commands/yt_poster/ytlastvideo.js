const { Client, Message, MessageEmbed } = require('discord.js');
const { prefix } = require('../..');

module.exports = {
    name: 'ytlastvideo',
    aliases: ['ytnewvideo'],
    categories: 'yt_poster',
    description: 'Get the most recent uploaded Video by a CHANNELLINK',
    usage: '',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {

        let ChannelLink = args[0];
        if (!ChannelLink) return message.channel.send(
            new MessageEmbed()
                .setColor("RED")
                .setDescription(`:x: Usage: \`${prefix}lastVideo <LINK>\``)
        )

        //get the latest videos
        client.YTP.getLatestVideos(ChannelLink).then(videos => {
            let video = videos[0]
            let time = new Date(video.pubDate)
            //define the embed
            let embed = new MessageEmbed()
                .setTitle(video.title)
                .setURL(video.link)
                .setColor("RED")
                .setFooter(`ID: ${video.id}`)
                .setTimestamp(time.getTime())
            //Send the Message
            message.channel.send({
                content: `${video.link}`,
                embed: embed
            }).then(msg => msg.react("👍"))
        }).catch(e => {
            console.log(e);
            message.channel.send(`${e.message ? e.message : e}`, {
                code: "js"
            })
        })

    }
}