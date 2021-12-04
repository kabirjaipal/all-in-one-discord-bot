const { Schema, model } = require('mongoose');

module.exports = model("Anti-link", new Schema({
    Guild: String,
    Action: String,
}))

