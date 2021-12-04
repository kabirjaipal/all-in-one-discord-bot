const { Client, Message, MessageEmbed } = require("discord.js");
const config = require("../../config/config.json");

module.exports = {
  name: "roles",
  aliases: ["serverroles"],
  description: "Show all Roles of Guild",
  usage: "roles",
  category : "information",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const roles = message.guild.roles.cache
      .sort((a, b) => b.position - a.position)
      .map((role) => role.toString())
      .slice(0, -1);

    let rolesdisplay;
    if (roles.length < 150) {
      rolesdisplay = roles.join(" ");
    } else {
      rolesdisplay = roles.slice(150).join(" ");
    }

    let roless = new MessageEmbed()
      .setColor(config.colors.yes)
      .setTitle(`**❯ All Roles Of :** ${message.guild.name}`)
      .setDescription(`**${roles.toString()}**`)
      .setThumbnail(message.guild.iconURL())
      .setImage(
        "https://media.tenor.com/images/0dc6d37ba932ae491149cd5b747b05af/tenor.png"
      )
      .setFooter("Coded by: Tech Boy Gaming");

    message.channel.send(roless);
  },
};
