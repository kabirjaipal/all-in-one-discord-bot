const { Client, Message, MessageEmbed, Collection } = require("discord.js");
const client = require("../index");
const voiceCollection = new Collection();
/**
 * @param {Client} client
 * @param {Message} message
 * @param {String[]} args
 */

client.on("voiceStateUpdate", async (oldState, newState) => {
  const user = await client.users.fetch(newState.id);
  const member = newState.guild.member(user);

  if (!oldState.channel && newState.channel.id === "863135684835672094") {
    const channel = await newState.guild.channels.create(user.tag, {
      type: "voice",
      parent: newState.channel.parent,
    });

    member.voice.setChannel(channel);
    voiceCollection.set(user.id, channel.id);
  } else if (!newState.channel) {
    if (oldState.channel.id === voiceCollection.get(newState.id))
      return oldState.channel.delete();
  }
});
