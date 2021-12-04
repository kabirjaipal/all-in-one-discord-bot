const { Client, Message, MessageEmbed } = require("discord.js");
const Schema = require("../../utils/models/level");

module.exports = {
  name: "set-levelup-channel",
  description: "",
  usage: "",
  aliases: ["setlevelup", "levelchannel"],
  category : "leveling",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.permissions.has("MANAGE_CHANNELS"))
      return message.reply(
        "You dont have enough permission to excute this command!"
      );

    const channel = message.mentions.channels.first();
    if (!channel) message.channel.send(`plz mention a channel like #level`);

    Schema.findOne({ Guild: message.guild.id }, async (err, data) => {
      if (data) {
        data.Channel = channel.id;
        data.save();
      } else {
        new Schema({
          Guild: message.guild.id,
          Channel: channel.id,
        }).save();
      }
      // db.set(`welcomeChannel_${message.guild.id}`, channel.id)

      const levelup = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Level-UP Channel")
        .setDescription(`${channel} has been set as a Level-UP Channel`)
        .setThumbnail(
          "https://media.tenor.com/images/610d120b3b048f6487ad7555e94591bc/tenor.gif"
        )
        .setFooter("Made By Kabir Jaipal");
      message.channel.send(levelup);
    });
  },
};
