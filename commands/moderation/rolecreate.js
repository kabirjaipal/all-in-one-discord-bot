const { Client, Message, MessageEmbed } = require("discord.js");
const toHex = require("colornames");

module.exports = {
  name: "rolecreate",
  aliases: ["role", "newrole", "roleadd"],
  description: "Create a Role in Your Server",
  usage: "m/roleadd <member mention/id> <role mention/role id>",
  category : "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const name = args.slice(1).join(" ");
    const regex = !/[^a-zA-Z0-9]+/g.test(name);
    if (!message.member.permissions.has("MANAGE_ROLES")) {
      return message.channel.send("You don't have enough Permissions");
    }
    if (!message.guild.me.permissions.has("MANAGE_ROLES")) {
      return message.channel.send("I don't have enough permissions to do this");
    }
    if (!args[0]) {
      return message.channel.send(
        "`Usage: <prefix> createrole <colorname> <Name>`"
      );
    }
    if (!name) {
      return message.channel.send("You need to specify a name for your Role");
    }
    if (regex === false) {
      return message.channel.send(
        "That is not valid role name. It can contain only letters and numbers"
      );
    }
    if (name.length > 100) {
      return message.channel.send(
        "Your role can't be more than 100 characters long"
      );
    }
    message.guild.roles.create({
      data: {
        name: name,
        color: toHex(args[0]),
      },
    });
    let embed = new MessageEmbed()
      .setAuthor(message.author.tag)
      .setColor("BLUE").setDescription(`
**Role: ** ${name}
**Action: ** New Role Created
**Role Color: ** ${args[0]}
**Channel: ** ${message.channel}
**By: ** ${message.author.tag}
      `);
    message.channel.send(embed);
  },
};
