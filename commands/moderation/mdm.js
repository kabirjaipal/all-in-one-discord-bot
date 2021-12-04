const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "dmall",
  aliases: ["mdm"],
  description: "",
  usage: "",
  category : "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (message.author.id != message.guild.ownerID) {
      return message.reply("Only Owner is Allowed to Use this Command");
    } else {
      message.delete;
      args = message.content.split(" ").slice(1);
      var argresult = args.join(" ");

      message.guild.members.cache.forEach((member) => {
        member
          .send(argresult)
          .then(
            console.log(`${member.user.username}#${member.user.discriminator}`)
          )
          .catch((err) =>
            console.error(
              `-----[DM's Disabled]----- \n${member.user.username}#${member.user.discriminator}`
            )
          );
        console.log(`.....DONE....`);
      });
      message.channel.send(`**DONE**`).then(message.delete({ timeout: 1000 }));
    }
  },
};
