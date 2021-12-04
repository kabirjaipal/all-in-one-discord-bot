const { Client, Message, MessageEmbed } = require("discord.js");
const config = require("../../config/config.json");

module.exports = {
  name: "t-remove",
  aliases: ["ticketremove"],
  description: "Removes a member to a specified ticket.",
  category: "ticket",
  usage: "",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (message.channel.name.includes("ticket-")) {
      const member =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]) ||
        message.guild.members.cache.find(
          (x) =>
            x.user.username === args.slice(0).join(" ") ||
            x.user.username === args[0]
        );
      if (!member) {
        return message.channel.send(
          `Incorrect Usage! Correct Usage:${config.prefix}remove <member>`
        );
      }
      try {
        message.channel
          .updateOverwrite(member.user, {
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false,
            ATTACH_FILES: false,
            READ_MESSAGE_HISTORY: false,
          })
          .then(() => {
            message.channel.send(
              `Successfully removed ${member} from ${message.channel}`
            );
          });
      } catch (e) {
        return message.channel.send("An error occurred, please try again!");
      }
    }
  },
};
