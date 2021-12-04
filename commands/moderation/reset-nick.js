const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "reset-nick",
  aliases: [""],
  description: "use for reset nick name of a user",
  usage: "resetnick <user>",
  category : "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const user = message.mentions.members.first();

    if (!user) return message.reply("Please specify a member!");

    try {
      user.setNickname(null);
      message.reply(
        new MessageEmbed()
          .setTitle("Nickname Reseted !!")
          .setDescription(
            `✅ <@${user.id}> (\`${user.user.tag}\`) nickname has been successfully Reseted !!`
          )
          .addField(
            "Changed By",
            `<@${message.member.id}>\n(\`${message.member.user.tag}\`)`,
            true
          )
          .addField(
            "Changed User",
            `<@${user.id}>\n(\`${user.user.tag}\`)`,
            true
          )
          .setFooter(`Coded By Tech Boy Gaming`)
          .setTimestamp()
          .setColor("RED")
      );
    } catch (err) {
      message.reply(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setThumbnail(user.user.displayAvatarURL())
          .setDescription(
            "I do not have permission to reset " +
              user.toString() +
              " nickname!"
          )
          .setFooter(`Coded By Tech Boy Gaming`)
      );
    }
  },
};
