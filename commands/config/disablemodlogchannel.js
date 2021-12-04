const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "disablemodlogchannel",
  aliases: ["dmc", "disablem", "disablemodlog"],
  category : "config",
  description: "Disables Server Modlog Channel",
  usage: "[channel name | channel mention | channel ID]",
  
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.permissions.has("ADMINISTRATOR"))
      return message.channel.send(
        "**You Do Not Have The Required Permissions! - [ADMINISTRATOR]**"
      );

    const modlogchannel = message.mentions.channels.first();

    if (!modlogchannel) {
      return message.channel.send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setTitle(
            `Please Mention modlogchannel to Disable Mod Log in This Guild `
          )
      );
    }

    if (
      !modlogchannel ===
      !client.channels.cache.find((ch) => ch.name === "modlogchannel")
    ) {
      message.channel.send(`Plz mention modlog`);
    } else {
      modlogchannel.delete();
      message.channel.send("modlog deleted.");
    }
  },
};
