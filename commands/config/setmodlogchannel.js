const { Client, Message, MessageEmbed } = require("discord.js");
const Guild = require("../../utils/models/mod-log"); //require our log model
const mongoose = require("mongoose");

module.exports = {
  name: "setlogchannel",
  aliases: ["setm", "sm", "smc", "setmodlog"],
  category: "config",
  description: "Sets A Channel Where The client Can Send Moderation Logs!",
  usage: "[channel mention | channel ID | channel name]",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.hasPermission("MANAGE_GUILD"))
      return message.channel
        .send("You do not have permission to use this command.")
        .then((m) => m.delete({ timeout: 5000 })); // if the user does not have perms

    const channel = await message.mentions.channels.first();
    if (!channel)
      return message.channel
        .send(
          "I cannot find that channel. Please mention a channel within this server."
        ) // if the user do not mention a channel
        .then((m) => m.delete({ timeout: 5000 }));

    let webhookid;
    let webhooktoken;
    await channel
      .createWebhook("Rock lOGGER", {
        avatar: message.guild.iconURL({ format: "png" }),
      })
      .then((webhook) => {
        webhookid = webhook.id;
        webhooktoken = webhook.token;
      });

    await Guild.findOne(
      //will find data from database
      {
        guildID: message.guild.id,
      },
      async (err, guild) => {
        if (err) console.error(err);
        if (!guild) {
          // what the bot should do if there is no data found for the server
          const newGuild = new Guild({
            _id: mongoose.Types.ObjectId(),
            guildID: message.guild.id,
            guildName: message.guild.name,
            logChannelID: channel.id,
            webhookid: webhookid,
            webhooktoken: webhooktoken,
          });

          await newGuild
            .save() //save the data to database(mongodb)
            .then((result) => console.log(result))
            .catch((err) => console.error(err));

          return message.channel.send(
            `The log channel has been set to ${channel}`
          );
        } else {
          guild
            .updateOne({
              //if data is found then update it with new one
              logChannelID: channel.id,
              webhooktoken: webhooktoken,
              webhookid: webhookid,
            })
            .catch((err) => console.error(err));

          return message.channel.send(
            `The log channel has been updated to ${channel}`
          );
        }
      }
    );
  },
};
