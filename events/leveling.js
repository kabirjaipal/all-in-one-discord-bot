const client = require("../index");
const Schema3 = require("../utils/models/level");
const Levels = require("discord-xp");
const { config } = require("../index");
Levels.setURL(config.mongoose);

client.on("message", async (message, member) => {
  try {
    Schema3.findOne({ Guild: message.guild.id }, async (e, data) => {
      if (!data) return;
      if (!message.guild) return;
      if (message.author.bot) return;

      const randomAmountOfXp = Math.floor(Math.random() * 29) + 1; // Min 1, Max 30
      const hasLeveledUp = await Levels.appendXp(
        message.author.id,
        message.guild.id,
        randomAmountOfXp
      );
      if (hasLeveledUp) {
        const user = await Levels.fetch(message.author.id, message.guild.id);
        // const member = message.mentions.users.first() || message.author
        const channel = message.guild.channels.cache.get(data.Channel);
        channel.send(
          `${message.author}, congratulations! :tada::tada: You Just Leveled Up \n ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ \n Your Current Level Is  **${user.level}**. :tada: \n  ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ \n Keep Chatting For Leveling Up :tada::tada: \n ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ `
        );
      }
    });
  } catch (e) {
    message.channel.send(e);
  }
});
