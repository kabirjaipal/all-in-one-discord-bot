const { Client, Message, MessageEmbed } = require('discord.js');
const db = require('quick.db')


module.exports = {
    name: 'disableverification',
    category: "⚙️Settings",
    aliases: ['dv', 'disableverify'],
    description: 'Disable\'s Server Verification System',
    usage: '',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args) => {

        if (!message.member.permissions.has("ADMINISTRATOR")) return message.channel.send("**You Do Not Have Required Permissions! - [ADMINISTRATOR]!**");

        let verifychannel = db.fetch(`verificationchannel_${message.guild.id}`);
        if (!verifychannel || verifychannel === null) return;
        if (!message.guild.channels.cache.has(verifychannel)) return;

        let verifiedchannel = message.guild.channels.cache.get(verifychannel);
        if (!verifiedchannel) return;

        let verifyrole = db.fetch(`verificationrole_${message.guild.id}`);
        if (!verifyrole || verifyrole === null) return;
        if (!message.guild.roles.cache.has(verifyrole)) return;

        let role = message.guild.roles.cache.get(verifyrole);
        if (!role) return;

        message.guild.channels.cache.forEach(channel => {
            if (channel.type === 'category' && channel.id === verifiedchannel.id) return;
            let r = channel.permissionOverwrites.get(role.id);
            if (!r) return;
            if (r.deny.has("VIEW_CHANNEL") || r.deny.has("SEND_MESSAGES")) return;

            channel.createOverwrite(message.guild.id, {
                VIEW_CHANNEL: true
            });

            channel.updateOverwrite(role, {
                VIEW_CHANNEL: null,
                SEND_MESSAGES: null
            });
        });

        verifiedchannel.updateOverwrite(role, {
            SEND_MESSAGES: null,
            VIEW_CHANNEL: null
        });

        verifiedchannel.delete();
        db.delete(`verificationchannel_${message.guild.id}`);
        db.delete(`verificationrole_${message.guild.id}`);
        return message.channel.send(`**Disabled Verification System in ${message.guild.name}!**`);

    }
}