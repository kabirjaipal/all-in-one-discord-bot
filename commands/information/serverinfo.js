const { Client, Message, MessageEmbed } = require("discord.js");
const moment = require("moment");

// variables
const filterLevels = {
  DISABLED: "Off",
  MEMBERS_WITHOUT_ROLES: "No Role",
  ALL_MEMBERS: "Everyone",
};

const verificationLevels = {
  NONE: "None",
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "(╯°□°）╯︵ ┻━┻",
  VERY_HIGH: "┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻",
};

const regions = {
  brazil: "Brazil",
  europe: "Europe",
  hongkong: "Hong Kong",
  india: "India",
  japan: "Japan",
  russia: "Russia",
  singapore: "Singapore",
  southafrica: "South Africa",
  sydeny: "Sydeny",
  "us-central": "US Central",
  "us-east": "US East",
  "us-west": "US West",
  "us-south": "US South",
};

module.exports = {
  name: "serverinfo",
  aliases: ["sinfo"],
  description: "Shows info about a server",
  usage: "serverinfo",
  category : "information",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const { guild } = message;
    const icon = message.guild.iconURL(); // Icon Of Server
    // const roles = message.guild.roles.cache.map(e => e.toString()) // Roles Of Server
    const roles = message.guild.roles.cache
      .sort((a, b) => b.position - a.position)
      .map((role) => role.toString())
      .slice(0, -1);

    let rolesdisplay;
    if (roles.length < 200) {
      rolesdisplay = roles.join(" ");
    } else {
      rolesdisplay = roles.slice(200).join(" ");
    }
    const emojis = message.guild.emojis.cache.map((e) => e.toString()); // Emojis Of Server
    const emojicount = message.guild.emojis.cache;

    message.channel
      .send(
        new MessageEmbed()
          .setColor("RED")
          .setDescription(`Getting Serverinfo...`)
      )
      .then((msg) => {
        msg.edit(
          new MessageEmbed()
            .setColor("RED")
            .setTitle("Server Info")
            .setThumbnail(message.guild.iconURL())
            .setAuthor(`This Guild Name is \`\`${message.guild.name}\`\``)
            .addField("**Guild Owner:**", `${message.guild.owner}`, true)
            .addField("Server region", message.guild.region, true)
            .addField("**Member Count:**", `${message.guild.memberCount}`, true)
            .addField(
              "``Verification Level``",
              verificationLevels[message.guild.verificationLevel],
              true
            )
            .addField(
              "``Rules Channel``",
              message.guild.rulesChannel
                ? `${message.guild.rulesChannel}`
                : "`None`",
              true
            )
            .addField("Boost Count:-", guild.premiumSubscriptionCount)
            .addField("Boost Level:-", guild.premiumTier)
            .addField(
              "Server Stats:-",
              `${
                guild.channels.cache.filter((channel) => channel.type == "text")
                  .size
              }⌨️\n${
                guild.channels.cache.filter(
                  (channel) => channel.type == "voice"
                ).size
              }🔈\n${
                guild.channels.cache.filter((channel) => channel.type == "news")
                  .size
              }📢\n${
                guild.channels.cache.filter(
                  (channel) => channel.type == "category"
                ).size
              }📁`
            )
            .addField(
              "Emoji Count:-",
              `${emojicount.size}\n${
                emojicount.filter((emoji) => !emoji.animated).size
              }(Non Animated)\n${
                emojicount.filter((emoji) => emoji.animated).size
              }(Animated)`
            )
            .addField(
              "**Total Real Members**",
              message.guild.members.cache.filter((member) => !member.user.bot)
                .size,
              true
            )
            .addField(
              "**Total Bots**",
              message.guild.members.cache.filter((member) => member.user.bot)
                .size,
              true
            )
            .addField(
              "**Total Channels**",
              message.guild.channels.cache.size,
              true
            )
            .addField(
              "**Total Text Channels**",
              message.guild.channels.cache.filter((ch) => ch.type === "text")
                .size,
              true
            )
            .addField(
              "**Total Voice Channels**",
              message.guild.channels.cache.filter((ch) => ch.type === "voice")
                .size,
              true
            )
            .addField(
              "**Created On**",
              message.guild.createdAt.toLocaleString(),
              true
            )
            .addField(
              "**Roles**",
              message.guild.roles.cache.size.toString(),
              true
            )
            .setFooter("Coded by: Tech Boy Gaming")
        );
      });
  },
};
