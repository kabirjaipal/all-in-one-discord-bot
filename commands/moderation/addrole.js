const { Client, Message, MessageEmbed } = require("discord.js");
const db = require("quick.db");
const ee = require("../../config/bot.json");

module.exports = {
  name: "addrole",
  aliases: ["giverole"],
  description: "Add role to any user",
  useage: "",
  category : "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.permissions.has("MANAGE_ROLES"))
      return message.channel.send(
        new MessageEmbed()
          .setColor(ee.wrongcolour)
          .setAuthor(message.author.tag)
          .setDescription(
            "**You Dont Have The Permissions To Add Roles To Users! - [MANAGE_ROLES]**"
          )
          .setFooter(ee.footertext, ee.footericon)
      );
    if (!message.guild.me.permissions.has("MANAGE_ROLES"))
      return message.channel.send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setDescription(
            " **I Dont Have The Permissions To Add Roles To Users! - [MANAGE_ROLES]**> "
          )
          .setFooter("Coded by: Tech Boy Gaming")
      );

    if (!args[0])
      return message.channel.send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setDescription("**Please Enter A Role!**")
          .setFooter("Coded by: Tech Boy Gaming")
      );

    let rMember =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.guild.members.cache.find(
        (r) => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()
      ) ||
      message.guild.members.cache.find(
        (ro) => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase()
      );
    if (!rMember)
      return message.channel.send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setDescription("**Please Enter A User Name!**")
          .setFooter("Coded by: Tech Boy Gaming")
      );
    if (
      rMember.roles.highest.comparePositionTo(message.guild.me.roles.highest) >=
      0
    )
      return message.channel.send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setDescription("**Cannot Add Role To This User!**")
          .setFooter("Coded by: Tech Boy Gaming")
      );

    let role =
      message.mentions.roles.first() ||
      message.guild.roles.cache.get(args[1]) ||
      message.guild.roles.cache.find(
        (rp) =>
          rp.name.toLowerCase() === args.slice(1).join(" ").toLocaleLowerCase()
      );
    if (!args[1])
      return message.channel.send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setDescription("**Please Enter A Role!**")
          .setFooter("Coded by: Tech Boy Gaming")
      );

    if (!role)
      return message.channel.send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setDescription("**Could Not Find That Role!**")
          .setFooter("Coded by: Tech Boy Gaming")
      );

    if (role.managed)
      return message.channel.send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setDescription("**Cannot Add That Role To The User!**")
          .setFooter("Coded by: Tech Boy Gaming")
      );
    if (message.guild.me.roles.highest.comparePositionTo(role) <= 0)
      return message.channel.send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setDescription(
            "**Role Is Currently Higher Than Me Therefore Cannot Add It To The User!**"
          )
          .setFooter("Coded by: Tech Boy Gaming")
      );

    if (rMember.roles.cache.has(role.id))
      return message.channel.send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setDescription(
            "**Role Is Currently Higher Than Me Therefore Cannot Add It To The User!**"
          )
          .setFooter("Coded by: Tech Boy Gaming")
      );
    message.channel.send();
    if (!rMember.roles.cache.has(role.id)) await rMember.roles.add(role.id);
    var sembed = new MessageEmbed()
      // .setColor("GREEN")
      // .setAuthor(message.guild.name, message.guild.iconURL())
      // .setDescription(`Role has been added to ${rMember.user.username}`)
      .setAuthor(
        rMember.user.username,
        rMember.user.displayAvatarURL({ dynamic: true })
      )
      .setThumbnail(rMember.user.displayAvatarURL({ dynamic: true }))
      .setColor("RED")
      .setDescription(
        `${role} Role has been added to ${rMember.user.username}\n
            \`Enjoy Dear\``
      )
      .setFooter(
        `Role added by ${message.author.username}`,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp();

    message.channel.send(sembed).then((msg) => {
      msg.delete({ timeout: 7000 });
    });

    let channel = db.fetch(`modlog_${message.guild.id}`);
    if (!channel) return;

    const embed = new MessageEmbed()
      .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
      .setColor("RED")
      .setThumbnail(rMember.user.displayAvatarURL({ dynamic: true }))
      .setFooter(message.guild.name, message.guild.iconURL())
      .addField("**Moderation**", "addrole")
      .addField("**Added Role to**", rMember.user.username)
      .addField("**Role Added**", role.name)
      .addField("**Added By**", message.author.username)
      .addField("**Date**", message.createdAt.toLocaleString())
      .setTimestamp();

    let sChannel = message.guild.channels.cache.get(channel);
    if (!sChannel) return;
    sChannel.send(embed);
  },
};
