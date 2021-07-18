const { Client, Message, MessageEmbed } = require("discord.js");
const { distube } = require("../..");
const ee = require("../../config/bot.json");
const config = require('../../config/config.json')
const { getData, getPreview, getTracks } = require('spotify-url-info')

module.exports = {
  name: "play",
  aliases: ["p"],
  description: "",
  usage: "",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const { channel } = message.member.voice;

    if (!args) return message.channel.send(
      new MessageEmbed()
        .setColor(ee.colour)
        .setTitle(`Searching Song`)
        .setDescription(`🎶 Please Provide Song name and Link to Play ..`)
        .setFooter(config.footertext)
    ).then((msg) => {
      msg.delete(({
        timeout: 5000
      }))

    })

    // if member not join channel
    if (!channel) return message.channel.send(
      new MessageEmbed()
        .setColor(ee.colour)
        .setTitle(`Searching Song`)
        .setDescription(`🎶 Please Join A voice Channel First..`)
        .setFooter(config.footertext)
    ).then((msg) => {
      msg.delete(({
        timeout: 5000
      }))

    })

    // if bot playing song already
    if (distube.isPlaying(message) && channel.id !== message.guild.me.voice.channel.id) return message.channel.send(
      new MessageEmbed()
        .setColor(ee.colour)
        .setTitle(`Searching Song`)
        .setDescription(`🎶 Please Join MY voice Channel First..`)
        .setFooter(config.footertext)
    ).then((msg) => {
      msg.delete(({
        timeout: 5000
      }))

    })
    // code of spotify songs
    if (args.join(" ").toLowerCase().includes('open.spotify') && args.join(" ").toLowerCase().includes('track')) {
      //get data
      let info = await getPreview(args.join(" "));
      //play track
      return distube.play(message, info.artist + " " + info.title);
    }

    // code of playlist
    else if (args.join(" ").toLowerCase().includes('open.spotify') && args.join(" ").toLowerCase().includes('playlist')) {
      let items = await getTracks(args.join(" "));
      let songsarray = [];
      let tracklength = items.length;
      if (tracklength > 25) {
        message.reply("the current maximum of tracks for spotify playlists are 25 tracks, if you wanna use bigger playlists");
        tracklength = 25;
      }
      message.channel.send(
        new MessageEmbed()
          .setColor(ee.colour)
          .setTitle(`Adding Songs`)
          .setDescription("🎶  Fetching the songs!", "This will take me around about: " + tracklength / 2 + " seconds")
          .setFooter(config.footertext)
      ).then((msg) => {
        msg.delete(({
          timeout: 5000
        }))

      })
      for (let i = 0; i < 25; i++) {
        let result = await distube.play(items[i].title);
        songsarray.push(result[0].url)
      }
      distube.playCustomPlaylist(message, songsarray, {
        name: message.author.username + "'s Spotify Playlist"
      });
    }
    message.channel.send(
      new MessageEmbed()
        .setColor(ee.colour)
        .setTitle(`Searching Song`)
        .setDescription(`🎶  I AM Searching Your Song , Hehe!!\`\`\`${args.join(" ")}\`\`\``)
        .setFooter(config.footertext)
    ).then((msg) => {
      msg.delete(({
        timeout: 5000
      }))

    })
    distube.play(message, args.join(" "));
  },
};
