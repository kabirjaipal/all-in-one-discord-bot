const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "unban",
  aliases: ["ajabsdk"],
  description: "unban a Member from a Guild",
  usage: "unban @User",
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
            "**You Dont Have The Permissions To UNBAN Users! - [BAN_MEMBERS]**"
          )
          .setFooter("Coded by: Tech Boy Gaming")
      );

    if (isNaN(args[0]))
      return message.channel.send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setDescription("**You need to provide an ID.**")
          .setFooter("Coded by: Tech Boy Gaming")
      );

    let bannedMember = await client.users.fetch(args[0]);
    let banMember =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);

    if (!message.guild.me.permissions.has("BAN_MEMBERS"))
      return message.channel.send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setDescription(
            "**You Dont Have The Permissions To UNBAN Users! - [BAN_MEMBERS]**"
          )
          .setFooter("Coded by: Tech Boy Gaming")
      );

    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason given!";

    message.guild.members
      .unban(bannedMember, reason)
      .catch((err) => console.log(err.toString().red));
    let Sembed = new MessageEmbed()
      .setColor("RED")
      .setAuthor(message.author.tag)
      .setDescription(
        `> You've been unbanned from **${message.guild.name}** because of ${reason}. You are permanently Unbanned.`
      )
      .setFooter("Coded by: Tech Boy Gaming");

    // invite link

    try {
      message.guild.channels.cache
        .get(message.channel.id)
        .createInvite()
        .then((invite) =>
          bannedMember.send(
            new MessageEmbed()
              .setColor("RED")
              .setTitle(`${message.guild.name} Join Now`)
              .setDescription(`Invite Link is here \n ${invite.url}`)
              .setImage(message.guild.bannerURL())
              .setFooter("Coded by: Tech Boy Gaming")
          )
        );
    } catch (error) {
      console.error(`I could not create the invite for the channel: ${error}`);
      message.channel.send(`You have to paste a correct channel ID!`);
    }

    bannedMember.send(Sembed).catch((err) => console.log(err.toString().red));
    let embed = new MessageEmbed()
      .setColor("RED")
      .setAuthor(bannedMember.username)
      .setFooter("Coded by: Tech Boy Gaming")
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(`✅ **${bannedMember.username}** successfully Unbanned!`);
    message.channel.send(embed).catch((err) => console.log(err.red));
  },
};
