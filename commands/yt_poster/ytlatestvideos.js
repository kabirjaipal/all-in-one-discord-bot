const { Client, Message, MessageEmbed } = require('discord.js');
const { prefix } = require('../..');

module.exports = {
    name: 'ytlatestvideos',
    aliases: ['allytvideos'],
    categories: 'yt_poster',
    description: 'Get all/latest Videos by a CHANNELLINK',
    usage: '',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {

        let ChannelLink = args[0];
        if (!ChannelLink) return message.channel.send(`:x: Usage: \`${prefix}latestVideos <LINK>\``)

        //get the Latest Videos
        client.YTP.getLatestVideos(ChannelLink).then(Videos => {
  
            let embed = new MessageEmbed()
                .setTitle(`Videos of ${Videos[0].author}`)
                .setColor("RED")
                .setURL(ChannelLink)
            //For Each Video, add a new Field (just the first 10 Videos!)
            Videos.forEach((v, i) => {
                if (i < 10) {
                    embed.addField(v.title, `[Watch it](${v.link}) | Published at: \`${v.pubDate}\``)
                }
            })
            //Send the Message
            message.channel.send({
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