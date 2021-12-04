const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "bans",
  aliases: ["fetchbans"],
  description: "Show Banned Users In A Guild",
  usage: "",
  category : "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.permissions.has("BAN_MEMBERS")) return;

    const fetchBans = message.guild.fetchBans();
    const bannedMembers = (await fetchBans)
      .map((member) => `\`${member.user.tag}\``)
      .join("\n");

    message.channel.send(
      new MessageEmbed()
        .setTitle(`List of banned users!`)
        .setDescription(bannedMembers)
        .setColor("BLUE")
    );
  },
};
