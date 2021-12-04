const {
  Client,
  Message,
  MessageEmbed,
  MessageAttachment,
} = require("discord.js");
const config = require("../../config/config.json");
const fetch = require("node-fetch");
const chatbot = require("../..");

/**
 * @param {Client} client
 * @param {Message} message
 * @param {String[]} args
 */

module.exports = (client) => {
  console.log(" :: LOADED CHATFEATURE.JS ".bgRed);
  client.on("message", (message) => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") {
      if (message.attachments.size > 0)
        return message.reply("Look at this too...", {
          files: ["./I_CANNOT_READ_FILES.png"],
        });

      fetch(
        `http://api.brainshop.ai/get?bid=${config.b_id}&key=${
          config.b_key
        }&uid=1&msg=${encodeURIComponent(message)}`
      )
        .then((res) => res.json())
        .then((data) => {
          message.channel
            .send(data.cnt)
            .catch((e) => console.log("ERROR | " + e.stack));
        });
      return;
    }
    if (
      client.chatbot
        .get(message.guild.id, "channels")
        .includes(message.channel.id)
    ) {
      if (message.attachments.size > 0)
        return message.reply("Look at this too...");

      fetch(
        `http://api.brainshop.ai/get?bid=${config.b_id}&key=${
          config.b_key
        }&uid=1&msg=${encodeURIComponent(message)}`
      )
        .then((res) => res.json())
        .then((data) => {
          message.channel
            .send(data.cnt)
            .catch((e) => console.log("ERROR | " + e.stack));
        });
    }
  });
  client.on("channelDelete", (channel) => {
    try {
      client.chatbot.remove(channel.guild.id, channel.id, "channels");
    } catch {}
  });
  client.on("guildRemove", (guild) => {
    try {
      let channels = guild.channels.cache.map((ch) => ch.id);
      for (const chid of channels) {
        if (client.chatbot.get(message.guild.id).includes(channel.id))
          client.chatbot.remove(message.guild.id, chid, "channels");
      }
    } catch {}
  });
};
