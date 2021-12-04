const { Client, Message, MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const config = require("../../config/config.json");
const db = require("quick.db");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
  name: "userinfo",
  aliases: ["uinfo"],
  description: "Get information about a user",
  usage: "userinfo [@USER]",
  category : "information",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args, prefix) => {
    let user =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member;
    let durumm;
    let durum = user.presence.status;

    let roles = user.roles.cache
      .map((x) => x)
      .filter((z) => z.name !== "@everyone");
    let messagecount = await db.get(
      `${message.guild.id}.${user.id}.messageCount`
    );

    if (!messagecount) messagecount = 0;

    if (roles.length > 100) {
      roles = "There is so much roles to show.";
    }

    const status = {
      online: "Online",
      idle: "Idle",
      dnd: "Do Not Disturb",
      offline: "Offline/Invisible",
    };

    var permissions = [];
    var acknowledgements = "None";

    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member;
    const randomColor = "#000000".replace(/0/g, function () {
      return (~~(Math.random() * 16)).toString(16);
    });

    if (message.member.permissions.has("KICK_MEMBERS")) {
      permissions.push("Kick Members");
    }

    if (message.member.permissions.has("BAN_MEMBERS")) {
      permissions.push("Ban Members");
    }

    if (message.member.permissions.has("ADMINISTRATOR")) {
      permissions.push("Administrator");
    }

    if (message.member.permissions.has("MANAGE_MESSAGES")) {
      permissions.push("Manage Messages");
    }

    if (message.member.permissions.has("MANAGE_CHANNELS")) {
      permissions.push("Manage Channels");
    }

    if (message.member.permissions.has("MENTION_EVERYONE")) {
      permissions.push("Mention Everyone");
    }

    if (message.member.permissions.has("MANAGE_NICKNAMES")) {
      permissions.push("Manage Nicknames");
    }

    if (message.member.permissions.has("MANAGE_ROLES")) {
      permissions.push("Manage Roles");
    }

    if (message.member.permissions.has("MANAGE_WEBHOOKS")) {
      permissions.push("Manage Webhooks");
    }

    if (message.member.permissions.has("MANAGE_EMOJIS")) {
      permissions.push("Manage Emojis");
    }

    if (permissions.length == 0) {
      permissions.push("No Key Permissions Found");
    }

    if (member.user.id == message.guild.ownerID) {
      acknowledgements = "Server Owner";
    }

    let safe = message.author.createdTimestamp;

    if (safe > 604800017) {
      safe = "`Reliable` <:discordinvisible:757485982227365939>";
    } else {
      safe = "`Suspicious` <:discorddnd:757485967266545704>";
    }

    if (durum === "online")
      durumm = `Online <:discordinvisible:757485982227365939> `;
    if (durum === "offline")
      durumm = `Offline <:discordoffline:757485996999966801> `;
    if (durum === "idle") durumm = `Idle <:discordidle:757483463501676614>`;
    if (durum === "dnd")
      durumm = `Do not disturb <:discorddnd:757485967266545704>  `;

    let lastMessage;
    let lastMessageTime;
    let nitroBadge = user.user.avatarURL({ dynamic: true });
    let flags = user.user.flags.toArray().join(``);

    if (!flags) {
      flags = "User doesn't have any badge";
    }

    flags = flags.replace(
      "HOUSE_BRAVERY",
      "• <:hsquadbravery:757488491792826410>`HypeSquad Bravery`"
    );
    flags = flags.replace(
      "EARLY_SUPPORTER",
      "• <a:nitro:740923343548579890> `Early Supporter`"
    );
    flags = flags.replace(
      "VERIFIED_DEVELOPER",
      "• <:discordbotdev:757489652214267904> `Verified Bot Developer`"
    );
    flags = flags.replace(
      "EARLY_VERIFIED_DEVELOPER",
      "• <:discordbotdev:757489652214267904> `Verified Bot Developer`"
    );
    flags = flags.replace(
      "HOUSE_BRILLIANCE",
      "• <:hsquadbrilliance:757487710775672863> `HypeSquad Brilliance`"
    );
    flags = flags.replace(
      "HOUSE_BALANCE",
      "• <:hsquadbalance:757487549605347348>`HypeSquad Balance`"
    );
    flags = flags.replace(
      "DISCORD_PARTNER",
      "• <:partner:739714991732686848> `Partner`"
    );
    flags = flags.replace(
      "HYPESQUAD_EVENTS",
      "• <a:hypesquad:755471122430034060>`Hypesquad Event`"
    );
    flags = flags.replace(
      "DISCORD_CLASSIC",
      "• <a:classic:740922817683652754>`Discord Classic`"
    );

    if (nitroBadge.includes("gif")) {
      flags =
        flags +
        `
      • <a:nitroboost:740923077973508156>  \`Nitro\``;
    }

    let voice = db.get(`${message.guild.id}.${user.user.id}.voicetime`);
    let stat = user.presence.activities[0];
    let custom;

    if (user.presence.activities.some((r) => r.name === "Spotify")) {
      custom = "Listening to Spotify";
    } else if (stat && stat.name !== "Custom Status") {
      custom = stat.name;
    } else {
      custom = "Nothing";
    }

    if (
      user.presence.activities.some((r) => r.name !== "Spotify") &&
      stat &&
      stat.state !== null
    ) {
      stat = stat.state;
    } else {
      stat = "Nothing";
    }

    if (!voice) {
      voice = "0 hours, 0 minutes and 0 seconds";
    } else {
      voice = moment
        .duration(voice)
        .format("h [ hours,] m [ minutes and] s[ seconds]");
    }

    if (user.lastMessage) {
      lastMessage = user.lastMessage.content;
      lastMessageTime = moment(user.lastMessage.createdTimestamp).format(
        "MMMM Do YYYY, H:mm:ss a"
      );
    } else {
      lastMessage = "None";
      lastMessageTime = "None";
    }
    message.channel
      .send(
        new MessageEmbed()
          .setColor(config.colors.yes)
          .setDescription(`Getting Userinfo...`)
      )
      .then((msg) => {
        msg.edit(
          new MessageEmbed()
            .setColor(config.colors.yes)
            .setAuthor(
              message.author.tag,
              message.author.avatarURL({ dynamic: true })
            )
            .setThumbnail(
              user.user.displayAvatarURL({ dynamic: true, size: 512 })
            )
            .setTitle(
              "Information about:   " +
                user.user.username +
                "#" +
                user.user.discriminator,
              user.user.displayAvatarURL({ dynamic: true })
            )
            .addField("**❯ ID:**' ", `\`${user.id}\``, true)
            .addField(
              "**❯ Username:**'",
              `\`${user.user.username}#${user.user.discriminator}\``,
              true
            )
            .addField(
              "**❯ Avatar:**",
              `[\`Link to avatar\`](${user.user.displayAvatarURL({
                format: "png",
              })})`,
              true
            )
            .addField("**❯ Bot:**", `\`${user.user.bot ? "Yes" : "No"}\``, true)
            .addField(
              "**❯ Date Joined DC:**",
              `\`${moment(user.user.createdTimestamp).format("LT")} ${moment(
                user.user.createdTimestamp
              ).format("LL")}   ${moment(
                user.user.createdTimestamp
              ).fromNow()}\``,
              true
            )
            .addField(
              "**❯ Date Joined Server:**",
              `\`${moment(user.joinedAt).format("LL LTS")}\``,
              true
            )
            .addField(
              "**❯ Messages Count:**",
              `\`${messagecount}\`
                               **❯ Last Message:**', \`${lastMessage}\`  
                               **❯ Last Message At:**', \`${lastMessageTime}\`  
                                `,
              true
            )
            .addField("**❯ __**Badge Information**__:**", `\`${flags}\``, true)
            .addField("**❯ __**Safety Check**__:**", `\`${safe}\``, true)
            .addField("Permissions: ", `${permissions.join(", ")}`, true)
            .addField("Acknowledgements: ", `${acknowledgements}`, true)
            .addField("Status", `${status[member.user.presence.status]}`, true)
            .addField("Member", [
              `**❯ Highest Role:** ${
                member.roles.highest.id === message.guild.id
                  ? "None"
                  : member.roles.highest.name
              }`,
              `**❯ Server Join Date:** ${moment(member.joinedAt).format(
                "LL LTS"
              )}`,
              `**❯ Hoist Role:** ${
                member.roles.hoist ? member.roles.hoist.name : "None"
              }`,
              `**❯ Roles [${roles.length}]:** ${
                roles.length < 10
                  ? roles.join(", ")
                  : roles.length > 10
                  ? this.client.utils.trimArray(roles)
                  : "None"
              }`,
              `\u200b`,
            ])
            .setFooter("Coded by: Tech Boy Gaming")
            .setTimestamp()
        );
      });
  },
};
