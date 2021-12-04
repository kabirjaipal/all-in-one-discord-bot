const { Client, Message, MessageEmbed } = require("discord.js");
const config = require("../../config/config.json");

module.exports = {
  name: "delchannel",
  aliases: ["delch", "deletechannel"],
  description: "Delete Channels From your Server",
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
    const fetchedChannel = message.mentions.channels.first();
    if (!fetchedChannel) {
      return message.channel.send(
        new MessageEmbed()
          .setColor(config.colors.yes)
          .setAuthor(message.author.tag)
          .setTitle(`Usage: ${config.prefix}delchannel <channel>`)
          .setFooter(config.footertext)
      );
    }
    fetchedChannel.delete();

    const embed = new MessageEmbed()
      .setTitle(`Channel ${fetchedChannel} has been deleted`)
      .setAuthor(message.author.tag)
      .setColor("BLUE")
      .setFooter(config.footertext);

    await message.channel.send(embed);
  },
};
