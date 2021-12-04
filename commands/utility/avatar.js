const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "avatar",
  aliases: ["av", "pfp", "pic"],
  category: "utility",
  description: "Get your own or someone else's avatar",
  usage: "[user mention]",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const user = message.mentions.users.first() || message.author;

    let av = new MessageEmbed()
      .setColor("RED")
      .setAuthor(message.author.username)
      .setTitle(`Here is Avatar of ${user.tag}`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
      .setDescription(
        `:frame_photo: [PNG](${user.avatarURL({
          format: "png",
        })}) | :frame_photo: [JPG](${user.avatarURL({
          format: "jpg",
        })}) | :frame_photo: [WEBP](${user.avatarURL({ format: "webp" })}) |` +
          "\nYour PFP is Op :blush:"
      )
      .setFooter(`\`Coded by: Tech Boy Gaming\`` + client.user.tag);

    message.channel.send(av);
  },
};
