const { Schema, model } = require('mongoose');

module.exports = model("raid-mode", new Schema({
    Guild: String
}))

