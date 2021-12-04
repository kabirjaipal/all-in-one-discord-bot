const Discord = require("discord.js");
const { Client, Message, MessageEmbed, Collection } = require("discord.js");
const fs = require("fs");
const colors = require("colors");
const config = require("./config/config.json");
const map = new Map();
const client = new Client({
  messageCacheLifetime: 60,
  fetchAllMembers: false,
  messageCacheMaxSize: 10,
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  shards: "auto",
  disableEveryone: true,
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
require("discord-buttons")(client);

// MongoDB
const mongoose = require("mongoose");
mongoose
  .connect(config.mongoose, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(console.log("MongoDB Conneted.."));
const prefix = config.prefix;
client.prefix = prefix;
client.config = config;
const token = config.token;
module.exports = client;
client.commands = new Collection();
client.aliases = new Collection();
client.events = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.categories = fs.readdirSync("./commands/");

//Loading files, with the client variable like Command Handler, Event Handler, ...
["command", "distube"].forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});

["chatbot", "logger", "jointocreate"].forEach((handler) => {
  require(`./utils/etc/${handler}`)(client);
});

// host bot

// const express = require("express")
// const app = express();

// app.get("/", (req, res) => {
//   res.send(`Pinging`)
// })

// app.listen(() => {
//   console.log(`Server Started..`)
// })

//databases setups
const Enmap = require("enmap");
client.settings = new Enmap({
  name: "settings",
  dataDir: "./databases/settings",
});
client.setups = new Enmap({
  name: "setups",
  dataDir: "./databases/setups",
});
client.chatbot = new Enmap({
  name: "chatbot",
  dataDir: "./databases/chatbot",
});
client.infos = new Enmap({
  name: "infos",
  dataDir: "./databases/infos",
});
client.jointocreatemap = new Enmap({
  name: "settings",
  dataDir: "./databases/jointocreatemap",
});

/// giveawat bot

// Initialise discord giveaways
const { GiveawaysManager } = require("discord-giveaways");
client.giveawaysManager = new GiveawaysManager(client, {
  updateCountdownEvery: 3000,
  default: {
    botsCanWin: false,
    embedColor: "#FF0000",
    reaction: "🎉",
  },
});

/* Client's GiveawaysManager Events */
client.giveawaysManager.on(
  "giveawayReactionAdded",
  async (giveaway, reactor, messageReaction) => {
    if (reactor.user.bot) return;
    try {
      if (giveaway.extraData) {
        await client.guilds.cache
          .get(giveaway.extraData.server)
          .members.fetch(reactor.id);
      }
      reactor.send(
        new Discord.MessageEmbed()
          .setTimestamp()
          .setTitle("Entery Approved! | You have a chance to win!!")
          .setDescription(
            `Your entery to [This Giveaway](https://discord.com/channels/${giveaway.guildID}/${giveaway.channelID}/${giveaway.messageID}) has been approved!`
          )
          .setFooter("Coded By Tech Boy Gaming")
          .setTimestamp()
      );
    } catch (error) {
      const guildx = client.guilds.cache.get(giveaway.extraData.server);
      messageReaction.users.remove(reactor.user);
      reactor.send(
        new Discord.MessageEmbed()
          .setTimestamp()
          .setTitle(":x: Entery Denied | Databse Entery Not Found & Returned!")
          .setDescription(
            `Your entery to [This Giveaway](https://discord.com/channels/${giveaway.guildID}/${giveaway.channelID}/${giveaway.messageID}) has been denied as you did not join **${guildx.name}**`
          )
          .setFooter("Coded By Tech Boy Gaming")
      );
    }
  }
);
// Check if user reacts on an ended giveaway
client.giveawaysManager.on(
  "endedGiveawayReactionAdded",
  (giveaway, member, reaction) => {
    reaction.users.remove(member.user);
    member.send(`**Aw snap! Looks Like that giveaway has already ended!**`);
  }
);
// Dm our winners
client.giveawaysManager.on("giveawayEnded", (giveaway, winners) => {
  winners.forEach((member) => {
    member.send(
      new Discord.MessageEmbed()
        .setTitle(`🎁 Let's goo!`)
        .setDescription(
          `Hello there ${member.user}\n I heard that you have won **[[This Giveaway]](https://discord.com/channels/${giveaway.guildID}/${giveaway.channelID}/${giveaway.messageID})**\n Good Job On Winning **${giveaway.prize}!**\nDirect Message the host to claim your prize!!`
        )
        .setTimestamp()
        .setFooter(member.user.username, member.user.displayAvatarURL())
    );
  });
});
// Dm Rerolled winners
client.giveawaysManager.on("giveawayRerolled", (giveaway, winners) => {
  winners.forEach((member) => {
    member.send(
      new Discord.MessageEmbed()
        .setTitle(`🎁 Let's goo! We Have A New Winner`)
        .setDescription(
          `Hello there ${member.user}\n I heard that the host rerolled and you have won **[[This Giveaway]](https://discord.com/channels/${giveaway.guildID}/${giveaway.channelID}/${giveaway.messageID})**\n Good Job On Winning **${giveaway.prize}!**\nDirect Message the host to claim your prize!!`
        )
        .setTimestamp()
        .setFooter(member.user.username, member.user.displayAvatarURL())
    );
  });
});
// When They Remove Reaction
client.giveawaysManager.on(
  "giveawayReactionRemoved",
  (giveaway, member, reaction) => {
    return member.send(
      `❓ Hold Up Did You Just Remove a Reaction From A Giveaway?`
    );
  }
);

client.login(token);
