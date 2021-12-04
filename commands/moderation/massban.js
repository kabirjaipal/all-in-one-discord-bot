const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "massban",
  aliases: ["multiban"],
  description: "ban a multiple user onetime",
  usage: "massban <@user1 @user2 @user3> [reason]",
  category : "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.permissions.has("BAN_MEMBERS"))
      return message.channel.send(
        new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.author.tag)
          .setDescription(
            "**You Dont Have The Permissions To Mute Users! - [BAN_MEMBERS]**"
          )
          .setFooter("Coded by: Tech Boy Gaming")
      );

    let bannedCollection = message.mentions.members;
    let banReason = args.slice(1).slice(bannedCollection.size).join(" ");

    if (!banReason) banReason = "No reason provided";

    function checkPerms(collection) {
      let data = [];
      collection.forEach((m) => {
        if (
          m.roles.highest.position >= message.member.roles.highest.position ||
          m.roles.highest.position >= message.guild.me.roles.highest.position
        )
          data.push(m);
      });
      if (data.length === 0) return false; // Passed
      return data;
    }
    let collector = message.channel.createMessageCollector(
      (m) => m.author.id === message.author.id,
      {
        time: 60 * 1000,
      }
    );
    message.channel.send(
      `:check: **Are you sure you want to ban ${bannedCollection
        .map((mem) => `${mem.toString()}`)
        .join(", ")}?** \nPlease reply with \`y\`/\`yes\` or \`cancel\``
    );
    collector.on("collect", async (msg) => {
      if (["yes", "y"].includes(msg.content.toLowerCase())) {
        try {
          bannedCollection.forEach((member) => {
            message.guild.members.ban(member, {
              reason: banReason,
              days: 7,
            });
          });
          return message.channel.send(
            new MessageEmbed()
              .setColor("BLUE")
              .setAuthor(message.author.tag)
              .setTitle("Massban Successful")
              .setDescription(
                `I have banned ${bannedCollection
                  .map((m) => `**${m.user.tag}**`)
                  .join(", ")} | ${banReason}`
              )
              .setFooter(`Coded By Tech Boy Gaming`)
          );
        } catch (e) {
          client.logger.log(`Massban failed \n${e}`, "error");
        }
        return collector.stop();
      } else if (msg.content.toLowerCase() === "cancel") {
        collector.stop();
        return message.channel.send(
          "Massban",
          "I have cancelled the massban on " +
            bannedCollection.size +
            " members",
          client.colors.green
        );
      } else {
        return message.channel.send(
          `**PROMPT FAILED**: \n${
            client.emoji.misc.check
          } Are you sure you want to ban ${bannedCollection
            .map((mem) => `**${mem.user.username}**`)
            .join(", ")}? \nPlease reply with \`y\`/\`yes\` or \`cancel\``
        );
      }
    });

    collector.on("end", (_, reason) => {
      if (reason === "time") {
        return message.error("Ran out of time, please try again");
      }
    });
  },
};
