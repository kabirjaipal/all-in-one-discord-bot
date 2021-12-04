const { Client, Message, MessageEmbed } = require("discord.js");
const config = require("../../config/config.json");

module.exports = {
  name: "set-rules",
  aliases: ["rules"],
  description: "Set Rule For Guild Member",
  useage: "set-rules",
  category : "moderation",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    let rules1 = new MessageEmbed()
      .setTitle(`General Rules`)
      .setColor(config.colors.yes)
      .setThumbnail(
        "https://media.discordapp.net/attachments/691896715661410365/808632776331886602/Black_and_Pink_Glitch_Gaming_Facebook_Cover_1.gif"
      )
      .setDescription([
        `
        📜  1.1. Treat all members with respect.
        📜  1.2. Harassment, abuse, hate speech or any kind of discriminatory speech will not be tolerated.
        📜  1.3. Do not in any way intentionally offend any member in the Discord server.
        📜  1.4 Racial or offensive slurs will not be tolerated.
        📜  1.5. Tagging a member/staff member without reason will result in a warning.
        📜  1.6. Revealing private information about any individual; is a zero tolerance rule.
        📜  1.7. Do not publicly accuse other users/players of misconduct.
        📜  1.8. No backseat modding.
        📜  1.9. No talking about topics related to religion or politics.
        📜  1.10. Words or small sentences in other languages other than English are allowed only for the purpose of teaching someone, or for clarification.
        📜  1.11. We welcome constructive criticism but have zero tolerance for aggressive or entitled demands.
        📜  1.12 Female Members Of The Server Are Supposed To Verify Themselves Through Voice Channels By Female Moderators As Soon As Possible Upon Joining Server Also If Already In Server To Avoid Certain Scenarios, Impersonating Using Fake Female Accounts Will Get Permanent Server Ban Once Proven.
        `,
      ]);

    let rules2 = new MessageEmbed()
      .setTitle(`Chat Rules`)
      .setColor(config.colors.yes)
      .setThumbnail(
        "https://media.discordapp.net/attachments/691896715661410365/808632776331886602/Black_and_Pink_Glitch_Gaming_Facebook_Cover_1.gif"
      )
      .setDescription([
        `
    📜 2.1. Don’t Spam (Emoji , same msg again & again or Dont spam for Level Increase.
    📜  2.3. If any of staff member is asking to Change the Topic of conversation then it needs to be changed, if it gets too offensive to other members. If not followed, there are kick/ban.
        
    📜 2.4. We highly request to our old members to welcome new members & try including them in your conversation. Don’t act creepy or rude towards the new members because they do not know how to behave in server.
        
    📜 2.5. Respect all staff and follow their instruction , Do not Use Abusive/odd Names/ Profile Pictures. If Any mod Found You Guilty they Can Change Your Name Any time.
        
    📜  2.6. Don’t expose anyone. Do not send any private information of anyone without permission. That includes pictures.
        
    📜 2.7. Do not randomly tag staff if unnecessary.
        
    📜 2.8. If you are annoyed by someone: Just block the person and move on.
        
    📜 2.9. Have common sense to understand puns/sarcasm.
        
    📜 2.10. Do not misbehave with girls and respect each and everyone member in the server.
        
    📜  2.11 Excessive use of bad language will lead to permanent ban/kick.
        
        `,
      ]);

    let rules3 = new MessageEmbed()
      .setTitle(`Voice Rules `)
      .setThumbnail(
        "https://media.discordapp.net/attachments/691896715661410365/808632776331886602/Black_and_Pink_Glitch_Gaming_Facebook_Cover_1.gif"
      )
      .setDescription([
        `
        📜  3.1. Posting any content related to piracy, cheats, cracks, exploits or any kind of copyright breaching materials is forbidden.
        📜  3.2. Any malicious activity toward the server or any member is forbidden.
        📜  3.3 This server follows all the Discord Guidelines and TermsOfServices. Please do read and follow all them listed.
        📜  3.4 Threats such as DDoS, DoX, or generalized threats are strictly prohibited and will result in an immediate removal/ban from the community.
        📜   3.5 Any attempts to “rape” other fellow community members is strictly prohibited and will result in an immediate removal/ban from the server.
        📜   3.6 Intentional toxic behavior is not allowed
        📜   3.7. Do not Argue With Any Mod/Staff. Their Decision will be last Decision
        📜   3.8. Do not use voice changer in vc, this will lead to permanent ban from the server.
        📜   3.9. Do not blow air in the mic or else you will be banned from vc.
        `,
      ]);

    let follow = new MessageEmbed()
      .setColor(config.colors.yes)
      .setTitle("Read all Rules Carefully")
      .setDescription(
        `Read the above rules carefully and do follow them.\n
    Note: The rules will be changed as per the requirements in the future.`
      )
      .setImage(
        "https://media.discordapp.net/attachments/691896715661410365/808632776331886602/Black_and_Pink_Glitch_Gaming_Facebook_Cover_1.gif"
      )
      .setFooter("Coded by: Tech Boy Gaming");

    message.channel.send(rules1);
    message.channel.send(rules2);
    message.channel.send(rules3);
    message.channel.send(follow).then(function (message) {
      message.react("✅");
    });
    message.channel.send(`@everyone`);
  },
};
