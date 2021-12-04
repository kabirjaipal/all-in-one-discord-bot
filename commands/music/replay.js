const { Client, Message, MessageEmbed } = require("discord.js");
const functions = require("../../handlers/function");
const config = require("../../config/config.json");
const distube = require("../../utils/etc/player");

module.exports = {
  name: "replay",
  aliases: ["restart"],
  useage: "replay",
  category: "music",
  description: "Replays the current song",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    //If Bot not connected, return error
    if (!message.guild.me.voice.channel)
      return functions.embedbuilder(
        client,
        3000,
        message,
        config.colors.no,
        "Nothing playing!"
      );

    //if member not connected return error
    if (!message.member.voice.channel)
      return functions.embedbuilder(
        client,
        5000,
        message,
        config.colors.no,
        "`" + message.author.tag + "`" + " You must join a Voice Channel"
      );

    //if they are not in the same channel, return error
    if (message.member.voice.channel.id != message.guild.me.voice.channel.id)
      return functions.embedbuilder(
        client,
        5000,
        message,
        config.colors.no,
        "`" +
          message.author.tag +
          "`" +
          " You must join my Voice Channel: " +
          ` \`${
            message.guild.me.voice.channel.name
              ? message.guild.me.voice.channel.name
              : ""
          }\``
      );

    //get the Queue
    let queue = distube.getQueue(message)

    //if no queue, return error
    if (!queue)
      return embedbuilder(
        "null",
        message,
        config.colors.no,
        "There is nothing playing!"
      );

    //get current song
    let cursong = queue.songs[0];

    //send information message
    functions.embedbuilder(
      client,
      5000,
      message,
      config.colors.yes,
      "Replaying current song:",
      `[${cursong.name}](${cursong.url})`,
      cursong.thumbnail
    );

    //seek to 0
    return client.distube.seek(message, 0);
  },
};
