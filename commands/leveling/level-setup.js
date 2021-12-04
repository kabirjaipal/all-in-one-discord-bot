const { Client, Message, MessageEmbed } = require("discord.js");
const db = require("../../utils/models/on_of");

module.exports = {
  name: "levelsetup",
  aliases: [""],
  description: "",
  useage: "",
  category : "leveling",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args, prefix) => {
    let perms = 1;

    if (
      !message.guild.me.permissions.has("EMBED_LINKS") ||
      !message.guild.me.permissions.has("SEND_MESSAGES")
    ) {
      perms = 0;
    }

    if (message.guild.me.permissions.has("ADMINISTRATOR")) {
      perms = 1;
    }

    if (perms === 0) {
      try {
        let embed = new MessageEmbed()
          .setDescription(
            "Oops, I am missing some permissions for this command, make sure I have the following permissions```Embed Links, Send Messages```"
          )
          .setColor(message.guild.me.displayColor)
          .setAuthor(`Missing Perms`, message.author.displayAvatarURL());
        message.member.send(embed);
        return;
      } catch {
        return;
      }
    } else if (perms === 1) {
      if (!args[0]) {
        let embed = new MessageEmbed()
          .setAuthor(
            `${message.author.username}`,
            message.author.displayAvatarURL()
          )
          .setDescription(
            `❌ You are missing some arguments, expected usage:\n\`\`${prefix}levels <on/off>\`\`\n\nArguments:\n\`\`on/off\`\`: Type out on or off`
          )
          .setColor("#ff4545");
        let msg = await message.channel.send(embed);
        msg.delete({ timeout: 6000 });
        return;
      }
      if (args[0].toLowerCase() === "on") {
        const data = await db.findOne({
          guildID: message.guild.id,
          type: "levels",
        });

        if (data) {
          await db.findOneAndDelete({
            guildID: message.guild.id,
            type: "levels",
          });

          const newData = new db({
            guildID: message.guild.id,
            type: "levels",
            onOrOff: "on",
          });
          newData.save().then(async () => {
            let embed = new MessageEmbed()
              .setDescription("✅ Level System is now **enabled**")
              .setColor(message.guild.me.displayColor);
            let msg = await message.channel.send(embed);
            msg.delete({ timeout: 6000 });
          });
        } else if (!data) {
          const newData = new db({
            guildID: message.guild.id,
            type: "levels",
            onOrOff: "on",
          });
          newData.save().then(async () => {
            let embed = new MessageEmbed()
              .setDescription("✅ Level System is now **enabled**")
              .setColor(message.guild.me.displayColor);
            let msg = await message.channel.send(embed);
            msg.delete({ timeout: 6000 });
          });
        }
        return;
      }
      if (args[0].toLowerCase() === "off") {
        const data = await db.findOne({
          guildID: message.guild.id,
          type: "levels",
        });

        if (data) {
          const levels = require("../node_modules/discord-xp/models/levels");
          const levelsData = await db.findOne({
            guildID: message.guild.id,
          });

          await db
            .findOneAndDelete({
              guildID: message.guild.id,
              type: "levels",
            })
            .then(async () => {
              let embed = new MessageEmbed()
                .setDescription("✅ Level System is now **disabled**")
                .setColor(message.guild.me.displayColor);
              let msg = await message.channel.send(embed);
              msg.delete({ timeout: 6000 });

              if (levelsData) {
                await levels.deleteMany({
                  guildID: message.guild.id,
                });
              }
              return;
            });
        } else if (!data) {
          let embed = new MessageEmbed()
            .setAuthor(
              `${message.author.username}`,
              message.author.displayAvatarURL()
            )
            .setDescription(
              `❌ This setting is currently off so I can\'t update it`
            )
            .setColor("#ff4545");
          let msg = await message.channel.send(embed);
          msg.delete({ timeout: 6000 });
          return;
        }
      }
      if (args[0].toLowerCase() !== "off" && args[0].toLowerCase() !== "on") {
        let embed = new MessageEmbed()
          .setAuthor(
            `${message.author.username}`,
            message.author.displayAvatarURL()
          )
          .setDescription(
            `❌ That is not an option, current options are: \`\`on, off\`\``
          )
          .setColor("#ff4545");
        let msg = await message.channel.send(embed);
        msg.delete({ timeout: 6000 });
        return;
      }
    }
  },
};
