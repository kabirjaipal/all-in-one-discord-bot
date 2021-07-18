const { Schema, model } = require('mongoose');

module.exports = model("blacklisted-words", new Schema({
    Guild: String,
    Action: String,
    Words: Array,
}))

