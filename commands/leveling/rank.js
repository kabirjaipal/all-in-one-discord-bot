const {
  Client,
  Message,
  MessageEmbed,
  MessageAttachment,
} = require("discord.js");
const canvacord = require("canvacord");
const db = require("quick.db");
const config = require("../../config/config.json");
const Levels = require("discord-xp");
Levels.setURL(config.mongoose);

module.exports = {
  name: "rank",
  description: "",
  usage: "",
  aliases: "",
  category : "leveling",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    try {
      const user = await Levels.fetch(message.author.id, message.guild.id);
      const neededXp = Levels.xpFor(parseInt(user.level) + 1);

      const rank = new canvacord.Rank()
        .setAvatar(
          message.author.displayAvatarURL({ dynamic: false, format: "png" })
        )
        .setCurrentXP(user.xp)
        .setLevel(user.level)
        .setRequiredXP(neededXp)
        .setStatus(message.member.presence.status)
        .setProgressBar("WHITE", "COLOR")
        .setUsername(message.author.username)
        .setDiscriminator(message.author.discriminator);
      rank.build().then((data) => {
        const attachment = new MessageAttachment(data, "AxelRank.png");
        message.channel.send(attachment);
      });
    } catch (e) {
      console.log(e);
    }
  },
};
