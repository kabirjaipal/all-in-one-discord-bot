const { Schema, model } = require('mongoose');

module.exports = model("Anti-Ad", new Schema({
    Guild: String,
    Action: String,
}))

