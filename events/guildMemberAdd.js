const schema = require("../utils/models/anti-raid");
const Schema1 = require("../utils/models/welcome");
const { MessageEmbed, MessageAttachment } = require("discord.js");
const client = require("..");

client.on("guildMemberAdd", async (member) => {
  schema.findOne({ Guild: member.guild.id }, async (err, data) => {
    const kickReason = "Anti-raidmode activated";
    if (!data) return;
    if (data) {
      try {
        member.send(
          new MessageEmbed()
            .setTitle(`Server Under Lockdown`)
            .setDescription(
              `You have been kicked from **${member.guild.name}** with reason: **${kickReason}**`
            )
            .setColor("RED")
        );
      } catch (e) {
        throw e;
      }
      member.kick(kickReason);
    }
  });

  // wecome bot
  Schema1.findOne({ Guild: member.guild.id }, async (e, data) => {
    if (!data) return;
    let user = member.user;
    let WELCOME = new MessageEmbed()
      .setTitle(`${member.user.username} Has Joined ${member.guild.name}`)
      .setDescription(
        `📜 Welcome To Our Server ${member.user} we are happy to have you! you are member number ${member.guild.memberCount}!\n \n 📜 ⊱ ──────────ஓ๑♡๑ஓ────────── ⊰ \n \n 📜 Read The Rules Of The Server  \n \n 📜 ⊱ ──────────ஓ๑♡๑ஓ────────── ⊰ \n \n 📜 Take Some Roles From  \n \n 📜 ⊱ ──────────ஓ๑♡๑ஓ────────── ⊰ \n \n 📜 Enjoy Having Fun In  \n \n 📜 ⊱ ──────────ஓ๑♡๑ஓ────────── ⊰ \n \n 📜 We are now ${member.guild.memberCount} in the server \n \n 📜 ⊱ ──────────ஓ๑♡๑ஓ────────── ⊰ \n \n 📜 \`Thanks for joining **${member.guild.name}** Hope you will enjoy here\` `
      )
      .setColor("RED")
      // .setImage("https://4kwallpapers.com/images/wallpapers/welcome-neon-glow-dark-background-glowing-1920x1080-2068.jpg")
      .setTimestamp()
      .setFooter("Thanks For Joining!");
    const channel = member.guild.channels.cache.get(data.Channel);
    channel.send(WELCOME);
    channel.send(user);
  });
});
