const { Client, Message, MessageEmbed } = require("discord.js");
const config = require("../../config/config.json");

module.exports = {
  name: "t-new",
  aliases: ["open-ticket", "newtick"],
  category: "ticket",
  description: "Creates a new ticket.",
  usage: "",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.guild.me.permissions.has("MANAGE_CHANNELS"))
      return message.channel.send(
        "I need the `MANAGE_CHANNELS` permission to use this comamnd"
      );
    if (
      message.guild.channels.cache.find(
        (channel) => channel.name === `ticket-${message.author.id}`
      )
    ) {
      return message.reply(
        "you already have a ticket, please close your exsisting ticket first before opening a new one!"
      );
    }

    message.guild.channels
      .create(`ticket-${message.author.id}`, {
        permissionOverwrites: [
          {
            id: message.author.id,
            allow: ["SEND_MESSAGES", "VIEW_CHANNEL"],
          },
          {
            id: message.guild.roles.everyone,
            deny: ["VIEW_CHANNEL"],
          },
        ],
        type: "text",
      })
      .then(async (channel) => {
        message.reply(
          `you have successfully created a ticket! Please click on ${channel} to view your ticket.`
        );
        channel.send(
          `Hi ${message.author}, welcome to your ticket! Please be patient, we will be with you shortly. If you would like to close this ticket please run \`${config.prefix}close\``
        );
        let logchannel = message.guild.channels.cache.find(
          (channel) => channel.name === `ticket-logs`
        );
        if (logchannel) {
          logchannel.send(
            `Ticket ${message.author.id} created. Click the following to veiw <#${channel.id}>`
          );
        }
      });
  },
};
