const mongoose = require('mongoose')

module.exports = mongoose.model('whitelist-channel', new mongoose.Schema({
    Guild: String,
    Anti_spam: Array,
    Anti_link: Array,
    Anti_Invite: Array,
    Anti_curse: Array
}))
