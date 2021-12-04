const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "voicemove",
  aliases: ["vcmove"],
  description: "Move all User to Different vc",
  usage: "",
  category : "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.permissions.any(["MOVE_MEMBERS"])) {
      return message.reply(
        ":x: You don't have `Move_Members` power to use this command."
      );
    }

    let channel = message.member.voice.channel;

    if (!channel)
      return message.channel.send(
        "You Have To Join A Voice Channel To Use This Command"
      );

    if (!message.guild.me.voice.connection) {
      channel.join().then((connection) => {
        message.guild.me.voice.setSelfDeaf(true);

        const e = new MessageEmbed()
          .setAuthor("| Voicemove", message.author.avatarURL({ dynamic: true }))
          .setDescription(
            "**:control_knobs: Now, move me and I'll drag users to a new voice channel.**"
          )
          .setColor("BLUE")
          .setFooter(`Developed by : ᴵ ᵃᵐ туѕσи#2806`);

        message.channel.send(e);

        client.on("voiceStateUpdate", async (oldmem, newmem) => {
          if (
            newmem.member.voice.channel &&
            newmem.member.voice.channel.id !== channel.id
          ) {
            let newchannel = message.guild.channels.cache.get(
              newmem.member.voice.channel.id
            );

            if (client.user.id === newmem.member.user.id) {
              channel.members.forEach((e) => {
                e.voice.setChannel(newchannel);

                newchannel.leave();
              });
            }
          }
        });
      });
    } else {
      message.channel.send(`**I'am already Connected To A Voice Channel.**`);
    }
  },
};
