const { Client, Message, MessageEmbed } = require("discord.js");
const ms = require("ms");
const Schema = require("../../utils/models/mute");

module.exports = {
  name: "mute",
  aliases: ["chup"],
  description: "Mutes a User for a specific Time!",
  useage: "mute @User <Time+Format(e.g: 10m)> [REASON]",
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
            "ERROR, please ping a USER! Usage: `mute @User <Time+Format(e.g: 10m)> [REASON]` example: `mute @User 10m He is doing bad stuff!`"
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
            ":x: I cannot mute this Member, because he is higher/Equal to your Rang Position!"
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

    let time = args[0];
    if (!time)
      return message.channel.send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setDescription(
            "**ERROR, please add a TIME! Usage: `mute @User <Time+Format(e.g: 10m)> [REASON]` example: `mute @User 10m He is doing bad stuff!`**"
          )
          .setFooter("Coded by: Tech Boy Gaming")
      );
    args.shift();

    let reason = args.join(" ");

    let allguildroles = message.guild.roles.cache.array();

    let mutedrole = false;
    for (let i = 0; i < allguildroles.length; i++) {
      if (allguildroles[i].name.toLowerCase().includes("muted")) {
        mutedrole = allguildroles[i];
        break;
      }
    }
    if (!mutedrole) {
      if (!message.guild.me.permissions.has("MANAGE_GUILD"))
        return message.channel.send(
          new MessageEmbed()
            .setColor("RED")
            .setAuthor(message.author.tag)
            .setDescription(
              "**I need the permission, to Manage Roles aka give roles**"
            )
            .setFooter("Coded by: Tech Boy Gaming")
        );
      let highestrolepos = message.guild.me.roles.highest.position;
      console.log(Number(highestrolepos) - 1);
      mutedrole = await message.guild.roles
        .create({
          data: {
            name: "muted",
            color: "#222222", //grey color
            hoist: false, //hoist true
            position: Number(highestrolepos) - 1, //muted role under highest Bot Role!
            //permissions: ["SEND_MESSAGES"]
          },
          reason: "This role got created, to mute Members!",
        })
        .catch((e) => {
          console.log(e);
          message.channel.send(
            new MessageEmbed()
              .setColor("RED")
              .setAuthor(message.author.tag)
              .setDescription("**I COULD NOT CREATE A ROLE, sorry**")
              .setFooter("Coded by: Tech Boy Gaming")
          );
        });
    }
    if (mutedrole.position > message.guild.me.roles.highest.position) {
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
    let mutetime;
    try {
      mutetime = ms(time);
    } catch {
      return message.channel.send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setDescription(
            "**ERROR, please add a TIME! Usage: `mute @User <Time+Format(e.g: 10m)> [REASON]` example: `mute @User 10m He is doing bad stuff!`**"
          )
          .setFooter("Coded by: Tech Boy Gaming")
      );
    }
    if (!mutetime || mutetime === undefined)
      return message.channel.send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setDescription(
            "**ERROR, please add a TIME! Usage: `mute @User <Time+Format(e.g: 10m)> [REASON]` example: `mute @User 10m He is doing bad stuff!`**"
          )
          .setFooter("Coded by: Tech Boy Gaming")
      );

    await message.guild.channels.cache.forEach((ch) => {
      try {
        ch.updateOverwrite(mutedrole, {
          SEND_MESSAGES: false,
          ADD_REACTIONS: false,
          CONNECT: false,
          SPEAK: false,
        });
      } catch (e) {
        console.log(e);
      }
    });

    try {
      member.roles.add(mutedrole);

      Schema.findOne({ Guild: message.guild.id }, async (err, data) => {
        if (!data) {
          new Schema({
            Guild: message.guild.id,
            Users: member.id,
          }).save();
        } else {
          data.Users.push(member.id);
          data.save();
        }
      });
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
      .setTitle(`Muted: \`${member.user.tag}\``)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter(
        `By: ${message.author.tag}`,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setDescription(
        `He/you is now muted for \`${ms(mutetime, {
          long: true,
        })} Talk Moderator To Unmute you..\`${
          reason ? `\n\n**REASON**\n> ${reason.substr(0, 1800)}` : "\nNO REASON"
        }`
      );
    message.channel.send(embed).catch((e) => console.log(e));

    member
      .send(embed.setTitle(`You got muted by: \`${message.author.tag}\``))
      .catch((e) => console.log(e));

    setTimeout(() => {
      try {
        message.channel
          .send(
            embed
              .setTitle(`You got unmuted: \`${member.user.tag}\``)
              .setDescription("\u200b")
          )
          .catch((e) => console.log(e));
        member.roles.remove(mutedrole);
      } catch {
        message.channel.send(
          new MessageEmbed()
            .setColor("RED")
            .setAuthor(message.author.tag)
            .setDescription("**Something went wrong!**")
            .setFooter("Coded by: Tech Boy Gaming")
        );
      }
    }, mutetime);
  },
};
