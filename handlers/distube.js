const { MessageEmbed, Client } = require("discord.js");
const distube = require("../utils/etc/player");
const ee = require("../config/bot.json");
const { MessageButton, MessageActionRow } = require("discord-buttons");

let pause = new MessageButton().setID("pause").setEmoji("⏯️").setStyle("grey");

let stop = new MessageButton().setID("stop").setEmoji("⏹️").setStyle("red");

let skip = new MessageButton().setID("skip").setEmoji("⏭️").setStyle("blurple");

let loop = new MessageButton().setID("loop").setEmoji("🔄").setStyle("green");

let btnarr = new MessageActionRow().addComponents([skip, pause, loop, stop]);

/**
 *
 * @param {Client} client
 */
module.exports = (client) => {
  const status = (queue) =>
    `Volume: \`${queue.volume}%\` | Filter: \`${
      queue.filter || "Off"
    }\` | Loop: \`${
      queue.repeatMode
        ? queue.repeatMode == 2
          ? "All Queue"
          : "This Song"
        : "Off"
    }\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``;

  // DisTube event listeners, more in the documentation page
  distube.on("playSong", async (queue, song) => {
    let embed = new MessageEmbed()
      .setColor(ee.colour)
      .setTitle("🎶 Playing Song!")
      .setDescription(`Song: [\`${song.name}\`](${song.url})`)
      .addField("🩸 Requested by:", `>>> ${song.user}`, true)
      .addField("⏱ Duration:", `>>> ${song.formattedDuration}\``, true)
      .addField("🔊 Volume:", `>>> \`${queue.volume} %\``, true)
      .setFooter(status(queue), song.user.displayAvatarURL({ dynamic: true }))
      .setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`);
    let msg = await queue.textChannel.send({
      embed: embed,
      components: btnarr,
    });
    client.on("clickButton", async (button) => {
      let member = queue.textChannel.guild.members.cache.get(
        button.clicker.user.id
      );
      if (button.id === "pause") {
        await button.reply.defer().catch((e) => {});
        if (!member.voice.channel) {
          return queue.textChannel
            .send(new MessageEmbed().setTitle(`You Need To Join Voice Channel`))
            .then((msg) => {
              setTimeout(() => {
                msg.delete().catch((e) => {});
              }, 3000);
            });
        } else {
          if (queue.paused) {
            queue.resume();
            return queue.textChannel
              .send(new MessageEmbed().setTitle(`Song Resumed`))
              .then((msg) => {
                setTimeout(() => {
                  msg.delete().catch((e) => {});
                }, 3000);
              });
          } else {
            queue.pause();
            return queue.textChannel
              .send(new MessageEmbed().setTitle(`Song Paused`))
              .then((msg) => {
                setTimeout(() => {
                  msg.delete().catch((e) => {});
                }, 3000);
              });
          }
        }
      } else if (button.id === "skip") {
        await button.reply.defer().catch((e) => {});
        if (!member.voice.channel) {
          return queue.textChannel
            .send(new MessageEmbed().setTitle(`You Need To Join Voice Channel`))
            .then((msg) => {
              setTimeout(() => {
                msg.delete().catch((e) => {});
              }, 3000);
            });
        } else {
          if (!queue.songs[0]) {
            queue.skip();
            return queue.textChannel
              .send(new MessageEmbed().setTitle(`Song Skiped`))
              .then((msg) => {
                setTimeout(() => {
                  msg.delete().catch((e) => {});
                }, 3000);
              });
          } else {
            queue.stop();
            return queue.textChannel
              .send(new MessageEmbed().setTitle(`Song Skiped`))
              .then((msg) => {
                setTimeout(() => {
                  msg.delete().catch((e) => {});
                }, 3000);
              });
          }
        }
      } else if (button.id === "stop") {
        await button.reply.defer().catch((e) => {});
        if (!member.voice.channel) {
          return queue.textChannel
            .send(new MessageEmbed().setTitle(`You Need To Join Voice Channel`))
            .then((msg) => {
              setTimeout(() => {
                msg.delete().catch((e) => {});
              }, 3000);
            });
        } else {
          queue.stop();
          return queue.textChannel
            .send(new MessageEmbed().setTitle(`Song Stoped`))
            .then((msg) => {
              setTimeout(() => {
                msg.delete().catch((e) => {});
              }, 3000);
            });
        }
      } else if (button.id === "loop") {
        await button.reply.defer().catch((e) => {});
        if (!member.voice.channel) {
          return queue.textChannel
            .send(new MessageEmbed().setTitle(`You Need To Join Voice Channel`))
            .then((msg) => {
              setTimeout(() => {
                msg.delete().catch((e) => {});
              }, 3000);
            });
        } else {
          if (queue.repeatMode === 1) {
            queue.setRepeatMode(0);
            return queue.textChannel
              .send(new MessageEmbed().setTitle(`Song Loop Off`))
              .then((msg) => {
                setTimeout(() => {
                  msg.delete().catch((e) => {});
                }, 3000);
              });
          } else {
            queue.setRepeatMode(1);
            return queue.textChannel
              .send(new MessageEmbed().setTitle(`Song Loop On`))
              .then((msg) => {
                setTimeout(() => {
                  msg.delete().catch((e) => {});
                }, 3000);
              });
          }
        }
      }
    });
  });

  distube.on("addSong", async (queue, song) => {
    queue.textChannel
      .send(
        new MessageEmbed()
          .setColor(ee.colour)
          .setTitle("🎶 Added Song!")
          .setDescription(
            `Song: >>> [\`${song.name}\`](${song.url}) \n Duration 🎱 >>> \`${song.formattedDuration}\` \n Tracks >>> ${queue.songs.length}`
          )
          .setFooter(`Requested by: ${queue}\n${status(queue)}}`)
      )
      .then((msg) => {
        setTimeout(() => {
          msg.delete().catch((e) => {});
        }, 5000);
      });
  });

  distube.on("addList", async (queue, playlist) => {
    queue.textChannel
      .send(
        new MessageEmbed()
          .setColor(ee.colour)
          .setTitle("🎶 Added Playlist!")
          .setDescription(
            `Playlist: >>> [\`${playlist.name}\`](${playlist.url}) \n Duration 🎱 >>>  \`${playlist.formattedDuration}\` \n Tracks >>> ${playlist.songs.length}`
          )
          .addField(
            `Now Playing >>> \`${song.name}\` - \`${
              song.formattedDuration
            }\`\n${status(queue)}`
          )
          .setFooter(`Requested by: ${playlist.user.tag}\n${status(queue)}}`)
      )
      .then((msg) => {
        setTimeout(() => {
          msg.delete().catch((e) => {});
        }, 5000);
      });
  });

  distube.on("searchCancel", async (message, queary) => {
    queue.textChannel.send(`Searching canceled`).then((msg) => {
      setTimeout(() => {
        msg.delete().catch((e) => {});
      }, 5000);
    });
  });

  distube.on("error", async (channel, e) => {
    console.error(e);
    channel.send("An error encountered: " + e).then((msg) => {
      setTimeout(() => {
        msg.delete().catch((e) => {});
      }, 5000);
    });
  });

  distube.on("initQueue", (queue) => {
    (queue.autoplay = false), (queue.volume = 100);
  });
};
