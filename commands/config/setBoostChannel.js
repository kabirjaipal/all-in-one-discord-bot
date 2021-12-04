const { Client, Message, MessageEmbed } = require("discord.js");
const db = require("../../utils/models/boost");

module.exports = {
  name: "setboostchannel",
  aliases: ["setbc", "setboostchannel", "setboostc"],
  category: "config",
  description: "Setup the booster message channel!!",
  usage: "",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.permissions.has("ADMINISTRATOR"))
      return message.lineReply(
        "You do not have admin perms to use this command!"
      );

    const channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[0]);

    if (!channel) return message.lineReply("Please provide the channel!");

    await db.findOne({ guild: message.guild.id }, async (err, data) => {
      if (!data) {
        data = new db({
          guild: message.guild.id,
          channel: channel.id,
        }).save();
        message.channel.send(
          `The booster message channel has been set as ${channel}!`
        );
      } else {
        data.channel = channel.id;
        await db.findOneAndUpdate({ guild: message.guild.id });
        message.channel.send(
          `The booster message channel has been update to ${channel}!`
        );
      }
    });
  },
};
