const { Client, Message, MessageEmbed } = require("discord.js");
const ms = require("ms");
const Schema = require("../../utils/models/mute");

module.exports = {
  name: "unmute",
  aliases: ["ole"],
  description: "Unmute a Muted User!",
  useage: "unmute @User",
  category : "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.permissions.has("ADMINISTRATOR"))
      return message.channel.send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setDescription(
            "**You Dont Have The Permissions To Mute Users! - [ADMINISTRATOR]**"
          )
          .setFooter("Coded by: Tech Boy Gaming")
      );

    let member = message.mentions.members.first();
    if (!member)
      return message.channel.send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setDescription(
            "**ERROR, please ping a USER! Usage: `mute @User <Time> [REASON]` example: `mute @User 10m He is doing bad stuff!`**"
          )
          .setFooter("Coded by: Tech Boy Gaming")
      );
    args.shift(); //shift args

    if (
      member.roles.highest.position >= message.member.roles.highest.position
    ) {
      return message.channel.send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setDescription(
            "**:x: I cannot mute this Member, because he is higher/Equal to your Rang Position!**"
          )
          .setFooter("Coded by: Tech Boy Gaming")
      );
    }

    if (!message.guild.me.permissions.has("MANAGE_ROLES"))
      return message.channel.send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setDescription(
            "**I need the permission, to Manage Roles aka give roles**"
          )
          .setFooter("Coded by: Tech Boy Gaming")
      );

    let allguildroles = message.guild.roles.cache.array();

    let mutedrole = false;
    for (let i = 0; i < allguildroles.length; i++) {
      if (allguildroles[i].name.toLowerCase().includes("muted")) {
        mutedrole = allguildroles[i];
        break;
      }
    }
    if (!mutedrole) {
      return message.channel.send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setDescription(
            "**:x: You never muted someone, there is no muted role yet!**"
          )
          .setFooter("Coded by: Tech Boy Gaming")
      );
    }
    if (
      !message.member.permissions.has("ADMINISTRATOR") &&
      mutedrole.position > message.guild.me.roles.highest.position
    ) {
      return message.channel.send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setDescription(
            "**:x: I cannot access the Role, because it's above me!**"
          )
          .setFooter("Coded by: Tech Boy Gaming")
      );
    }
    Schema.findOne(
      {
        Guild: message.guild.id,
      },
      async (err, data) => {
        if (!data)
          return message.channel.send(
            new MessageEmbed()
              .setColor("RED")
              .setAuthor(message.author.tag)
              .setDescription(
                "**:x: You never muted someone, there is no muted role yet!**"
              )
              .setFooter("Coded by: Tech Boy Gaming")
          );
        const user = data.Users.findIndex((prop) => prop === member.id);
        if (user == -1)
          return message.channel.send(
            new MessageEmbed()
              .setColor("RED")
              .setAuthor(message.author.tag)
              .setDescription(
                "**:x: You never muted someone, there is no muted role yet!**"
              )
              .setFooter("Coded by: Tech Boy Gaming")
          );
        data.Users.splice(user, 1);
      }
    );
    try {
      await member.roles.remove(mutedrole);
    } catch {
      message.channel.send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setDescription("**Something went wrong!**")
          .setFooter("Coded by: Tech Boy Gaming")
      );
    }
    let embed = new MessageEmbed()
      .setColor("RED")
      .setTitle(`Unmuted: \`${member.user.tag}\``)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter(
        `By: ${message.author.tag}`,
        message.author.displayAvatarURL({ dynamic: true })
      );
    message.channel.send(embed);
    try {
      member.send(
        embed.setTitle(`You got unmuted by: \`${message.author.tag}\``)
      );
    } catch {}
  },
};
