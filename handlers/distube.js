const { MessageEmbed } = require("discord.js");
// const distube = require('../index')
const ee = require("../config/bot.json");

module.exports = (client) => {
  const status = (queue) =>
    `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || "Off"
    }\` | Loop: \`${queue.repeatMode
      ? queue.repeatMode == 2
        ? "All Queue"
        : "This Song"
      : "Off"
    }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

  // DisTube event listeners, more in the documentation page
  client.distube
    .on('playSong', async (message, queue, song) =>
      message.channel
        .send(
          new MessageEmbed()
            .setColor(ee.colour)
            .setTitle("🎶 Playing Song!")
            .setDescription(`Song: [\`${song.name}\`](${song.url})`)
            .addField("`🩸 Requested by:", `>>> ${song.user}`, true)
            .addField(
              "⏱ Duration:",
              `>>> \`${queue.formattedCurrentTime} / ${song.formattedDuration}\``,
              true
            )
            .addField(
              "🌀 Queue:",
              `>>> \`${queue.songs.length} song(s) - ${queue.formattedDuration}\``,
              true
            )
            .addField("🔊 Volume:", `>>> \`${queue.volume} %\``, true)
            .addField(
              "👀 Views:",
              `>>> \`${song.views.toLocaleString()}\``,
              true
            )
            .addField(
              "♾ Loop:",
              `>>> ${queue.repeatMode
                ? queue.repeatMode === 2
                  ? "✅ Queue"
                  : "✅ Song"
                : "❌"
              }`,
              true
            )
            .addField(
              "↪️ Autoplay:",
              `>>> ${queue.autoplay ? "✅" : "❌"}`,
              true
            )
            .addField("❔ Filter:", `>>> \`${queue.filter || "❌"}\``, true)
            .setFooter("Made By Kabir Jaipal aka Tech Boy Gaming")
            .setAuthor(
              message.author.tag,
              message.member.user.displayAvatarURL({
                dynamic: true,
              })
            )
            .setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`)

        )
        .then(async (msg) => {
          await msg.react("⏭");
          await msg.react("⏯");
          await msg.react("🔉");
          await msg.react("🔊");
          await msg.react("🔇");
          await msg.react("🔁");
          await msg.react("🔀");
          await msg.react("⏹");
          await msg.react("🎵");
          await msg.react("🎶");

          const filter = (reaction, user) =>
            ["⏭", "⏯", "🔉", "🔊", "🔇", "🔁", "⏹", "🎵", "🎶"].includes(
              reaction.emoji.id || reaction.emoji.name
            ) && user.id !== message.client.user.id;
          var collector = await msg.createReactionCollector(filter, {
            time: song.duration > 0 ? song.duration * 1000 : 600000,
          })

          // collecter
          collector.on('collect', async (reaction, user) => {
            //return if no queue available
            if (!queue) return;

            //create member out of the user
            const member = reaction.message.guild.member(user);

            //remoe the reaction
            reaction.users.remove(user);

            if (!member.voice.channel || (member.voice.channel.id !== member.guild.me.voice.channel.id)) return message.channel.send(
              new MessageEmbed()
                .setColor(ee.colour)
                .setAuthor(message.author.tag)
                .setDescription(" You must join a Voice Channel")
                .setFooter(ee.footertext)
            )


        
            // reaction control start

            switch (reaction.emoji.id || reaction.emoji.name) {
              // skip reaction
              case "⏭":
                queue.playing = true;
                reaction.users.remove(user).catch(console.error)
                queue.connection.dispatcher.end()
                message.channel.send(
                  new MessageEmbed()
                    .setColor(ee.colour)
                    .setAuthor(message.author.tag)
                    .setDescription("SKIPPED!",
                      `Skipped the song`)
                    .setFooter(ee.footertext)
                ).then((msg) => {
                  msg.delete({
                    timeout: 5000
                  })
                })
                collector.stop()
                break;
              // pause and resume reaction

              case "⏯":
                reaction.users.remove(user).catch(console.error);
                if (queue.playing) {
                  queue.playing = !queue.playing;
                  distube.pause(message)
                  message.channel.send(
                    new MessageEmbed()
                      .setColor(ee.colour)
                      .setAuthor(message.author.tag)
                      .setDescription(`PAUSHED!"⏸ paused the music`)
                      .setFooter(ee.footertext)
                  ).then((msg) => {
                    msg.delete({
                      timeout: 5000
                    })
                  })
                } else {
                  queue.playing = !queue.playing;
                  distube.resume(message)
                  message.channel.send(
                    new MessageEmbed()
                      .setColor(ee.colour)
                      .setAuthor(message.author.tag)
                      .setDescription(`RESUMED!" ▶ resumed the music!`)
                      .setFooter(ee.footertext)
                  ).then((msg) => {
                    msg.delete({
                      timeout: 5000
                    })
                  })


                }
                break;

              // Mute reaction
              case "🔇":
                reaction.users.remove(user).catch(console.error)
                if (queue.volume <= 0) {
                  queue.volume = 100;
                  queue.connection.dispatcher.setVolumeLogarithmic(100 / 100);
                  message.channel.send(
                    new MessageEmbed()
                      .setColor(ee.colour)
                      .setAuthor(message.author.tag)
                      .setDescription(`"UNMUTED!" 🔊 unmuted the music!`)
                      .setFooter(ee.footertext)
                  ).then((msg) => {
                    msg.delete({
                      timeout: 5000
                    })
                  })
                } else {
                  queue.volume = 0;
                  queue.connection.dispatcher.setVolumeLogarithmic(0);
                  message.channel.send(
                    new MessageEmbed()
                      .setColor(ee.colour)
                      .setAuthor(message.author.tag)
                      .setDescription(`"MUTED!" 🔇 muted the music!`)
                      .setFooter(ee.footertext)
                  ).then((msg) => {
                    msg.delete({
                      timeout: 5000
                    })
                  })
                }
                break;

              // decrease Volume
              case "🔉":
                reaction.users.remove(user).catch(console.error);
                if (queue.volume - 10 <= 0) queue.volume = 0;
                else queue.volume = queue.volume - 10;
                queue.connection.dispatcher.setVolumeLogarithmic(
                  queue.volume / 100
                );
                queue.textChannel;
                message.channel.send(
                  new MessageEmbed()
                    .setColor(ee.colour)
                    .setAuthor(message.author.tag)
                    .setDescription(`🔉 decreased the volume, the volume is now ${queue.volume}%`)
                    .setFooter(ee.footertext)
                ).then((msg) => {
                  msg.delete({
                    timeout: 5000
                  })
                })
                break;

              // increase Volume
              case "🔊":
                reaction.users.remove(user).catch(console.error);
                if (queue.volume + 10 >= 1000) queue.volume = 100;
                else queue.volume = queue.volume + 10;
                queue.connection.dispatcher.setVolumeLogarithmic(
                  queue.volume / 100
                );
                message.channel.send(
                  new MessageEmbed()
                    .setColor(ee.colour)
                    .setAuthor(message.author.tag)
                    .setDescription(`🔊 increased the volume, the volume is now ${queue.volume}%`)
                    .setFooter(ee.footertext)
                ).then((msg) => {
                  msg.delete({
                    timeout: 5000
                  })
                })
                break;

              // Loop reaction
              case "🔁":
                reaction.users.remove(user).catch(console.error);
                queue.loop = !queue.loop;
                message.channel.send(
                  new MessageEmbed()
                    .setColor(ee.colour)
                    .setAuthor(message.author.tag)
                    .setDescription(`Loop is now ${queue.loop ? "**on**" : "**off**"}`)
                    .setFooter(ee.footertext)
                ).then((msg) => {
                  msg.delete({
                    timeout: 5000
                  })
                })
                break;

              // Stop reaction
              case "⏹":
                reaction.users.remove(user).catch(console.error);
                queue.songs = [];
                message.channel.send(
                  new MessageEmbed()
                    .setColor(ee.colour)
                    .setAuthor(message.author.tag)
                    .setDescription(`⏹ stopped the music!`)
                    .setFooter(ee.footertext)
                ).then((msg) => {
                  msg.delete({
                    timeout: 5000
                  })
                })
                try {
                  queue.connection.dispatcher.end();
                } catch (error) {
                  console.error(error);
                  queue.connection.disconnect();
                }
                collector.stop();
                break;

              // QUEUE reaction
              case "🔀":
                reaction.users.remove(user).catch(console.error);
                if (!queue)
                  message.channel.send(
                    new MessageEmbed()
                      .setColor(ee.colour)
                      .setAuthor(message.author.tag)
                      .setDescription(`Upps, There is no queue.`)
                      .setFooter(ee.footertext)
                  ).then((msg) => {
                    msg.delete({
                      timeout: 5000
                    })
                  })
                let songs = queue.songs;
                queue.songs = songs;
                for (let i = songs.length - 1; i > 1; i--) {
                  let j = 1 + Math.floor(Math.random() * i);
                  [songs[i], songs[j]] = [songs[j], songs[i]];
                }
                message.client.queue.set(message.guild.id, queue);
                message.channel.send(
                  new MessageEmbed()
                    .setColor(ee.colour)
                    .setAuthor(message.author.tag)
                    .setDescription(`🔀 Shuffled The Queue`)
                    .setFooter(ee.footertext)
                ).then((msg) => {
                  msg.delete({
                    timeout: 5000
                  })
                })

                break;

              // nOW playing reaction
              case "🎵":
                reaction.users.remove(user).catch(console.error);
                const song = queue.songs[0];
                //get current song duration in s
                //get thumbnail
                let thumb;
                if (song.thumbnail === undefined)
                  thumb =
                    "https://cdn.discordapp.com/attachments/778600026280558617/781024479623118878/ezgif.com-gif-maker_1.gif";
                else thumb = song.thumbnail.url;
                //define current time
                const seek =
                  (queue.connection.dispatcher.streamTime -
                    queue.connection.dispatcher.pausedTime) /
                  1000;
                //define embed

                message.channel.send(
                  new MessageEmbed()
                    .setColor(ee.colour)
                    .setAuthor(message.author.tag)
                    .setTitle(` ♪ Now playing♪`, true)
                    .setDescription(`[**${song.name}**](${song.url})`, true)
                    .setFooter(ee.footertext)
                ).then((msg) => {
                  msg.delete({
                    timeout: 5000
                  })
                })
                break;



              //  Music Quee reaction
              case "🎶":
                reaction.users.remove(user).catch(console.error);
                const description = queue.songs.map(
                  (song, index) =>
                    `${index + 1}. ${song.name}\n`
                );
                message.channel.send(
                  new MessageEmbed()
                    .setColor(ee.colour)
                    .setAuthor(message.author.tag)
                    .setTitle(` ♪ Music Queue`)
                    .setDescription(`**${description}**`)
                    .setFooter(ee.footertext)
                ).then((msg) => {
                  msg.delete({
                    timeout: 5000
                  })
                })
                // const splitDescription = splitMessage(description, {
                //   maxLength: 2048,
                //   char: "\n",
                //   prepend: "",
                //   append: "",
                // });

                // splitDescription.forEach(async (m) => {
                //   queueEmbed.setDescription(m);
                //   message.react("🎶");
                // });
                break;


              default:
                reaction.users.remove(user).catch(console.error);
                break;
            }

          })
          collector.on("end", () => {
            msg.reactions.removeAll();
            msg.delete({
              timeout: 7200,
            });
          });
        })

    )
    /*  .setTitle("🎶 Playing Song!")
            .setDescription(`Song: [\`${song.name}\`](${song.url})`)
            */
    .on("addSong", (message, queue, song) =>
      message.channel.send(
        new MessageEmbed()
          .setColor(ee.colour)
          .setTitle("🎶 Added Song!")
          .setDescription(`Song: >>> [\`${song.name}\`](${song.url}) \n Duration 🎱 >>> \`${song.formattedDuration}\` \n Tracks >>> ${queue.songs.length}`)
          .setFooter(
            `Requested by: ${message.author.tag}\n${status(
              queue
            )}}`
          )
      ).then((msg) => {
        msg.delete({ timeout: 5000 })
      })
    )
    .on("playList", (message, queue, playlist, song) =>
      message.channel.send(
        new MessageEmbed()
          .setColor(ee.colour)
          .setTitle("🎶 Added Playlist!")
          .setDescription(`Playlist: >>> [\`${playlist.name}\`](${playlist.url}) \n Duration 🎱 >>>  \`${playlist.formattedDuration}\` \n Tracks >>> ${playlist.songs.length}`)
          .addField(`Now Playing >>> \`${song.name
            }\` - \`${song.formattedDuration}\`\n${status(queue)}`)
          .setFooter(
            `Requested by: ${message.author.tag}\n${status(
              queue
            )}}`
          )
      ).then((msg) => {
        msg.delete({ timeout: 5000 })
      })
    )
    .on("addList", (message, queue, playlist) =>
      message.channel.send(
        new MessageEmbed()
          .setColor(ee.colour)
          .setTitle("🎶 Added Playlist!")
          .setDescription(`Playlist: >>> [\`${playlist.name}\`](${playlist.url}) \n Duration 🎱 >>>  \`${playlist.formattedDuration}\` \n Tracks >>> ${playlist.songs.length}`)
          .addField(`playlist (${playlist.songs.length
            } songs) to queue\n${status(queue)}`
          )
          .setFooter(
            `Requested by: ${message.author.tag}\n${status(
              queue
            )}}`
          )
      ).then((msg) => {
        msg.delete({ timeout: 5000 })
      })
    )
    // DisTubeOptions.searchSongs = true
    .on("searchResult", (message, result) => {
      let i = 0;
      message.channel.send(
        new MessageEmbed()
          .setColor(ee.colour)
          .setTitle(`Your Search Result >>> ${result.length}`)
          .addField(`**Choose an option from below**\n${result
            .map(
              (song) => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``
            )
            .join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`, true)
          .setFooter(
            `Requested by: ${message.author.tag}\n${status(
              queue
            )}}`
          )
      )
    })
    // DisTubeOptions.searchSongs = true
    .on("searchCancel", (message) => message.channel.send(`Searching canceled`).then((msg) => {
      msg.delete({ timeout: 5000 })
    }))
    .on("error", (message, e) => {
      console.error(e);
      message.channel.send("An error encountered: " + e).then((msg) => {
        msg.delete({ timeout: 5000 })
      })
    })
    .on("initQueue", (queue) => {
      queue.autoplay = false;
      queue.volume = 100;
    });
};
