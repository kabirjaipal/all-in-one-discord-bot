const Discord = require("discord.js");
const { Client, Collection, MessageEmbed } = require("discord.js");
const client = require("..");
const config = require("../config/config.json");

module.exports.embedbuilder = embedbuilder;
module.exports.errorbuilder = errorbuilder;
module.exports.escapeRegex = escapeRegex;
module.exports.QueueEmbed = QueueEmbed;
module.exports.lyricsEmbed = lyricsEmbed;
module.exports.curembed = curembed;

function embedbuilder(
  client,
  deletetime,
  message,
  color,
  title,
  description,
  thumbnail,
  author
) {
  try {
    if (title.includes("filter") && title.includes("Adding")) {
      client.infos.set(
        "global",
        Number(client.infos.get("global", "filters")) + 1,
        "filters"
      );
    }
  } catch {}
  try {
    let embed = new Discord.MessageEmbed()
      .setColor(color)
      .setFooter(config.footertext)
      .setAuthor(message.author.tag);
    if (title) embed.setTitle(title);
    if (description) embed.setDescription(description);
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (author) embed.setAuthor(author);
    if (!deletetime || deletetime === undefined || deletetime === "null") {
      message.channel.send(embed).then((msg) => {
        try {
          if (msg.channel.type === "news") msg.crosspost();
        } catch (error) {
          console.log(error);
          errorbuilder(error.stack.toString().substr(0, 2000));
        }
      });
      return;
    }
    return message.channel.send(embed);
  } catch (error) {
    embedbuilder(
      client,
      5000,
      message,
      "RED",
      "ERROR: ",
      "```" +
        error.toString().substr(0, 100) +
        "```" +
        "\n\n**Error got sent to my owner!**"
    );
    errorbuilder(error.stack.toString().substr(0, 2000));
  }
}

function errorbuilder(error) {
  console.log(error);
}

function escapeRegex(str) {
  try {
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  } catch (e) {
    console.log(String(e.stack).bgRed);
  }
}

function QueueEmbed(client, queue) {
  try {
    let embeds = [];
    let k = 10;
    //defining each Pages
    for (let i = 0; i < queue.songs.length; i += 10) {
      let qus = queue.songs;
      const current = qus.slice(i, k);
      let j = i;
      k += 10;
      const info = current
        .map(
          (track) =>
            `**${j++} -** [\`${track.name}\`](${track.url}) - \`${
              track.formattedDuration
            }\``
        )
        .join("\n");
      const embed = new Discord.MessageEmbed()
        .setTitle("Server Queue")
        .setColor(config.colors.yes)
        .setDescription(
          `**Current Song - [\`${qus[0].name}\`](${qus[0].url})**\n\n${info}`
        )
        .setFooter(config.footertext, client.user.displayAvatarURL());
      embeds.push(embed);
    }
    //returning the Embed
    return embeds;
  } catch (error) {
    console.log(error);
    errorbuilder(error.stack.toString().substr(0, 2000));
  }
}

function lyricsEmbed(client, message, lyrics, song) {
  try {
    let embeds = [];
    let k = 1000;
    for (let i = 0; i < lyrics.length; i += 1000) {
      const current = lyrics.slice(i, k);
      k += 1000;
      const embed = new Discord.MessageEmbed()
        .setTitle("Lyrics - " + song.name)
        .setURL(song.url)
        .setThumbnail(song.thumbnail)
        .setColor(config.colors.yes)
        .setDescription(current);
      embeds.push(embed);
    }
    return embeds;
  } catch (error) {
    console.log(error);
    embedbuilder(
      client,
      5000,
      message,
      "RED",
      "ERROR: ",
      "```" +
        error.toString().substr(0, 100) +
        "```" +
        "\n\n**Error got sent to my owner!**"
    );
    errorbuilder(error.stack.toString().substr(0, 2000));
  }
}

function curembed(client, message) {
  try {
    let djs = "";
    if (client.settings.get(message.guild.id, `djroles`).join("") === "")
      djs = "not setup";
    else
      for (
        let i = 0;
        i < client.settings.get(message.guild.id, `djroles`).length;
        i++
      ) {
        djs +=
          "<@&" + client.settings.get(message.guild.id, `djroles`)[i] + "> | ";
      }

    let queue = client.distube.getQueue(message); //get the current queue
    let song = queue.songs[0];
    embed = new Discord.MessageEmbed()
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
      .addField("👀 Views:", `>>> \`${song.views.toLocaleString()}\``, true)
      .addField(
        "♾ Loop:",
        `>>> ${
          queue.repeatMode
            ? queue.repeatMode === 2
              ? "✅ Queue"
              : "✅ Song"
            : "❌"
        }`,
        true
      )
      .addField("↪️ Autoplay:", `>>> ${queue.autoplay ? "✅" : "❌"}`, true)
      .addField("❔ Filter:", `>>> \`${queue.filter || "❌"}\``, true)
      .setFooter("Made By Kabir Jaipal aka Tech Boy Gaming")
      .setAuthor(
        message.author.tag,
        message.member.user.displayAvatarURL({
          dynamic: true,
        })
      )
      .setThumbnail(`https://img.youtube.com/vi/${song.id}/mqdefault.jpg`);
    return embed; //sending the new embed back
  } catch (error) {
    console.log(error);
    embedbuilder(
      5000,
      message,
      config.colors.no,
      "ERROR: ",
      "```" +
        error.toString().substr(0, 100) +
        "```" +
        "\n\n**Error got sent to my owner!**"
    );
    errorbuilder(error.stack.toString().substr(0, 2000));
  }
}
