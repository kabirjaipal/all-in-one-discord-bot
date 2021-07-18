const { Schema, model } = require('mongoose');

module.exports = model("welcome-channel", new Schema({
    Guild: String,
    Channel: String,
}))

