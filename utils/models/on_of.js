const mongoose = require('mongoose');

const onOrOffSchema = new mongoose.Schema({
    guildID: String,
    type: String,
    onOrOff: String,
});

module.exports = mongoose.model('On/Off', onOrOffSchema);