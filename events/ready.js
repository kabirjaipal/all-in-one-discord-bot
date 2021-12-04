const { prefix } = require("../index");
const client = require("../index");

client.on("ready", async () => {
  client.user.setStatus("dnd");
  console.log(`${client.user.username} ✅`);
  const status = [
    `in ${client.guilds.cache.size} Servers | ${client.user.username}`,
    `with ${client.users.cache.size} Users | ${client.user.username}`,
    `in ${client.channels.cache.size} Channels | ${client.user.username}`,
    `${prefix}help | ${client.user.username}`,
  ]
  setInterval(() => {
    client.user.setActivity(status[Math.floor(Math.random() * status.length)], { type: 'WATCHING' }) //You Can Set The Type To PLAYING/WATCHING/COMPETING/LISTENING.
  }, 5000)
});
