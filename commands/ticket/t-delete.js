const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "t-delete",
  aliases: ["deltick"],
  category: "ticket",
  description: "Delete a specified ticket.",
  usage: "",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (message.channel.name.includes("ticket-")) {
      message.channel.delete();
    } else {
      return message.reply(
        "you cannot use this command here. Please use this command when you want to delete a ticket."
      );
    }
  },
};
