const { Client, Message, MessageEmbed } = require('discord.js');
const { MessageMenuOption, MessageActionRow, MessageMenu, MessageButton, MessageComponent } = require("discord-buttons");
const { stripIndents } = require("common-tags");


module.exports = {
    name: 'btn',
    aliases: [''],
    categories: ' ',
    description: '',
    usage: '',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {

        const embed = new MessageEmbed()
            .setColor(message.client.color)
            .setAuthor(message.client.user.username, message.client.user.displayAvatarURL())
            .setThumbnail(message.client.user.displayAvatarURL())
            .setFooter(`Request by: ${message.author.tag}`)
            .setTitle(`List All Command`);


        const commands = (category) => {
            return message.client.commands
                .filter(cmd => cmd.category === category)
                .map(cmd => `\`${cmd.name}\``)
                .join(", ");
        }


        const info = message.client.categories
            .map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n ${commands(cat)}`)
            .reduce((string, category) => string + "\n" + category);

        const FirstOption = new MessageMenuOption()
            .setLabel(`Info Commands`)
            .setDescription(`To see the Info Commands`)
            .setLabel(info)
            .setEmoji(`861556552971845652`)
            .setValue(`information-menu`)

        const FirstMenu = new MessageMenu()
            .addOption(FirstOption)
            .setID(`firstmenu`)
            .setPlaceholder(`Choose the help categoery.`)

        const FirstRow = new MessageActionRow()
            .addComponent(FirstMenu)



        return message.channel.send(embed.setDescription(info));
        await message.channel.send("Here you go sire choose your menu.", { components: [FirstRow] })


        client.on(`clickMenu`, async (menu) => {
            if (menu.values[0] == "information-menu") {
                await menu.reply.defer()
                menu.channel.send(`Commands on the way.`)
            }
        })

    }
}