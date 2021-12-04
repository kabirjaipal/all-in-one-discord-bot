const { Client, Message, MessageEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "warn",
  aliases: ["shant"],
  description: "Warn anyone who do not obey the rules",
  usage: "warn <@mention> <reason>",
  category : "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.permissions.has("ADMINISTRATOR")) {
      return message.channel
        .send(
          new MessageEmbed()
            .setColor("RED")
            .setAuthor(message.author.tag)
            .setDescription(
              "**You Dont Have The Permissions To Warn Users! - [ADMINISTRATOR]**"
            )
            .setFooter("Coded by: Tech Boy Gaming")
        )
        .then((msg) => {
          msg.delete({ timeout: 10000 });
        });
    }

    const user =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);

    if (!user) {
      return message.channel
        .send(
          new MessageEmbed()
            .setColor("RED")
            .setAuthor(message.author.tag)
            .setDescription(
              "**Please Mention the person to who you want to warn - warn @mention <reaosn>**"
            )
            .setFooter("Coded by: Tech Boy Gaming")
        )
        .then((msg) => {
          msg.delete({ timeout: 10000 });
        });
    }

    if (message.mentions.users.first().bot) {
      return message.channel
        .send(
          new MessageEmbed()
            .setColor("RED")
            .setAuthor(message.author.tag)
            .setDescription("**You can not warn bots**")
            .setFooter("Coded by: Tech Boy Gaming")
        )
        .then((msg) => {
          msg.delete({ timeout: 10000 });
        });
    }

    if (message.author.id === user.id) {
      return message.channel
        .send(
          new MessageEmbed()
            .setColor("RED")
            .setAuthor(message.author.tag)
            .setDescription("**You can not warn yourself**")
            .setFooter("Coded by: Tech Boy Gaming")
        )
        .then((msg) => {
          msg.delete({ timeout: 10000 });
        });
    }

    if (user.id === message.guild.owner.id) {
      return message.channel
        .send(
          new MessageEmbed()
            .setColor("RED")
            .setAuthor(message.author.tag)
            .setDescription("**BSDK, how you can warn server owner -_-**")
            .setFooter("Coded by: Tech Boy Gaming")
        )
        .then((msg) => {
          msg.delete({ timeout: 10000 });
        });
    }

    const reason = args.slice(1).join(" ");

    if (!reason) {
      return message.channel
        .send(
          new MessageEmbed()
            .setColor("RED")
            .setAuthor(message.author.tag)
            .setDescription(
              "**Please provide reason to warn - warn @mention <reason>**"
            )
            .setFooter("Coded by: Tech Boy Gaming")
        )
        .then((msg) => {
          msg.delete({ timeout: 10000 });
        });
    }

    // database
    let warnings = db.get(`warnings_${message.guild.id}_${user.id}`);

    if (warnings === null) {
      db.set(`warnings_${message.guild.id}_${user.id}`, 1);
      user
        .send(
          new MessageEmbed()
            .setColor("RED")
            .setFooter("Coded by: Tech Boy Gaming")
            .setAuthor(message.author.tag)
            .setThumbnail(user.user.displayAvatarURL())
            .setDescription(
              `You have been warned in **${message.guild.name}** for ${reason}`
            )
        )
        .then((msg) => {
          msg.delete({ timeout: 10000 });
        });
      await message.channel
        .send(
          new MessageEmbed()
            .setColor("RED")
            .setFooter("Coded by: Tech Boy Gaming")
            .setAuthor(message.author.tag)
            .setThumbnail(user.user.displayAvatarURL())
            .setDescription(
              `✅ Success |  You warned **${user.user.username}** for ${reason}`
            )
        )
        .then((msg) => {
          msg.delete({ timeout: 10000 });
        });
    } else if (warnings !== null) {
      db.add(`warnings_${message.guild.id}_${user.id}`, 1);

      user
        .send(
          new MessageEmbed()
            .setColor("RED")
            .setFooter("Coded by: Tech Boy Gaming")
            .setAuthor(message.author.tag)
            .setThumbnail(user.user.displayAvatarURL())
            .setDescription(
              `You have been warned in **${message.guild.name}** for ${reason}`
            )
        )
        .then((msg) => {
          msg.delete({ timeout: 10000 });
        });

      await message.channel
        .send(
          new MessageEmbed()
            .setColor("RED")
            .setFooter("Coded by: Tech Boy Gaming")
            .setAuthor(message.author.tag)
            .setThumbnail(user.user.displayAvatarURL())
            .setDescription(
              `✅ Success |  You warned **${user.user.username}** for ${reason}`
            )
        )
        .then((msg) => {
          msg.delete({ timeout: 10000 });
        });
    }
  },
};
