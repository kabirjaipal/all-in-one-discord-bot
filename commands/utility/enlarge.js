const { Client, Message, MessageEmbed, Util } = require("discord.js");
const { parse } = require("twemoji-parser");

module.exports = {
  name: "enlarge",
  aliases: ["emogif"],
  category: "utility",
  description: "Enlarges the emoji",
  usage: "enlarge <emoji>",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const emoji = args[0];
    if (!emoji) return message.reply("No emoji provided!");

    let custom = Util.parseEmoji(emoji);
    const embed = new MessageEmbed()
      .setTitle(`Enlarged version of ${emoji}`)
      .setColor("RED")
      .setFooter(`\`Coded by: Tech Boy Gaming\``);

    if (custom.id) {
      embed.setImage(
        `https://cdn.discordapp.com/emojis/${custom.id}.${
          custom.animated ? "gif" : "png"
        }`
      );
      return message.channel.send(embed);
    } else {
      let parsed = parse(emoji, { assetType: "png" });
      if (!parsed[0]) return message.channel.send("Invalid emoji!");

      embed.setImage(parsed[0].url);
      return message.channel.send(embed);
    }
  },
};
