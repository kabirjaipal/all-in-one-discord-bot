const { Client, Message, MessageEmbed } = require("discord.js");
const functions = require("../../handlers/function");
const config = require("../../config/config.json");
const distube = require("../../utils/etc/player");

module.exports = {
  name: "bassboost",
  useage: "bassboost <song>",
  description: "*Adds a Filter named bassboost ",
  category: "musicfilter",
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
    let filter = message.content.slice(config.prefix.length).split(" ")[0];
    if (args[0]) {
      let bassboostfilter = `bassboost${Math.floor(Number(args[0]))}`;
      switch (Math.floor(Number(args[0]))) {
        case 1:
          await distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(
            client,
            3000,
            message,
            config.colors.yes,
            "Adding filter!",
            `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``
          );
          break;

        case 2:
          await distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(
            client,
            3000,
            message,
            config.colors.yes,
            "Adding filter!",
            `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``
          );
          break;

        case 3:
          await distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(
            client,
            3000,
            message,
            config.colors.yes,
            "Adding filter!",
            `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``
          );
          break;

        case 4:
          await distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(
            client,
            3000,
            message,
            config.colors.yes,
            "Adding filter!",
            `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``
          );
          break;

        case 5:
          await distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(
            client,
            3000,
            message,
            config.colors.yes,
            "Adding filter!",
            `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``
          );
          break;

        case 6:
          await distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(
            client,
            3000,
            message,
            config.colors.yes,
            "Adding filter!",
            `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``
          );
          break;

        case 7:
          await distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(
            client,
            3000,
            message,
            config.colors.yes,
            "Adding filter!",
            `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``
          );
          break;

        case 8:
          await distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(
            client,
            3000,
            message,
            config.colors.yes,
            "Adding filter!",
            `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``
          );
          break;

        case 9:
          await distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(
            client,
            3000,
            message,
            config.colors.yes,
            "Adding filter!",
            `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``
          );
          break;

        case 10:
          await distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(
            client,
            3000,
            message,
            config.colors.yes,
            "Adding filter!",
            `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``
          );
          break;

        case 11:
          await distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(
            client,
            3000,
            message,
            config.colors.yes,
            "Adding filter!",
            `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``
          );
          break;

        case 12:
          await distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(
            client,
            3000,
            message,
            config.colors.yes,
            "Adding filter!",
            `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``
          );
          break;

        case 13:
          await distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(
            client,
            3000,
            message,
            config.colors.yes,
            "Adding filter!",
            `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``
          );
          break;

        case 14:
          await distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(
            client,
            3000,
            message,
            config.colors.yes,
            "Adding filter!",
            `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``
          );
          break;

        case 15:
          await distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(
            client,
            3000,
            message,
            config.colors.yes,
            "Adding filter!",
            `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``
          );
          break;

        case 16:
          await distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(
            client,
            3000,
            message,
            config.colors.yes,
            "Adding filter!",
            `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``
          );
          break;

        case 17:
          await distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(
            client,
            3000,
            message,
            config.colors.yes,
            "Adding filter!",
            `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``
          );
          break;

        case 18:
          await distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(
            client,
            3000,
            message,
            config.colors.yes,
            "Adding filter!",
            `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``
          );
          break;

        case 19:
          await distube.setFilter(message, bassboostfilter);
          await functions.embedbuilder(
            client,
            3000,
            message,
            config.colors.yes,
            "Adding filter!",
            `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``
          );
          break;

        case 20:
          await functions.embedbuilder(
            client,
            3000,
            message,
            config.colors.yes,
            "Adding filter!",
            `Bassboost with: \`${Math.floor(Number(args[0]))}db Gain\``
          );
          await distube.setFilter(message, bassboostfilter);
          break;

        default:
          await functions.embedbuilder(
            client,
            3000,
            message,
            config.colors.no,
            "ERROR",
            `Bassboost with: \`${Math.floor(
              Number(args[0])
            )}db Gain\` DOES NOT WORK!`
          );
          break;
      }
    } else if (
      message.content.slice(config.prefix.length).split(" ")[0] === queue.filter
    )
      filter = "clear";
    else {
      filter = await distube.setFilter(message, filter);
      await functions.embedbuilder(
        client,
        3000,
        message,
        config.colors.yes,
        "Adding filter!",
        filter
      );
    }
  },
};
