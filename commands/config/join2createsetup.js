const { Client, Message, MessageEmbed } = require("discord.js");
const config = require("../../config//config.json");
let prefix = config.prefix;
const ee = require("../../config/bot.json");
const { databasing, escapeRegex } = require("../../handlers/voice_function");

module.exports = {
  name: "join2createsetup",
  aliases: ["j2c", "join2create"],
  category : "config",
  description: "Setup join2create in Guild",
  usage: "",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.permissions.has("ADMINISTRATOR"))
      return message.channel.send(
        new MessageEmbed()
          .setColor(ee.colour)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(":x: You don't have enough Permissions!")
      );

    let { channel } = message.member.voice;

    if (channel) {
      message.reply(
        new MessageEmbed()
          .setTitle("Setup Complete for Join to Create")
          .setColor(ee.color)
          .setDescription(
            ` Channel: \`${channel.name}\`\n Now is Join to Create Channel!`
          )
          .setFooter(ee.footertext, ee.footericon)
      );
      client.settings.set(message.guild.id, channel.id, `channel`);
    } else {
      message.guild.channels
        .create("Join to Create", {
          type: "voice",
          bitrate: 8000,
          userLimit: 2,
          permissionOverwrites: [
            //update the permissions
            {
              //the role "EVERYONE" is just able to VIEW_CHANNEL and CONNECT
              id: message.guild.id,
              allow: ["VIEW_CHANNEL", "CONNECT"],
              deny: ["SPEAK"],
            },
          ],
        })
        .then((vc) => {
          if (message.channel.parent) vc.setParent(message.channel.parentID);
          message.reply(
            new MessageEmbed()
              .setTitle(" Setup Complete for Join to Create")
              .setColor(ee.color)
              .setDescription(
                ` Channel: \`${channel.name}\`\n Created For You!`
              )
              .setFooter(ee.footertext, ee.footericon)
          );
          client.settings.set(message.guild.id, vc.id, `channel`);
        });
    }
  },
};
