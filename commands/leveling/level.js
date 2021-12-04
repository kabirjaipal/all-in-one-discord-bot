const {
  Client,
  Message,
  MessageEmbed,
  MessageAttachment,
} = require("discord.js");
const config = require("../../config/config.json");
const Levels = require("discord-xp");
Levels.setURL(config.mongoose);

module.exports = {
  name: "level",
  description: "Shows your current rank & level!",
  usage: "level",
  aliases: "",
  category : "leveling",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const target = message.mentions.users.first() || message.author;
    const user = await Levels.fetch(target.id, message.guild.id);

    if (!user) {
      const u = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle(`${target.username} Level`)
        .setThumbnail(target.displayAvatarURL())
        .setDescription(
          " oops , Seems like this user has not earned any xp so far."
        )
        .setFooter("Leveling System By Kabir Jaipal");

      message.channel.send(u);
    }

    if (user) {
      const levelsss = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle(`${target.username} Level`)
        .setThumbnail(target.displayAvatarURL())
        .setDescription(`> **${target.tag}** is currently level ${user.level}.`)
        .setFooter("Leveling System By Kabir Jaipal");

      message.channel.send(levelsss);
    }
  },
};
