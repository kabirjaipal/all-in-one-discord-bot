const { Client, Message, MessageEmbed } = require("discord.js");
const functions = require("../../handlers/function");
const config = require("../../config/config.json");
const distube = require("../../utils/etc/player");

module.exports = {
  name: "rewind",
  aliases: ["rew"],
  useage: "rewind <DURATION>",
  category: "music",
  description: "Rewinds the Song back: seconds",
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

    //if no Queue return error message
    if (!queue)
      return functions.embedbuilder(
        client,
        3000,
        message,
        config.colors.no,
        "Nothing playing!"
      );

    //if no arguments, return error message
    if (!args[0])
      return functions.embedbuilder(
        client,
        5000,
        message,
        config.colors.no,
        "`" +
          message.author.tag +
          "`" +
          "Please add the amount you wanna rewind"
      );

    //get seektime
    let seektime = queue.currentTime - Number(args[0]) * 1000;
    if (seektime < 0) seektime = 0;
    if (seektime >= queue.songs[0].duration - queue.currentTime) seektime = 0;

    //seek
    distube.seek(message, Number(seektime));

    //send information message
    functions.embedbuilder(
      client,
      3000,
      message,
      config.colors.yes,
      "REWIND!",
      `Rewinded the song for \`${args[0]} seconds\``
    );
  },
};
