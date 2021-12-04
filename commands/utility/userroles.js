const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "userroles",
  aliases: [""],
  description: "Check Role of a User",
  usage: "userroles <mention>",
  category: "utility",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);

    if (!member)
      return message.channel.send(
        new MessageEmbed().setColor("BLUE").setTitle("Please mention a member.")
      );

    const memberRoles = member.roles.cache
      .filter((roles) => roles.id !== message.guild.id)
      .map((role) => role.toString());

    message.channel.send(
      new MessageEmbed()
        .setAuthor(
          member.user.tag,
          member.user.displayAvatarURL({ dynamic: true })
        )
        .setDescription(`${member}'s roles 🔗🔗  ${memberRoles}`)
        .setColor("BLUE")
    );
  },
};
