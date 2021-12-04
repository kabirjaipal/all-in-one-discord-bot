const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "poll",
  aliases: ["polling"],
  description: "do poll in your server",
  usage: "poll <question>",
  category : "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.permissions.has("MANAGE_GUILD"))
      return message.channel.send(
        "**You Do Not Have Sufficient Permissions! - [MANAGE_GUILD]**"
      );

    if (!args[0])
      return message.channel.send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setTitle("**Please Enter A Query!**")
          .setFooter(`Coded By Tech Boy Gaming`)
      );

    const embed = new MessageEmbed()
      .setColor("GREEN")
      .setTitle(`Poll For ${message.guild.name} Sever`)
      .setFooter(`Coded By Tech Boy Gaming`)
      .setDescription(args.join(" "));
    var msg = await message.channel.send(embed);

    await msg.react("✅");
    await msg.react("❌");
  },
};
