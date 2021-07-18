const {
    MessageEmbed,
    Message,
    Client
} = require("discord.js");
const {
    readdirSync
} = require("fs");
const { prefix } = require("../..");
let color = "#36393f"

module.exports = {
    name: "help",
    aliases: ['h'],
    description: "Shows all available bot commands.",
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String} args 
     * @returns 

     */
    run: async (client, message, args) => {

        if (!args[0]) {
            let categories = [];


            //categories to ignore
            let ignored = [
                "owner",
                "mod"
            ];

        
            const emo = {
                games: "🎮",
                config: "⚙️",
                automod : "👍",
                giveaway: "🎉",
                information: "📻",
                moderation: "🔨",
                music: "🎵",
                musicfilter: "🎼",
                // owner: "👑",
                leveling: "🎂",
                rr_roles: "🙌",
                ticket: "🎫",
                utility: ":comet:",
                welcome_leave: "✨",
                rr_roles: "🎁",
                yt_poster : "📺"
            }

            readdirSync("./commands/").forEach((dir) => {
                if (ignored.includes(dir.toLowerCase())) return;
                const name = `${emo[dir.toLowerCase()]} ${dir.toUpperCase()}`
                let cats = new Object();

                cats = {
                    name: name,
                    value: `\`${prefix}help ${dir.toLowerCase()}\``,
                    inline: true
                }


                categories.push(cats);
                //cots.push(dir.toLowerCase());
            });

            const embed = new MessageEmbed()
                .setColor('RANDOM')
                .setTitle("HELP MENU 🔰 Commands")
                .addField('Prefix Information', `Prefix: \`${prefix}\`\nYou can also mention ${client.user} to get prefix info.`, false)
                .addField("• Developer", `\`\`\`yml\nName: ᴋᴀʙɪʀ々ꜱɪɴɢʜ#8148 [821095540569407508]\nName Ξ Kabir Jaipal [821095540569407508]\`\`\``)
                .addField("• Important Links", `**[Invite Link](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot)\`|\`[Support Server](https://discord.com/invite/tVWrU5PWZV)\`|\`[Youtube](https://www.youtube.com/channel/UCINCfgiBYCykOemiuVhqtIQ/)\`**`)
                .setDescription(
                    `Use \`${prefix}help\` followed by a command name to get more additional information on a command. For example: \`${prefix}help ban\`.`
                )
                .addFields(categories)
                .setFooter(`To see command descriptions and inforamtion, type: ${prefix}help [CMD NAME]`, client.user.displayAvatarURL())
                .setThumbnail(client.user.displayAvatarURL())
                .setTimestamp()
                .setThumbnail(client.user.displayAvatarURL({
                    dynamic: true
                }))
                .setColor(color);

            return message.channel.send(embed);
        } else {
            let cots = [];
            let catts = [];

            readdirSync("./commands/").forEach((dir) => {
                if (dir.toLowerCase() !== args[0].toLowerCase()) return;
                const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
                    file.endsWith(".js")
                );


                const cmds = commands.map((command) => {
                    let file = require(`../../commands/${dir}/${command}`);

                    if (!file.name) return "No command name.";

                    let name = file.name.replace(".js", "");

                    let des = client.commands.get(name).description;

                    let obj = {
                        cname: `\`${name}\``,
                        des
                    }

                    return obj;
                });

                let dota = new Object();

                cmds.map(co => {
                    dota = {
                        name: `${cmds.length === 0 ? "In progress." : co.cname}`,
                        value: co.des ? co.des : 'No Description',
                        inline: true,
                    }
                    catts.push(dota)
                });

                cots.push(dir.toLowerCase());
            });

            // console.log(cots);

            const command =
                client.commands.get(args[0].toLowerCase()) ||
                client.commands.find(
                    (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
                );

            if (cots.includes(args[0].toLowerCase())) {
                const combed = new MessageEmbed()
                    .setTitle(`__${args[0].charAt(0).toUpperCase() + args[0].slice(1)} Commands!__`)
                    .setDescription(`Use \`${prefix}help\` followed by a command name to get more information on a command.\nFor example: \`${prefix}help ping\`.\n\n`)
                    .addFields(catts)
                    .setColor(color)
                    .setThumbnail(client.user.displayAvatarURL({ format: "png" }))
                    .setColor('RANDOM')
                    .setFooter(`Coded By Tech Boy Gaming`)

                return message.channel.send(combed)
            }

            if (!command) {
                const embed = new MessageEmbed()
                    .setTitle(`Invalid command! Use \`${prefix}help\` for all of my commands!`)
                    .setColor("RED");
                return message.channel.send(embed);
            }

            const embed = new MessageEmbed()
                .setTitle("Command Details:")
                .addField(
                    "Command:",
                    command.name ? `\`${command.name}\`` : "No name for this command."
                )
                .addField(
                    "Aliases:",
                    command.aliases ?
                        `\`${command.aliases.join("` `")}\`` :
                        "No aliases for this command."
                )
                .addField(
                    "Usage:",
                    command.usage ?
                        `\`${prefix}${command.name} ${command.usage}\`` :
                        `\`${prefix}${command.name}\``
                )
                .addField(
                    "Command Description:",
                    command.description ?
                        command.description :
                        "No description for this command."
                )
                .setFooter(
                    `Requested by ${message.author.tag}`,
                    message.author.displayAvatarURL({
                        dynamic: true
                    })
                )
                .setTimestamp()
                .setColor(color);
            return message.channel.send(embed , { allowedMentions: { repliedUser: false }});
        }
    },
};