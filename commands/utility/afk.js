const { Client, Message, MessageEmbed } = require("discord.js");
const { afk } = require("../../utils/etc/afk");

module.exports = {
  name: "afk",
  description: "An AFK command!",
  category: "utility",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const reason = args.join(" ") || "No reason!";

    afk.set(message.author.id, [Date.now(), reason]);

    message.channel.send(
      new MessageEmbed()
        .setDescription(`You have been set as AFK. \`${reason}\``)
        .setTimestamp()
        .setColor(`RANDOM`)
        .setFooter(`Coded By Tech Boy Gaming`)
    );
  },
};
