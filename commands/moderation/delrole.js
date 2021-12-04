const { Client, Message, MessageEmbed } = require("discord.js");
const config = require("../../config/config.json");

module.exports = {
  name: "delrole",
  aliases: ["role", "deleterole", "roleremove"],
  description: "Delete a Role in Your Server",
  usage: "m/roleremove <member mention/id> <role mention/role id>",
  category : "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const role = message.mentions.roles.first();
    if (!message.member.permissions.has("MANAGE_ROLES")) {
      return message.channel.send("You don't have enough Permissions");
    }
    if (!role) {
      return message.channel.send(
        new MessageEmbed()
          .setColor(config.colors.no)
          .setAuthor(message.author.tag)
          .setTitle(`Usage: ${config.prefix}delrole <role>`)
          .setDescription("Please mention A Role to Delete")
          .setFooter(config.footertext)
      );
    }
    role.delete();
    const embed = new MessageEmbed()
      .setTitle("Roles Update")
      .setDescription(`${role} role has been deleted`)
      .setColor(config.colors.no)
      .setAuthor(message.author.tag);
    await message.channel.send(embed);
  },
};
