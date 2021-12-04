const { Client, Message, MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "g-start",
  aliases: ["givewaystart"],
  description: "Start a Giveway in Server",
  usage: "",
  category : "giveaway",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    var rolename;
    var BonusEntries;
    // If the member doesn't have enough permissions
    if (
      !message.member.permissions.has("MANAGE_MESSAGES") &&
      !message.member.roles.cache.some((r) => r.name === "Giveaways")
    ) {
      return message.channel.send(
        ":x: You need to have the manage messages permissions to start giveaways."
      );
    }

    // Giveaway channel
    let giveawayChannel = message.mentions.channels.first();
    // If no channel is mentionned
    if (!giveawayChannel) {
      return message.channel.send(":x: You have to mention a valid channel!");
    }

    // Giveaway duration
    let giveawayDuration = args[1];
    // If the duration isn't valid
    if (!giveawayDuration || isNaN(ms(giveawayDuration))) {
      return message.channel.send(":x: You have to specify a valid duration!");
    }

    // Number of winners
    let giveawayNumberWinners = parseInt(args[2]);
    // If the specified number of winners is not a number
    if (isNaN(giveawayNumberWinners) || parseInt(giveawayNumberWinners) <= 0) {
      return message.channel.send(
        ":x: You have to specify a valid number of winners!"
      );
    }

    // Giveaway prize
    let giveawayPrize = args.slice(3).join(" ");
    // If no prize is specified
    if (!giveawayPrize) {
      return message.channel.send(":x: You have to specify a valid prize!");
    }

    message.channel.send("Do You Want Any Bonus Enteries?");
    const filter = (m) => m.author.id === message.author.id;
    await message.channel
      .awaitMessages(filter, {
        max: 1,
        time: 300000,
        errors: ["time"],
      })
      .then(async (collected) => {
        if (collected.first().content.toLowerCase() === "yes") {
          await message.channel.send(
            `Alright which role will have bonus enteries?`
          );
          await message.channel
            .awaitMessages(filter, {
              max: 1,
              time: 60000,
              errors: ["time"],
            })
            .then(async (rolen) => {
              const x = await message.guild.roles.cache.find(
                (n) => n.name === `${rolen.first().content}`
              );
              rolename = rolen.first().content;
              if (!x) {
                message.channel.send(`No such role found!, Skipping this!`);
                rolename = null;
              }
            });
          if (rolename !== null) {
            await message.channel.send(
              `How many bonus eneteries will we have for ${rolename}?`
            );
            await message.channel
              .awaitMessages(filter, {
                max: 1,
                time: 60000,
                errors: ["time"],
              })
              .then(async (rolentery) => {
                BonusEntries = parseInt(rolentery.first().content);
                message.channel.send(
                  `✅ Alright **${rolename}** will have **${BonusEntries}** Extra Enteries`
                );
              });
          }
        } else {
          if (collected.first().content.toLowerCase() === "no") {
            message.channel.send("Aight! Skipping this!");
            rolename = null;
            BonusEntries = null;
          } else {
            message.channel.send("Invalid Response Collected, Skipping!");
            rolename = null;
            BonusEntries = null;
          }
        }
      });

    // Start the giveaway
    await client.giveawaysManager.start(giveawayChannel, {
      // The giveaway duration
      time: ms(giveawayDuration),
      // The giveaway prize
      prize: giveawayPrize,
      // The giveaway winner count
      winnerCount: parseInt(giveawayNumberWinners),
      // BonusEntries If Provided

      bonusEntries: [
        {
          // Members who have the role which is assigned to "rolename" get the amount of bonus entries which are assigned to "BonusEntries"
          bonus: new Function(
            "member",
            `return member.roles.cache.some((r) => r.name === \'${rolename}\') ? ${BonusEntries} : null`
          ),
          cumulative: false,
        },
      ],
      // Who hosts this giveaway
      hostedBy: client.config.hostedBy ? message.author : null,
      // Messages
      messages: {
        giveaway:
          (client.config.everyoneMention ? "@everyone\n\n" : "") +
          "🎉🎉 **GIVEAWAY** 🎉🎉",
        giveawayEnded:
          (client.config.everyoneMention ? "@everyone\n\n" : "") +
          "🎉🎉 **GIVEAWAY ENDED** 🎉🎉",
        timeRemaining: "Time remaining: **{duration}**!",
        inviteToParticipate: `React with 🎉 to participate!`,
        winMessage: "Congratulations, {winners}! You won **{prize}**!",
        embedFooter: "Giveaways",
        noWinner: "Giveaway cancelled, no valid participations.",
        hostedBy: "Hosted by: {user}",
        winners: "winner(s)",
        endedAt: "Ended at",
        units: {
          seconds: "seconds",
          minutes: "minutes",
          hours: "hours",
          days: "days",
          pluralS: false, // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
        },
      },
    });
    if (rolename) {
      const mentionfetch = await message.guild.roles.cache.find(
        (n) => n.name === `${rolename}`
      );
      let giveaway = new MessageEmbed()
        .setAuthor(`Bonus Enteries Alert!`)
        .setDescription(
          `**${mentionfetch}** Has **${BonusEntries}** Extra Enteries in this giveaway!`
        )
        .setFooter(`Coded by Tech Boy Gaming`);
      giveawayChannel.send(giveaway);
    }
    message.channel.send(`Giveaway started in ${giveawayChannel}!`);
  },
};
