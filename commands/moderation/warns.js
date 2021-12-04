const { Client, Message, MessageEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "warns",
  aliases: ["dhamkiya"],
  description: "Get the warnings of yours or mentioned person",
  useage: "warns <user>",
  category : "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.permissions.has("ADMINISTRATOR")) {
      return message.channel.send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setDescription(
            "**You Dont Have The Permissions To Warn Users! - [ADMINISTRATOR]**"
          )
          .setFooter("Coded by: Tech Boy Gaming")
      );
    }

    const user =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);

    if (!user) {
      return message.channel.send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setDescription(
            "**Please Mention the person to who you want to Show Warns - warns @mention **"
          )
          .setFooter("Coded by: Tech Boy Gaming")
      );
    }

    if (message.mentions.users.first().bot) {
      return message.channel.send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setDescription("**You can not Check The warns of bots**")
          .setFooter("Coded by: Tech Boy Gaming")
      );
    }

    const reason = args.slice(1).join(" ");

    let warnings = db.get(`warnings_${message.guild.id}_${user.id}`);

    if (warnings === null) warnings = 0;
    message.channel.send(
      new MessageEmbed()
        .setColor("RED")
        .setAuthor(message.author.tag)
        .setDescription(
          `** ${user.user.username} Have ${warnings} warning's **`
        )
        .setFooter("Coded by: Tech Boy Gaming")
    );
  },
};
