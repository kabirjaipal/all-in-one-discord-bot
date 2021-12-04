//load the data
const config = require("../config/config.json");
const ee = require("../config/bot.json");
//Start the module

//FUNCTION FOR ENSURING THE databases
function databasing(guildid, client) {
  client.settings.ensure(guildid, {
    prefix: config.prefix,
    channel: "",
    channelname: "{user}' Room",
    guild: guildid,
  });
}
//Function to reset the Database
function reset_DB(guildid, client) {
  client.settings.set(guildid, {
    prefix: config.prefix,
    channel: "",
    channelname: "{user}' Room",
    guild: guildid,
  });
}
//FUNCTION FOR CHECKING THE PREFIX !
function escapeRegex(str) {
  try {
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  } catch (e) {}
}

//function to check voice channels
function check_voice_channels(client) {
  let guilds = client.guilds.cache.map((guild) => guild.id);
  for (let i = 0; i < guilds.length; i++) {
    try {
      let guild = client.guilds.cache.get(guilds[i]);
      databasing(guild.id, client);
      let jointocreate = []; //get the data from the database onto one variables
      jointocreate.push(client.settings.get(guild.id, "channel"));
      for (let j = 0; j < jointocreate.length; j++) {
        let channel = guild.channels.cache.get(jointocreate[j]);
        if (!channel) continue;
        let members = channel.members.map((guild) => guild.id);
        if (!members) continue;
        for (let k = 0; k < members.length; k++) {
          let member = guild.members.cache.get(members[k]);
          create_join_to_create_Channel(client, member.voice, j + 1);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }
  return;
}
//function to create a voice channel
function create_join_to_create_Channel(client, user, type) {
  if (type == 1)
    chname = client.settings.get(user.member.guild.id, "channelname");
  else chname = "{user}'s Room";
  //CREATE THE CHANNEL
  let allowed = true;
  if (!user.guild.me.hasPermission("MANAGE_CHANNELS")) {
    allowed = false;
    try {
      user.member.user.send(
        "${user.member.user} | :x: Error | Please give me the permission, `MANGE CHANNELS` --> I need to be able to create Channels ..."
      );
    } catch {
      try {
        let channel = guild.channels.cache.find(
          (channel) =>
            channel.type === "text" &&
            channel.permissionsFor(guild.me).has("SEND_MESSAGES")
        );
        channel.send(
          `${user.member.user} | :x: Error | Please give me the permission, \`MANGE CHANNELS\` --> I need to be able to create Channels ...`
        );
      } catch {}
    }
  }
  if (allowed) {
    console.log(
      `Created the Channel: ${String(
        chname.replace("{user}", user.member.user.username)
      ).substr(0, 32)} in: ${user.guild ? user.guild.name : "undefined"}`
        .brightGreen
    );

    user.guild.channels
      .create(
        String(chname.replace("{user}", user.member.user.username)).substr(
          0,
          32
        ),
        {
          type: "voice",
          permissionOverwrites: [
            //update the permissions
            {
              id: user.id, //the user is allowed to change everything
              allow: [
                "MANAGE_CHANNELS",
                "VIEW_CHANNEL",
                "MANAGE_ROLES",
                "CONNECT",
              ],
            },
            {
              //the role "EVERYONE" is just able to VIEW_CHANNEL and CONNECT
              id: user.guild.id,
              allow: ["VIEW_CHANNEL", "CONNECT"],
            },
          ],
        }
      )
      .then((vc) => {
        if (user.channel.parent) vc.setParent(user.channel.parent);
        client.jointocreatemap.set(`owner_${vc.guild.id}_${vc.id}`, user.id);
        client.jointocreatemap.set(
          `tempvoicechannel_${vc.guild.id}_${vc.id}`,
          vc.id
        );
        user.setChannel(vc);
      });
  }
}

module.exports.databasing = databasing;
module.exports.reset_DB = reset_DB;
module.exports.escapeRegex = escapeRegex;
module.exports.check_voice_channels = check_voice_channels;
module.exports.create_join_to_create_Channel = create_join_to_create_Channel;
