const { Client, Message, MessageEmbed } = require("discord.js");
const config = require("../../config/config.json");

module.exports = {
  name: "createchat",
  aliases: ["makechannel", "createchannel"],
  description: "Create Text Channels in your Server",
  usage: "createchat <name>",
  category : "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.permissions.has("MANAGE_CHANNELS")) {
      return message.channel.send("You don't have enough Permissions");
    }

    if (!args[0]) {
      return message.channel.send(
        new MessageEmbed()
          .setColor(config.colors.no)
          .setAuthor(message.author.tag)
          .setTitle(`Usage: ${config.prefix}createchat <channel>`)
          .setDescription("Please mention the name for the Channel")
          .setFooter(config.footertext)
      );
    }

    message.guild.channels.create(args.slice(0).join(" "), {
      topic: "For chat",
      type: "text",
    });

    const embed = new MessageEmbed()
      .setTitle("Channel Updates")
      .setDescription(`Channel ${args[0]} has been created`)
      .setColor(config.colors.yes)
      .setFooter(config.footertext);
    message.channel.send(embed);

    // client.modlogs(
    //     {
    //         Member: member,
    //         Action: 'Ban',
    //         Color: 'PURPLE',
    //         Reason: reason
    //     },
    //     message
    // )
  },
};
