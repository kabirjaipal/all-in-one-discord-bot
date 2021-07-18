const m = require('mongoose');

module.exports = m.model('levelup-channel', new m.Schema({
    Guild: String,
    Channel: String
}))