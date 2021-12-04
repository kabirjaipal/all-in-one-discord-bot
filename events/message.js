const { Collection, MessageEmbed, Client } = require("discord.js");
const { prefix } = require("../index");
const client = require("../index");
const config = require("../config/config.json");

client.on("message", async (message) => {
  client.chatbot.ensure(message.guild.id, {
    channels: [],
  });

  if (message.author.bot) return;
  if (message.channel.partial) await message.channel.fetch();
  if (message.partial) await message.fetch();
  if (!message.content.startsWith(prefix)) return;
  if (!message.guild) return;
  if (!message.member)
    message.member = await message.guild.fetchMember(message);
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (cmd.length == 0) return;
  let command = client.commands.get(cmd);
  if (!command) command = client.commands.get(client.aliases.get(cmd));
  if (command) command.run(client, message, args);
  if (command) message.react("✅");
  // if (!command) return message.reply(`Unkown command, try: ${prefix}help`).then((message) => {
  //   message.react('❌')
  // })

  // mute system //////
  const Schema = require("../utils/models/mute");

  client.on("guildMemberAdd", async (member) => {
    const data = await Schema.findOne({ Guild: member.guild.id });
    if (!data) return;
    const user = data.Users.findIndex((prop) => prop === member.id);
    if (user === -1) return;

    const role = member.guild.roles.cache.find(
      (role) => role.name.toLowerCase() === "muted"
    );
    member.roles.add(role.id);
  });

  // booster event
  const boos = require("../utils/models/boost");
  boos.findOne({ guild: message.guild.id }, async (err, data) => {
    if (message.type === "USER_PREMIUM_GUILD_SUBSCRIPTION") {
      let ch = message.guild.channels.cache.get(data.channel);
      ch.send(`Thank you ${message.author}, for becoming a Nitro Booster! You have unlocked:\n\n
            1) Acess Our Heart You .. Hehe
            2) Access to external emojis
            3) Access to change your nickname
            4) Access to the Nitro Booster role`);
    }
  });

  // mod logs

  const modlogsSchema = require("../utils/models/mod-log");
  client.modlogs = async function ({ Member, Action, Color, Reason }, message) {
    const data = await modlogsSchema.findOne({ Guild: message.guild.id });
    if (!data) return;
    const channel = message.guild.channels.cache.get(data.Channel);

    const logsEmbed = new MessageEmbed()
      .setColor(Color)
      .setDescription(`Reason :${Reason || "No reason"}`)
      .addField("Member", `${Member.user.tag} (${Member.id})`)
      .setTitle(`Action took: ${Action}`);

    channel.send(logsEmbed);
  };
});
