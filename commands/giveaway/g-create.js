const { Client, Message, MessageEmbed } = require("discord.js");
const ms = require("ms");
const { prefix } = require("../..");

module.exports = {
  name: "g-create",
  aliases: ["create-giveaway"],
  description: "",
  usage: "",
  category : "giveaway",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const currentGiveaways = client.giveawaysManager.giveaways.filter(
      (g) => g.guildID === message.guild.id && !g.ended
    ).length;
    let time = "";
    let winnersCount;
    let prize = "";
    let channel = "";
    let embed = new MessageEmbed()
      .setTitle("Create A Giveaway!")
      .setColor("#406da2")
      .setFooter(client.user.username, client.user.displayAvatarURL())
      .setTimestamp();
    const msg = await message.channel.send(
      embed.setDescription(
        "In which channel would you like the giveaway to start in?\nPlease tag the channel or provide it's ID.\n **Must Reply within 30 seconds!**"
      )
    );
    let xembed = new MessageEmbed()
      .setTitle("Oops! Looks Like We Met A Timeout! 🕖")
      .setColor("#FF0000")
      .setDescription(
        "💥 Snap our luck!\nYou took too much time to decide!\nUse ``create`` again to start a new giveaway!\nTry to respond within **30 seconds** this time!"
      )
      .setFooter(client.user.username, client.user.displayAvatarURL())
      .setTimestamp();

    const filter = (m) => m.author.id === message.author.id && !m.author.bot;
    const collector = await message.channel.createMessageCollector(filter, {
      max: 3,
      time: 30000,
    });

    collector.on("collect", async (collect) => {
      const response = collect.content;
      let chn =
        collect.mentions.channels.first() ||
        message.guild.channels.cache.get(response);
      await collect.delete();
      if (!chn) {
        return msg.edit(
          embed.setDescription(
            "Uh-Oh! Looks like you provided an Invalid channel!\n**Try Again?**\n Example: ``#giveaways``, ``677813783523098627``"
          )
        );
      } else {
        channel = chn;
        collector.stop(
          msg.edit(
            embed.setDescription(
              `Alright! Next, How long do you want me to host the giveaway in ${channel} for? \n** Must Reply within 30 seconds!**`
            )
          )
        );
      }
      const collector2 = await message.channel.createMessageCollector(filter, {
        max: 3,
        time: 30000,
      });
      collector2.on("collect", async (collect2) => {
        let mss = ms(collect2.content);
        await collect2.delete();
        if (!mss) {
          return msg.edit(
            embed.setDescription(
              "Aw Snap! Looks Like You Provided Me With An Invalid Duration\n**Try Again?**\n Example: ``10 minutes``,``10m``,``10``"
            )
          );
        } else {
          time = mss;
          collector2.stop(
            msg.edit(
              embed.setDescription(
                `Alright! Next, How may winners should I roll for the giveaway?\n**Must Reply within 30 seconds.**`
              )
            )
          );
        }
        const collector3 = await message.channel.createMessageCollector(
          filter,
          {
            max: 3,
            time: 30000,
            errors: ["time"],
          }
        );
        collector3.on("collect", async (collect3) => {
          const response3 = collect3.content.toLowerCase();
          await collect3.delete();
          if (parseInt(response3) < 1 || isNaN(parseInt(response3))) {
            return msg.edit(
              embed.setDescription(
                "Boi! Winners Must Be A Number or greater than equal to one!\n**Try Again?**\n Example ``1``,``10``, etcetra."
              )
            );
          } else {
            winnersCount = parseInt(response3);
            collector3.stop(
              msg.edit(
                embed.setDescription(
                  `Alright, Generous Human! Next, What should be the prize for the giveaway?\n**Must Reply within 30 seconds!**`
                )
              )
            );
          }
          const collector4 = await message.channel.createMessageCollector(
            filter,
            { max: 3, time: 30000 }
          );
          collector4.on("collect", async (collect4) => {
            const response4 = collect4.content.toLowerCase();
            prize = response4;
            await collect4.delete();
            collector4.stop(
              msg.edit(
                embed.setDescription(
                  "Alright! Next, Do you want to have a server joining requirement for the giveaway? If yes, provide the server's permanent invite link!\n**Must Reply within 30 seconds!**\n**Bot Must Be In The Server!**\n**Respond with ``none`` If no requirements!**"
                )
              )
            );
            const collector5 = await message.channel.createMessageCollector(
              filter,
              { max: 1, time: 30000 }
            );
            collector5.on("collect", async (collect5) => {
              const response5 = collect5.content;
              await collect5.delete();
              if (response5.toLowerCase() !== "none") {
                client.fetchInvite(response5).then(async (invite) => {
                  let client_is_in_server = client.guilds.cache.get(
                    invite.guild.id
                  );
                  if (!client_is_in_server) {
                    return message.channel.send({
                      embed: {
                        color: 000000,
                        author: {
                          name: client.user.username,
                          icon_url: client.user.avatarURL,
                        },
                        title: "Server Check!",
                        url: "https://youtube.com/c/techboy2",
                        description:
                          "Woah woah woah! I see a new server! are you sure I am in that? You need to invite me there to set that as a requirement! 😳",
                        timestamp: new Date(),
                        footer: {
                          icon_url: client.user.avatarURL,
                          text: "Server Check",
                        },
                      },
                    });
                  }

                  collector5.stop(
                    msg.edit(
                      embed.setDescription(
                        `Alright! Giveaway has been started in ${channel} for **${prize}** which will last for **${ms(
                          time,
                          { long: true }
                        )}** and there will be **${winnersCount}** winner(s)! and users would have to join ${response5}`
                      )
                    )
                  );
                  client.giveawaysManager.start(channel, {
                    time: parseInt(time),
                    prize: prize,
                    hostedBy: client.config.hostedBy ? message.author : null,
                    winnerCount: parseInt(winnersCount),
                    messages: {
                      giveaway: "**Giveaway!**",
                      giveawayEnded: "**GIVEAWAY ENDED**",
                      timeRemaining: `**Time Remaining : {duration}**`,
                      inviteToParticipate: `**React with 🎉 to participate!**`,
                      winMessage:
                        "Congratulations, {winners}! You won **{prize}**!",
                      embedFooter: "Giveaways",
                      hostedBy: "**Hosted By: {user}**",
                      noWinner:
                        "**Uh Oh! Looks like we got no reactions on this giveaway :<**.",
                      winners: "Lucky Winner(s) In This Giveaway",
                      endedAt: "Winners rolled at",
                      units: {
                        seconds: "seconds",
                        minutes: "minutes",
                        hours: "hours",
                        days: "days",
                      },
                    },
                    extraData: {
                      server: `${invite.guild.id}`,
                    },
                  });
                });
              } else {
                return message.channel.send(
                  `**Please use the command \`\`${prefix}start\`\` instead to make a giveaway without a server requirement**`
                );
              }
            });
          });
        });
      });
    });
    collector.on("end", (collected, reason) => {
      if (reason == "time") {
        message.channel.send(xembed);
      }
    });
    try {
      collector2.on("end", (collected, reason) => {
        if (reason == "time") {
          message.channel.send(xembed);
        }
      });
      collector3.on("end", (collected, reason) => {
        if (reason == "time") {
          message.channel.send(xembed);
        }
      });
      collector4.on("end", (collected, reason) => {
        if (reason == "time") {
          message.channel.send(xembed);
        }
      });
      collector5.on("end", (collected, reason) => {
        if (reason == "time") {
          message.channel.send(xembed);
        }
      });
    } catch (e) {}
  },
};
