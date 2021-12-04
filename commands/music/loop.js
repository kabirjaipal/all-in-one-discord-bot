const { Client, Message, MessageEmbed } = require("discord.js");
const functions = require("../../handlers/function");
const config = require("../../config/config.json");
const distube = require("../../utils/etc/player");

module.exports = {
  name: "loop",
  aliases: ["repeat"],
  useage: "loop <0/1/2> |",
  category: "music",
  description:
    "Enables loop for off / song / queue*\n0 = off\n1 = song\n2 = queue",
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

    //if no arguments return error
    if (!args[0])
      return functions.embedbuilder(
        client,
        5000,
        message,
        config.colors.no,
        "`" +
          message.author.tag +
          "`" +
          " Please add the Loop style Options wanna change",
        `Valid Options:\n\n\`0\`   /   \`1\`   /   \`2\`\n\`off\` / \`song\` / \`queue\``
      );

    //set variable
    let loopis = args[0];
    if (args[0].toString().toLowerCase() === "song") loopis = "1";
    else if (args[0].toString().toLowerCase() === "queue") loopis = "2";
    else if (args[0].toString().toLowerCase() === "off") loopis = "0";
    else if (args[0].toString().toLowerCase() === "s") loopis = "1";
    else if (args[0].toString().toLowerCase() === "q") loopis = "2";
    else if (args[0].toString().toLowerCase() === "disable") loopis = "0";
    loopis = Number(loopis);

    //change loop state
    if (0 <= loopis && loopis <= 2) {
      await distube.setRepeatMode(message,parseInt(args[0]))
      await functions.embedbuilder(
        client,
        3000,
        message,
        config.colors.yes,
        "Repeat mode set to:",
        `${args[0]
          .replace("0", "OFF")
          .replace("1", "Repeat song")
          .replace("2", "Repeat Queue")}`
      );
      return;
    } else {
      return functions.embedbuilder(
        client,
        3000,
        message,
        config.colors.no,
        "ERROR",
        `Please use a number between **0** and **2**   |   *(0: disabled, 1: Repeat a song, 2: Repeat all the queue)*`
      );
    }
  },
};
