const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "embed",
  aliases: [""],
  description: "",
  usage: "",
  category : "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!message.member.permissions.has("ADMINISTRATOR"))
      return message.channel
        .send("You do not have the required permission to use this command.")
        .then((m) => {
          setTimeout(() => {
            m.delete();
          }, 3000);
        });
    let embed = new MessageEmbed();
    message
      .reply("What should the title of the embed be? if none then type `none`")
      .then((m) => m.delete({ timeout: 30000 }));
    let title = await message.channel.awaitMessages(
      (res) => res.author.id === message.author.id,
      {
        max: 1,
        time: 30000,
      }
    );

    if (title.size) {
      if (title.first().content !== "none") {
        if (title.first().length > 256)
          return message
            .reply("Description can not exceed 2048 characters.")
            .then((m) => m.delete({ timeout: 5000 }));
        embed.setTitle(title.first().content);
      }
    }

    message
      .reply(
        "What should the description of the embed be? if none then type `none`"
      )
      .then((m) => m.delete({ timeout: 30000 }));
    let description = await message.channel.awaitMessages(
      (res) => res.author.id === message.author.id,
      {
        max: 1,
        time: 30000,
      }
    );

    if (description.size) {
      if (description.first().content !== "none") {
        if (description.first().length > 2048)
          return message
            .reply("Description can not exceed 2048 characters.")
            .then((m) => m.delete({ timeout: 5000 }));
        embed.setDescription(description.first().content);
      }
    }

    message
      .reply("What should the image of the embed be? if none then type `none`")
      .then((m) => m.delete({ timeout: 30000 }));
    let image = await message.channel.awaitMessages(
      (res) => res.author.id === message.author.id,
      {
        max: 1,
        time: 30000,
      }
    );

    if (image.size) {
      if (image.first().content !== "none") {
        if (!/\.(jpe?g|png|gif)$/i.test(image.first().content)) {
          return message
            .reply("that was not a valid URL.")
            .then((m) => m.delete({ timeout: 5000 }));
        }
        embed.setImage(image.first().content);
      }
    }

    message
      .reply(
        "What should the color of the embed be, either a hex color or a normal color."
      )
      .then((m) => m.delete({ timeout: 30000 }));
    let color = await message.channel.awaitMessages(
      (res) => res.author.id === message.author.id,
      {
        max: 1,
        time: 30000,
      }
    );

    embed.setColor(color.first().content);

    message
      .reply("What should the footer of the embed be? if none then type `none`")
      .then((m) => m.delete({ timeout: 30000 }));
    let footer = await message.channel.awaitMessages(
      (res) => res.author.id === message.author.id,
      {
        max: 1,
        time: 30000,
      }
    );

    if (footer.size) {
      if (footer.first().content !== "none") {
        if (footer.first().length > 2048)
          return message
            .reply("Footer can not exceed 2048 characters.")
            .then((m) => m.delete({ timeout: 5000 }));
        embed.setFooter(footer.first().content);
      }
    }

    message.channel.send(embed);
  },
};
