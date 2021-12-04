const { Client, Message, MessageEmbed } = require("discord.js");
const emoji = require("../../config/emojis.json");

module.exports = {
  name: "hackban",
  aliases: ["forceban", "ipban", "softban"],
  description: "Bans a user outside the server !!",
  example: `forceban 123456789101123 I don't want him`,
  category : "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const user = args[0] || message.mentions.members.first();
    const perms = ["BAN_MEMBERS" || "ADMINSTRATOR"];
    const doggo = message.guild.members.cache.get(client.user.id);

    if (!message.member.permissions.has(perms))
      return message
        .reply(
          `${emoji.msg.ERROR} You do not have the permission to do that lol try asking a staff to give you the permission **\`BAN_MEMBERS\`** or **\`ADMINISTRATOR\`**`
        )
        .then((msg) => {
          msg.delete({ timeout: 20000 });
        });

    if (!doggo.permissions.has(perms))
      return message.reply(
        `${emoji.msg.ERROR} I do not have permission to ban users pls enable permission **\`BAN_MEMBERS\`** for me`
      );

    if (!user)
      return message.reply(
        `${emoji.msg.ERROR} Please specify User ID of someone you want to forceban. **\`${config.Prefix}forceban <User ID> [reason]\`**`
      );

    if (user === client.user.id)
      return message.reply(
        `${emoji.msg.ERROR} Wait what ??!! I can't ban myslef !!!`
      );

    if (isNaN(user))
      return message.reply(
        `${emoji.msg.ERROR} Hey mention user ID user Ids are in numbers not in alphabets`
      );

    if (user.id === message.author.id)
      return message.reply(
        `${emoji.msg.ERROR} You cannot forceban yourself idot`
      );

    const reason = args.slice(1).join(" ");

    client.users
      .fetch(user)
      .then(async (user) => {
        await message.guild.members.ban(user.id, { reason: reason });
        user.send(
          new MessageEmbed()
            .setColor("RED")
            .setAuthor(message.author.tag)
            .setThumbnail(message.author.displayAvatarURL())
            .setTitle("Force Ban")
            .setDescription(
              `You Have Been Hack Banned From ${message.guild.name}`
            )
            .addField("Reason", `**\`${reason != "" ? reason : "-"}\`**`, true)
            .addField(
              "Banned By",
              `<@${message.member.id}> (**\`${message.member.user.tag}\`**)`,
              true
            )
        );

        const embed = new MessageEmbed()
          .setColor("#00aaaa")
          .setTitle("Force Ban !!")
          .setThumbnail(message.author.displayAvatarURL())
          .setDescription(
            `${emoji.msg.SUCCESS} <@${user.id}> (**\`${user.tag}\`**) has been forcefully banned from **${message.guild.name}** outside the guild !!`
          )
          .addField("Reason", `**\`${reason != "" ? reason : "-"}\`**`, true)
          .addField(
            "Banned By",
            `<@${message.member.id}> (**\`${message.member.user.tag}\`**)`,
            true
          )
          .setTimestamp();

        return message.channel.send(embed);
      })
      .catch((error) => {
        return message.channel.send(`An error occured:\n\`\`\`${error}\`\`\``);
      });
  },
};
