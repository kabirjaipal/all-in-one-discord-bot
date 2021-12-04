const { MessageEmbed, Discord } = require("discord.js");

module.exports = {
  name: "membercount",
  aliases: ["memberinfo"],
  description: 'Use this command to get the guild"s member information.',
  usage: "membercount",
  category: "information",
  run: async (client, message, args, funcs) => {
    try {
      const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Server Member Info")
        .setDescription(` Total Members - ${message.guild.memberCount}`);
      message.channel.send(embed);
    } catch (e) {
      console.error;
      message.channel.send(`Oh no! An error occurred! \`${e.message}\`.`);
    }
  },
};
