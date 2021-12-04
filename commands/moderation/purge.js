const { Client, Message, MessageEmbed } = require("discord.js");
const config = require("../../config/config.json");
const functions = require("../../handlers/function");

module.exports = {
  name: "purge",
  aliases: ["clear", "delete", "prune"],
  description: "Delete 1-99 Message in Guild Channel",
  useage: "purge <amount> like bots - humans ",
  category : "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    // UPDATE ^ ACCORDING TO YOUR HANDLER
    let prefix = config.prefix;
    try {
      let member =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]) ||
        message.member;
      if (!message.member.permissions.has("MANAGE_MESSAGES"))
        return message.channel.send(
          new MessageEmbed()
            .setColor("RED")
            .setAuthor(message.author.tag)
            .setThumbnail(message.author.displayAvatarURL())
            .setDescription(
              ` 🥺 You don't have **MANAGE_MESSAGES** premssions to use this command.`
            )
            .setFooter("Coded by: Tech Boy Gaming")
            .setTimestamp()
        );

      const commands = [
        `bots\` - ✔️ Delete messages sent by bots. (Ignore humans)`,
        `humans\` - ✔️ Delete messages sent by humans. (Ignore bots)`,
        `embeds\` - ✔️Delete messages containing rich embeds.`,
        `files\` - ✔️ Delete messages containing files/images/attachments.`,
        `mentions\` - ✔️ Delete messages containing member/user/channel/role mentions.`,
        `pins\` - ✔️ Delete messages which are pinned.`,
        `text\` - ✔️ Delete messages containing only text. (Ignores files/images/attachments, embeds)`,
        `match\` ✔️ <text> - Delete messages containing text.`,
        `not\` ✔️ <text> - Delete messages not containing text.`,
        `startswith\` ✔️ <text> - Delete messages starts with text.`,
        `endswith\` ✔️ <text> - Delete messages ends with text.`,
      ];

      //errpr embed
      let error1 = new MessageEmbed()
        .setColor("RED")
        .setAuthor(message.author.tag)
        .setThumbnail(message.author.displayAvatarURL())
        .setDescription(
          ` 😂😂 You can only delete the messages which are not older than 14 days.`
        )
        .setFooter("Coded by: Tech Boy Gaming")
        .setTimestamp();

      const embd = new MessageEmbed()
        .setColor("RED")
        .setTitle("Purge | Clear | Delete | Prune")
        .setThumbnail(
          client.user.displayAvatarURL({
            dynamic: true,
          })
        )
        .setDescription(
          `Delete a number of messages from a channel. (Ignores the pinned messages and limit is 100)`
        )
        .addField(
          "Usage",
          `\`${prefix}purge <amount>\` - Delete a number of messages.\n\`${prefix}purge <amount>  ${commands.join(
            `\n\`${prefix}purge <amount>  `
          )}`
        )
        .setFooter(
          `${prefix}purge, ${prefix}clear, ${prefix}delete, ${prefix}prune`
        );

      if (!args[0] || !args.length) return message.channel.send(embd);
      let amount = Number(args[0], 10) || parseInt(args[0]);
      if (isNaN(amount) || !Number.isInteger(amount))
        return functions.embedbuilder(
          client,
          9000,
          message,
          config.colors.no,
          "😂😂 Please enter a number of messages to purge."
        );
      if (!amount || amount < 2 || amount > 100)
        return functions.embedbuilder(
          client,
          9000,
          message,
          config.colors.no,
          "😂😂 Please enter a number of message between 2 and 100."
        );
      if (!args[1]) {
        try {
          await message.delete();
          await message.channel.bulkDelete(amount).then(async (m) => {
            let embed = new MessageEmbed()
              .setColor("RED")
              .setDescription(
                `✅  Cleared **${m.size}**/**${amount}** messages!`
              )
              .setThumbnail(
                member.user.displayAvatarURL({
                  dynamic: true,
                })
              )
              .setFooter("Coded by: Tech Boy Gaming");

            message.channel
              .send(embed)
              .then((msg) => msg.delete({ timeout: 4000 }));
          });
        } catch (e) {
          console.log(e);
          message.channel.send(error1);
        }
      } else if (args[1]) {
        let msg;
        let data;
        let embed;
        switch (args[1]) {
          case "bots":
            msg = await message.channel.messages.fetch({ limit: amount });
            data = [];
            msg
              .map((m) => m)
              .forEach((ms) => {
                if (ms.author.bot && !ms.pinned) data.push(ms);
              });

            try {
              await message.channel
                .bulkDelete(data.length ? data : 1, true)
                .then(async (m) => {
                  embed = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(
                      `✅  Cleared **${m.size}**/**${amount}** messages!`
                    )
                    .setThumbnail(
                      member.user.displayAvatarURL({
                        dynamic: true,
                      })
                    )
                    .setFooter("Coded by: Tech Boy Gaming");

                  message.channel
                    .send(embed)
                    .then((msg) => msg.delete({ timeout: 50000 }));
                });
            } catch (e) {
              console.log(e);
              message.channel.send(error1);
            }

            break;
          case "humans":
            msg = await message.channel.messages.fetch({ limit: amount });
            data = [];
            msg
              .map((m) => m)
              .forEach((ms) => {
                if (!ms.author.bot && !ms.pinned) data.push(ms);
              });

            try {
              await message.channel
                .bulkDelete(data.length ? data : 1, true)
                .then(async (m) => {
                  embed = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(
                      `✅  Cleared **${m.size}**/**${amount}** messages!`
                    )
                    .setThumbnail(
                      member.user.displayAvatarURL({
                        dynamic: true,
                      })
                    )
                    .setFooter("Coded by: Tech Boy Gaming");

                  message.channel
                    .send(embed)
                    .then((msg) => msg.delete({ timeout: 50000 }));
                });
            } catch (e) {
              console.log(e);
              message.channel.send(error1);
            }

            break;
          case "embeds":
            msg = await message.channel.messages.fetch({ limit: amount });
            data = [];
            msg
              .map((m) => m)
              .forEach((ms) => {
                if (ms.embeds.length && !ms.pinned) data.push(ms);
              });

            try {
              await message.channel
                .bulkDelete(data.length ? data : 1, true)
                .then(async (m) => {
                  embed = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(
                      `✅  Cleared **${m.size}**/**${amount}** messages!`
                    )
                    .setThumbnail(
                      member.user.displayAvatarURL({
                        dynamic: true,
                      })
                    )
                    .setFooter("Coded by: Tech Boy Gaming");

                  message.channel
                    .send(embed)
                    .then((msg) => msg.delete({ timeout: 50000 }));
                });
            } catch (e) {
              console.log(e);
              message.channel.send(error1);
            }

            break;
          case "files":
            msg = await message.channel.messages.fetch({ limit: amount });
            data = [];
            msg
              .map((m) => m)
              .forEach((ms) => {
                if (ms.attachments.first() && !ms.pinned) data.push(ms);
              });

            try {
              await message.channel
                .bulkDelete(data.length ? data : 1, true)
                .then(async (m) => {
                  embed = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(
                      `✅  Cleared **${m.size}**/**${amount}** messages!`
                    )
                    .setThumbnail(
                      member.user.displayAvatarURL({
                        dynamic: true,
                      })
                    )
                    .setFooter("Coded by: Tech Boy Gaming");

                  message.channel
                    .send(embed)
                    .then((msg) => msg.delete({ timeout: 50000 }));
                });
            } catch (e) {
              console.log(e);
              message.channel.send(error1);
            }

            break;
          case "text":
            msg = await message.channel.messages.fetch({ limit: amount });
            data = [];
            msg
              .map((m) => m)
              .forEach((ms) => {
                if (!ms.attachments.first() && !ms.embeds.length && !ms.pinned)
                  data.push(ms);
              });

            try {
              await message.channel
                .bulkDelete(data.length ? data : 1, true)
                .then(async (m) => {
                  embed = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(
                      `✅  Cleared **${m.size}**/**${amount}** messages!`
                    )
                    .setThumbnail(
                      member.user.displayAvatarURL({
                        dynamic: true,
                      })
                    )
                    .setFooter("Coded by: Tech Boy Gaming");

                  message.channel
                    .send(embed)
                    .then((msg) => msg.delete({ timeout: 50000 }));
                });
            } catch (e) {
              console.log(e);
              message.channel.send(error1);
            }

            break;
          case "mentions":
            msg = await message.channel.messages.fetch({ limit: amount });
            data = [];
            msg
              .map((m) => m)
              .forEach((ms) => {
                if (
                  (ms.mentions.users.first() ||
                    ms.mentions.members.first() ||
                    ms.mentions.channels.first() ||
                    ms.mentions.roles.first()) &&
                  !ms.pinned
                )
                  data.push(ms);
              });

            try {
              await message.channel
                .bulkDelete(data.length ? data : 1, true)
                .then(async (m) => {
                  embed = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(
                      `✅  Cleared **${m.size}**/**${amount}** messages!`
                    )
                    .setThumbnail(
                      member.user.displayAvatarURL({
                        dynamic: true,
                      })
                    )
                    .setFooter("Coded by: Tech Boy Gaming");

                  message.channel
                    .send(embed)
                    .then((msg) => msg.delete({ timeout: 50000 }));
                });
            } catch (e) {
              console.log(e);
              message.channel.send(error1);
            }

            break;
          case "pins":
            msg = await message.channel.messages.fetch({ limit: amount });
            data = [];
            msg
              .map((m) => m)
              .forEach((ms) => {
                if (ms.pinned) data.push(ms);
              });

            try {
              await message.channel
                .bulkDelete(data.length ? data : 1, true)
                .then(async (m) => {
                  embed = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(
                      `✅  Cleared **${m.size}**/**${amount}** messages!`
                    )
                    .setThumbnail(
                      member.user.displayAvatarURL({
                        dynamic: true,
                      })
                    )
                    .setFooter("Coded by: Tech Boy Gaming");

                  message.channel
                    .send(embed)
                    .then((msg) => msg.delete({ timeout: 50000 }));
                });
            } catch (e) {
              console.log(e);
              message.channel.send(error1);
            }

            break;
          case "match":
            msg = await message.channel.messages.fetch({ limit: amount });
            data = [];
            msg
              .map((m) => m)
              .forEach((ms) => {
                if (!args[2]) return message.channel.send(embd);
                if (ms.content.includes(args.slice(2).join(" ")) && !ms.pinned)
                  data.push(ms);
              });

            try {
              await message.channel
                .bulkDelete(data.length ? data : 1, true)
                .then(async (m) => {
                  embed = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(
                      `✅  Cleared **${m.size}**/**${amount}** messages!`
                    )
                    .setThumbnail(
                      member.user.displayAvatarURL({
                        dynamic: true,
                      })
                    )
                    .setFooter("Coded by: Tech Boy Gaming");

                  message.channel
                    .send(embed)
                    .then((msg) => msg.delete({ timeout: 50000 }));
                });
            } catch (e) {
              console.log(e);
              message.channel.send(error1);
            }

            break;
          case "not":
            msg = await message.channel.messages.fetch({ limit: amount });
            data = [];
            msg
              .map((m) => m)
              .forEach((ms) => {
                if (!args[2]) return message.channel.send(embd);
                if (!ms.content.includes(args.slice(2).join(" ")) && !ms.pinned)
                  data.push(ms);
              });

            try {
              await message.channel
                .bulkDelete(data.length ? data : 1, true)
                .then(async (m) => {
                  embed = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(
                      `✅  Cleared **${m.size}**/**${amount}** messages!`
                    )
                    .setThumbnail(
                      member.user.displayAvatarURL({
                        dynamic: true,
                      })
                    )
                    .setFooter("Coded by: Tech Boy Gaming");

                  message.channel
                    .send(embed)
                    .then((msg) => msg.delete({ timeout: 50000 }));
                });
            } catch (e) {
              console.log(e);
              message.channel.send(error1);
            }

            break;
          case "startswith":
            msg = await message.channel.messages.fetch({ limit: amount });
            data = [];
            msg
              .map((m) => m)
              .forEach((ms) => {
                if (!args[2]) return message.channel.send(embd);
                if (
                  ms.content.startsWith(args.slice(2).join(" ")) &&
                  !ms.pinned
                )
                  data.push(ms);
              });

            try {
              await message.channel
                .bulkDelete(data.length ? data : 1, true)
                .then(async (m) => {
                  embed = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(
                      `✅  Cleared **${m.size}**/**${amount}** messages!`
                    )
                    .setThumbnail(
                      member.user.displayAvatarURL({
                        dynamic: true,
                      })
                    )
                    .setFooter("Coded by: Tech Boy Gaming");

                  message.channel
                    .send(embed)
                    .then((msg) => msg.delete({ timeout: 50000 }));
                });
            } catch (e) {
              console.log(e);
              message.channel.send(error1);
            }

            break;
          case "endswith":
            msg = await message.channel.messages.fetch({ limit: amount });
            data = [];
            msg
              .map((m) => m)
              .forEach((ms) => {
                if (!args[2]) return message.channel.send(embd);
                if (ms.content.endsWith(args.slice(2).join(" ")) && !ms.pinned)
                  data.push(ms);
              });

            try {
              await message.channel
                .bulkDelete(data.length ? data : 1, true)
                .then(async (m) => {
                  embed = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(
                      `✅  Cleared **${m.size}**/**${amount}** messages!`
                    )
                    .setThumbnail(
                      member.user.displayAvatarURL({
                        dynamic: true,
                      })
                    )
                    .setFooter("Coded by: Tech Boy Gaming");

                  message.channel
                    .send(embed)
                    .then((msg) => msg.delete({ timeout: 50000 }));
                });
            } catch (e) {
              console.log(e);
              message.channel.send(error1);
            }

            break;
          default:
            return message.channel.send(embd);
            break;
        }
      } else {
        return message.channel.send(`An error occoured.`);
      }
    } catch (error) {
      console.log(error);
      message.channel.send(`An error occurred: \`${error}\``);
    }
  },
};
