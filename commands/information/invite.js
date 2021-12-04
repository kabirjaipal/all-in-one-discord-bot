const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'invite',
    aliases: ['inv'],
    description: '',
    usage: '',
    category : "information",
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {

        message.channel.send(
            new MessageEmbed()
                .setColor('BLUE')
                .setAuthor(message.author.tag)
                .setTitle("Invite & Support Link!")
                .addField("**Invite Link**", `[Click here to invite me](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8)`)
                .addField("**Support Server**", `[Click to join support Server](https://discord.com/invite/tVWrU5PWZV)`)
                .setFooter(`Requested by ${message.author.tag}`, client.user.displayAvatarURL())
                .setTimestamp()


        )

    }
}