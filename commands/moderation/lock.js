const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "lock",
  aliases: [""],
  description: "Lock a Channel in Your Guild",
  usage: "lock <channel>",
  category : "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    let lockPermErr = new MessageEmbed()
      .setTitle("**User Permission Error!**")
      .setDescription("**Sorry, you don't have permissions to use this! ❌**");

    if (!message.channel.permissionsFor(message.member).has("ADMINISTRATOR"))
      return message.channel.send(lockPermErr);

    let channel = message.channel;

    try {
      message.guild.roles.cache.forEach((role) => {
        channel.createOverwrite(role, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false,
        });
      });
    } catch (e) {
      console.log(e);
    }

    message.channel.send(`Done | Channel Locked!`);
  },
};
