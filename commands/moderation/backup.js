const { Client, Message, MessageEmbed } = require("discord.js");
const config = require("../../config/config.json");
const backup = require("discord-backup");
backup.setStorageFolder(__dirname + "/backups/");
let prefix = config.prefix;

module.exports = {
  name: "backup",
  aliases: ["serverbackup"],
  description: "Backup manager, for creating, loading, fetching backups, ...",
  category : "moderation",
  usage:
    "backup create -- saves from this server\nbackup load <ID> -- Loads in&from this server\nbackup info <ID> -- Shows info of this backup\nbackup list [SERVERID] -- Shows list of this/other Server\nbackup loadother <SERVERID> <ID> -- Loads Backup from Different Server",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!args[0])
      return message
        .reply(
          new MessageEmbed()
            .setColor("RED")
            .setTitle("PLEASE USE A VALID PARAMETER!")
            .setDescription(
              "`<prefix>backup create` -- *saves from this server*\n`<prefix>backup load <ID>` -- *Loads in&from this server*\n`<prefix>backup info <ID>` -- *Shows info of this backup*\n`<prefix>backup list [SERVERID]` -- *Shows list of this/other Server*\n`<prefix>backup loadother <SERVERID> <ID>` -- *Loads Backup from Different Server*"
            )
        )
        .catch((e) => console.log(e.stack.toString().red));

    if (args[0].toLowerCase() === "create") {
      if (!message.member.permissions.has("ADMINISTRATOR")) {
        return message
          .reply(
            "You must be an administrator of this server to request a backup!"
          )
          .catch((e) => console.log(e.stack.toString().red));
      }
      if (!message.guild.me.permissions.has("ADMINISTRATOR")) {
        return message
          .reply("I AM MISSING PERMISSIONS")
          .catch((e) => console.log(e.stack.toString().red));
      }

      message.reply("LOADING...");

      backup
        .create(message.guild, {
          jsonBeautify: true,
        })
        .then((backupData) => {
          message.reply(
            new MessageEmbed()
              .setColor("GREEN")
              .setTitle("BACKUP CREATED AND SAVED!")
              .setDescription("You'll find the ID in your DMS")
          );
          message.author.send(
            "The backup has been created! To load it, type this command on the server of your choice: `<prefix>backup load " +
              backupData.id +
              "`!"
          );
          console.log(backupData.id);
        });
    } else if (args[0].toLowerCase() === "load") {
      // Check member permissions
      if (!message.member.permissions.has("ADMINISTRATOR")) {
        return message.channel.send(
          ":x: | You must be an administrator of this server to load a backup!"
        );
      }
      if (!message.guild.me.permissions.has("ADMINISTRATOR")) {
        return message
          .reply("I AM MISSING PERMISSIONS")
          .catch((e) => console.log(e.stack.toString().red));
      }
      if (args[2]) {
        try {
          let guild = await client.guilds.fetch(args[1]);
          let backupID = args[2];
          if (!backupID) {
            return message.channel.send(
              ":x: | You must specify a valid backup ID!: `//backup loadother <SERVERID> <ID>`"
            );
          }
          message.reply("LOADING...");

          // Fetching the backup to know if it exists
          backup
            .fetch(backupID)
            .then(async () => {
              // If the backup exists, request for confirmation
              message.channel.send(
                ":warning: | When the backup is loaded, all the channels, roles, etc. will be replaced! Type `confirm` to confirm!"
              );
              await message.channel
                .awaitMessages(
                  (m) =>
                    m.author.id === message.author.id &&
                    m.content === "confirm",
                  {
                    max: 1,
                    time: 20000,
                    errors: ["time"],
                  }
                )
                .catch((err) => {
                  // if the author of the commands does not confirm the backup loading
                  return message.channel.send(
                    ":x: | Time's up! Cancelled backup loading!"
                  );
                });
              // When the author of the command has confirmed that he wants to load the backup on his server
              message.author.send(
                ":white_check_mark: | Start loading the backup!"
              );
              // Load the backup
              backup
                .load(backupID, message.guild)
                .then(() => {
                  // When the backup is loaded, delete them from the server
                  backup.remove(backupID);
                })
                .catch((err) => {
                  // If an error occurred
                  return message.author.send(
                    ":x: | Sorry, an error occurred... Please check that I have administrator permissions!"
                  );
                });
            })
            .catch((err) => {
              console.log(err);
              // if the backup wasn't found
              return message.channel.send(
                ":x: | No backup found for `" + backupID + "`!"
              );
            });
        } catch {
          return message.reply("CANNOT GET INFORMATION ABOUT THIS SERVER ID!");
        }
      } else {
        let backupID = args[1];
        if (!backupID) {
          return message.channel.send(
            ":x: | You must specify a valid backup ID!: `backup load <ID>`"
          );
        }
        message.reply("LOADING...");
        // Fetching the backup to know if it exists
        backup
          .fetch(backupID)
          .then(async () => {
            // If the backup exists, request for confirmation
            message.channel.send(
              ":warning: | When the backup is loaded, all the channels, roles, etc. will be replaced! Type `confirm` to confirm!"
            );
            await message.channel
              .awaitMessages(
                (m) =>
                  m.author.id === message.author.id && m.content === "confirm",
                {
                  max: 1,
                  time: 20000,
                  errors: ["time"],
                }
              )
              .catch((err) => {
                // if the author of the commands does not confirm the backup loading
                return message.channel.send(
                  ":x: | Time's up! Cancelled backup loading!"
                );
              });
            // When the author of the command has confirmed that he wants to load the backup on his server
            message.author.send(
              ":white_check_mark: | Start loading the backup!"
            );
            // Load the backup
            backup
              .load(backupID, message.guild)
              .then(() => {
                // When the backup is loaded, delete them from the server
                backup.remove(backupID);
              })
              .catch((err) => {
                // If an error occurred
                return message.author.send(
                  ":x: | Sorry, an error occurred... Please check that I have administrator permissions!"
                );
              });
          })
          .catch((err) => {
            console.log(err);
            // if the backup wasn't found
            return message.channel.send(
              ":x: | No backup found for `" + backupID + "`!"
            );
          });
      }
    } else if (args[0].toLowerCase() === "info") {
      let backupID = args[1];
      if (!backupID) {
        return message.channel.send(
          ":x: | You must specify a valid backup ID!: `//backup infos <ID>`"
        );
      }
      message.reply("LOADING...");

      // Fetch the backup
      backup
        .fetch(backupID)
        .then((backupInfos) => {
          const date = new Date(backupInfos.data.createdTimestamp);
          const yyyy = date.getFullYear().toString(),
            mm = (date.getMonth() + 1).toString(),
            dd = date.getDate().toString();
          const formatedDate = `${yyyy}/${mm[1] ? mm : "0" + mm[0]}/${
            dd[1] ? dd : "0" + dd[0]
          }`;
          let embed = new Discord.MessageEmbed()
            .setAuthor("Backup Informations")
            // Display the backup ID
            .addField("Backup ID", backupInfos.id, false)
            // Displays the server from which this backup comes
            .addField("Server ID", backupInfos.data.guildID, false)
            // Display the size (in mb) of the backup
            .addField("Size", `${backupInfos.size} kb`, false)
            // Display when the backup was created
            .addField("Created at", formatedDate, false)
            .setColor("RED");
          message.channel.send(embed);
        })
        .catch((err) => {
          // if the backup wasn't found
          return message.channel.send(
            ":x: | No backup found for `" + backupID + "`!"
          );
        });
    } else if (args[0].toLowerCase() === "list") {
      if (args[1]) {
        try {
          let guild = await client.guilds.fetch(args[1]);
          message.reply("LOADING...");

          backup.list(guild).then((backups) => {
            let embed = new MessageEmbed()
              .setColor("RED")
              .setTitle("BACKUPS OF: " + String(guild.name).toUpperCase());
            embed.setDescription("`" + backups.join("`\n`") + "`");
            embed.addField(
              `GET INFORMATION", "to get info about a Backup, type: ${prefix}backup info <ID>`
            );
            message.channel.send(embed);
          });
        } catch {
          return message.reply("CANNOT GET INFORMATION ABOUT THIS SERVER ID!");
        }
      } else {
        backup.list().then((backups) => {
          let embed = new MessageEmbed()
            .setColor("RED")
            .setTitle("BACKUPS OF THIS SERVER!");
          embed.setDescription("`" + backups.join("`\n`") + "`");
          embed.addField(
            `GET INFORMATION", "to get info about a Backup, type: ${prefix}backup info <ID>`
          );
          message.channel.send(embed);
        });
      }
    } else if (args[0].toLowerCase() === "loadother") {
      // Check member permissions
      if (!message.member.permissions.has("ADMINISTRATOR")) {
        return message.channel.send(
          ":x: | You must be an administrator of this server to load a backup!"
        );
      }
      if (!message.guild.me.permissions.has("ADMINISTRATOR")) {
        return message
          .reply("I AM MISSING PERMISSIONS")
          .catch((e) => console.log(e.stack.toString().red));
      }
      if (args[1]) {
        try {
          let guild = await client.guilds.fetch(args[1]);
          let backupID = args[2];
          if (!backupID) {
            return message.channel.send(
              `:x: | You must specify a valid backup ID!: ${prefix}backup loadother <SERVERID> <ID>`
            );
          }
          message.reply("LOADING...");

          // Fetching the backup to know if it exists
          backup
            .fetch(backupID)
            .then(async () => {
              // If the backup exists, request for confirmation
              message.channel.send(
                ":warning: | When the backup is loaded, all the channels, roles, etc. will be replaced! Type `confirm` to confirm!"
              );
              await message.channel
                .awaitMessages(
                  (m) =>
                    m.author.id === message.author.id &&
                    m.content === "confirm",
                  {
                    max: 1,
                    time: 20000,
                    errors: ["time"],
                  }
                )
                .catch((err) => {
                  // if the author of the commands does not confirm the backup loading
                  return message.channel.send(
                    ":x: | Time's up! Cancelled backup loading!"
                  );
                });
              // When the author of the command has confirmed that he wants to load the backup on his server
              message.author.send(
                ":white_check_mark: | Start loading the backup!"
              );
              // Load the backup
              backup
                .load(backupID, message.guild)
                .then(() => {
                  // When the backup is loaded, delete them from the server
                  backup.remove(backupID);
                })
                .catch((err) => {
                  // If an error occurred
                  return message.author.send(
                    ":x: | Sorry, an error occurred... Please check that I have administrator permissions!"
                  );
                });
            })
            .catch((err) => {
              console.log(err);
              // if the backup wasn't found
              return message.channel.send(
                ":x: | No backup found for `" + backupID + "`!"
              );
            });
        } catch {
          return message.reply("CANNOT GET INFORMATION ABOUT THIS SERVER ID!");
        }
      }
    } else
      return message
        .reply(
          new MessageEmbed()
            .setColor("RED")
            .setTitle("PLEASE USE A VALID PARAMETER!")
            .setDescription(
              `${prefix}backup create -- *saves from this server*\n ${prefix}backup load <ID> -- *Loads in&from this server*\n ${prefix}backup info <ID> -- *Shows info of this backup*\n${prefix}backup list [SERVERID] -- *Shows list of this/other Server*\n ${prefix}backup loadother <SERVERID> <ID> -- *Loads Backup from Different Server*`
            )
        )
        .catch((e) => console.log(e.stack.toString().red));
  },
};
