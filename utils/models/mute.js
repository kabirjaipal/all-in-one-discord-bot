const { Schema, model } = require('mongoose');

module.exports = model("mute-members", new Schema({
    Guild: String,
    Users: Array,
}))

