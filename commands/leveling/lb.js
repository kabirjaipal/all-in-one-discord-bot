const { Client, Message, MessageEmbed } = require("discord.js");
const config = require("../../config/config.json");
const Levels = require("discord-xp");
Levels.setURL(config.mongoose);

module.exports = {
  name: "leaderboard",
  category : "leveling",
  description: "Shows the message experience leaderboard",
  aliases: ["lb"],
  usage: "leaderboard <global|guild|channel>",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, 10); // We grab top 10 users with most xp in the current server.

    if (rawLeaderboard.length < 1) return reply("Nobody's in leaderboard yet.");

    const leaderboard = await Levels.computeLeaderboard(
      client,
      rawLeaderboard,
      true
    ); // We process the leaderboard.

    const lb = leaderboard.map(
      (e) =>
        `${e.position}. ${e.username}#${e.discriminator}\nLevel: ${
          e.level
        }\nXP: ${e.xp.toLocaleString()}`
    ); // We map the outputs.

    const lb2 = new MessageEmbed()
      .setColor("RANDOM")
      .setThumbnail(message.guild.icon)
      .setTitle(`**Leaderboard**:`)
      .setDescription(`\n\n${lb.join("\n\n")}`)
      .setFooter("Coded By Tech Boy Gaming");
    message.channel.send(lb2);
  },
};
