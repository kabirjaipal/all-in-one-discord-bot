const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "ban",
  aliases: ["jabsdk"],
  description: "Bans a Member from a Guild",
  usage: "ban @User",
  category : "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.permissions.has("BAN_MEMBERS"))
      return message.channel.send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setDescription(
            "**You Dont Have The Permissions To Mute Users! - [BAN_MEMBERS]**"
          )
          .setFooter("Coded by: Tech Boy Gaming")
      );

    let banMember =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!banMember) {
      const missingArgs = new MessageEmbed()
        .setColor("RED")
        .setTitle("Missing arguments")
        .setDescription(
          `
                                **Name** : ban\n
                                **Description** :Bans a Member from a Guild\n
                                **aliases** : jabsdk\n
                                **usage**: ban <@user/ID> [reason]\n `
        )
        .setFooter("Coded by: Tech Boy Gaming")
        .setTimestamp();
      return message.channel.send(missingArgs);
    }
    let reason = args.slice(1).join(" ");
    if (!reason) reason = "no reason";

    if (!message.guild.me.permissions.has(["BAN_MEMBERS", "ADMINISTRATOR"]))
      return message.reply(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setDescription("I dont have the permissions to ban users!")
          .setFooter("Coded by: Tech Boy Gaming")
      );

    let Sembed = new MessageEmbed()
      .setColor("RED")
      .setAuthor(banMember.user.tag)
      .setFooter("Coded by: Tech Boy Gaming")
      .setThumbnail(banMember.user.displayAvatarURL())
      .setDescription(
        `> You've been banned from ${message.guild.name} because of ${reason}. You are permanently banned.`
      );
    let i = 0;
    banMember.send(Sembed).catch((err) => console.log(err.toString().red));
    banMember
      .ban(banMember, reason)
      .catch((err) => {
        console.log(err.toString().red);
        i++;
      })
      .then(() => {
        let embed = new MessageEmbed()
          .setColor("RED")
          .setAuthor(banMember.user.tag)
          .setFooter("Coded by: Tech Boy Gaming")
          .setThumbnail(banMember.user.displayAvatarURL())
          .setDescription(`✅ **${banMember.user.tag}** successfully banned!`);
        if (i == 1) return message.reply("MISSING PERMISSIONS TO BAN HIM!");
        message.reply(embed).then((msg) => {
          msg.delete({ timeout: 10000 });
        });
      });
  },
};
