const { MessageEmbed } = require("discord.js");
const emoji = require("../../config/emojis.json");

module.exports = {
  name: "set-nick",
  aliases: ["setnickname", "nick"],
  description:
    "Sets a nickname for the mentioned user or provided ID from this guild",
  example: `nickname @kabu or !!nickname @kabir "Cool"`,
  category : "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const user =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    const perms = ["MANAGE_NICKNAMES" || "ADMINSTRATOR"];
    const doggo = message.guild.members.cache.get(client.user.id);
    let nickname = args[1];

    if (!message.member.permissions.has(perms))
      return message
        .reply(
          `${emoji.msg.ERROR} You do not have the permission to do that lol try asking a staff to give you the permission **\`MANAGE_NICKNAMES\`** or **\`ADMINISTRATOR\`**`
        )
        .then((msg) => {
          msg.delete({ timeout: 20000 });
        });

    if (!doggo.permissions.has(perms))
      return message.reply(
        `${emoji.msg.ERROR} I do not have permission to ban users pls enable permission **\`MANAGE_NICKNAMES\`** for me`
      );

    if (!user)
      return message.reply(
        `${emoji.msg.ERROR} Please mention or provide the ID of the user from this guild !! **\`${config.Prefix}nickname [Mention or ID] [The Nickname]\`**`
      );

    if (!args[1])
      return message.reply(`${emoji.msg.ERROR} Please provide a nickname !!`);

    if (nickname.startsWith('"')) {
      nickname = message.content.slice(message.content.indexOf(args[1]) + 1);

      if (!nickname.includes('"'))
        return message.reply(
          `${emoji.msg.ERROR} Please ensure the nickname is surrounded in quotes ""`
        );

      if (user.roles.highest.position > message.member.roles.highest.position)
        return message.reply(
          `${emoji.msg.ERROR} You cannot ban someone with an equal or higher role to you !!! or if you are owner pls be yourself in a higher position`
        );

      if (user.roles.highest.position > doggo.roles.highest.position)
        return message.reply(
          `${emoji.msg.ERROR} You cannot ban someone with an equal or higher role than me !!`
        );

      nickname = nickname.slice(0, nickname.indexOf('"'));
      if (!nickname.replace(/\s/g, "").length)
        return message.reply(
          `${emoji.msg.ERROR} Please provide a nickname to give to someone !`
        );
    }

    if (nickname.length > 32) {
      return message.reply(
        `${emoji.msg.ERROR} Provided nickname is too big pls provide a nickname which is lesser than 32 characters !!`
      );
    } else {
      try {
        const oldNickname = user.nickname || user.user.username;
        const changelog = `From \`${oldNickname}\` to \`${nickname}\``;

        await user.setNickname(nickname);

        const embed = new MessageEmbed()
          .setTitle("Nickname Changed !!")
          .setDescription(
            `${emoji.msg.SUCCESS} <@${user.id}> (\`${user.user.tag}\`) nickname has been successfully changed !!`
          )
          .addField(
            "Changed By",
            `<@${message.member.id}>\n(\`${message.member.user.tag}\`)`,
            true
          )
          .addField(
            "Changed User",
            `<@${user.id}>\n(\`${user.user.tag}\`)`,
            true
          )
          .addField("Changelog", changelog, true)
          .setFooter(
            message.member.displayName,
            message.author.displayAvatarURL({ dynamic: true })
          )
          .setTimestamp()
          .setColor("RED");
        await message.channel.send(embed);
      } catch (err) {
        message.reply(
          `${emoji.msg.ERROR} Please check the role position !!`,
          err.message
        );
      }
    }
  },
};
