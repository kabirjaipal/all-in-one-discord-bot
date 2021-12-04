const { Client, Message, MessageEmbed, Collection } = require("discord.js");
const config = require("../../config/config.json");
const ee = require("../../config/bot.json");
const {
  databasing,
  check_voice_channels,
  create_join_to_create_Channel,
} = require("../../handlers/voice_function");

/**
 * @param {Client} client
 * @param {Message} message
 * @param {String[]} args
 */
module.exports = async (client, message, args) => {
  console.log(` :: ⬜️ Module: jointocreate`);

  client.on("ready", () => {
    check_voice_channels(client);
    setInterval(() => check_voice_channels(client), 10 * 1000);
  });

  client.on("voiceStateUpdate", async (oldState, newState) => {
    //LOGS FOR EVERYTHING EXCEPT JOINING / LEAVING / SWITCHING
    if (config.voice_log_console) {
      if (!oldState.streaming && newState.streaming)
        return console.log(
          `${newState.member.user.tag} Is now ${
            newState.streaming ? "streaming" : "not streaming"
          }`.gray
        );
      if (oldState.streaming && !newState.streaming)
        return console.log(
          `${newState.member.user.tag} Is now ${
            newState.streaming ? "streaming)" : "not streaming)"
          }`.gray
        );
      if (!oldState.serverDeaf && newState.serverDeaf)
        return console.log(
          `${newState.member.user.tag} Is now ${
            newState.serverDeaf ? "deafed (Server)" : "undeafed (Server)"
          }`.gray
        );
      if (oldState.serverDeaf && !newState.serverDeaf)
        return console.log(
          `${newState.member.user.tag} Is now ${
            newState.serverDeaf ? "deafed (Server)" : "undeafed (Server)"
          }`.gray
        );
      if (!oldState.serverMute && newState.serverMute)
        return console.log(
          `${newState.member.user.tag} Is now ${
            newState.serverMute ? "muted (Server)" : "unmuted (Server)"
          }`.gray
        );
      if (oldState.serverMute && !newState.serverMute)
        return console.log(
          `${newState.member.user.tag} Is now ${
            newState.serverMute ? "muted (Server)" : "unmuted (Server)"
          }`.gray
        );
      if (!oldState.selfDeaf && newState.selfDeaf)
        return console.log(
          `${newState.member.user.tag} Is now ${
            newState.selfDeaf ? "deafed (self)" : "undeafed (self)"
          }`.gray
        );
      if (oldState.selfDeaf && !newState.selfDeaf)
        return console.log(
          `${newState.member.user.tag} Is now ${
            newState.selfDeaf ? "deafed (self)" : "undeafed (self)"
          }`.gray
        );
      if (!oldState.selfMute && newState.selfMute)
        return console.log(
          `${newState.member.user.tag} Is now ${
            newState.selfMute ? "muted (self)" : "unmuted (self)"
          }`.gray
        );
      if (oldState.selfMute && !newState.selfMute)
        return console.log(
          `${newState.member.user.tag} Is now ${
            newState.selfMute ? "muted (self)" : "unmuted (self)"
          }`.gray
        );
      if (oldState.sessionID != newState.sessionID)
        console.log(
          `${newState.member.user.tag} sessionID Is now on: ${newState.sessionID}`
            .gray
        );
      if (!oldState.selfVideo && newState.selfVideo)
        return console.log(
          `${newState.member.user.tag} Is now ${
            newState.selfVideo ? "self Video Sharing" : "not self Video Sharing"
          }`.gray
        );
      if (oldState.selfVideo && !newState.selfVideo)
        return console.log(
          `${newState.member.user.tag} Is now ${
            newState.selfVideo ? "self Video Sharing" : "not self Video Sharing"
          }`.gray
        );
    }

    // JOINED A CHANNEL
    if (!oldState.channelID && newState.channelID) {
      databasing(newState.guild.id, client); //load every database
      let channels = [];
      channels.push(client.settings.get(newState.guild.id, `channel`));
      channels.push(client.settings.get(newState.guild.id, `channel`));
      channels.push(client.settings.get(newState.guild.id, `channel`));
      for (let i = 0; i < channels.length; i++) {
        if (
          channels[i].length > 2 &&
          channels[i].includes(newState.channelID)
        ) {
          create_join_to_create_Channel(client, newState, i + 1);
          break;
        }
      }
      return;
    }

    // LEFT A CHANNEL
    if (oldState.channelID && !newState.channelID) {
      databasing(oldState.guild.id, client); //load every database
      client.jointocreatemap.ensure(
        `tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`,
        false
      );
      if (
        client.jointocreatemap.get(
          `tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`
        )
      ) {
        //CHANNEL DELETE CHECK
        var vc = oldState.guild.channels.cache.get(
          client.jointocreatemap.get(
            `tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`
          )
        );
        if (vc.members.size < 1) {
          console.log(
            `Deleted the Channel: ${vc.name} in: ${
              vc.guild ? vc.guild.name : "undefined"
            }`.strikethrough.brightRed
          );
          client.jointocreatemap.delete(
            `tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`
          );
          client.jointocreatemap.delete(`owner_${vc.guild.id}_${vc.id}`);
          return vc.delete().catch((e) => console.log("Couldn't delete room"));
        } else {
          let perms = vc.permissionOverwrites.map((c) => c);
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (
              perms[i].allow.toArray().includes("MANAGE_CHANNELS") &&
              perms[i].id == oldState.member.user.id
            )
              owner = true;
          }
          //if owner left, then pick a random user
          if (owner) {
            let members = vc.members.map((member) => member.id);
            let randommemberid =
              members[Math.floor(Math.random() * members.length)];
            vc.updateOverwrite(randommemberid, {
              CONNECT: true,
              VIEW_CHANNEL: true,
              MANAGE_CHANNELS: true,
              MANAGE_ROLES: true,
            }).catch((e) => console.log(e.message));
            vc.updateOverwrite(randommemberid, {
              CONNECT: true,
              VIEW_CHANNEL: true,
              MANAGE_CHANNELS: true,
              MANAGE_ROLES: true,
            }).catch((e) => console.log(e.message));
            try {
              client.users.fetch(randommemberid).then((user) => {
                user.send(
                  new MessageEmbed()
                    .setColor(ee.colour)
                    .setFooter(ee.footericon, ee.footericon)
                    .setTitle("The Owner left, you are now the new one!")
                    .setDescription(
                      `you now have access to all \`.help voice\` Commands!`
                    )
                );
              });
            } catch {
              /* */
            }
          }
        }
      }
    }

    // Switch A CHANNEL
    if (oldState.channelID && newState.channelID) {
      databasing(newState.guild.id, client);
      if (oldState.channelID !== newState.channelID) {
        let channels = [];
        channels.push(client.settings.get(newState.guild.id, `channel`));
        channels.push(client.settings.get(newState.guild.id, `channel`));
        channels.push(client.settings.get(newState.guild.id, `channel`));
        for (let i = 0; i < channels.length; i++) {
          if (
            channels[i].length > 2 &&
            channels[i].includes(newState.channelID)
          ) {
            create_join_to_create_Channel(client, newState, i + 1);
            break;
          }
        }
        //ENSURE THE DB
        client.jointocreatemap.ensure(
          `tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`,
          false
        );
        //IF STATEMENT
        if (
          client.jointocreatemap.get(
            `tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`
          )
        ) {
          var vc = oldState.guild.channels.cache.get(
            client.jointocreatemap.get(
              `tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`
            )
          );
          if (vc.members.size < 1) {
            console.log(
              `Deleted the Channel: ${vc.name} in: ${
                vc.guild ? vc.guild.name : "undefined"
              }`.strikethrough.brightRed
            );
            client.jointocreatemap.delete(
              `tempvoicechannel_${oldState.guild.id}_${oldState.channelID}`
            );
            client.jointocreatemap.delete(`owner_${vc.guild.id}_${vc.id}`);
            return vc
              .delete()
              .catch((e) => console.log("Couldn't delete room"));
          } else {
            /* */
          }
        }
      }
    }
  });
};
