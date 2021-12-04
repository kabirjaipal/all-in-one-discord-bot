const { Client, Message, MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "timedlockdown",
  aliases: ["tl", "tlock"],
  description: "Start a timed lockdown in a channel",
  useage: "timedlockdown <time>",
  category : "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const time = args.join("");

    if (!message.member.permissions.has("MANAGE_MESSAGES")) {
      return message.channel
        .send(
          new MessageEmbed()
            .setColor("RED")
            .setAuthor(message.author.tag)
            .setDescription(
              "**You Dont Have The Permissions To Warn Users! - [MANAGE_MESSAGES]**"
            )
            .setFooter("Coded by: Tech Boy Gaming")
        )
        .then((msg) => {
          msg.delete({ timeout: 10000 });
        });
    }

    if (!time)
      return message.channel
        .send(
          new MessageEmbed()
            .setColor("RED")
            .setAuthor(message.author.tag)
            .setDescription(
              "** Enter a valid time period in `Seconds`, `Minutes` or `Hours` **"
            )
            .setFooter("Coded by: Tech Boy Gaming")
        )
        .then((msg) => {
          msg.delete({ timeout: 10000 });
        });

    message.channel.overwritePermissions([
      {
        id: message.guild.id,
        deny: ["SEND_MESSAGES"],
      },
    ]);

    message.channel
      .send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setDescription(
            `** ${message.channel} has been placed under lockdown for ${time}  **`
          )
          .setFooter("Coded by: Tech Boy Gaming")
      )
      .then((msg) => {
        msg.delete({ timeout: 10000 });
      });
    let timeleft = time;

    setTimeout(() => {
      message.channel.overwritePermissions([
        {
          id: message.guild.id,
          deny: ["SEND_MESSAGES"],
        },
      ]);
    });

    message.channel
      .send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setTitle("Channel Updates")
          .setDescription(`** Locked has been lifted in ${message.channel} **`)
          .setFooter("Coded by: Tech Boy Gaming")
      )
      .then((msg) => {
        msg.delete({ timeout: 10000 });
      });
  },
};
