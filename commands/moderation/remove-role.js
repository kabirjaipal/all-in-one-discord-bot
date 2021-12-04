const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "removerole",
  aliases: ["backrole"],
  description: "remove role to any user",
  useage: "",
  category : "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    let target = message.mentions.members.first();

    if (!target)
      return message.channel.send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setDescription("**I am unable to find the user**")
          .setFooter("Coded by: Tech Boy Gaming")
      );

    let rrole = message.mentions.roles.first();

    if (!rrole)
      return message.channel.send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setDescription("**I am unable to find the role**")
          .setFooter("Coded by: Tech Boy Gaming")
      );

    let ticon = target.user.avatarURL({ dynamic: true, size: 2048 });
    let aicon = message.author.avatarURL({ dynamic: true, size: 2048 });

    const embed = new MessageEmbed()
      .setAuthor(target.user.username, ticon)
      .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
      .setColor("RANDOM")
      .setDescription(
        `${rrole} role removed from ${target}\n
            \`So Sad I Pray You Will Get Role Back\``
      )
      .setFooter(`Role added by ${message.author.username}`, aicon)
      .setTimestamp();

    await message.channel.send(embed).then((msg) => {
      msg.delete({ timeout: 7000 });
    });

    target.roles.remove(rrole);
  },
};
