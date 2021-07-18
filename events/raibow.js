
// const { MessageEmbed } = require('discord.js')
// const client = require('../index')

// // client.on('message', (message) => {
// //     const serverId = message.guild.id;
// //     try {
// //         let interval = "5000"

// //         let guild = client.guilds.cache.get(serverId)
// //         if (!guild) throw `[ Error ] Didn't Find Any Server : ${message.guild.name}`

// //         let role2 = message.guild.roles.create({
// //             data: {
// //                 name: "Rainbow",
// //                 color: "RED"
// //             }
// //         })
// //         let role = guild.roles.cache.find(r => r.name === "Rainbow")
// //         if (!role) throw `[ Error ] Didn't Find Any Role, Server Name: ${guild.name}`
// //         guild.owner.send(
// //             new MessageEmbed()
// //                 .setDescription(`Rainbow Role Created \n Now You can Give Anyone...`)
// //         )


// //         if (interval < 60000) console.log(`\n[!!!] Enjoy Your Rainbow Roles`)

// //         setInterval(() => {
// //             role.edit({ color: 'RANDOM' }).catch(err => console.log(`[ Error ] An error occurred during the role change.`));
// //         }, interval)



// //     } catch (error) {
// //         console.log(error);
// //     }

// // })


// client.on('message', (message) => {
//     try {

//         let role = message.guild.roles.cache.find(r => r.name === "Rainbow")
//         if (!role) {
//             let role2 = message.guild.roles.create({
//                 data: {
//                     name: "Rainbow",
//                     color: "GREEN"
//                 }
//             })
//         }

//         setInterval(() => {
//             role.setColor("RANDOM")
//         }, 3000)
//     } catch (error) {
//         message.channel.send(error)
//     }

// })