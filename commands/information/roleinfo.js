const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "role",
  aliase: ["rl", "roleinfo"],
  description: "This Command use For Info About a Role",
  usage: `prefix <role>`,
  category : "information",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    let role;
    if (args[0] && isNaN(args[0]) && message.mentions.roles.first())
      role = message.mentions.roles.first();
    if (args[0] && isNaN(args[0]) && !message.mentions.roles.first()) {
      role = message.guild.roles.cache.find(
        (e) =>
          e.name.toLowerCase().trim() ==
          args.slice(0).join(" ").toLowerCase().trim()
      );

      if (
        !message.guild.roles.cache.find(
          (e) =>
            e.name.toLowerCase().trim() ==
            args.slice(0).join(" ").toLowerCase().trim()
        )
      )
        return message.reply(":x: Role not found");
    }
    if (args[0] && !isNaN(args[0])) {
      role = message.guild.roles.cache.find((e) => e.id == args[0]);
      if (!message.guild.roles.cache.has(args[0]))
        return message.reply(":x: Role not found");
    }

    if (!role) return message.reply("You must mention role");
    let rolemembers;
    if (role.members.size > 20)
      rolemembers =
        role.members
          .map((e) => `<@${e.id}>`)
          .slice(0, 20)
          .join(", ") + ` and ${role.members.size - 20} more members...`;
    if (role.members.size < 20)
      rolemembers = role.members.map((e) => `<@${e.id}>`).join(", ");

    let embed = new MessageEmbed()
      .setColor(role.color)
      .setAuthor(message.guild.name, message.guild.iconURL())
      .setDescription(
        `**Role Name:** ${role.name}(<@&${role.id}>)\n\n
            **Role ID:** **\`${role.id}\`**\n\n
            **Role Mentionable:** ${role.mentionable
              .toString()
              .replace("true", "Yes")
              .replace("false", "No")}\n\n**Role Members Size:** ${
          role.members.size || 0
        }`
      )
      .addField("Role Members;", rolemembers || "Not Found");

    message.channel.send(embed);
  },
};
