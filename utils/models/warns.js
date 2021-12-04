const { Schema, model } = require('mongoose');

module.exports = model("warns", new Schema({
    guildId: String,
    User: String,
    content: Array
}))

