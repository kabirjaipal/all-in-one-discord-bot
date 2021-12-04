const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "unantivc",
  aliases: [""],
  description: "",
  usage: "",
  category : "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.permissions.has("MANAGE_ROLES")) return;

    const target =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!target)
      return message.reply(
        "Please tell me the member who should not be prevented from joining the vc"
      );

    if (target.id === message.author.id)
      return message.reply("You cannot unantivc yourself!");

    let role = message.guild.roles.cache.find(
      (role) => role.name.toLowerCase() === "antivc"
    );
    if (!role) return message.reply("Anti-Vc role doesn't exist");

    if (!target.roles.cache.has(role.id))
      return message.reply(
        `${target} was not event prevented from joining the vc in the first place.`
      );

    target.roles.remove(role.id);
    message.channel.send(`${target} will now be able to join vc\'s`);
  },
};
