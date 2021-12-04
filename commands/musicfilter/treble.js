const { Client, Message, MessageEmbed } = require("discord.js");
const functions = require("../../handlers/function");
const config = require("../../config/config.json");
const path = require("path");
const distube = require("../../utils/etc/player");

module.exports = {
  name: "bassboost",
  useage: "bassboost <song>",
  category: "musicfilter",
  description: "*Adds a Filter named bassboost ",
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

    //get queue
    let queue = distube.getQueue(message)

    //if no queue return error
    if (!queue)
      return functions.embedbuilder(
        client,
        3000,
        message,
        config.colors.no,
        "There is nothing playing!"
      );

    //get the filter from the content
    let filter = path.parse(__filename).name;

    //if its the same filter as the current one, use bassboost6
    if (filter === queue.filter) filter = "bassboost6";

    //set the new filter
    filter = await distube.setFilter(message, filter);

    //send information message
    await functions.embedbuilder(
      client,
      3000,
      message,
      config.colors.yes,
      "Adding filter!",
      filter
    );
  },
};
