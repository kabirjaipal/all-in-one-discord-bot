const m = require('mongoose');

module.exports = m.model('boost', new m.Schema({
  guild: String,
  channel: String
}))