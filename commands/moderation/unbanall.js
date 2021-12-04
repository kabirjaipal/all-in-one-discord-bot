const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "unbanall",
  aliases: ["uball"],
  description: "Can unbanll all the users",
  usage: "",
  category : "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const noadmin = new MessageEmbed().setDescription(
      `*You are missing \`ADMINISTRATOR\` permissions to perform this execution.*`
    );

    if (message.member.permissions.has("ADMINISTRATOR")) {
      message.guild.fetchBans().then((bans) => {
        if (bans.size == 0) {
          {
            const embed = new MessageEmbed()
              .setDescription(`There are no banned users.`)
              .setColor("RANDOM");
            message.reply(embed);
          }
        } else {
          bans.forEach((ban) => {
            message.guild.members.unban(ban.user.id);
          });
          const emb = new MessageEmbed()
            .setTitle("Ubanned all")
            .setDescription(
              ` All banned users  has been Unbanned \n\n Moderator:<@${message.author.id}>\n\nUnbanned All Banned Members. `
            )

            .setColor("BLUE");
          message.channel.send(emb);
        }
      });
    } else {
      return await message.channel.send(noadmin);
    }
  },
};
