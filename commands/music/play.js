const { Client, Message, MessageEmbed } = require("discord.js");
const ee = require("../../config/bot.json");
const config = require("../../config/config.json");
const distube = require("../../utils/etc/player");

module.exports = {
  name: "play",
  aliases: ["p"],
  description: "",
  category: "music",
  usage: "",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const { channel } = message.member.voice;

    // if member not join channel
    if (!channel)
      return message.channel
        .send(
          new MessageEmbed()
            .setColor(ee.colour)
            .setTitle(`Searching Song`)
            .setDescription(`🎶 Please Join A voice Channel First..`)
            .setFooter(config.footertext)
        )
        .then((msg) => {
          msg.delete({
            timeout: 5000,
          });
        });
    let search = args.join(" ");

    if (!search) {
      return message.channel
        .send(
          new MessageEmbed()
            .setColor(ee.colour)
            .setTitle(`Give me Song name or link`)
            .setFooter(config.footertext)
        )
        .then((msg) => {
          msg.delete({
            timeout: 5000,
          });
        });
    } else {
      message.channel
        .send(
          new MessageEmbed()
            .setColor(ee.colour)
            .setTitle(`Searching Song`)
            .setDescription(
              `🎶  I AM Searching Your Song , Hehe!!\`\`\`${search}\`\`\``
            )
            .setFooter(config.footertext)
        )
        .then((msg) => {
          msg.delete({
            timeout: 5000,
          });
        });
      distube.play(message, search);
    }
  },
};
